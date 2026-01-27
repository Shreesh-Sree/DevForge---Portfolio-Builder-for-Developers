import { useEffect, useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { TerminalTemplate } from '../templates/terminal/TerminalTemplate'
import { MonolithTemplate } from '../templates/monolith/MonolithTemplate'
import type { PortfolioData, TemplateId } from '../types'
import { usePortfolioStore } from '../store/portfolioStore'
import { createClient } from '@/lib/supabase'

const supabase = createClient()
import { Loader2 } from 'lucide-react'

// Template component map
const templateComponents: Record<TemplateId, React.ComponentType<{ data: PortfolioData }>> = {
    terminal: TerminalTemplate,
    monolith: MonolithTemplate,
}

// Sample data for preview (fallback)
const sampleData: PortfolioData = {
    profile: {
        id: 'preview',
        username: 'johndoe',
        name: 'Jane Doe',
        tagline: 'Full Stack Developer & UI Designer',
        bio: 'I build pixel-perfect, engaging, and accessible digital experiences.',
        profile_photo: '',
        resume_file: '',
        template_id: 'monolith' as TemplateId,
        accent_color: '',
        custom_domain: '',
        is_premium: false,
        views: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    social_links: {
        id: 'preview',
        user_id: 'preview',
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        twitter: 'https://instagram.com/johndoe',
        website: 'https://example.com',
        email: 'jane@example.com',
        dribbble: '',
        youtube: ''
    },
    experience: [
        {
            id: '1',
            user_id: 'preview',
            company: 'Tech Corp',
            position: 'Senior Developer',
            location: 'San Francisco, CA',
            start_date: '2023-01-01',
            end_date: null,
            is_current: true,
            description: 'Leading the frontend team and rearchitecting the core product.',
            logo_url: '',
            display_order: 1,
            created_at: new Date().toISOString(),
        },
        {
            id: '2',
            user_id: 'preview',
            company: 'StartUp Inc',
            position: 'Frontend Developer',
            location: 'Remote',
            start_date: '2021-06-01',
            end_date: '2022-12-31',
            is_current: false,
            description: 'Built the MVP from scratch using Next.js and Supabase.',
            logo_url: '',
            display_order: 2,
            created_at: new Date().toISOString(),
        },
    ],
    projects: [
        {
            id: '1',
            user_id: 'preview',
            title: 'E-commerce Platform',
            tagline: 'A modern shopping experience',
            description: 'Full-featured e-commerce solution with cart, checkout, and admin dashboard.',
            thumbnail: '',
            images: [],
            github_url: 'https://github.com',
            live_url: 'https://example.com',
            case_study_url: '',
            tech_stack: ['Next.js', 'Stripe', 'Tailwind'],
            is_featured: true,
            display_order: 1,
            github_stars: 0,
            created_at: new Date().toISOString(),
        },
        {
            id: '2',
            user_id: 'preview',
            title: 'Task Manager',
            tagline: 'Productivity app',
            description: 'Collaborative task management tool with real-time updates.',
            thumbnail: '',
            images: [],
            github_url: 'https://github.com',
            live_url: 'https://example.com',
            case_study_url: '',
            tech_stack: ['React', 'Supabase', 'TypeScript'],
            is_featured: false,
            display_order: 2,
            github_stars: 0,
            created_at: new Date().toISOString(),
        },
    ],
    skills: [
        { id: '1', user_id: 'preview', name: 'React', category: 'frontend', proficiency: 'expert', display_order: 1, created_at: '' },
        { id: '2', user_id: 'preview', name: 'TypeScript', category: 'languages', proficiency: 'advanced', display_order: 2, created_at: '' },
        { id: '3', user_id: 'preview', name: 'Node.js', category: 'backend', proficiency: 'advanced', display_order: 3, created_at: '' },
        { id: '4', user_id: 'preview', name: 'TailwindCSS', category: 'frontend', proficiency: 'expert', display_order: 4, created_at: '' },
    ],
    education: [
        {
            id: '1',
            user_id: 'preview',
            institution: 'University of Tech',
            degree: 'BS',
            field: 'Computer Science',
            start_date: '2017-09-01',
            end_date: '2021-05-01',
            description: 'Graduated with Honors.',
            logo_url: '',
            display_order: 1,
            created_at: '',
        }
    ]
}

export default function PreviewPage() {
    const { templateId } = useParams()
    const {
        profile,
        socialLinks,
        experience,
        projects,
        skills,
        education,
        fetchPortfolio
    } = usePortfolioStore()

    const [loading, setLoading] = useState(true)
    const [useSampleData, setUseSampleData] = useState(false)

    useEffect(() => {
        async function loadUserData() {
            setLoading(true)
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                // Fetch user data
                await fetchPortfolio(user.id)
                // We use the store state which will be updated by fetchPortfolio
            } else {
                setUseSampleData(true)
            }
            setLoading(false)
        }

        loadUserData()
    }, [fetchPortfolio])

    if (!templateId || !Object.keys(templateComponents).includes(templateId as TemplateId)) {
        return <Navigate to="/dashboard" replace />
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
            </div>
        )
    }

    const TemplateComponent = templateComponents[templateId as TemplateId]

    // Determine data source
    // If we have a loaded profile, use store data. Otherwise fallback to sample.
    const hasUserData = !!profile
    const dataToUse = (hasUserData && !useSampleData) ? {
        profile: profile!,
        social_links: socialLinks,
        experience,
        projects,
        skills,
        education
    } : sampleData

    // Override the template_id in the data to match the preview URL parameter
    // This allows previewing any template regardless of what's saved in the profile
    const previewData: PortfolioData = {
        ...dataToUse,
        profile: {
            ...dataToUse.profile,
            template_id: templateId as TemplateId,
        }
    }

    return <TemplateComponent data={previewData} />
}
