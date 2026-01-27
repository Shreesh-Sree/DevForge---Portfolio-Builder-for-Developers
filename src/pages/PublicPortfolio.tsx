import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { createClient } from '@/lib/supabase'

const supabase = createClient()
import { AlertCircle, Loader2 } from 'lucide-react'
import { TerminalTemplate } from '../templates/terminal/TerminalTemplate'
import { MonolithTemplate } from '../templates/monolith/MonolithTemplate'
import type { PortfolioData } from '../types'

export default function PublicPortfolio() {
    const { username } = useParams()
    const [data, setData] = useState<PortfolioData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        async function fetchPortfolio() {
            try {
                // 1. Get User ID from Username
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('username', username)
                    .single()

                if (profileError || !profile) {
                    throw new Error('User not found')
                }

                const userId = profile.id

                // 2. Fetch all other data in parallel
                const [
                    socialLinksRes,
                    experienceRes,
                    projectsRes,
                    skillsRes,
                    educationRes,
                ] = await Promise.all([
                    supabase.from('social_links').select('*').eq('user_id', userId).single(),
                    supabase.from('experience').select('*').eq('user_id', userId).order('display_order'),
                    supabase.from('projects').select('*').eq('user_id', userId).order('display_order'),
                    supabase.from('skills').select('*').eq('user_id', userId).order('display_order'),
                    supabase.from('education').select('*').eq('user_id', userId).order('display_order'),
                ])

                const portfolioData: PortfolioData = {
                    profile,
                    social_links: socialLinksRes.data,
                    experience: experienceRes.data || [],
                    projects: projectsRes.data || [],
                    skills: skillsRes.data || [],
                    education: educationRes.data || [],
                }

                setData(portfolioData)
            } catch (err) {
                console.error(err)
                setError(true)
            } finally {
                setLoading(false)
            }
        }

        if (username) {
            fetchPortfolio()
        }
    }, [username])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <Loader2 className="animate-spin h-8 w-8 text-white" />
            </div>
        )
    }

    if (error || !data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-black px-8 text-center">
                <AlertCircle className="w-12 h-12 text-gray-500 mb-6" />
                <h1 className="text-2xl font-bold mb-2 text-white">Portfolio not found</h1>
                <p className="text-gray-400 font-medium mb-8 max-w-xs">The user "@{username}" hasn't initialized their portfolio yet.</p>
                <Link to="/" className="bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition-all">Go back Home</Link>
            </div>
        )
    }

    // Render the correct template
    const templateId = data.profile.template_id || 'monolith'

    if (templateId === 'terminal') {
        return <TerminalTemplate data={data} />
    }

    return <MonolithTemplate data={data} />
}
