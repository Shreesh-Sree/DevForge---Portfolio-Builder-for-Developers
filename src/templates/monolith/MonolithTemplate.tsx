'use client'

import { motion } from 'framer-motion'
import { Github, Linkedin, Instagram, Mail, ExternalLink } from 'lucide-react'
import type { TemplateProps } from '../index'
import { formatDateRange } from '../../lib/utils'

export function MonolithTemplate({ data }: TemplateProps) {
    const { profile, social_links, experience, projects, skills, education } = data

    // Group skills by category
    const skillsByCategory = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
        if (!acc[skill.category]) {
            acc[skill.category] = []
        }
        acc[skill.category].push(skill)
        return acc
    }, {})

    const accentColor = profile.accent_color || '#FFFFFF'

    const navItems = [
        { id: 'about', label: 'About' },
        { id: 'experience', label: 'Work', show: experience.length > 0 },
        { id: 'projects', label: 'Projects', show: projects.length > 0 },
        { id: 'skills', label: 'Skills', show: skills.length > 0 },
        { id: 'education', label: 'Education', show: education.length > 0 },
        { id: 'contact', label: 'Contact' }
    ].filter(item => item.show !== false)

    return (
        <div className="min-h-screen bg-[#030303] text-white selection:bg-[var(--accent)] selection:text-black font-sans antialiased overflow-x-hidden" style={{ '--accent': accentColor } as React.CSSProperties}>
            {/* Top Navigation - Minimalist Glass */}
            <div className="fixed top-0 inset-x-0 z-50 flex justify-center p-4 md:p-6">
                <nav className="bg-black/20 backdrop-blur-md border border-white/5 px-6 md:px-8 py-2.5 md:py-3 rounded-full flex items-center gap-4 md:gap-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)] max-w-[95vw] overflow-x-auto no-scrollbar">
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent)] mr-2 whitespace-nowrap hidden lg:block">{profile.name}</span>
                    <div className="w-px h-3 bg-white/10 hidden lg:block" />
                    <div className="flex items-center gap-4 md:gap-6">
                        {navItems.map((item) => (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-neutral-400 hover:text-white transition-all whitespace-nowrap"
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>
                </nav>
            </div>

            {/* Bottom Floating Social Hub */}
            <div className="fixed bottom-8 right-8 z-50 hidden md:flex flex-col gap-3">
                {social_links?.github && (
                    <a href={social_links.github} target="_blank" rel="noopener noreferrer" className="p-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all group shadow-xl">
                        <Github className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </a>
                )}
                {social_links?.linkedin && (
                    <a href={social_links.linkedin} target="_blank" rel="noopener noreferrer" className="p-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all group shadow-xl">
                        <Linkedin className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </a>
                )}
                {social_links?.twitter && (
                    <a href={social_links.twitter} target="_blank" rel="noopener noreferrer" className="p-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all group shadow-xl">
                        <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </a>
                )}
                {social_links?.email && (
                    <a href={`mailto:${social_links.email}`} className="p-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all group shadow-xl">
                        <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </a>
                )}
            </div>

            {/* Main Content */}
            <main className="relative">
                {/* Hero Section */}
                <section id="about" className="min-h-screen flex flex-col items-center justify-center p-6 md:p-8 text-center relative overflow-hidden">
                    {/* Atmospheric Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vh] bg-gradient-to-tr from-[var(--accent)]/5 via-transparent to-[var(--accent)]/5 blur-[120px] pointer-events-none" />
                    <div className="absolute top-1/4 left-1/4 w-[60vw] h-[60vw] bg-[var(--accent)]/10 blur-[150px] rounded-full animate-pulse pointer-events-none" />

                    <motion.div
                        className="mb-8 md:mb-10 px-4 md:px-6 py-2 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400 shadow-inner"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <span className="inline-block w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-[var(--accent)] mr-2 md:mr-3 animate-pulse" />
                        Available for select projects
                    </motion.div>

                    <div className="relative z-10 w-full max-w-7xl mx-auto">
                        <motion.h1
                            className="text-[clamp(2.5rem,10vw,10rem)] font-black leading-[0.85] tracking-[-0.05em] mb-8 md:mb-12 uppercase"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        >
                            {profile.name.split(' ').map((word, i) => (
                                <span key={word + i} className={`block ${i % 2 !== 0 ? 'text-neutral-500 italic' : ''}`}>
                                    {word}
                                </span>
                            ))}
                        </motion.h1>

                        <div className="max-w-xl mx-auto space-y-8 md:space-y-12">
                            {profile.tagline && (
                                <motion.p
                                    className="text-sm md:text-lg lg:text-xl text-neutral-400 font-medium tracking-tight leading-relaxed max-w-xs md:max-w-lg mx-auto uppercase tracking-widest"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                >
                                    {profile.tagline}
                                </motion.p>
                            )}

                            <motion.div
                                className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1, delay: 0.7 }}
                            >
                                <a
                                    href="#contact"
                                    className="w-full sm:w-auto px-8 md:px-12 py-5 md:py-6 rounded-full font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
                                    style={{ backgroundColor: 'var(--accent)', color: accentColor === '#FFFFFF' ? '#000000' : '#FFFFFF' }}
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                        Let's Collaborate <ExternalLink className="w-3 h-3" />
                                    </span>
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                </a>
                                <a
                                    href="#projects"
                                    className="w-full sm:w-auto px-8 md:px-12 py-5 md:py-6 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-sm font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] hover:bg-white/5 hover:border-white/20 transition-all shadow-xl"
                                >
                                    Explore Works
                                </a>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Experience Section */}
                {experience.length > 0 && (
                    <section id="experience" className="max-w-7xl mx-auto px-8 py-32 border-t border-white/5">
                        <div className="flex flex-col lg:flex-row gap-16 lg:gap-32">
                            <div className="lg:w-1/3">
                                <h2 className="text-sm font-black uppercase tracking-[0.4em] text-[var(--accent)] mb-4">Chronicle</h2>
                                <p className="text-4xl font-bold tracking-tight">Professional Journey</p>
                            </div>
                            <div className="lg:w-2/3 space-y-24">
                                {experience.map((exp, index) => (
                                    <motion.div
                                        key={exp.id}
                                        className="relative pl-6 md:pl-8 border-l border-white/10"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-[var(--accent)] shadow-[0_0_15px_var(--accent)]" />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-4">
                                            {formatDateRange(exp.start_date, exp.end_date, exp.is_current)}
                                        </p>
                                        <h3 className="text-3xl font-bold mb-2">{exp.position}</h3>
                                        <p className="text-xl text-neutral-400 mb-6 font-medium italic">@ {exp.company}</p>
                                        {exp.description && (
                                            <p className="text-neutral-500 leading-relaxed text-lg max-w-xl">{exp.description}</p>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Projects Section - Capsule Style */}
                {projects.length > 0 && (
                    <section id="projects" className="py-32 border-y border-white/5 relative overflow-hidden">
                        <div className="max-w-7xl mx-auto px-8">
                            <div className="mb-20">
                                <h2 className="text-[var(--accent)] text-[10px] font-black uppercase tracking-[0.4em] mb-4">Selected Works</h2>
                                <h3 className="text-4xl font-bold tracking-tight">Project Artifacts</h3>
                            </div>

                            <div className="flex flex-col gap-8">
                                {projects.map((project, index) => (
                                    <motion.div
                                        key={project.id}
                                        className="group relative flex flex-col lg:flex-row items-center gap-6 md:gap-8 p-6 md:p-12 rounded-[32px] md:rounded-[100px] bg-white/[0.02] border border-white/[0.05] hover:border-[var(--accent)]/30 hover:bg-white/[0.04] transition-all duration-500"
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <div className="flex-1">
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {project.tech_stack.map(tech => (
                                                    <span key={tech} className="text-[8px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 whitespace-nowrap">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                            <h4 className="text-2xl md:text-5xl font-black tracking-tighter mb-4 group-hover:text-[var(--accent)] transition-colors">
                                                {project.title}
                                            </h4>
                                            {project.description && (
                                                <p className="text-neutral-500 text-lg leading-relaxed max-w-2xl">
                                                    {project.description}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex gap-4 shrink-0 md:mt-4 lg:mt-0">
                                            {project.github_url && (
                                                <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-2xl">
                                                    <Github className="w-5 h-5 md:w-6 md:h-6" />
                                                </a>
                                            )}
                                            {project.live_url && (
                                                <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[var(--accent)] text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-2xl" style={{ backgroundColor: 'var(--accent)', color: accentColor === '#FFFFFF' ? '#000000' : '#FFFFFF' }}>
                                                    <ExternalLink className="w-5 h-5 md:w-6 md:h-6" />
                                                </a>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Skills/Stacks - Modern Chip Design */}
                {skills.length > 0 && (
                    <section id="skills" className="max-w-7xl mx-auto px-8 py-32">
                        <div className="flex flex-col lg:flex-row gap-16">
                            <div className="lg:w-1/3">
                                <h2 className="text-[var(--accent)] text-[10px] font-black uppercase tracking-[0.4em] mb-4">Arsenal</h2>
                                <h3 className="text-4xl font-bold tracking-tight">Technologies & Tools</h3>
                            </div>
                            <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                                {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                                    <div key={category} className="p-6 md:p-10 rounded-[24px] md:rounded-[40px] bg-white/[0.02] border border-white/5 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-[var(--accent)]/10 transition-colors" />
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-8">{category}</p>
                                        <div className="flex flex-wrap gap-3">
                                            {categorySkills.map((skill) => (
                                                <div
                                                    key={skill.id}
                                                    className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold hover:border-[var(--accent)] hover:bg-white/[0.07] transition-all cursor-default shadow-sm"
                                                >
                                                    {skill.name}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Education Section - Modern Simple Grid */}
                {education.length > 0 && (
                    <section id="education" className="max-w-7xl mx-auto px-8 py-32 border-t border-white/5">
                        <div className="flex flex-col lg:flex-row gap-16">
                            <div className="lg:w-1/3">
                                <h2 className="text-[var(--accent)] text-[10px] font-black uppercase tracking-[0.4em] mb-4">Credentials</h2>
                                <h3 className="text-4xl font-bold tracking-tight">Academic Foundation</h3>
                            </div>
                            <div className="lg:w-2/3 grid grid-cols-1 gap-12">
                                {education.map((edu) => (
                                    <div key={edu.id} className="group relative">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4 mb-4">
                                            <h4 className="text-xl md:text-2xl font-bold">{edu.institution}</h4>
                                            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-neutral-500 bg-white/5 px-4 py-2 rounded-full border border-white/10 shadow-sm">
                                                {formatDateRange(edu.start_date, edu.end_date)}
                                            </span>
                                        </div>
                                        <p className="text-xl text-[var(--accent)] font-medium mb-4">{edu.degree} in {edu.field}</p>
                                        {edu.description && (
                                            <p className="text-neutral-500 leading-relaxed max-w-2xl text-lg">{edu.description}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Footer Section - Contact */}
                <section id="contact" className="px-8 pb-48 pt-32 text-center relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[var(--accent)]/5 blur-[150px] rounded-full opacity-30 pointer-events-none" />

                    <motion.div
                        className="max-w-4xl mx-auto relative z-10"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-6xl lg:text-[7rem] font-black tracking-tighter leading-[0.9] mb-8 md:mb-12 uppercase flex flex-col items-center">
                            <span>Shall we</span>
                            <span className="relative inline-block px-8 md:px-12 py-3 md:py-4 mt-2">
                                <motion.span
                                    className="absolute inset-0 bg-[var(--accent)]/30 backdrop-blur-sm"
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.5, duration: 0.8 }}
                                    style={{ originX: 0 }}
                                />
                                <span className="relative z-10 italic">collaborate?</span>
                            </span>
                        </h2>

                        <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-center items-center">
                            <a
                                href={`mailto:${social_links?.email || ''}`}
                                className="w-full md:w-auto px-10 md:px-14 py-6 md:py-7 bg-white text-black rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 overflow-hidden relative shadow-2xl"
                            >
                                <span className="relative z-10">Send a Mission</span>
                                <ExternalLink className="w-4 h-4 relative z-10" />
                            </a>

                            <div className="flex gap-4">
                                {social_links?.linkedin && (
                                    <a href={social_links.linkedin} className="p-7 rounded-full border border-white/10 bg-white/5 hover:border-[var(--accent)] hover:bg-white/[0.08] transition-all shadow-xl group">
                                        <Linkedin className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
                                    </a>
                                )}
                                {social_links?.twitter && (
                                    <a href={social_links.twitter} className="p-7 rounded-full border border-white/10 bg-white/5 hover:border-[var(--accent)] hover:bg-white/[0.08] transition-all shadow-xl group">
                                        <Instagram className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
                                    </a>
                                )}
                                {social_links?.email && (
                                    <a href={`mailto:${social_links.email}`} className="p-7 rounded-full border border-white/10 bg-white/5 hover:border-[var(--accent)] hover:bg-white/[0.08] transition-all shadow-xl group">
                                        <Mail className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="mt-40 pt-16 border-t border-white/5 text-[9px] font-black uppercase tracking-[0.5em] text-neutral-600">
                            {new Date().getFullYear()} • {profile.name} • Design System v4.0 • Built with DevForge
                        </div>
                    </motion.div>
                </section>
            </main>
        </div>
    )
}
