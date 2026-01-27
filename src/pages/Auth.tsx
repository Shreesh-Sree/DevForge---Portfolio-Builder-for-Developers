import { useState } from 'react'
import { createClient } from '@/lib/supabase'

const supabase = createClient()
import { Loader2 } from 'lucide-react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import Footer from '../components/Footer'

export default function Auth() {
    const location = useLocation()
    const [isSignup, setIsSignup] = useState(location.pathname === '/signup')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)
    const navigate = useNavigate()

    async function handleEmailAuth(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setMessage(null)

        if (isSignup) {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name: fullName }
                }
            })
            if (error) {
                setError(error.message)
            } else if (data.user && !data.session) {
                setMessage('Check your email for confirmation.')
            } else {
                navigate('/dashboard')
            }
        } else {
            const { error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) {
                setError(error.message)
            } else {
                navigate('/dashboard')
            }
        }
        setLoading(false)
    }

    async function handleGithubLogin() {
        setLoading(true)
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: window.location.origin + '/dashboard',
                scopes: 'repo delete_repo'
            }
        })
        if (error) {
            setError(error.message)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-forge-black text-forge-beige font-sans flex flex-col selection:bg-forge-muted selection:text-white">
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-sm space-y-10 py-20">
                    <header>
                        <Link to="/" className="text-[10px] font-black text-forge-muted hover:text-white uppercase tracking-widest mb-8 block transition-colors">← Back Home</Link>
                        <h1 className="text-4xl font-black uppercase tracking-tighter leading-tight text-white">
                            {isSignup ? "Join the\nForge" : "Welcome\nBack"}
                        </h1>
                    </header>

                    {message ? (
                        <div className="p-6 bg-forge-grey border border-forge-muted/20 rounded-[28px] text-sm font-bold text-forge-beige">
                            {message}
                        </div>
                    ) : (
                        <form onSubmit={handleEmailAuth} className="space-y-6">
                            {isSignup && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-forge-muted uppercase tracking-widest">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full p-3 bg-forge-grey border border-transparent focus:border-forge-muted focus:bg-forge-black outline-none text-sm font-bold text-white rounded-2xl transition-all placeholder:text-forge-muted/50"
                                    />
                                </div>
                            )}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-forge-muted uppercase tracking-widest">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-3 bg-forge-grey border border-transparent focus:border-forge-muted focus:bg-forge-black outline-none text-sm font-bold text-white rounded-2xl transition-all placeholder:text-forge-muted/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-forge-muted uppercase tracking-widest">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-3 bg-forge-grey border border-transparent focus:border-forge-muted focus:bg-forge-black outline-none text-sm font-bold text-white rounded-2xl transition-all placeholder:text-forge-muted/50"
                                />
                            </div>

                            {error && <p className="text-[10px] text-red-400 font-black uppercase tracking-widest">{error}</p>}

                            <div className="space-y-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-forge-beige text-forge-black text-xs font-black uppercase tracking-widest rounded-full hover:bg-white disabled:opacity-50 transition-all shadow-lg shadow-black/20"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (isSignup ? 'Create Account' : 'Sign In')}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleGithubLogin}
                                    className="w-full py-4 border border-forge-muted/30 text-forge-beige text-xs font-black uppercase tracking-widest rounded-full hover:bg-forge-grey transition-all"
                                >
                                    Login with GitHub
                                </button>
                            </div>

                            <div className="pt-4 text-center">
                                <button
                                    type="button"
                                    onClick={() => setIsSignup(!isSignup)}
                                    className="text-[10px] font-black text-forge-muted uppercase tracking-widest hover:text-white transition-colors"
                                >
                                    {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign up"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    )
}
