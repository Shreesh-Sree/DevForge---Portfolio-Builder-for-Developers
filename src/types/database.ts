// Database types matching Supabase schema

export interface Profile {
    id: string
    username: string
    name: string
    tagline: string
    bio: string
    profile_photo: string
    resume_file: string
    template_id: TemplateId
    accent_color: string
    custom_domain: string
    is_premium: boolean
    views: number
    created_at: string
    updated_at: string
}

export interface SocialLinks {
    id: string
    user_id: string
    github: string
    linkedin: string
    twitter: string
    instagram?: string
    website: string
    email: string
    dribbble: string
    youtube: string
}

export interface Experience {
    id: string
    user_id: string
    company: string
    position: string
    location: string
    start_date: string
    end_date: string | null
    is_current: boolean
    description: string
    logo_url: string
    display_order: number
    created_at: string
}

export interface Project {
    id: string
    user_id: string
    title: string
    tagline: string
    description: string
    tech_stack: string[]
    github_url: string
    live_url: string
    case_study_url: string
    images: string[]
    thumbnail: string
    is_featured: boolean
    display_order: number
    github_stars: number
    created_at: string
}

export interface Skill {
    id: string
    user_id: string
    category: SkillCategory
    name: string
    proficiency: SkillProficiency
    display_order: number
    created_at: string
}

export interface Education {
    id: string
    user_id: string
    institution: string
    degree: string
    field: string
    start_date: string
    end_date: string | null
    description: string
    logo_url: string
    display_order: number
    created_at: string
}

export interface PortfolioView {
    id: string
    user_id: string
    viewed_at: string
    ip_address: string
    user_agent: string
    referrer: string
    country: string
    city: string
}

export interface ContactMessage {
    id: string
    portfolio_user_id: string
    sender_name: string
    sender_email: string
    subject: string
    message: string
    created_at: string
    is_read: boolean
}

// Enums
export type TemplateId = 'terminal' | 'monolith' | 'light-modern'

export type SkillCategory = 'frontend' | 'backend' | 'devops' | 'tools' | 'languages' | 'other'

export type SkillProficiency = 'beginner' | 'intermediate' | 'advanced' | 'expert'

// Full portfolio data (for fetching complete portfolio)
export interface PortfolioData {
    profile: Profile
    social_links: SocialLinks | null
    experience: Experience[]
    projects: Project[]
    skills: Skill[]
    education: Education[]
}

// Form input types (for creating/updating)
export type ProfileInput = Omit<Profile, 'id' | 'created_at' | 'updated_at' | 'views'>
export type SocialLinksInput = Omit<SocialLinks, 'id' | 'user_id'>
export type ExperienceInput = Omit<Experience, 'id' | 'user_id' | 'created_at'>
export type ProjectInput = Omit<Project, 'id' | 'user_id' | 'created_at' | 'github_stars'>
export type SkillInput = Omit<Skill, 'id' | 'user_id' | 'created_at'>
export type EducationInput = Omit<Education, 'id' | 'user_id' | 'created_at'>

// Resume parsing result
export interface ParsedResume {
    name: string
    email: string
    phone: string
    summary: string
    experience: Array<{
        company: string
        position: string
        startDate: string
        endDate: string
        description: string
    }>
    projects: Array<{
        title: string
        description: string
        techStack: string[]
        link: string
    }>
    skills: {
        frontend: string[]
        backend: string[]
        devops: string[]
        tools: string[]
        languages: string[]
    }
    education: Array<{
        institution: string
        degree: string
        field: string
        graduationDate: string
    }>
    socialLinks: {
        github: string
        linkedin: string
        twitter: string
        instagram: string
        website: string
        email: string
    }
}
