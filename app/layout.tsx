import type { Metadata } from 'next'
import { Cinzel, Crimson_Pro, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import { createClient } from '@/lib/supabase/server'

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-display-var',
  weight: ['400', '600', '700', '900'],
  display: 'swap',
})

const crimsonPro = Crimson_Pro({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono-var',
  weight: ['400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'CalmTracker – Calmera Tibia Tracker',
  description: 'Track top 1000 Calmera players: XP gains, online status, deaths, and enemy watch.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="en">
      <body className={`${cinzel.variable} ${crimsonPro.variable} ${jetBrainsMono.variable}`}>
        <Navbar user={user} />
        <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
          {children}
        </main>
      </body>
    </html>
  )
}
