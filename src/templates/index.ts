import type { PortfolioData } from '../types'

export interface TemplateProps {
    data: PortfolioData
}

export interface TemplateConfig {
    id: string
    name: string
    description: string
    preview: string
    colors: {
        background: string
        foreground: string
        accent: string
    }
}

export const templates: TemplateConfig[] = [
    {
        id: 'terminal',
        name: 'Terminal',
        description: 'Hacker aesthetic with command-line interface',
        preview: '/templates/terminal.png',
        colors: {
            background: '#000000',
            foreground: '#00FF00',
            accent: '#FFBF00',
        },
    },
    {
        id: 'monolith',
        name: 'Monolith',
        description: 'Swiss minimalism with bold typography',
        preview: '/templates/monolith.png',
        colors: {
            background: '#000000',
            foreground: '#FFFFFF',
            accent: '#FFFFFF',
        },
    },

]

export function getTemplate(id: string): TemplateConfig | undefined {
    return templates.find(t => t.id === id)
}
