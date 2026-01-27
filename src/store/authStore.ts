import { create } from 'zustand'
import { createClient } from '@/lib/supabase'
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js'

interface AuthState {
    user: User | null
    isLoading: boolean
    isInitialized: boolean
    error: string | null

    // Actions
    initialize: () => Promise<void>
    signInWithGithub: () => Promise<{ error: string | null }>
    signIn: (email: string, password: string) => Promise<{ error: string | null }>
    signUp: (email: string, password: string, username: string) => Promise<{ error: string | null }>
    signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isLoading: true,
    isInitialized: false,
    error: null,

    initialize: async () => {
        if (get().isInitialized) return

        const supabase = createClient()

        // Get initial session
        const { data: { session } } = await supabase.auth.getSession()
        set({ user: session?.user ?? null, isLoading: false, isInitialized: true })

        // Listen for auth changes
        supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
            set({ user: session?.user ?? null, isLoading: false })
        })
    },

    signInWithGithub: async () => {
        set({ isLoading: true, error: null })
        const supabase = createClient()

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
                scopes: 'repo',
            },
        })

        if (error) {
            set({ error: error.message, isLoading: false })
            return { error: error.message }
        }

        return { error: null }
    },

    signIn: async (email, password) => {
        set({ isLoading: true, error: null })
        const supabase = createClient()

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            set({ error: error.message, isLoading: false })
            return { error: error.message }
        }

        return { error: null }
    },

    signUp: async (email, password, username) => {
        set({ isLoading: true, error: null })
        const supabase = createClient()

        const { error: signUpError, data } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username,
                },
            },
        })

        if (signUpError) {
            set({ error: signUpError.message, isLoading: false })
            return { error: signUpError.message }
        }

        // Create profile entry
        if (data.user) {
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([
                    {
                        id: data.user.id,
                        username,
                        full_name: username, // Default to username
                    },
                ])

            if (profileError) {
                console.error('Error creating profile:', profileError)
                // Continue anyway as auth was successful
            }
        }

        return { error: null }
    },

    signOut: async () => {
        set({ isLoading: true })
        const supabase = createClient()
        await supabase.auth.signOut()
        set({ user: null, isLoading: false })
    },
}))
