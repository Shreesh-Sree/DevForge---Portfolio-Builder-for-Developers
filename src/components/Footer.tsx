export default function Footer() {
    return (
        <footer className="bg-forge-black border-t border-forge-muted/10 py-16 px-10">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-2 font-bold text-forge-muted">
                    <div className="w-6 h-6 bg-forge-muted/20 text-forge-muted flex items-center justify-center rounded text-[10px]">/</div>
                    DevForge
                </div>
                <div className="flex gap-8 text-[11px] font-black uppercase tracking-widest text-forge-muted">
                    <a href="#" className="hover:text-white transition-colors">GitHub</a>
                    <a href="#" className="hover:text-white transition-colors">Terms</a>
                </div>
                <div className="text-[10px] text-forge-muted/50 font-bold uppercase tracking-tight">
                    © 2026 DevForge. Build fast, own your code.
                </div>
            </div>
        </footer>
    )
}
