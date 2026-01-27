import { createBrowserClient } from '@supabase/ssr'

export const createClient = () =>
    createBrowserClient(
        import.meta.env.VITE_SUPABASE_URL!,
        import.meta.env.VITE_SUPABASE_ANON_KEY!,
        {
            cookieOptions: {
                maxAge: 60 * 60 * 3, // 3 hours
                path: '/',
                sameSite: 'lax',
                secure: import.meta.env.PROD,
            }
        }
    )
