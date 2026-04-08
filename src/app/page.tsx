import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-xl">
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="w-3 h-3 rounded-full bg-brand-red animate-pulse" />
          <span className="text-lg font-mono tracking-widest text-brand-white">
            RAIL<span className="text-brand-red">GUARD</span>X
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-brand-white mb-4 leading-tight">
          Behavioral Guardrails<br />
          <span className="text-brand-red">for AI Agents</span>
        </h1>

        <p className="text-brand-grey text-lg mb-10 leading-relaxed">
          A security checkpoint for your AI agents. Check if actions are allowed,
          log everything, stay in control.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="px-8 py-3 bg-brand-red text-brand-bg font-semibold text-sm rounded hover:bg-brand-orange transition-colors"
          >
            Get Started Free
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 border border-brand-border text-brand-white text-sm rounded hover:border-brand-red transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
