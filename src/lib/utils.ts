import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
    })
}

export function formatDateRange(startDate: Date | string, endDate?: Date | string | null, isCurrent?: boolean): string {
    const start = formatDate(startDate)
    if (isCurrent) {
        return `${start} - Present`
    }
    if (endDate) {
        return `${start} - ${formatDate(endDate)}`
    }
    return start
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
}

export function getInitials(name: string): string {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}
