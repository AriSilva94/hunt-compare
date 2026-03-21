'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const NAV_LINKS = [
  { href: '/', label: 'Leaderboard' },
  { href: '/online', label: 'Online' },
  { href: '/deaths', label: 'Deaths' },
]

export default function Navbar({ user }: { user: { email?: string } | null }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="relative z-50" style={{ background: '#0f0d0a', borderBottom: '1px solid #2a2018' }}>
      {/* Ember accent line */}
      <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent 0%, #c07828 30%, #d4a840 50%, #c07828 70%, transparent 100%)', opacity: 0.7 }} />

      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between" style={{ height: '54px' }}>

        {/* Logo + nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="display-font" style={{ color: '#c07828', fontSize: '0.95rem', letterSpacing: '0.18em', textDecoration: 'none', fontWeight: 700 }}>
            CALMTRACKER
          </Link>

          <div className="hidden sm:flex items-center gap-5">
            {NAV_LINKS.map((l) => {
              const active = pathname === l.href
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`nav-link${active ? ' active' : ''}`}
                >
                  {l.label.toUpperCase()}
                </Link>
              )
            })}
          </div>
        </div>

        {/* User area */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/dashboard" className={`nav-user-link${pathname === '/dashboard' ? ' active' : ''}`}>
                COMMAND
              </Link>
              <Link href="/enemies" className={`nav-user-link${pathname === '/enemies' ? ' active' : ''}`}>
                ENEMIES
              </Link>
              <Link href="/hunted" className={`nav-user-link${pathname === '/hunted' ? ' active' : ''}`}>
                HUNTED
              </Link>
              <button onClick={handleSignOut} className="retreat-btn">
                RETREAT
              </button>
            </>
          ) : (
            <Link href="/login" className="nav-auth-link display-font" style={{ fontSize: '0.65rem', letterSpacing: '0.14em', padding: '5px 14px', fontWeight: 700 }}>
              ENTER
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
