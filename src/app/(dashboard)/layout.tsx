'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: '◆' },
  { label: 'Logs', href: '/logs', icon: '▤' },
  { label: 'Rules', href: '/rules', icon: '⚙' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex md:flex-col md:w-56 border-r border-brand-border bg-brand-panel">
        <div className="p-5 border-b border-brand-border">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
            <span className="text-xs font-mono tracking-widest text-brand-white">
              RAIL<span className="text-brand-red">GUARD</span>X
            </span>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors ${
                pathname === item.href
                  ? 'bg-brand-red/10 text-brand-red'
                  : 'text-brand-grey hover:text-brand-white hover:bg-brand-border/50'
              }`}
            >
              <span className="text-xs">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-brand-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm text-brand-grey hover:text-brand-red hover:bg-brand-red/5 transition-colors"
          >
            <span className="text-xs">⏻</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile top nav */}
      <div className="md:hidden border-b border-brand-border bg-brand-panel">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
            <span className="text-xs font-mono tracking-widest text-brand-white">
              RAIL<span className="text-brand-red">GUARD</span>X
            </span>
          </Link>
          <button
            onClick={handleLogout}
            className="text-xs text-brand-grey hover:text-brand-red transition-colors"
          >
            Sign Out
          </button>
        </div>
        <nav className="flex px-2 pb-2 gap-1">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 text-center py-2 rounded text-xs font-medium transition-colors ${
                pathname === item.href
                  ? 'bg-brand-red/10 text-brand-red'
                  : 'text-brand-grey hover:text-brand-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}
