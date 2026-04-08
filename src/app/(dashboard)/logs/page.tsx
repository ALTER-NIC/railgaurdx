import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function LogsPage() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('owner_id', user.id)
    .single()

  if (!project) redirect('/dashboard')

  const { data: logs } = await supabase
    .from('logs')
    .select('id, action_type, action_payload, verdict, reason, timestamp')
    .eq('project_id', project.id)
    .order('timestamp', { ascending: false })
    .limit(100)

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-semibold text-brand-white mb-1">Logs</h1>
      <p className="text-brand-grey text-sm mb-8">
        Last 100 agent action checks.
      </p>

      {!logs || logs.length === 0 ? (
        <div className="bg-brand-panel border border-brand-border rounded-lg p-12 text-center">
          <p className="text-brand-grey text-sm">
            No logs yet. Make your first API call to <code className="text-brand-red">/api/check</code> to see activity here.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-brand-panel border border-brand-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-border text-xs text-brand-grey uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Timestamp</th>
                  <th className="text-left px-5 py-3">Action</th>
                  <th className="text-left px-5 py-3">Verdict</th>
                  <th className="text-left px-5 py-3">Payload</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-brand-border/50 hover:bg-brand-border/20 transition-colors">
                    <td className="px-5 py-3 text-brand-grey text-xs font-mono whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-brand-white font-mono">
                      {log.action_type}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                          log.verdict === 'allow'
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-brand-red/10 text-brand-red'
                        }`}
                      >
                        {log.verdict === 'allow' ? 'ALLOWED' : 'BLOCKED'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-brand-grey text-xs font-mono max-w-xs truncate">
                      {log.action_payload
                        ? JSON.stringify(log.action_payload).slice(0, 80)
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="bg-brand-panel border border-brand-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-brand-white font-mono text-sm">{log.action_type}</span>
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                      log.verdict === 'allow'
                        ? 'bg-green-500/10 text-green-500'
                        : 'bg-brand-red/10 text-brand-red'
                    }`}
                  >
                    {log.verdict === 'allow' ? 'ALLOWED' : 'BLOCKED'}
                  </span>
                </div>
                <p className="text-brand-grey text-xs font-mono mb-1">
                  {new Date(log.timestamp).toLocaleString()}
                </p>
                {log.action_payload && (
                  <p className="text-brand-grey text-xs font-mono truncate">
                    {JSON.stringify(log.action_payload).slice(0, 60)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
