import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { createClient } from '@/lib/supabase'
import type { Session, AuthChangeEvent } from '@supabase/supabase-js'

const supabase = createClient()
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Preview from './pages/Preview'
import PublicPortfolio from './pages/PublicPortfolio'
import { Loader2 } from 'lucide-react'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const user = session?.user ?? null
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setSession(session)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-forge-black">
        <Loader2 className="w-8 h-8 animate-spin text-forge-beige" />
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <Auth />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/dashboard" /> : <Auth />}
        />
        <Route
          path="/auth"
          element={user ? <Navigate to="/dashboard" /> : <Auth />}
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/auth" />}
        />
        <Route path="/preview/:templateId" element={<Preview />} />
        <Route path="/:username" element={<PublicPortfolio />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
