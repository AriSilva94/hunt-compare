'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="fade-in-up">
          <div style={{ fontSize: '2.5rem', color: '#c07828', marginBottom: '1rem' }}>✦</div>
          <h1 className="display-font" style={{ fontSize: '1.5rem', letterSpacing: '0.1em', color: '#e2d8c2', marginBottom: '0.75rem' }}>
            CHECK YOUR EMAIL
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#9a8a72', fontStyle: 'italic' }}>
            Confirmation sent to <strong style={{ color: '#8a7a62', fontStyle: 'normal' }}>{email}</strong>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '360px' }} className="fade-in-up">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="display-font" style={{ fontSize: '0.58rem', letterSpacing: '0.3em', color: '#3a2a18', marginBottom: '0.75rem' }}>
            CALMTRACKER · ENLIST
          </div>
          <h1 className="display-font" style={{ fontSize: '1.75rem', letterSpacing: '0.1em', fontWeight: 700, color: '#e2d8c2' }}>
            CREATE ACCOUNT
          </h1>
          <div style={{ width: '3rem', height: '2px', background: 'linear-gradient(90deg, transparent, #c07828, transparent)', margin: '0.75rem auto 0' }} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="display-font" style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.15em', color: '#9a8a72', marginBottom: '6px' }}>EMAIL</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="chronicle-input" style={{ width: '100%', padding: '9px 12px', fontSize: '0.88rem', fontFamily: 'var(--font-body, serif)', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label className="display-font" style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.15em', color: '#9a8a72', marginBottom: '6px' }}>PASSWORD</label>
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              className="chronicle-input" style={{ width: '100%', padding: '9px 12px', fontSize: '0.88rem', fontFamily: 'var(--font-body, serif)', boxSizing: 'border-box' }} />
          </div>

          {error && (
            <p style={{ fontSize: '0.8rem', color: '#b82020', background: '#1a0808', border: '1px solid #4a1010', padding: '8px 12px', margin: 0 }}>
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="display-font ember-btn"
            style={{ marginTop: '0.5rem', padding: '10px', fontSize: '0.7rem', letterSpacing: '0.18em', fontWeight: 700, width: '100%' }}>
            {loading ? 'ENLISTING...' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#6a5a44', marginTop: '1.5rem' }}>
          Already enlisted?{' '}
          <Link href="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
