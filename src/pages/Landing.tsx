import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import type { Session, AuthChangeEvent, User } from '@supabase/supabase-js'
import Footer from '../components/Footer'

const supabase = createClient()

export default function Landing() {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        setUser(null)
    }

    return (
        <div className="min-h-screen bg-forge-black text-forge-beige font-sans pb-40 selection:bg-forge-muted selection:text-white">
            <main className="max-w-6xl mx-auto px-10 pt-32 md:pt-48">
                {/* Distinct, Staggered Typographic Hero */}
                <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start mb-24 md:mb-40">
                    <div className="flex-1">
                        <h1 className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] uppercase text-white">
                            Build<br />
                            <span className="text-transparent stroke-[1px] stroke-forge-muted fill-transparent" style={{ WebkitTextStroke: '1px #948979' }}>Your</span><br />
                            Forge
                        </h1>
                    </div>
                    <div className="flex-1 pt-0 md:pt-4">
                        <p className="text-xl md:text-2xl font-bold mb-8 leading-tight max-w-sm text-forge-beige">
                            The developer portfolio engine. <br />
                            <span className="text-forge-muted font-medium">No design skills required. Just your code and your story.</span>
                        </p>
                        <div className="flex flex-col gap-4 items-start">
                            <Link to={user ? "/dashboard" : "/auth"} className="group flex items-center gap-4 text-lg font-black uppercase tracking-widest text-white hover:text-forge-beige hover:gap-6 transition-all">
                                {user ? "Go to Dashboard" : "Start Building"} <ArrowRight className="w-5 h-5" />
                            </Link>
                            <a href="#templates" className="text-sm font-bold text-forge-muted hover:text-white transition-colors uppercase tracking-widest">
                                Browse Styles
                            </a>
                        </div>
                    </div>
                </div>

                {/* Minimalist Feature List */}
                <section className="mb-24 md:mb-40 space-y-8 md:space-y-12">
                    <div className="flex items-end gap-3 md:gap-4 border-b border-forge-grey pb-4">
                        <span className="text-3xl md:text-4xl font-black opacity-20 text-forge-muted">01</span>
                        <h3 className="text-lg md:text-xl font-bold mb-0.5 text-white">Instant Generation</h3>
                        <p className="text-forge-muted text-[10px] md:text-sm ml-auto max-w-[140px] md:max-w-xs text-right italic font-medium">Turn a JSON/Resume into a high-end site in seconds.</p>
                    </div>
                    <div className="flex items-end gap-3 md:gap-4 border-b border-forge-grey pb-4">
                        <span className="text-3xl md:text-4xl font-black opacity-20 text-forge-muted">02</span>
                        <h3 className="text-lg md:text-xl font-bold mb-0.5 text-white">GitHub Native</h3>
                        <p className="text-forge-muted text-[10px] md:text-sm ml-auto max-w-[140px] md:max-w-xs text-right italic font-medium">Direct export to your repos. Full ownership, forever.</p>
                    </div>
                    <div className="flex items-end gap-3 md:gap-4 border-b border-forge-grey pb-4">
                        <span className="text-3xl md:text-4xl font-black opacity-20 text-forge-muted">03</span>
                        <h3 className="text-lg md:text-xl font-bold mb-0.5 text-white">Edge Deployment</h3>
                        <p className="text-forge-muted text-[10px] md:text-sm ml-auto max-w-[140px] md:max-w-xs text-right italic font-medium">Optimized for Vercel, Netlify, and GitHub Pages.</p>
                    </div>
                </section>

                {/* Focused Templates Section */}
                <section id="templates" className="mb-32">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">Styles</h2>
                            <p className="text-[10px] md:text-sm font-bold text-forge-muted uppercase tracking-[0.2em] mt-2">Curated themes for modern developers</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        {[
                            { id: 'terminal', name: 'Terminal', tag: 'Hacker', desc: 'A command-line inspired interface for the minimalists.' },
                            { id: 'monolith', name: 'Monolith', tag: 'Editorial', desc: 'Bold typography and immersive layouts for the storytellers.' },
                            { id: 'light-modern', name: 'Light Modern', tag: 'Professional', desc: 'Clean, crisp, and high-performance design for the pros.' }
                        ].map(t => (
                            <Link
                                key={t.id}
                                to={`/preview/${t.id}`}
                                className="group relative flex flex-col bg-forge-grey/20 border border-white/5 rounded-[48px] overflow-hidden transition-all duration-500 hover:border-forge-beige/30 hover:shadow-2xl hover:shadow-forge-beige/5"
                            >
                                <div className="p-10 pb-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-forge-muted">{t.tag}</div>
                                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-forge-beige group-hover:text-forge-black transition-all">
                                            <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform" />
                                        </div>
                                    </div>
                                    <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-4">{t.name}</h3>
                                    <p className="text-sm text-forge-muted font-medium max-w-[240px] leading-relaxed italic">{t.desc}</p>
                                </div>

                                <div className="relative aspect-[16/10] mx-6 mb-6 rounded-[32px] overflow-hidden bg-black/40 border border-white/5 group-hover:border-white/10 transition-colors">
                                    <div className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-500 group-hover:opacity-0 bg-black/40" />
                                    <iframe
                                        src={`/preview/${t.id}`}
                                        className="absolute top-0 left-0 w-[400%] h-[400%] border-none origin-top-left pointer-events-none"
                                        style={{ transform: 'scale(0.25)' }}
                                        title={`${t.name} Preview`}
                                    />
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </main>

            <Footer />

            {/* Floating Bottom Navbar */}
            <div className="fixed bottom-6 md:bottom-8 inset-x-0 z-50 px-4 md:px-6">
                <nav className="max-w-5xl mx-auto px-6 md:px-10 py-4 md:py-5 flex justify-between items-center bg-forge-grey/90 backdrop-blur-md border border-forge-muted/20 rounded-full md:rounded-[32px] shadow-2xl shadow-black/50 transition-all">
                    <Link to="/" className="text-lg md:text-xl font-bold flex items-center gap-2 text-white">
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-forge-beige text-forge-black flex items-center justify-center rounded">/</div>
                        <span className="hidden sm:inline">DevForge</span>
                    </Link>
                    <div className="flex items-center gap-4 md:gap-8">
                        {user ? (
                            <>
                                <Link to="/dashboard" className="text-[10px] md:text-xs font-black uppercase tracking-widest text-forge-muted hover:text-white transition-colors">Dashboard</Link>
                                <button onClick={handleSignOut} className="bg-forge-beige text-forge-black px-4 md:px-6 py-2 md:py-2.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-white transition-all shadow-lg">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/auth" className="text-[10px] md:text-xs font-black uppercase tracking-widest text-forge-muted hover:text-white transition-colors">Log In</Link>
                                <Link to="/auth" className="bg-forge-beige text-forge-black px-4 md:px-6 py-2 md:py-2.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-white transition-all shadow-lg">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </nav>
            </div>
        </div>
    )
}
