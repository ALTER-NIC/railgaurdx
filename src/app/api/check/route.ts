import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { ratelimit } from '@/lib/ratelimit'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { api_key, action_type, payload } = body

    // Validate required fields
    if (!api_key || typeof api_key !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid api_key' },
        { status: 400 }
      )
    }
    if (!action_type || typeof action_type !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid action_type' },
        { status: 400 }
      )
    }
    if (action_type.length > 200) {
      return NextResponse.json(
        { error: 'action_type exceeds 200 characters' },
        { status: 400 }
      )
    }
    if (payload !== undefined && payload !== null) {
      const payloadStr = JSON.stringify(payload)
      if (payloadStr.length > 10240) {
        return NextResponse.json(
          { error: 'payload exceeds 10KB limit' },
          { status: 400 }
        )
      }
    }

    // Rate limit by api_key
    const { success } = await ratelimit.limit(api_key)
    if (!success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Max 100 requests per minute.' },
        { status: 429 }
      )
    }

    const supabase = createAdminClient()

    // Look up project by api_key
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('api_key', api_key)
      .single()

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      )
    }

    // Check rules for this action_type
    const { data: rule } = await supabase
      .from('rules')
      .select('verdict')
      .eq('project_id', project.id)
      .eq('action_type', action_type)
      .single()

    const verdict = rule ? rule.verdict : 'allow'
    const reason = rule
      ? `Rule matched: ${action_type} is ${rule.verdict}ed`
      : `No rule found for "${action_type}" — allowed by default`

    // Write to logs
    const { data: log, error: logError } = await supabase
      .from('logs')
      .insert({
        project_id: project.id,
        action_type,
        action_payload: payload ?? null,
        verdict,
        reason,
      })
      .select('id')
      .single()

    if (logError) {
      return NextResponse.json(
        { error: 'Failed to log action' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      allowed: verdict === 'allow',
      reason,
      log_id: log.id,
    })
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}
