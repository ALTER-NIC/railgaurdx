import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key')

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing x-api-key header' },
      { status: 400 }
    )
  }

  const supabase = createAdminClient()

  // Look up project by api_key
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('id')
    .eq('api_key', apiKey)
    .single()

  if (projectError || !project) {
    return NextResponse.json(
      { error: 'Invalid API key' },
      { status: 401 }
    )
  }

  // Fetch last 100 logs
  const { data: logs, error: logsError } = await supabase
    .from('logs')
    .select('id, action_type, action_payload, verdict, reason, timestamp')
    .eq('project_id', project.id)
    .order('timestamp', { ascending: false })
    .limit(100)

  if (logsError) {
    return NextResponse.json(
      { error: 'Failed to fetch logs' },
      { status: 500 }
    )
  }

  return NextResponse.json({
    logs: logs.map(log => ({
      log_id: log.id,
      action_type: log.action_type,
      payload: log.action_payload,
      verdict: log.verdict,
      reason: log.reason,
      timestamp: log.timestamp,
    })),
  })
}
