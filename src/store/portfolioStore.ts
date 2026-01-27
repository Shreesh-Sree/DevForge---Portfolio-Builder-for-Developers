import { create } from 'zustand'
import { createClient } from '@/lib/supabase'
import type {
    Profile,
    SocialLinks,
    Experience,
    Project,
    Skill,
    Education,
} from '@/types'

interface PortfolioState {
    // Data
    profile: Profile | null
    socialLinks: SocialLinks | null
    experience: Experience[]
    projects: Project[]
    skills: Skill[]
    education: Education[]

    // UI State
    isLoading: boolean
    error: string | null
    selectedTemplate: string

    // Actions
    fetchPortfolio: (userId: string) => Promise<void>
    updateProfile: (updates: Partial<Profile>) => Promise<void>
    updateSocialLinks: (updates: Partial<SocialLinks>) => Promise<void>

    // Experience
    addExperience: (data: Omit<Experience, 'id' | 'user_id' | 'created_at'>) => Promise<void>
    updateExperience: (id: string, data: Partial<Experience>) => Promise<void>
    deleteExperience: (id: string) => Promise<void>

    // Projects
    addProject: (data: Omit<Project, 'id' | 'user_id' | 'created_at' | 'github_stars'>) => Promise<void>
    updateProject: (id: string, data: Partial<Project>) => Promise<void>
    deleteProject: (id: string) => Promise<void>

    // Skills
    addSkill: (data: Omit<Skill, 'id' | 'user_id' | 'created_at'>) => Promise<void>
    updateSkill: (id: string, data: Partial<Skill>) => Promise<void>
    deleteSkill: (id: string) => Promise<void>

    // Education
    addEducation: (data: Omit<Education, 'id' | 'user_id' | 'created_at'>) => Promise<void>
    updateEducation: (id: string, data: Partial<Education>) => Promise<void>
    deleteEducation: (id: string) => Promise<void>

    // Template
    setTemplate: (templateId: string) => void

    // Reset
    reset: () => void
}

const initialState = {
    profile: null,
    socialLinks: null,
    experience: [],
    projects: [],
    skills: [],
    education: [],
    isLoading: false,
    error: null,
    selectedTemplate: 'monolith',
}

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
    ...initialState,

    fetchPortfolio: async (userId: string) => {
        set({ isLoading: true, error: null })
        const supabase = createClient()

        try {
            // Fetch all portfolio data in parallel
            const [
                profileRes,
                socialLinksRes,
                experienceRes,
                projectsRes,
                skillsRes,
                educationRes,
            ] = await Promise.all([
                supabase.from('profiles').select('*').eq('id', userId).single(),
                supabase.from('social_links').select('*').eq('user_id', userId).single(),
                supabase.from('experience').select('*').eq('user_id', userId).order('display_order'),
                supabase.from('projects').select('*').eq('user_id', userId).order('display_order'),
                supabase.from('skills').select('*').eq('user_id', userId).order('display_order'),
                supabase.from('education').select('*').eq('user_id', userId).order('display_order'),
            ])

            set({
                profile: profileRes.data,
                socialLinks: socialLinksRes.data,
                experience: experienceRes.data || [],
                projects: projectsRes.data || [],
                skills: skillsRes.data || [],
                education: educationRes.data || [],
                selectedTemplate: profileRes.data?.template_id || 'monolith',
                isLoading: false,
            })
        } catch (error) {
            set({ error: 'Failed to fetch portfolio data', isLoading: false })
        }
    },

    updateProfile: async (updates) => {
        const { profile } = get()
        if (!profile) return

        const supabase = createClient()
        const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', profile.id)

        if (!error) {
            set({ profile: { ...profile, ...updates } })
        }
    },

    updateSocialLinks: async (updates) => {
        const { profile, socialLinks } = get()
        if (!profile) return

        const supabase = createClient()

        if (socialLinks) {
            // Update existing
            const { error } = await supabase
                .from('social_links')
                .update(updates)
                .eq('user_id', profile.id)

            if (!error) {
                set({ socialLinks: { ...socialLinks, ...updates } })
            }
        } else {
            // Create new
            const { data, error } = await supabase
                .from('social_links')
                .insert({ user_id: profile.id, ...updates })
                .select()
                .single()

            if (!error && data) {
                set({ socialLinks: data })
            }
        }
    },

    // Experience CRUD
    addExperience: async (data) => {
        const { profile, experience } = get()
        if (!profile) return

        const supabase = createClient()
        const { data: newExp, error } = await supabase
            .from('experience')
            .insert({ ...data, user_id: profile.id })
            .select()
            .single()

        if (!error && newExp) {
            set({ experience: [...experience, newExp] })
        }
    },

    updateExperience: async (id, data) => {
        const { experience } = get()
        const supabase = createClient()

        const { error } = await supabase
            .from('experience')
            .update(data)
            .eq('id', id)

        if (!error) {
            set({
                experience: experience.map(exp =>
                    exp.id === id ? { ...exp, ...data } : exp
                )
            })
        }
    },

    deleteExperience: async (id) => {
        const { experience } = get()
        const supabase = createClient()

        const { error } = await supabase
            .from('experience')
            .delete()
            .eq('id', id)

        if (!error) {
            set({ experience: experience.filter(exp => exp.id !== id) })
        }
    },

    // Projects CRUD
    addProject: async (data) => {
        const { profile, projects } = get()
        if (!profile) return

        const supabase = createClient()
        const { data: newProject, error } = await supabase
            .from('projects')
            .insert({ ...data, user_id: profile.id })
            .select()
            .single()

        if (!error && newProject) {
            set({ projects: [...projects, newProject] })
        }
    },

    updateProject: async (id, data) => {
        const { projects } = get()
        const supabase = createClient()

        const { error } = await supabase
            .from('projects')
            .update(data)
            .eq('id', id)

        if (!error) {
            set({
                projects: projects.map(proj =>
                    proj.id === id ? { ...proj, ...data } : proj
                )
            })
        }
    },

    deleteProject: async (id) => {
        const { projects } = get()
        const supabase = createClient()

        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id)

        if (!error) {
            set({ projects: projects.filter(proj => proj.id !== id) })
        }
    },

    // Skills CRUD
    addSkill: async (data) => {
        const { profile, skills } = get()
        if (!profile) return

        const supabase = createClient()
        const { data: newSkill, error } = await supabase
            .from('skills')
            .insert({ ...data, user_id: profile.id })
            .select()
            .single()

        if (!error && newSkill) {
            set({ skills: [...skills, newSkill] })
        }
    },

    updateSkill: async (id, data) => {
        const { skills } = get()
        const supabase = createClient()

        const { error } = await supabase
            .from('skills')
            .update(data)
            .eq('id', id)

        if (!error) {
            set({
                skills: skills.map(skill =>
                    skill.id === id ? { ...skill, ...data } : skill
                )
            })
        }
    },

    deleteSkill: async (id) => {
        const { skills } = get()
        const supabase = createClient()

        const { error } = await supabase
            .from('skills')
            .delete()
            .eq('id', id)

        if (!error) {
            set({ skills: skills.filter(skill => skill.id !== id) })
        }
    },

    // Education CRUD
    addEducation: async (data) => {
        const { profile, education } = get()
        if (!profile) return

        const supabase = createClient()
        const { data: newEdu, error } = await supabase
            .from('education')
            .insert({ ...data, user_id: profile.id })
            .select()
            .single()

        if (!error && newEdu) {
            set({ education: [...education, newEdu] })
        }
    },

    updateEducation: async (id, data) => {
        const { education } = get()
        const supabase = createClient()

        const { error } = await supabase
            .from('education')
            .update(data)
            .eq('id', id)

        if (!error) {
            set({
                education: education.map(edu =>
                    edu.id === id ? { ...edu, ...data } : edu
                )
            })
        }
    },

    deleteEducation: async (id) => {
        const { education } = get()
        const supabase = createClient()

        const { error } = await supabase
            .from('education')
            .delete()
            .eq('id', id)

        if (!error) {
            set({ education: education.filter(edu => edu.id !== id) })
        }
    },

    setTemplate: (templateId) => {
        set({ selectedTemplate: templateId })
    },

    reset: () => {
        set(initialState)
    },
}))
