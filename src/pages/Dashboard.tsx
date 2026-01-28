import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Layout, Plus, ExternalLink, Settings, UserCircle, Paintbrush, Loader2, Briefcase, GraduationCap, Code as CodeIcon, Rocket, Trash2, ChevronDown, Download, Github, CheckCircle, Linkedin, Instagram, Globe, Mail, Save, Building2, Menu } from 'lucide-react'
import Footer from '../components/Footer'
import { usePortfolioStore } from '@/store/portfolioStore'
import { createClient } from '@/lib/supabase'
import type { Session } from '@supabase/supabase-js'
import JSZip from 'jszip'

// Raw imports for ZIP generation
import monolithRaw from '../templates/monolith/MonolithTemplate.tsx?raw'
import terminalRaw from '../templates/terminal/TerminalTemplate.tsx?raw'
import templateIndexRaw from '../templates/index.ts?raw'
import utilsRaw from '../lib/utils.ts?raw'

const supabase = createClient()

// ==================== COMPONENTS ====================

function SampleCard({ title, subtitle, icon: Icon }: { title: string, subtitle: string, icon: React.ElementType }) {
    return (
        <div className="p-5 border border-dashed border-forge-muted/30 rounded-3xl text-sm flex justify-between items-center opacity-70 bg-forge-grey/30 hover:bg-forge-grey/50 transition-all group">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-forge-grey border border-forge-muted/20 flex items-center justify-center shadow-lg shadow-black/20 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5 text-forge-beige" />
                </div>
                <div>
                    <p className="font-bold text-white">{title}</p>
                    <p className="text-forge-muted text-[11px] font-medium">{subtitle}</p>
                </div>
            </div>
            <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] font-black uppercase text-forge-muted tracking-widest">Sample</span>
                <div className="w-8 h-1 bg-forge-muted/20 rounded-full" />
            </div>
        </div>
    )
}

// Generic Modal Component
function Modal({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) {
    if (!isOpen) return null
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#1B2129] border border-forge-muted/20 w-full max-w-md rounded-[32px] p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white uppercase tracking-tight">{title}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><ChevronDown className="w-5 h-5 text-forge-muted" /></button>
                </div>
                {children}
            </div>
        </div>
    )
}

// Confirmation Modal Component
function ConfirmModal({ isOpen, onClose, onConfirm, title, message }: { isOpen: boolean, onClose: () => void, onConfirm: () => void, title: string, message: string }) {
    if (!isOpen) return null
    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#1B2129] border border-forge-muted/20 w-full max-w-sm rounded-[32px] p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                <h2 className="text-xl font-bold text-white uppercase tracking-tight mb-2">{title}</h2>
                <p className="text-sm text-forge-muted font-medium leading-relaxed mb-8">{message}</p>
                <div className="flex gap-4">
                    <button onClick={onClose} className="flex-1 py-3 bg-forge-grey text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-forge-grey/80 transition-all">Cancel</button>
                    <button onClick={() => { onConfirm(); onClose() }} className="flex-1 py-3 bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-red-500/20 transition-all">Delete</button>
                </div>
            </div>
        </div>
    )
}


export default function Dashboard() {
    const navigate = useNavigate()
    const {
        profile,
        projects,
        experience,
        education,
        skills,
        isLoading: loading,
        fetchPortfolio,
        updateProfile,
        updateSocialLinks,
        socialLinks,
        reset
    } = usePortfolioStore()


    // Local UI states (sync with store when data loads)
    const [fullName, setFullName] = useState('')
    const [about, setAbout] = useState('')
    const [activeTab, setActiveTab] = useState('overview')
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [location, setLocation] = useState('')
    const [saving, setSaving] = useState(false)

    // Settings & Socials State
    const [settingsUsername, setSettingsUsername] = useState('')
    const [settingsAccentColor, setSettingsAccentColor] = useState('#F5F5DC')
    const [socials, setSocials] = useState({
        github: '',
        linkedin: '',
        twitter: '', // Used for Instagram
        website: '',
        email: ''
    })

    // Modal State
    const [modalType, setModalType] = useState<'experience' | 'education' | 'skills' | 'projects' | null>(null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [modalData, setModalData] = useState<any>({})

    // Deployment Action States
    const [actionLoading, setActionLoading] = useState<string | null>(null)
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null)
    const [repoData, setRepoData] = useState<{ name: string, url: string } | null>(null)
    const [showConnectInput, setShowConnectInput] = useState(false)
    const [connectUrl, setConnectUrl] = useState('')

    // Load repo data from profile (persisted in custom_domain field)
    useEffect(() => {
        if (profile?.custom_domain && profile.custom_domain.includes('github.com')) {
            const repoName = profile.custom_domain.split('/').pop() || 'portfolio'
            setRepoData({ name: repoName, url: profile.custom_domain })
        } else {
            setRepoData(null)
        }
    }, [profile])

    // Confirmation Modal State
    const [confirmation, setConfirmation] = useState<{
        isOpen: boolean,
        title: string,
        message: string,
        onConfirm: () => void
    }>({ isOpen: false, title: '', message: '', onConfirm: () => { } })

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000)
            return () => clearTimeout(timer)
        }
    }, [toast])

    useEffect(() => {
        if (profile) {
            setFullName(profile.name || '')
            setAbout(profile.bio || '')
            setLocation(profile.tagline || '')
            setSettingsUsername(profile.username || '')
            setSettingsAccentColor(profile.accent_color || '#F5F5DC')
        }
    }, [profile])

    useEffect(() => {
        if (socialLinks) {
            setSocials({
                github: socialLinks.github || '',
                linkedin: socialLinks.linkedin || '',
                twitter: socialLinks.twitter || '',
                website: socialLinks.website || '',
                email: socialLinks.email || ''
            })
        }
    }, [socialLinks])

    async function handleDownloadZip() {
        setActionLoading('download')
        try {
            const zip = new JSZip()
            const username = profile?.username || 'developer'
            const templateId = profile?.template_id || 'monolith'

            // 1. Prepare Data
            const portfolioData = {
                profile,
                experience,
                projects,
                skills,
                education,
                socialLinks: usePortfolioStore.getState().socialLinks,
                updatedAt: new Date().toISOString()
            }

            // 2. Add Project Structure
            // Configuration Files
            zip.file('package.json', JSON.stringify({
                name: `portfolio-${username}`,
                private: true,
                version: "0.1.0",
                type: "module",
                scripts: {
                    "dev": "vite",
                    "build": "tsc && vite build",
                    "preview": "vite preview"
                },
                dependencies: {
                    "react": "^19.0.0",
                    "react-dom": "^19.0.0",
                    "framer-motion": "^12.0.0",
                    "lucide-react": "^0.470.0",
                    "clsx": "^2.1.1",
                    "tailwind-merge": "^3.0.0"
                },
                devDependencies: {
                    "@types/react": "^19.0.0",
                    "@types/react-dom": "^19.0.0",
                    "@vitejs/plugin-react": "^4.3.4",
                    "autoprefixer": "^10.4.20",
                    "postcss": "^8.4.49",
                    "tailwindcss": "^3.4.17",
                    "typescript": "~5.7.2",
                    "vite": "^6.0.5"
                }
            }, null, 2))

            zip.file('vite.config.ts', `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})`)

            zip.file('tailwind.config.js', `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'forge-black': '#000000',
        'forge-grey': '#111111',
        'forge-beige': '#F5F5DC',
        'forge-muted': '#666666',
      }
    },
  },
  plugins: [],
}`)

            zip.file('postcss.config.js', `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`)

            zip.file('tsconfig.json', JSON.stringify({
                compilerOptions: {
                    target: "ESNext",
                    useDefineForClassFields: true,
                    lib: ["DOM", "DOM.Iterable", "ESNext"],
                    allowJs: false,
                    skipLibCheck: true,
                    esModuleInterop: false,
                    allowSyntheticDefaultImports: true,
                    strict: true,
                    forceConsistentCasingInFileNames: true,
                    module: "ESNext",
                    moduleResolution: "Bundler",
                    resolveJsonModule: true,
                    isolatedModules: true,
                    noEmit: true,
                    jsx: "react-jsx",
                    paths: {
                        "@/*": ["./src/*"]
                    }
                },
                include: ["src"]
            }, null, 2))

            // Root Files
            zip.file('index.html', `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${profile?.name || 'My Portfolio'}</title>
  </head>
  <body class="bg-black text-white">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`)

            zip.file('README.md', `# ${profile?.name || 'Portfolio'}
            
This portfolio was generated with **DevForge**.

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Run development server:
   \`\`\`bash
   npm run dev
   \`\`\`

3. Build for production:
   \`\`\`bash
   npm run build
   \`\`\`
`)

            // Source Files
            zip.file('src/main.tsx', `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`)

            zip.file('src/index.css', `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  background: black;
  color: white;
}`)

            zip.file('src/data.json', JSON.stringify(portfolioData, null, 2))
            zip.file('src/lib/utils.ts', utilsRaw)
            zip.file('src/templates/index.ts', templateIndexRaw)

            // Select Template
            if (templateId === 'terminal') {
                zip.file('src/templates/terminal/TerminalTemplate.tsx', terminalRaw)
                zip.file('src/App.tsx', `import { TerminalTemplate } from './templates/terminal/TerminalTemplate'
import data from './data.json'

function App() {
  return <TerminalTemplate data={data as any} />
}

export default App`)
            } else {
                zip.file('src/templates/monolith/MonolithTemplate.tsx', monolithRaw)
                zip.file('src/App.tsx', `import { MonolithTemplate } from './templates/monolith/MonolithTemplate'
import data from './data.json'

function App() {
  return <MonolithTemplate data={data as any} />
}

export default App`)
            }

            // 3. Generate and Download
            const content = await zip.generateAsync({ type: "blob" })
            const url = URL.createObjectURL(content)
            const link = document.createElement('a')
            link.href = url
            link.download = `portfolio-source-${username}.zip`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)

            setToast({ message: 'Source code ZIP downloaded successfully!', type: 'success' })
        } catch (err) {
            console.error('ZIP Generation failed:', err)
            setToast({ message: 'Download failed. Please try again.', type: 'error' })
        } finally {
            setActionLoading(null)
        }
    }

    // Help with GitHub authentication context
    async function getGithubContext(): Promise<{ session: Session, providerToken: string, githubUser: string } | { error: string }> {
        const { data: { session } } = await supabase.auth.getSession()
        const providerToken = session?.provider_token

        if (!providerToken) {
            console.error('No provider token found in session', session)
            return { error: 'GitHub access missing. Please re-login.' }
        }

        let githubUser = session?.user.user_metadata.user_name

        // Fallback: fetch from GitHub if metadata missing
        try {
            const res = await fetch('https://api.github.com/user', {
                headers: { 'Authorization': `Bearer ${providerToken}` }
            })
            if (res.ok) {
                const data = await res.json()
                githubUser = data.login
            } else {
                console.error('GitHub API /user error:', await res.text())
            }
        } catch (e) {
            console.error('Failed to fetch github user info', e)
        }

        if (!githubUser) {
            return { error: 'Could not determine your GitHub username. Please logout and login again.' }
        }

        return { session: session!, providerToken: providerToken as string, githubUser: githubUser as string }
    }

    // Safe Base64 for Unicode (handles non-ASCII characters)
    function toBase64(str: string) {
        try {
            const bytes = new TextEncoder().encode(str)
            const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("")
            return btoa(binString)
        } catch (e) {
            console.error('Base64 encoding failed', e)
            return btoa(str) // Fallback
        }
    }

    async function handleUpdateRepo() {
        if (!repoData) return
        setActionLoading('update')

        try {
            const context = await getGithubContext()
            if ('error' in context) {
                setToast({ message: context.error, type: 'error' })
                return
            }
            const { providerToken, githubUser } = context

            // Gather all data to sync
            const state = usePortfolioStore.getState()
            const allData = {
                profile: state.profile,
                experience: state.experience,
                education: state.education,
                skills: state.skills,
                projects: state.projects,
                socialLinks: state.socialLinks,
                updatedAt: new Date().toISOString()
            }

            // 1. Check if file exists to get SHA (for update)
            const fileUrl = `https://api.github.com/repos/${githubUser}/${repoData.name}/contents/portfolio-data.json`
            const checkRes = await fetch(fileUrl, {
                headers: { 'Authorization': `Bearer ${providerToken}` }
            })

            let sha: string | undefined
            if (checkRes.ok) {
                const fileData = await checkRes.json()
                sha = fileData.sha
            }

            // 2. Create/Update file
            const uploadRes = await fetch(fileUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${providerToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: `Update portfolio data: ${new Date().toLocaleString()}`,
                    content: toBase64(JSON.stringify(allData, null, 2)),
                    sha: sha // Required for updating existing file
                })
            })

            if (!uploadRes.ok) {
                const err = await uploadRes.json()
                throw new Error(err.message || 'Failed to upload to GitHub')
            }

            setToast({ message: 'Repository updated with latest portfolio data!', type: 'success' })
        } catch (err) {
            const error = err as Error;
            console.error('Update failed:', error)
            setToast({ message: `Update failed: ${error.message}`, type: 'error' })
        } finally {
            setActionLoading(null)
        }
    }

    async function handleDeleteRepo() {
        setConfirmation({
            isOpen: true,
            title: 'Delete Repository?',
            message: 'Are you sure you want to disconnect AND DELETE this repository from GitHub? This action cannot be undone.',
            onConfirm: async () => {
                setActionLoading('delete')
                try {
                    const context = await getGithubContext()
                    if ('error' in context) {
                        setToast({ message: context.error, type: 'error' })
                        return
                    }
                    const { providerToken, githubUser } = context

                    if (!repoData) return

                    const response = await fetch(`https://api.github.com/repos/${githubUser}/${repoData.name}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${providerToken}`,
                            'Accept': 'application/vnd.github.v3+json',
                        }
                    })

                    if (response.status === 204) {
                        setRepoData(null)
                        // Clear from profile
                        await updateProfile({ custom_domain: '' })
                        setToast({ message: 'Repository deleted from GitHub.', type: 'success' })
                    } else if (response.status === 404) {
                        setRepoData(null)
                        // Clear from profile
                        await updateProfile({ custom_domain: '' })
                        setToast({ message: 'Repository not found on GitHub, disconnected locally.', type: 'info' })
                    } else if (response.status === 403 || response.status === 401) {
                        const err = await response.json()
                        setToast({ message: `Permission Denied: ${err.message}. Please logout and login again.`, type: 'error' })
                    } else {
                        const err = await response.json()
                        throw new Error(err.message || 'Failed to delete repository')
                    }
                } catch (err) {
                    const error = err as Error;
                    console.error('Delete failed:', error)
                    setToast({ message: `Error: ${error.message}`, type: 'error' })
                } finally {
                    setActionLoading(null)
                }
            }
        })
    }

    async function handleConnectRepo() {
        if (!connectUrl.includes('github.com')) {
            setToast({ message: 'Please enter a valid GitHub repository URL.', type: 'error' })
            return
        }

        setActionLoading('connect')

        // Basic parsing - assuming standard https://github.com/user/repo format
        try {
            const urlParts = connectUrl.split('github.com/')
            if (urlParts.length < 2) throw new Error('Invalid URL')

            const repoPath = urlParts[1].split('/')
            const repoName = repoPath.length > 1 ? repoPath[1] : repoPath[0]

            if (!repoName) throw new Error('Cannot determine repo name')

            setRepoData({ name: repoName, url: connectUrl })

            // Persist to profile
            await updateProfile({ custom_domain: connectUrl })

            setToast({ message: 'Repository linked successfully!', type: 'success' })
            setShowConnectInput(false)
            setConnectUrl('')
        } catch (err) {
            console.error('Parse repository URL error:', err)
            setToast({ message: 'Could not parse repository URL.', type: 'error' })
        } finally {
            setActionLoading(null)
        }
    }

    async function handleCreateRepo() {
        setActionLoading('create')

        try {
            const context = await getGithubContext()
            if ('error' in context) {
                setToast({ message: context.error, type: 'error' })
                return
            }
            const { providerToken, githubUser } = context

            // Using timestamp to ensure uniqueness if profile username is not available
            const baseName = profile?.username || githubUser || 'portfolio'
            const repoName = `portfolio-${baseName}`

            const response = await fetch('https://api.github.com/user/repos', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${providerToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: repoName,
                    description: 'My DevForge Portfolio',
                    private: false,
                    auto_init: true
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'GitHub API Error')
            }

            setRepoData({ name: repoName, url: data.html_url })

            // Persist to profile
            await updateProfile({ custom_domain: data.html_url })

            setToast({ message: `'${repoName}' created and linked successfully!`, type: 'success' })
        } catch (err: unknown) {
            const error = err as { message?: string }
            console.error('Create failed:', error)
            setToast({ message: `Failed to create repository: ${error.message || 'Unknown error'}`, type: 'error' })
        } finally {
            setActionLoading(null)
        }
    }

    useEffect(() => {
        async function loadData() {
            const { data: { user } } = await supabase.auth.getUser()
            const isDevBypass = import.meta.env.DEV && localStorage.getItem('dev_auth_bypass') === 'true'

            if (!user && !isDevBypass) {
                navigate('/')
                return
            }

            // If bypass is active and there's no user, use a fixed dummy ID for dev
            const userId = user?.id || '00000000-0000-0000-0000-000000000001'
            await fetchPortfolio(userId)
        }

        loadData()
        return () => reset()
    }, [navigate, fetchPortfolio, reset])

    async function saveProfile() {
        setSaving(true)
        try {
            await updateProfile({
                name: fullName,
                bio: about,
                tagline: location // Mapping location to tagline for now based on types
            })
            setToast({ message: 'Profile saved successfully!', type: 'success' })
        } catch (err) {
            console.error('Save profile error:', err)
            setToast({ message: 'Error saving profile.', type: 'error' })
        } finally {
            setSaving(false)
        }
    }

    async function handleSaveSettings() {
        setSaving(true)
        try {
            // 1. Update Profile (Username & Accent)
            await updateProfile({
                username: settingsUsername,
                accent_color: settingsAccentColor,
            })

            // 2. Update Social Links
            await updateSocialLinks(socials)

            setToast({ message: 'All settings saved successfully!', type: 'success' })
        } catch (error) {
            console.error('Save Settings Error:', error)
            setToast({ message: 'Error saving settings.', type: 'error' })
        } finally {
            setSaving(false)
        }
    }

    // CRUD Handlers
    async function handleAddItem() {
        if (!modalType) return
        setSaving(true)
        try {
            if (modalType === 'experience') {
                await usePortfolioStore.getState().addExperience({
                    company: modalData.company,
                    position: modalData.position,
                    location: '',
                    start_date: modalData.start_date || new Date().toISOString(),
                    end_date: null,
                    is_current: false,
                    description: '',
                    logo_url: '',
                    display_order: 0
                })
            } else if (modalType === 'education') {
                await usePortfolioStore.getState().addEducation({
                    institution: modalData.institution,
                    degree: modalData.degree,
                    field: '',
                    start_date: modalData.start_date || new Date().toISOString(),
                    end_date: null,
                    description: '',
                    logo_url: '',
                    display_order: 0
                })
            } else if (modalType === 'skills') {
                const proficiencyMap = ['beginner', 'intermediate', 'advanced', 'expert'] as const
                const level = modalData.proficiencyLevel !== undefined ? modalData.proficiencyLevel : 1

                await usePortfolioStore.getState().addSkill({
                    name: modalData.name,
                    category: 'other', // Default
                    proficiency: proficiencyMap[level] || 'intermediate',
                    display_order: 0
                })
            } else if (modalType === 'projects') {
                await usePortfolioStore.getState().addProject({
                    title: modalData.title,
                    tagline: modalData.tagline,
                    description: modalData.description || '',
                    tech_stack: modalData.tech_stack ? modalData.tech_stack.split(',').map((s: string) => s.trim()) : [],
                    github_url: modalData.github_url || '',
                    live_url: modalData.live_url || '',
                    case_study_url: '',
                    images: [],
                    thumbnail: '',
                    is_featured: false,
                    display_order: projects.length
                })
            }
            setToast({ message: 'Item added successfully!', type: 'success' })
            setModalType(null)
            setModalData({})
        } catch (err) {
            console.error('Handle save settings error:', err)
            setToast({ message: 'Failed to save settings.', type: 'error' })
        } finally {
            setSaving(false)
        }
    }

    function handleDeleteItem(type: 'experience' | 'education' | 'skills', id: string) {
        setConfirmation({
            isOpen: true,
            title: 'Delete Item?',
            message: 'Are you sure you want to delete this item? This action removes it permanently.',
            onConfirm: async () => {
                try {
                    if (type === 'experience') await usePortfolioStore.getState().deleteExperience(id)
                    if (type === 'education') await usePortfolioStore.getState().deleteEducation(id)
                    if (type === 'skills') await usePortfolioStore.getState().deleteSkill(id)
                    setToast({ message: 'Item deleted.', type: 'info' })
                } catch (err) {
                    console.error('Delete item error:', err)
                    setToast({ message: 'Failed to delete.', type: 'error' })
                }
            }
        })
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-forge-black"><Loader2 className="animate-spin h-6 w-6 text-forge-beige" /></div>

    const tabs = [
        { id: 'overview', label: 'Portfolios', icon: Layout },
        { id: 'profile', label: 'Profile', icon: UserCircle },
        { id: 'projects', label: 'Work', icon: Briefcase },
        { id: 'experience', label: 'Experience', icon: Building2 },
        { id: 'education', label: 'Education', icon: GraduationCap },
        { id: 'skills', label: 'Skills', icon: CodeIcon },
        { id: 'templates', label: 'Themes', icon: Paintbrush },
        { id: 'deploy', label: 'Deploy', icon: Rocket },
        { id: 'settings', label: 'Settings', icon: Settings },
    ]

    return (
        <div className="min-h-screen bg-forge-black text-forge-beige font-sans pb-40 selection:bg-forge-muted selection:text-white">
            <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-10 flex flex-col md:flex-row gap-6 md:gap-8">
                {/* Mobile Tab Selector Trigger */}
                <div className="md:hidden sticky top-0 z-40 bg-forge-black pb-4">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="w-full flex items-center justify-between p-4 bg-forge-grey border border-forge-muted/20 rounded-2xl shadow-lg"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-forge-black rounded-xl">
                                <Menu className="w-5 h-5 text-forge-beige" />
                            </div>
                            <span className="font-bold text-white uppercase tracking-[0.2em] text-xs">
                                {tabs.find(t => t.id === activeTab)?.label}
                            </span>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-forge-muted transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Mobile Dropdown Overly/Menu */}
                    {isMenuOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-forge-grey border border-forge-muted/20 rounded-[24px] shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="grid grid-cols-2 gap-2">
                                {tabs.map(tab => {
                                    const isActive = activeTab === tab.id
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => { setActiveTab(tab.id); setIsMenuOpen(false) }}
                                            className={`flex items-center gap-3 p-3 rounded-xl text-xs font-bold transition-all ${isActive
                                                ? 'bg-forge-black text-white'
                                                : 'text-forge-muted hover:text-white hover:bg-forge-black/30'
                                                }`}
                                        >
                                            <tab.icon className={`w-3.5 h-3.5 ${isActive ? 'text-forge-beige' : 'text-forge-muted'}`} />
                                            {tab.label}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Desktop Stylish Sidebar */}
                <nav className="hidden md:flex w-48 flex-col gap-1.5 no-scrollbar">
                    {tabs.map(tab => {
                        const isActive = activeTab === tab.id
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-bold transition-all whitespace-nowrap relative group ${isActive
                                    ? 'bg-forge-grey text-white shadow-lg shadow-black/20'
                                    : 'text-forge-muted hover:text-white hover:bg-forge-grey/50'
                                    }`}
                            >
                                {isActive && (
                                    <div className="absolute left-1 top-3 bottom-3 w-1 bg-forge-beige rounded-full shadow-[0_0_8px_rgba(223,208,184,0.3)]" />
                                )}
                                <tab.icon className={`w-4 h-4 transition-all duration-300 ${isActive ? 'text-forge-beige scale-105' : 'text-forge-muted group-hover:text-white'}`} />
                                {tab.label}
                            </button>
                        )
                    })}
                </nav>

                <main className="flex-1">
                    {activeTab === 'overview' && (
                        <div className="space-y-6 text-left">
                            <div className="flex justify-between items-center">
                                <h1 className="text-lg md:text-xl font-bold uppercase tracking-tighter text-white">Your Sites</h1>
                                <div className="flex gap-2">
                                    <a href={`/preview/${profile?.template_id || 'monolith'}`} target="_blank" className="text-[10px] md:text-[11px] font-black uppercase tracking-widest bg-forge-grey border border-forge-muted/30 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full hover:bg-forge-muted/20 transition-colors">Preview</a>
                                    <button className="text-[10px] md:text-[11px] font-black uppercase tracking-widest bg-forge-beige text-forge-black px-3 md:px-4 py-1.5 md:py-2 rounded-full hover:bg-white transition-colors">Build New</button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {projects.map(p => (
                                    <div key={p.id} className="p-5 border border-forge-muted/20 bg-forge-grey/20 rounded-[28px] hover:bg-forge-grey/40 flex justify-between items-center group transition-all">
                                        <div>
                                            <p className="font-bold text-sm tracking-tight text-white">{profile?.name || 'My Site'}</p>
                                            <p className="text-[10px] font-black text-forge-muted uppercase tracking-widest mt-1">devforge-js.vercel.app/{profile?.username}</p>
                                        </div>
                                        <a href={`/${profile?.username}`} target="_blank" className="p-2 rounded-full hover:bg-forge-grey transition-colors"><ExternalLink className="w-3.5 h-3.5 text-forge-beige" /></a>
                                    </div>
                                ))}
                                {projects.length === 0 && <SampleCard icon={Layout} title="Sample Site" subtitle="devforge-js.vercel.app/demo" />}
                            </div>
                        </div>
                    )}

                    {activeTab === 'projects' && (
                        <div className="space-y-6 text-left">
                            <div className="flex justify-between items-center">
                                <h1 className="text-lg md:text-xl font-bold uppercase tracking-tighter text-white">Your Projects</h1>
                                <button onClick={() => setModalType('projects')} className="bg-forge-beige text-forge-black px-4 md:px-6 py-2 md:py-2.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-white transition-all shadow-lg flex items-center gap-2">
                                    <Plus className="w-4 h-4" /> Add Project
                                </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {projects.map(p => (
                                    <div key={p.id} className="p-6 border border-forge-muted/20 bg-forge-grey/20 rounded-[32px] hover:bg-forge-grey/40 group transition-all">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-12 h-12 bg-forge-black rounded-2xl flex items-center justify-center border border-forge-muted/10 group-hover:border-forge-beige transition-all">
                                                <Briefcase className="w-6 h-6 text-forge-muted group-hover:text-forge-beige" />
                                            </div>
                                            <button
                                                onClick={() => usePortfolioStore.getState().deleteProject(p.id)}
                                                className="p-2 text-forge-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <h3 className="font-bold text-lg text-white mb-1">{p.title}</h3>
                                        <p className="text-sm text-forge-muted line-clamp-2 mb-4">{p.tagline}</p>
                                        <div className="flex gap-3 pt-4 border-t border-forge-muted/10">
                                            {p.github_url && (
                                                <a href={p.github_url} target="_blank" className="text-[10px] font-black uppercase tracking-widest text-forge-beige hover:text-white flex items-center gap-1.5 transition-colors">
                                                    <Github className="w-3.5 h-3.5" /> Source
                                                </a>
                                            )}
                                            {p.live_url && (
                                                <a href={p.live_url} target="_blank" className="text-[10px] font-black uppercase tracking-widest text-forge-beige hover:text-white flex items-center gap-1.5 transition-colors">
                                                    <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {projects.length === 0 && (
                                    <div className="col-span-full py-20 border-2 border-dashed border-forge-muted/10 rounded-[40px] flex flex-col items-center justify-center text-center px-6">
                                        <div className="w-16 h-16 bg-forge-grey/50 rounded-full flex items-center justify-center mb-4">
                                            <Briefcase className="w-8 h-8 text-forge-muted" />
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-2">No projects yet</h3>
                                        <p className="text-sm text-forge-muted max-w-xs mb-8">Showcase your best work by adding your favorite projects here.</p>
                                        <button onClick={() => setModalType('projects')} className="bg-white/5 border border-white/10 hover:border-white/20 text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all">Add Your First Project</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="max-w-md space-y-8 text-left">
                            <h1 className="text-xl font-bold uppercase tracking-tighter text-white">Info</h1>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-forge-muted uppercase tracking-widest">Legal Name</label>
                                    <input value={fullName} onChange={e => setFullName(e.target.value)} className="w-full p-3 bg-forge-grey border border-transparent focus:border-forge-muted focus:bg-forge-black outline-none text-sm font-bold text-white rounded-2xl transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-forge-muted uppercase tracking-widest">Biography</label>
                                    <textarea rows={3} value={about} onChange={e => setAbout(e.target.value)} className="w-full p-3 bg-forge-grey border border-transparent focus:border-forge-muted focus:bg-forge-black outline-none text-sm font-medium text-white rounded-2xl transition-all resize-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-forge-muted uppercase tracking-widest">Where</label>
                                    <input value={location} onChange={e => setLocation(e.target.value)} className="w-full p-3 bg-forge-grey border border-transparent focus:border-forge-muted focus:bg-forge-black outline-none text-sm font-bold text-white rounded-2xl transition-all" />
                                </div>
                                <button onClick={saveProfile} className="bg-forge-beige text-forge-black px-8 py-3 text-xs font-black uppercase tracking-widest rounded-full shadow-lg shadow-black/20 hover:bg-white transition-all">{saving ? '...' : 'Save Changes'}</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'experience' && (
                        <div className="space-y-8 text-left">
                            <div className="flex justify-between items-center">
                                <h1 className="text-xl font-bold uppercase tracking-tighter text-white">Experience</h1>
                                <Plus onClick={() => setModalType('experience')} className="w-5 h-5 text-forge-muted hover:text-white cursor-pointer transition-colors" />
                            </div>
                            <div className="space-y-4">
                                {experience.length === 0 ? (
                                    <SampleCard icon={Briefcase} title="Senior Software Engineer" subtitle="Global Tech Inc • 2021-2024" />
                                ) : (
                                    experience.map(e => (
                                        <div key={e.id} className="p-6 border border-forge-muted/20 bg-forge-grey/20 rounded-[28px] text-sm font-bold text-white flex justify-between items-center group">
                                            <div>
                                                <p>{e.position}</p>
                                                <p className="text-xs text-forge-muted font-medium mt-0.5">{e.company}</p>
                                            </div>
                                            <Trash2 onClick={() => handleDeleteItem('experience', e.id)} className="w-4 h-4 text-forge-muted hover:text-red-400 cursor-pointer transition-colors opacity-0 group-hover:opacity-100" />
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'education' && (
                        <div className="space-y-8 text-left">
                            <div className="flex justify-between items-center">
                                <h1 className="text-xl font-bold uppercase tracking-tighter text-white">Education</h1>
                                <Plus onClick={() => setModalType('education')} className="w-5 h-5 text-forge-muted hover:text-white cursor-pointer transition-colors" />
                            </div>
                            <div className="space-y-4">
                                {education.length === 0 ? (
                                    <SampleCard icon={GraduationCap} title="Masters in Computer Science" subtitle="State University • 2020" />
                                ) : (
                                    education.map(e => (
                                        <div key={e.id} className="p-6 border border-forge-muted/20 bg-forge-grey/20 rounded-[28px] text-sm font-bold text-white flex justify-between items-center group">
                                            <div>
                                                <p>{e.degree}</p>
                                                <p className="text-xs text-forge-muted font-medium mt-0.5">{e.institution}</p>
                                            </div>
                                            <Trash2 onClick={() => handleDeleteItem('education', e.id)} className="w-4 h-4 text-forge-muted hover:text-red-400 cursor-pointer transition-colors opacity-0 group-hover:opacity-100" />
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'skills' && (
                        <div className="space-y-8 text-left">
                            <h1 className="text-xl font-bold uppercase tracking-tighter text-white">Skills</h1>
                            <div className="flex flex-wrap gap-3">
                                {skills.length === 0 ? (
                                    <SampleCard icon={CodeIcon} title="Fullstack Development" subtitle="React, Node.js, TypeScript, PostgreSQL" />
                                ) : (
                                    skills.map(s => (
                                        <span key={s.id} className="px-4 py-2 bg-forge-grey border border-forge-muted/20 rounded-full font-bold text-xs text-white group relative pr-8">
                                            {s.name}
                                            <button onClick={() => handleDeleteItem('skills', s.id)} className="absolute right-2 top-1/2 -translate-y-1/2 text-forge-muted hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
                                        </span>
                                    ))
                                )}
                                <button onClick={() => setModalType('skills')} className="px-6 py-2 border border-dashed border-forge-muted/30 text-forge-muted rounded-full text-xs font-bold hover:border-forge-beige hover:text-forge-beige transition-all">+ Add</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'templates' && (
                        <div className="space-y-10 text-left">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h1 className="text-lg md:text-xl font-bold uppercase tracking-tighter text-white">Styles</h1>
                                    <p className="text-[10px] font-black uppercase text-forge-muted tracking-[0.2em] mt-1">Base Templates</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                                {[
                                    { id: 'terminal', name: 'Terminal', category: 'Hacker' },
                                    { id: 'monolith', name: 'Monolith', category: 'Editorial' }
                                ].map(t => (
                                    <div
                                        key={t.id}
                                        onClick={() => updateProfile({ template_id: t.id as 'terminal' | 'monolith' })}
                                        className={`group relative flex flex-col border transition-all duration-500 overflow-hidden cursor-pointer rounded-[40px] ${profile?.template_id?.toLowerCase() === t.id ? 'border-forge-beige/50 bg-forge-black shadow-2xl shadow-forge-beige/5 ring-1 ring-forge-beige/20' : 'border-white/5 bg-forge-grey/20 opacity-80 hover:opacity-100 hover:border-white/10'}`}
                                    >
                                        <div className="p-8 pb-4 flex justify-between items-start">
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-forge-muted mb-2">{t.category}</p>
                                                <h3 className="text-3xl font-black uppercase tracking-tighter text-white group-hover:text-forge-beige transition-colors">{t.name}</h3>
                                            </div>
                                            {profile?.template_id?.toLowerCase() === t.id && (
                                                <div className="px-3 py-1 bg-forge-beige text-forge-black text-[9px] font-black uppercase tracking-widest rounded-full">Active</div>
                                            )}
                                        </div>

                                        {/* Preview Iframe Container */}
                                        <div className="relative aspect-[16/10] mx-4 mb-4 rounded-3xl overflow-hidden bg-black/40 border border-white/5 group-hover:border-white/10 transition-colors">
                                            <div className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-500 group-hover:opacity-0 bg-black/20" />
                                            <iframe
                                                src={`/preview/${t.id}`}
                                                className="absolute top-0 left-0 w-[400%] h-[400%] border-none origin-top-left pointer-events-none"
                                                style={{ transform: 'scale(0.25)' }}
                                                title={`${t.name} Preview`}
                                            />
                                        </div>

                                        <div className="p-8 pt-0 mt-auto flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <a
                                                href={`/preview/${t.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="text-[10px] font-black uppercase tracking-[0.2em] text-forge-muted hover:text-forge-beige flex items-center gap-2 group/link"
                                            >
                                                Launch Preview <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'deploy' && (
                        <div className="space-y-12 text-left">
                            <div className="flex justify-between items-center">
                                <h1 className="text-lg md:text-xl font-bold uppercase tracking-tighter text-white">Share</h1>
                                <span className="text-[9px] md:text-[10px] font-black uppercase text-forge-muted tracking-widest px-3 md:px-4 py-1 md:py-1.5 border border-forge-muted/20 rounded-full bg-forge-black/20">Status: Ready</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                {/* Download Source Code Card */}
                                <div className="p-6 md:p-10 border border-forge-muted/10 bg-forge-grey/20 rounded-[32px] md:rounded-[48px] flex flex-col justify-between space-y-8 md:space-y-10 group transition-all hover:bg-forge-grey/30">
                                    <div className="flex items-start gap-6">
                                        <div className="w-16 h-16 shrink-0 bg-forge-grey/50 border border-forge-muted/10 flex items-center justify-center shadow-2xl shadow-black/40 group-hover:scale-105 transition-transform">
                                            <Download className="w-8 h-8 text-forge-beige" />
                                        </div>
                                        <div className="space-y-2">
                                            <h2 className="text-xl font-bold text-white tracking-tight">Download Source Code</h2>
                                            <p className="text-sm font-medium text-forge-muted leading-relaxed">Get a ZIP file with your complete portfolio project.</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleDownloadZip}
                                        disabled={actionLoading === 'download'}
                                        className="w-full py-5 bg-forge-beige text-forge-black text-[13px] font-black uppercase tracking-[0.1em] rounded-3xl flex items-center justify-center gap-3 shadow-xl shadow-black/20 hover:bg-white hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50 disabled:scale-100"
                                    >
                                        {actionLoading === 'download' ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Download className="w-5 h-5 pointer-events-none" />
                                        )}
                                        {actionLoading === 'download' ? 'DOWNLOADING...' : 'DOWNLOAD ZIP'}
                                    </button>
                                </div>

                                {/* GitHub Repository Card */}
                                <div className="p-6 md:p-10 border border-forge-muted/10 bg-forge-grey/20 rounded-[32px] md:rounded-[48px] flex flex-col justify-between space-y-8 md:space-y-10 group transition-all hover:bg-forge-grey/30">
                                    {repoData ? (
                                        <>
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-start gap-6">
                                                    <div className="w-16 h-16 shrink-0 bg-forge-grey/50 border border-forge-muted/10 flex items-center justify-center shadow-2xl shadow-black/40 group-hover:scale-105 transition-transform">
                                                        <Github className="w-8 h-8 text-forge-beige" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <h2 className="text-xl font-bold text-white tracking-tight">GitHub Repository</h2>
                                                        <p className="text-sm font-medium text-forge-muted leading-relaxed">Repository connected successfully.</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 px-3.5 py-1.5 bg-forge-black/60 border border-forge-muted/30 rounded-full">
                                                    <CheckCircle className="w-3.5 h-3.5 text-forge-beige" />
                                                    <span className="text-[10px] font-black uppercase text-forge-beige tracking-widest">Connected</span>
                                                </div>
                                            </div>

                                            <div className="space-y-5">
                                                <div className="flex items-center justify-between p-5 bg-forge-black/40 border border-forge-muted/10 rounded-3xl group/item hover:border-forge-muted/30 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <Github className="w-5 h-5 text-forge-muted" />
                                                        <span className="text-base font-bold text-white tracking-tight">{repoData.name}</span>
                                                    </div>
                                                    <a href={repoData.url} target="_blank" rel="noopener noreferrer">
                                                        <ExternalLink className="w-4 h-4 text-forge-muted group-hover/item:text-white transition-colors" />
                                                    </a>
                                                </div>

                                                <div className="flex gap-4">
                                                    <button
                                                        onClick={handleUpdateRepo}
                                                        disabled={actionLoading === 'update'}
                                                        className="flex-1 py-5 bg-forge-beige text-forge-black text-[13px] font-black uppercase tracking-[0.1em] rounded-3xl flex items-center justify-center gap-3 shadow-xl shadow-black/20 hover:bg-white hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50 disabled:scale-100"
                                                    >
                                                        {actionLoading === 'update' ? (
                                                            <Loader2 className="w-5 h-5 animate-spin" />
                                                        ) : (
                                                            <Rocket className="w-5 h-5 pointer-events-none" />
                                                        )}
                                                        {actionLoading === 'update' ? 'UPDATING...' : 'UPDATE REPO'}
                                                    </button>
                                                    <button
                                                        onClick={handleDeleteRepo}
                                                        disabled={actionLoading === 'delete'}
                                                        className="w-16 h-16 shrink-0 border border-forge-muted/10 bg-forge-grey/20 text-red-400/80 flex items-center justify-center hover:bg-red-500/10 hover:text-red-400 hover:border-red-400/30 transition-all active:scale-90 group/delete disabled:opacity-50"
                                                    >
                                                        {actionLoading === 'delete' ? (
                                                            <Loader2 className="w-6 h-6 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="w-6 h-6 group-hover/delete:rotate-12 transition-transform" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex items-start gap-6">
                                                <div className="w-16 h-16 shrink-0 bg-forge-grey/50 border border-forge-muted/10 flex items-center justify-center shadow-2xl shadow-black/40 group-hover:scale-105 transition-transform">
                                                    <Github className="w-8 h-8 text-forge-muted" />
                                                </div>
                                                <div className="space-y-2">
                                                    <h2 className="text-xl font-bold text-white tracking-tight">GitHub Repository</h2>
                                                    <p className="text-sm font-medium text-forge-muted leading-relaxed">Connect your portfolio to a GitHub repository.</p>
                                                </div>
                                            </div>

                                            {showConnectInput ? (
                                                <div className="space-y-4 animate-in fade-in duration-200">
                                                    <input
                                                        autoFocus
                                                        placeholder="https://github.com/username/repo"
                                                        value={connectUrl}
                                                        onChange={e => setConnectUrl(e.target.value)}
                                                        className="w-full p-4 bg-forge-black/40 border border-forge-muted/20 text-white rounded-2xl outline-none focus:border-forge-muted transition-all text-sm font-medium placeholder:text-forge-muted/50"
                                                    />
                                                    <div className="flex gap-3">
                                                        <button
                                                            onClick={() => setShowConnectInput(false)}
                                                            className="flex-1 py-3.5 bg-forge-grey/50 text-forge-muted text-[11px] font-black uppercase tracking-widest rounded-2xl hover:text-white hover:bg-forge-grey transition-all"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={handleConnectRepo}
                                                            disabled={!connectUrl.trim() || actionLoading === 'connect'}
                                                            className="flex-1 py-3.5 bg-forge-beige text-forge-black text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-white transition-all disabled:opacity-50"
                                                        >
                                                            {actionLoading === 'connect' ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Link Repo'}
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    <button
                                                        onClick={handleCreateRepo}
                                                        disabled={actionLoading === 'create'}
                                                        className="w-full py-4 bg-forge-beige text-forge-black text-[13px] font-black uppercase tracking-[0.1em] rounded-3xl flex items-center justify-center gap-3 shadow-xl shadow-black/20 hover:bg-white hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50 disabled:scale-100"
                                                    >
                                                        {actionLoading === 'create' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                                                        {actionLoading === 'create' ? 'CREATING...' : 'CREATE NEW REPO'}
                                                    </button>
                                                    <button
                                                        onClick={() => setShowConnectInput(true)}
                                                        disabled={actionLoading === 'connect'}
                                                        className="w-full py-4 bg-forge-grey/50 border border-forge-muted/20 text-white text-[13px] font-black uppercase tracking-[0.1em] rounded-3xl flex items-center justify-center gap-3 hover:bg-forge-grey transition-all active:scale-95 disabled:opacity-50 disabled:scale-100"
                                                    >
                                                        <Github className="w-5 h-5" />
                                                        CONNECT EXISTING
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="pt-8 border-t border-forge-muted/10">
                                <h2 className="text-[10px] font-black uppercase text-forge-muted tracking-widest mb-6 px-2">Source Code</h2>
                                <div className="p-6 bg-forge-grey/10 border border-forge-muted/10 rounded-3xl">
                                    <p className="text-sm font-medium text-forge-muted leading-relaxed mb-4">You can download the source code of your portfolio to host it anywhere you want.</p>
                                    <p className="text-xs text-forge-muted/60">Note: External hosting guides are available in the documentation.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {
                        activeTab === 'settings' && (
                            <div className="space-y-12 text-left pb-20">
                                <div>
                                    <h1 className="text-xl font-bold uppercase tracking-tighter text-white mb-8">Settings</h1>

                                    {/* Portfolio Customization */}
                                    <div className="space-y-6">
                                        <h2 className="text-[10px] font-black uppercase text-forge-muted tracking-widest px-2">Portfolio Customization</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-forge-muted uppercase tracking-widest pl-2">Portfolio URL Slug</label>
                                                <div className="relative group">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[11px] font-bold text-forge-muted tracking-tight group-focus-within:text-forge-beige transition-colors">devforge.app/</span>
                                                    <input
                                                        value={settingsUsername}
                                                        onChange={e => setSettingsUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                                        className="w-full pl-24 pr-4 py-3 bg-forge-grey border border-transparent focus:border-forge-muted focus:bg-forge-black outline-none text-sm font-bold text-white rounded-2xl transition-all"
                                                        placeholder="username"
                                                    />
                                                </div>
                                                <p className="text-[9px] text-forge-muted/60 font-medium pl-2 uppercase tracking-widest">This changes your public portfolio link.</p>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-forge-muted uppercase tracking-widest pl-2">Accent Color</label>
                                                <div className="flex gap-4">
                                                    <input
                                                        type="color"
                                                        value={settingsAccentColor}
                                                        onChange={e => setSettingsAccentColor(e.target.value)}
                                                        className="w-12 h-12 bg-forge-grey border border-forge-muted/20 rounded-xl cursor-pointer p-1"
                                                    />
                                                    <input
                                                        value={settingsAccentColor}
                                                        onChange={e => setSettingsAccentColor(e.target.value)}
                                                        className="flex-1 px-4 py-3 bg-forge-grey border border-transparent focus:border-forge-muted focus:bg-forge-black outline-none text-sm font-mono font-bold text-white rounded-2xl transition-all"
                                                        placeholder="#000000"
                                                    />
                                                </div>
                                                <p className="text-[9px] text-forge-muted/60 font-medium pl-2 uppercase tracking-widest">Sets the primary color for buttons, highlights, and icons.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Social Links Section */}
                                <div className="space-y-6">
                                    <h2 className="text-[10px] font-black uppercase text-forge-muted tracking-widest px-2">Social Connections</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { id: 'github', label: 'GitHub', icon: Github, placeholder: 'github.com/username' },
                                            { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'linkedin.com/in/username' },
                                            { id: 'twitter', label: 'Instagram', icon: Instagram, placeholder: 'instagram.com/username' },
                                            { id: 'website', label: 'Website', icon: Globe, placeholder: 'yourdomain.com' },
                                            { id: 'email', label: 'Public Email', icon: Mail, placeholder: 'your@email.com' },
                                        ].map((social) => (
                                            <div key={social.id} className="relative group">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-forge-black flex items-center justify-center border border-forge-muted/10 group-focus-within:border-forge-beige transition-all">
                                                    <social.icon className="w-4 h-4 text-forge-muted group-focus-within:text-forge-beige" />
                                                </div>
                                                <input
                                                    value={(socials as Record<string, string>)[social.id] || ''}
                                                    onChange={e => setSocials({ ...socials, [social.id]: e.target.value })}
                                                    className="w-full pl-16 pr-4 py-4 bg-forge-grey/20 border border-forge-muted/10 focus:border-forge-muted focus:bg-forge-grey/40 outline-none text-sm font-bold text-white rounded-3xl transition-all"
                                                    placeholder={social.placeholder}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Bottom Actions */}
                                <div className="pt-8 border-t border-forge-muted/10 flex flex-col md:flex-row gap-4">
                                    <button
                                        onClick={handleSaveSettings}
                                        disabled={saving}
                                        className="flex-1 py-4 bg-forge-beige text-forge-black text-[13px] font-black uppercase tracking-[0.1em] rounded-3xl flex items-center justify-center gap-3 shadow-xl shadow-black/20 hover:bg-white hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                        {saving ? 'SAVING...' : 'SAVE ALL SETTINGS'}
                                    </button>

                                    <button
                                        onClick={() => setConfirmation({
                                            isOpen: true,
                                            title: 'Delete Account?',
                                            message: 'This will permanently delete your account and all associated data. This action is irreversible.',
                                            onConfirm: () => setToast({ message: 'Account deletion disabled in demo.', type: 'info' })
                                        })}
                                        className="px-8 py-4 bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] font-black uppercase tracking-[0.1em] rounded-3xl flex items-center justify-center gap-3 hover:bg-red-500/20 transition-all opacity-80 hover:opacity-100"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                        DELETE ACCOUNT
                                    </button>
                                </div>
                            </div>
                        )
                    }
                </main >
            </div >

            <Footer />

            {/* Floating Bottom Navbar */}
            <div className="fixed bottom-6 md:bottom-8 inset-x-0 z-50 px-4 md:px-6">
                <nav className="max-w-5xl mx-auto px-6 md:px-10 py-4 md:py-5 flex justify-between items-center bg-forge-grey/90 backdrop-blur-md border border-forge-muted/20 rounded-full md:rounded-[32px] shadow-2xl shadow-black/50 transition-all">
                    <Link to="/" className="text-lg md:text-xl font-bold flex items-center gap-2 text-white">
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-forge-beige text-forge-black flex items-center justify-center rounded">/</div>
                        <span className="hidden sm:inline">DevForge</span>
                    </Link>
                    <div className="flex items-center gap-4 md:gap-8">
                        <Link to="/dashboard" className="text-[10px] md:text-xs font-black uppercase tracking-widest text-forge-muted hover:text-white transition-colors">Dashboard</Link>
                        <button onClick={() => { supabase.auth.signOut(); navigate('/') }} className="bg-forge-beige text-forge-black px-4 md:px-6 py-2 md:py-2.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-white transition-all shadow-lg">Logout</button>
                    </div>
                </nav>
            </div>

            {/* Toast Notification */}
            {
                toast && (
                    <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 rounded-3xl shadow-2xl backdrop-blur-xl border border-forge-muted/20 flex items-center gap-3 transition-all animate-in fade-in slide-in-from-top-4 duration-300 ${toast.type === 'success' ? 'bg-green-500/10 text-green-400' :
                        toast.type === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-forge-beige/10 text-forge-beige'
                        }`}>
                        {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
                        {toast.type === 'error' && <Trash2 className="w-5 h-5" />}
                        {toast.type === 'info' && <ExternalLink className="w-5 h-5" />}
                        <span className="text-sm font-bold tracking-tight">{toast.message}</span>
                    </div>
                )
            }

            {/* Modal */}
            <Modal isOpen={!!modalType} onClose={() => { setModalType(null); setModalData({}) }} title={`Add ${modalType}`}>
                <div className="space-y-4">
                    {modalType === 'experience' && (
                        <>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-forge-muted uppercase tracking-widest">Company</label>
                                <input placeholder="e.g. Google" value={modalData.company || ''} onChange={e => setModalData({ ...modalData, company: e.target.value })} className="w-full p-3 bg-forge-grey border border-transparent focus:border-forge-muted focus:bg-forge-black outline-none text-sm font-bold text-white rounded-2xl transition-all" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-forge-muted uppercase tracking-widest">Position</label>
                                <input placeholder="e.g. Senior Developer" value={modalData.position || ''} onChange={e => setModalData({ ...modalData, position: e.target.value })} className="w-full p-3 bg-forge-grey border border-transparent focus:border-forge-muted focus:bg-forge-black outline-none text-sm font-bold text-white rounded-2xl transition-all" />
                            </div>
                        </>
                    )}
                    {modalType === 'education' && (
                        <>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-forge-muted uppercase tracking-widest">Institution</label>
                                <input placeholder="e.g. Stanford University" value={modalData.institution || ''} onChange={e => setModalData({ ...modalData, institution: e.target.value })} className="w-full p-3 bg-forge-grey border border-transparent focus:border-forge-muted focus:bg-forge-black outline-none text-sm font-bold text-white rounded-2xl transition-all" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-forge-muted uppercase tracking-widest">Degree</label>
                                <input placeholder="e.g. B.S. Computer Science" value={modalData.degree || ''} onChange={e => setModalData({ ...modalData, degree: e.target.value })} className="w-full p-3 bg-forge-grey border border-transparent focus:border-forge-muted focus:bg-forge-black outline-none text-sm font-bold text-white rounded-2xl transition-all" />
                            </div>
                        </>
                    )}
                    {modalType === 'skills' && (
                        <>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-forge-muted uppercase tracking-widest">Skill Name</label>
                                <input placeholder="e.g. React" value={modalData.name || ''} onChange={e => setModalData({ ...modalData, name: e.target.value })} className="w-full p-3 bg-forge-grey border border-transparent focus:border-forge-muted focus:bg-forge-black outline-none text-sm font-bold text-white rounded-2xl transition-all" />
                            </div>
                            <div className="space-y-2 pt-2">
                                <div className="flex justify-between items-end">
                                    <label className="text-[10px] font-black text-forge-muted uppercase tracking-widest">Proficiency</label>
                                    <span className="text-xs font-bold text-forge-beige uppercase">{['Beginner', 'Intermediate', 'Advanced', 'Expert'][modalData.proficiencyLevel || 1]}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="3"
                                    step="1"
                                    value={modalData.proficiencyLevel !== undefined ? modalData.proficiencyLevel : 1}
                                    onChange={e => setModalData({ ...modalData, proficiencyLevel: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-forge-grey rounded-lg appearance-none cursor-pointer accent-forge-beige hover:accent-white transition-all"
                                />
                                <div className="flex justify-between text-[10px] text-forge-muted font-bold uppercase tracking-widest px-1">
                                    <span>Beg</span>
                                    <span>Int</span>
                                    <span>Adv</span>
                                    <span>Exp</span>
                                </div>
                            </div>
                        </>
                    )}
                    {modalType === 'projects' && (
                        <>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-forge-muted uppercase tracking-widest">Project Title</label>
                                <input placeholder="e.g. E-commerce App" value={modalData.title || ''} onChange={e => setModalData({ ...modalData, title: e.target.value })} className="w-full p-3 bg-forge-grey border border-transparent focus:border-forge-muted focus:bg-forge-black outline-none text-sm font-bold text-white rounded-2xl transition-all" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-forge-muted uppercase tracking-widest">Short Tagline</label>
                                <input placeholder="e.g. Modern shopping experience" value={modalData.tagline || ''} onChange={e => setModalData({ ...modalData, tagline: e.target.value })} className="w-full p-3 bg-forge-grey border border-transparent focus:border-forge-muted focus:bg-forge-black outline-none text-sm font-bold text-white rounded-2xl transition-all" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-forge-muted uppercase tracking-widest">GitHub URL</label>
                                <input placeholder="github.com/username/repo" value={modalData.github_url || ''} onChange={e => setModalData({ ...modalData, github_url: e.target.value })} className="w-full p-3 bg-forge-grey border border-transparent focus:border-forge-muted focus:bg-forge-black outline-none text-sm font-bold text-white rounded-2xl transition-all" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-forge-muted uppercase tracking-widest">Live Demo URL</label>
                                <input placeholder="your-project.vercel.app" value={modalData.live_url || ''} onChange={e => setModalData({ ...modalData, live_url: e.target.value })} className="w-full p-3 bg-forge-grey border border-transparent focus:border-forge-muted focus:bg-forge-black outline-none text-sm font-bold text-white rounded-2xl transition-all" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-forge-muted uppercase tracking-widest">Tech Stack (comma separated)</label>
                                <input placeholder="React, Tailwind, Supabase" value={modalData.tech_stack || ''} onChange={e => setModalData({ ...modalData, tech_stack: e.target.value })} className="w-full p-3 bg-forge-grey border border-transparent focus:border-forge-muted focus:bg-forge-black outline-none text-sm font-bold text-white rounded-2xl transition-all" />
                            </div>
                        </>
                    )}
                    <button onClick={handleAddItem} disabled={saving} className="w-full py-4 bg-forge-beige text-forge-black text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-white transition-all shadow-lg shadow-black/20 mt-4">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Add Item'}
                    </button>
                </div>
            </Modal>

            <ConfirmModal
                isOpen={confirmation.isOpen}
                title={confirmation.title}
                message={confirmation.message}
                onConfirm={confirmation.onConfirm}
                onClose={() => setConfirmation({ ...confirmation, isOpen: false })}
            />
        </div >
    )
}
