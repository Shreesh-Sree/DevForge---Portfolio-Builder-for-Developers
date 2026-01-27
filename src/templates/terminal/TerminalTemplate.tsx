'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import type { TemplateProps } from '../index'
import { formatDateRange } from '../../lib/utils'

// Typing animation hook
function useTypingEffect(text: string, speed: number = 30) {
    const [displayedText, setDisplayedText] = useState('')
    const [isComplete, setIsComplete] = useState(false)

    useEffect(() => {
        setDisplayedText('')
        setIsComplete(false)
        let i = 0
        const timer = setInterval(() => {
            if (i < text.length) {
                setDisplayedText(text.slice(0, i + 1))
                i++
            } else {
                clearInterval(timer)
                setIsComplete(true)
            }
        }, speed)

        return () => clearInterval(timer)
    }, [text, speed])

    return { displayedText, isComplete }
}

// Command output component
function CommandLine({ command, children, delay = 0 }: {
    command: string
    children: React.ReactNode
    delay?: number
}) {
    const [showContent, setShowContent] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setShowContent(true), delay)
        return () => clearTimeout(timer)
    }, [delay])

    if (!showContent) return null

    return (
        <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex items-center gap-2 mb-2">
                <span style={{ color: 'var(--accent)' }}>guest@portfolio</span>
                <span className="text-white">:</span>
                <span className="text-blue-400">~</span>
                <span className="text-white">$</span>
                <span className="text-green-300 ml-2">{command}</span>
            </div>
            <div className="pl-0 text-gray-300">
                {children}
            </div>
        </motion.div>
    )
}

// Cursor blink animation
function BlinkingCursor() {
    return (
        <motion.span
            className="inline-block w-2 h-5 ml-1"
            style={{ backgroundColor: 'var(--accent)' }}
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
        />
    )
}

// Progress bar for skills
function SkillBar({ name, level }: { name: string; level: string }) {
    const levels: Record<string, number> = {
        beginner: 25,
        intermediate: 50,
        advanced: 75,
        expert: 100,
    }
    const percentage = levels[level] || 50
    const filledBlocks = Math.floor(percentage / 10)
    const emptyBlocks = 10 - filledBlocks

    return (
        <div className="flex items-center gap-4 font-mono text-sm">
            <span className="w-32 text-gray-400">{name}</span>
            <span style={{ color: 'var(--accent)' }}>
                [{'█'.repeat(filledBlocks)}{'░'.repeat(emptyBlocks)}]
            </span>
            <span className="text-amber-400">{percentage}%</span>
        </div>
    )
}

export function TerminalTemplate({ data }: TemplateProps) {
    const { profile, social_links, experience, projects, skills, education } = data
    const accentColor = profile.accent_color || '#4ade80' // default green-400
    const containerRef = useRef<HTMLDivElement>(null)

    const { displayedText: nameText, isComplete: nameComplete } = useTypingEffect(
        `Welcome to ${profile.name}'s portfolio`,
        40
    )

    // Group skills by category
    const skillsByCategory = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
        if (!acc[skill.category]) {
            acc[skill.category] = []
        }
        acc[skill.category].push(skill)
        return acc
    }, {})

    return (
        <div
            ref={containerRef}
            className="min-h-screen bg-black font-mono relative overflow-hidden"
            style={{
                fontFamily: "'Fira Code', 'Courier New', monospace",
                color: 'var(--accent)',
                '--accent': accentColor
            } as any}
        >
            {/* Scanline effect */}
            <div
                className="pointer-events-none fixed inset-0 z-50"
                style={{
                    background: 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15) 1px, transparent 1px, transparent 2px)',
                }}
            />

            {/* CRT glow effect */}
            <div
                className="pointer-events-none fixed inset-0 z-40"
                style={{
                    boxShadow: 'inset 0 0 150px rgba(0, 255, 0, 0.05)',
                }}
            />

            {/* Terminal window */}
            <div className="max-w-5xl mx-auto p-4 md:p-8 relative z-10">
                {/* Terminal header */}
                <div className="bg-neutral-900 border border-neutral-700 rounded-t-lg px-4 py-2 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="ml-4 text-neutral-400 text-sm">guest@portfolio — bash</span>
                </div>

                {/* Terminal content */}
                <div className="bg-black/90 border-x border-b border-neutral-700 rounded-b-lg p-6 md:p-8 min-h-[90vh]">
                    {/* ASCII art header */}
                    <pre className="text-xs md:text-sm mb-8 overflow-x-auto" style={{ color: 'var(--accent)' }}>
                        {`
 ____             _____                      
|  _ \\  _____   _|  ___|__  _ __ __ _  ___ 
| | | |/ _ \\ \\ / / |_ / _ \\| '__/ _\` |/ _ \\
| |_| |  __/\\ V /|  _| (_) | | | (_| |  __/
|____/ \\___| \\_/ |_|  \\___/|_|  \\__, |\\___|
                                |___/      
`}
                    </pre>

                    {/* Welcome message */}
                    <div className="mb-8">
                        <span className="text-amber-400">→</span>
                        <span className="ml-2">{nameText}</span>
                        {!nameComplete && <BlinkingCursor />}
                    </div>

                    {/* About section */}
                    <CommandLine command="cat about.txt" delay={1500}>
                        <div className="border-l-2 border-green-700 pl-4 my-4">
                            {profile.bio ? (
                                <p className="text-gray-300 leading-relaxed">{profile.bio}</p>
                            ) : (
                                <p className="text-gray-500 italic">No bio available</p>
                            )}
                        </div>
                        {profile.tagline && (
                            <p className="text-amber-400 mt-4">「 {profile.tagline} 」</p>
                        )}
                    </CommandLine>

                    {/* Contact info */}
                    <CommandLine command="cat contact.txt" delay={2000}>
                        <div className="grid gap-2 text-sm">
                            {social_links?.email && (
                                <div className="flex items-center gap-4">
                                    <span className="text-gray-500">EMAIL:</span>
                                    <a href={`mailto:${social_links.email}`} className="text-blue-400 hover:underline">
                                        {social_links.email}
                                    </a>
                                </div>
                            )}
                            {social_links?.github && (
                                <div className="flex items-center gap-4">
                                    <span className="text-gray-500">GITHUB:</span>
                                    <a href={social_links.github} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                        {social_links.github}
                                    </a>
                                </div>
                            )}
                            {social_links?.linkedin && (
                                <div className="flex items-center gap-4">
                                    <span className="text-gray-500">LINKEDIN:</span>
                                    <a href={social_links.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                        {social_links.linkedin}
                                    </a>
                                </div>
                            )}
                            {social_links?.instagram && (
                                <div className="flex items-center gap-4">
                                    <span className="text-gray-500">INSTAGRAM:</span>
                                    <a href={social_links.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                        {social_links.instagram}
                                    </a>
                                </div>
                            )}
                            {social_links?.email && (
                                <div className="flex items-center gap-4">
                                    <span className="text-gray-500">EMAIL:</span>
                                    <a href={`mailto:${social_links.email}`} className="text-blue-400 hover:underline">
                                        {social_links.email}
                                    </a>
                                </div>
                            )}
                            {social_links?.website && (
                                <div className="flex items-center gap-4">
                                    <span className="text-gray-500">WEBSITE:</span>
                                    <a href={social_links.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                        {social_links.website}
                                    </a>
                                </div>
                            )}
                        </div>
                    </CommandLine>

                    {/* Experience section */}
                    {experience.length > 0 && (
                        <CommandLine command="ls -la experience/" delay={2500}>
                            <div className="space-y-6 mt-4">
                                {experience.map((exp) => (
                                    <div key={exp.id} className="border-l border-neutral-700 pl-4">
                                        <div className="flex items-center gap-4 text-sm">
                                            <span className="text-neutral-500">drwxr-xr-x</span>
                                            <span className="text-amber-400">{exp.company}/</span>
                                        </div>
                                        <div className="mt-2">
                                            <span className="text-green-300">{exp.position}</span>
                                            <span className="text-neutral-500 ml-4">
                                                {formatDateRange(exp.start_date, exp.end_date, exp.is_current)}
                                            </span>
                                        </div>
                                        {exp.description && (
                                            <p className="text-gray-400 text-sm mt-2 leading-relaxed">{exp.description}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CommandLine>
                    )}

                    {/* Projects section */}
                    {projects.length > 0 && (
                        <CommandLine command="find ./projects -type f" delay={3000}>
                            <div className="grid gap-6 mt-4">
                                {projects.map((project) => (
                                    <div key={project.id} className="border border-neutral-800 p-4 rounded">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-green-300 text-lg font-bold">{project.title}</h3>
                                                {project.tagline && (
                                                    <p className="text-amber-400 text-sm mt-1">{project.tagline}</p>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                {project.github_url && (
                                                    <a
                                                        href={project.github_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-400 hover:text-blue-300 text-sm"
                                                    >
                                                        [source]
                                                    </a>
                                                )}
                                                {project.live_url && (
                                                    <a
                                                        href={project.live_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-400 hover:text-blue-300 text-sm"
                                                    >
                                                        [demo]
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                        {project.description && (
                                            <p className="text-gray-400 text-sm mt-3">{project.description}</p>
                                        )}
                                        {project.tech_stack.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {project.tech_stack.map(tech => (
                                                    <span key={tech} className="text-xs px-2 py-1 bg-neutral-900 text-neutral-400 rounded">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CommandLine>
                    )}

                    {/* Skills section */}
                    {skills.length > 0 && (
                        <CommandLine command="cat skills.txt" delay={3500}>
                            <div className="space-y-6 mt-4">
                                {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                                    <div key={category}>
                                        <div className="text-amber-400 text-sm uppercase mb-3">
                                            # {category}
                                        </div>
                                        <div className="space-y-2">
                                            {categorySkills.map(skill => (
                                                <SkillBar
                                                    key={skill.id}
                                                    name={skill.name}
                                                    level={skill.proficiency}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CommandLine>
                    )}

                    {/* Education section */}
                    {education.length > 0 && (
                        <CommandLine command="cat education.txt" delay={4000}>
                            <div className="space-y-4 mt-4">
                                {education.map(edu => (
                                    <div key={edu.id} className="border-l border-green-700 pl-4">
                                        <h3 className="text-green-300">{edu.institution}</h3>
                                        {edu.degree && edu.field && (
                                            <p className="text-gray-400">
                                                {edu.degree} in {edu.field}
                                            </p>
                                        )}
                                        <p className="text-neutral-500 text-sm">
                                            {formatDateRange(edu.start_date, edu.end_date)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CommandLine>
                    )}

                    {/* Footer */}
                    <div className="mt-16 pt-8 border-t border-neutral-800 text-center">
                        <p className="text-neutral-500 text-sm">
                            <span className="text-amber-400">&gt;</span> Thank you for visiting!
                        </p>
                        <p className="text-neutral-600 text-xs mt-2">
                            Built with DevForge | © {new Date().getFullYear()} {profile.name}
                        </p>
                    </div>

                    {/* Active cursor */}
                    <div className="mt-8 flex items-center">
                        <span className="text-green-400">guest@portfolio</span>
                        <span className="text-white">:</span>
                        <span className="text-blue-400">~</span>
                        <span className="text-white">$</span>
                        <BlinkingCursor />
                    </div>
                </div>
            </div>
        </div>
    )
}
