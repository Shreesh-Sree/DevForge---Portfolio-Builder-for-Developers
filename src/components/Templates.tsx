import { Github, Instagram, Mail, ExternalLink } from 'lucide-react'

export function TerminalTemplate({ profile }: { profile: any }) {
    return (
        <div className="min-h-screen bg-black text-green-500 font-mono p-4 md:p-10 selection:bg-green-500 selection:text-black">
            <div className="max-w-3xl mx-auto border border-green-900/50 p-6 md:p-10 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                <div className="mb-10 text-xs opacity-50 flex justify-between">
                    <span>PORTFOLIO_OS [Version 1.0.4]</span>
                    <span>SYSTEM_READY</span>
                </div>

                <section className="mb-12">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-white text-xl">guest@devforge</span>
                        <span className="text-green-800">:</span>
                        <span className="text-blue-400">~</span>
                        <span className="text-white">$</span>
                        <span className="typing-effect">whoami</span>
                    </div>
                    <div className="pl-6 border-l border-green-900/50 space-y-4">
                        <h1 className="text-4xl md:text-5xl font-black text-white">{profile.full_name || 'Hacker Anon'}</h1>
                        <p className="text-xl text-green-400">{profile.about || 'A passionate developer building the future.'}</p>
                    </div>
                </section>

                <section className="mb-12">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-white">$</span>
                        <span>ls /projects</span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        {[1, 2].map(i => (
                            <div key={i} className="border border-green-900/30 p-4 hover:bg-green-900/10 transition-colors">
                                <h3 className="text-white font-bold mb-1">Project_{i}.exe</h3>
                                <p className="text-xs opacity-70 mb-3">Experimental application with complex logic.</p>
                                <div className="flex gap-2 text-[10px]">
                                    <span className="px-1 bg-green-900/30">REACT</span>
                                    <span className="px-1 bg-green-900/30">SUPABASE</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-white">$</span>
                        <span>contact --info</span>
                    </div>
                    <div className="flex gap-6">
                        <Github className="w-5 h-5 hover:text-white transition-colors cursor-pointer" />
                        <Instagram className="w-5 h-5 hover:text-white transition-colors cursor-pointer" />
                        <Mail className="w-5 h-5 hover:text-white transition-colors cursor-pointer" />
                    </div>
                </section>

                <div className="mt-20 text-center text-[10px] opacity-30">
                    --- END OF TRANSMISSION ---
                </div>
            </div>
        </div>
    )
}

export function MonolithTemplate({ profile }: { profile: any }) {
    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
            <header className="fixed top-0 w-full flex justify-between items-center px-10 py-8 z-50">
                <div className="font-black text-2xl tracking-tighter uppercase whitespace-nowrap">
                    {profile.username || 'DevForge'}
                </div>
                <div className="flex gap-8 text-[10px] uppercase font-bold tracking-[0.2em]">
                    <span className="hover:line-through cursor-pointer">About</span>
                    <span className="hover:line-through cursor-pointer">Work</span>
                    <span className="hover:line-through cursor-pointer">Contact</span>
                </div>
            </header>

            <main className="pt-40 px-6 md:px-20 pb-20">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-32">
                        <h1 className="text-[12vw] leading-[0.85] font-black uppercase tracking-tighter mb-12">
                            Building <br /> The Web
                        </h1>
                        <div className="grid md:grid-cols-2 gap-20">
                            <p className="text-2xl md:text-3xl leading-tight font-medium text-gray-400">
                                {profile.about || 'Specializing in clean typography, bold layouts, and high-performance applications.'}
                            </p>
                            <div className="flex flex-col justify-end">
                                <div className="h-px bg-black mb-8"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-black tracking-widest uppercase">{profile.location || 'Based in Earth'}</span>
                                    <div className="flex gap-6">
                                        <Github className="w-5 h-5" />
                                        <Mail className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <section className="space-y-20">
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-300">Selected Works</h2>
                        <div className="grid md:grid-cols-2 gap-10">
                            {[1, 2].map(i => (
                                <div key={i} className="group cursor-pointer">
                                    <div className="aspect-[16/10] bg-gray-100 mb-6 overflow-hidden">
                                        <div className="w-full h-full bg-gray-200 group-hover:scale-105 transition-transform duration-700"></div>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <h3 className="text-xl font-bold uppercase tracking-tight">Project Title {i}</h3>
                                            <p className="text-xs text-gray-400 uppercase font-black tracking-widest mt-1">Design / Dev</p>
                                        </div>
                                        <ExternalLink className="w-5 h-5 opacity-20 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>

            <footer className="p-10 border-t border-gray-100 flex justify-between items-center text-[10px] uppercase font-black tracking-widest">
                <span>© 2026 {profile.full_name || 'Portfolio'}</span>
                <span>Built with DevForge</span>
            </footer>
        </div>
    )
}
