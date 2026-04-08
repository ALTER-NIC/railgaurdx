import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { addRule, deleteRule } from './actions'

export default async function RulesPage() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('owner_id', user.id)
    .single()

  if (!project) redirect('/dashboard')

  const { data: rules } = await supabase
    .from('rules')
    .select('id, action_type, verdict, created_at')
    .eq('project_id', project.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-semibold text-brand-white mb-1">Rules</h1>
      <p className="text-brand-grey text-sm mb-8">
        Define which actions your AI agents can and cannot perform.
      </p>

      {/* Add Rule Form */}
      <form action={addRule} className="bg-brand-panel border border-brand-border rounded-lg p-5 mb-8">
        <h2 className="text-sm font-semibold text-brand-white mb-4">Add New Rule</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            name="action_type"
            type="text"
            required
            maxLength={200}
            placeholder="e.g. send_email, delete_user, transfer_funds"
            className="flex-1 px-4 py-2.5 bg-brand-bg border border-brand-border rounded text-sm text-brand-white font-mono focus:border-brand-red focus:outline-none transition-colors"
          />
          <select
            name="verdict"
            defaultValue="block"
            className="px-4 py-2.5 bg-brand-bg border border-brand-border rounded text-sm text-brand-white focus:border-brand-red focus:outline-none transition-colors"
          >
            <option value="block">Block</option>
            <option value="allow">Allow</option>
          </select>
          <button
            type="submit"
            className="px-6 py-2.5 bg-brand-red text-brand-bg text-sm font-semibold rounded hover:bg-brand-orange transition-colors whitespace-nowrap"
          >
            Add Rule
          </button>
        </div>
      </form>

      {/* Rules List */}
      {!rules || rules.length === 0 ? (
        <div className="bg-brand-panel border border-brand-border rounded-lg p-12 text-center">
          <p className="text-brand-grey text-sm">
            No rules yet. Actions without a matching rule are <span className="text-green-500">allowed by default</span>.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="bg-brand-panel border border-brand-border rounded-lg px-5 py-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <span
                  className={`inline-block px-2.5 py-1 rounded text-xs font-semibold uppercase whitespace-nowrap ${
                    rule.verdict === 'allow'
                      ? 'bg-green-500/10 text-green-500'
                      : 'bg-brand-red/10 text-brand-red'
                  }`}
                >
                  {rule.verdict}
                </span>
                <span className="text-sm text-brand-white font-mono truncate">
                  {rule.action_type}
                </span>
              </div>
              <form action={deleteRule}>
                <input type="hidden" name="rule_id" value={rule.id} />
                <button
                  type="submit"
                  className="text-xs text-brand-grey hover:text-brand-red transition-colors whitespace-nowrap"
                >
                  Delete
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
