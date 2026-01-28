'use client'

import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, ExternalLink, ArrowRight, MapPin, Calendar, Download } from 'lucide-react'
import type { TemplateProps } from '../index'
import { formatDateRange } from '../../lib/utils'

export function LightModernTemplate({ data }: TemplateProps) {
    const { profile, social_links, experience, projects, skills, education } = data

    const accentColor = profile.accent_color || '#2563EB' // Default Blue

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[var(--accent)] selection:text-white" style={{ '--accent': accentColor } as React.CSSProperties}>

            {/* Background Pattern */}
            <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

            {/* Navigation - Top Border */}
            <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="font-bold text-lg tracking-tight flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[var(--accent)] text-white flex items-center justify-center font-bold text-sm">
                            {profile.name.charAt(0)}
                        </div>
                        <span className="text-slate-900">{profile.name}</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
                        <a href="#about" className="hover:text-[var(--accent)] transition-colors">About</a>
                        {experience.length > 0 && <a href="#experience" className="hover:text-[var(--accent)] transition-colors">Experience</a>}
                        {projects.length > 0 && <a href="#projects" className="hover:text-[var(--accent)] transition-colors">Projects</a>}
                        <a href="#contact" className="px-4 py-2 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-colors">Contact</a>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-20 space-y-32">

                {/* Hero Section - Left Aligned */}
                <section id="about" className="min-h-[60vh] flex flex-col justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            Open to work
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                            {profile.tagline || `Frontend Engineer building digital products.`}
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-500 leading-relaxed max-w-2xl font-light">
                            {profile.bio || "Crafting polished, high-performance user interfaces with a focus on details and accessibility."}
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            {social_links?.github && (
                                <a href={social_links.github} target="_blank" className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"><Github className="w-6 h-6" /></a>
                            )}
                            {social_links?.linkedin && (
                                <a href={social_links.linkedin} target="_blank" className="p-3 text-slate-400 hover:text-[#0A66C2] hover:bg-blue-50 rounded-xl transition-all"><Linkedin className="w-6 h-6" /></a>
                            )}
                            {social_links?.email && (
                                <a href={`mailto:${social_links.email}`} className="p-3 text-slate-400 hover:text-[var(--accent)] hover:bg-slate-100 rounded-xl transition-all"><Mail className="w-6 h-6" /></a>
                            )}
                            {profile.resume_file && (
                                <a href={profile.resume_file} target="_blank" className="ml-auto flex items-center gap-2 text-sm font-bold text-[var(--accent)] hover:underline">
                                    <Download className="w-4 h-4" /> Download Resume
                                </a>
                            )}
                        </div>
                    </motion.div>
                </section>

                {/* Experience - Vertical Timeline (Non-Split) */}
                {experience.length > 0 && (
                    <section id="experience" className="bg-white rounded-[2rem] p-8 md:p-12 border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-12">
                            <Calendar className="w-6 h-6 text-[var(--accent)]" />
                            <h2 className="text-2xl font-bold text-slate-900">Work Experience</h2>
                        </div>

                        <div className="space-y-12 relative">
                            <div className="absolute left-[9px] top-2 bottom-2 w-[2px] bg-slate-100" />

                            {experience.map((exp, i) => (
                                <motion.div
                                    key={exp.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="relative pl-10"
                                >
                                    <div className={`absolute left-0 top-2 w-[20px] h-[20px] rounded-full border-4 border-white ${i === 0 ? 'bg-[var(--accent)]' : 'bg-slate-300'}`} />

                                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                                        <h3 className="text-xl font-bold text-slate-900">{exp.position}</h3>
                                        <span className="text-sm font-medium text-slate-400 tabular-nums">
                                            {formatDateRange(exp.start_date, exp.end_date, exp.is_current)}
                                        </span>
                                    </div>

                                    <div className="text-base font-semibold text-slate-700 mb-4 flex items-center gap-2">
                                        {exp.company}
                                        {exp.location && <span className="text-xs font-normal text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> {exp.location}</span>}
                                    </div>

                                    <p className="text-slate-600 leading-relaxed text-sm max-w-3xl">
                                        {exp.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects - Grid Layout (Cards) */}
                {projects.length > 0 && (
                    <section id="projects">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-3xl font-bold text-slate-900">Featured Projects</h2>
                            <a href="#" className="text-sm font-bold text-[var(--accent)] flex items-center gap-1 hover:gap-2 transition-all">
                                View All <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {projects.map((project, index) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                                >
                                    <div className="aspect-[16/9] bg-slate-100 relative overflow-hidden">
                                        {/* Placeholder pattern/image */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200" />
                                        <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                                            {/* Could replace with an actual image if available */}
                                            <div className="w-16 h-16 rounded-xl bg-white/50" />
                                        </div>
                                    </div>

                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="flex items-start justify-between mb-4">
                                            <h3 className="text-lg font-bold text-slate-900">{project.title}</h3>
                                            <div className="flex gap-2">
                                                {project.github_url && <a href={project.github_url} className="text-slate-400 hover:text-slate-900"><Github className="w-4 h-4" /></a>}
                                                {project.live_url && <a href={project.live_url} className="text-slate-400 hover:text-[var(--accent)]"><ExternalLink className="w-4 h-4" /></a>}
                                            </div>
                                        </div>

                                        <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">
                                            {project.description}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mt-auto">
                                            {project.tech_stack.slice(0, 4).map(tech => (
                                                <span key={tech} className="px-2 py-1 bg-slate-50 text-slate-600 text-xs font-semibold rounded-md border border-slate-100">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education - Simple List */}
                {education.length > 0 && (
                    <section id="education" className="bg-white rounded-[2rem] p-8 md:p-12 border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-10">
                            <h2 className="text-2xl font-bold text-slate-900">Education</h2>
                        </div>
                        <div className="space-y-6">
                            {education.map(edu => (
                                <div key={edu.id} className="pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold text-slate-900">{edu.institution}</h3>
                                        <span className="text-sm font-medium text-slate-400">{formatDateRange(edu.start_date, edu.end_date)}</span>
                                    </div>
                                    <div className="text-base text-[var(--accent)] font-medium">{edu.degree} in {edu.field}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills - Simple Clean Grid */}
                {skills.length > 0 && (
                    <section className="py-12 border-t border-slate-200">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-8">Technical Skills</h3>
                        <div className="flex flex-wrap gap-3">
                            {skills.map(skill => (
                                <div key={skill.id} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 shadow-sm">
                                    {skill.name}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Footer - Minimal */}
                <footer id="contact" className="py-20 border-t border-slate-200 text-center space-y-8">
                    <h2 className="text-3xl font-bold text-slate-900">Let's work together.</h2>
                    <p className="text-slate-500 max-w-md mx-auto">
                        Currently available for freelance projects and open to full-time opportunities.
                    </p>
                    <a href={`mailto:${social_links?.email}`} className="inline-block px-8 py-4 bg-[var(--accent)] text-white font-bold rounded-full shadow-lg shadow-[var(--accent)]/30 hover:-translate-y-1 transition-transform">
                        Say Hello
                    </a>

                    <div className="pt-20 text-xs text-slate-400">
                        © {new Date().getFullYear()} {profile.name}. All rights reserved.
                    </div>
                </footer>

            </main>
        </div>
    )
}
