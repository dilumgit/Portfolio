import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  })
}

export function formatDateRange(
  startDate: string | null | undefined,
  endDate: string | null | undefined,
  isCurrent: boolean = false
): string {
  const start = formatDate(startDate)
  if (isCurrent) return `${start} – Present`
  const end = formatDate(endDate)
  if (!start && !end) return ''
  if (!start) return end
  if (!end) return start
  return `${start} – ${end}`
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '…'
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function absoluteUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  return `${baseUrl}${path}`
}

export function sortEducationReverseChronological<
  T extends {
    is_current?: boolean | null
    end_date?: string | null
    start_date?: string | null
    display_order?: number | null
  }
>(a: T, b: T): number {
  const aIsOngoing = !!a.is_current || !a.end_date
  const bIsOngoing = !!b.is_current || !b.end_date

  // 1. Currently enrolled / ongoing education appears first
  if (aIsOngoing && !bIsOngoing) return -1
  if (!aIsOngoing && bIsOngoing) return 1

  // 2. If both are ongoing, compare start_date descending (newest first)
  if (aIsOngoing && bIsOngoing) {
    const aStart = a.start_date || ''
    const bStart = b.start_date || ''
    if (aStart !== bStart) {
      return bStart.localeCompare(aStart)
    }
  } else {
    // 3. If both are completed, compare end_date descending (most recent completion first)
    const aEnd = a.end_date || ''
    const bEnd = b.end_date || ''
    if (aEnd !== bEnd) {
      return bEnd.localeCompare(aEnd)
    }

    // Fallback if end dates match: compare start_date descending
    const aStart = a.start_date || ''
    const bStart = b.start_date || ''
    if (aStart !== bStart) {
      return bStart.localeCompare(aStart)
    }
  }

  // 4. Stable fallback
  return (a.display_order ?? 0) - (b.display_order ?? 0)
}

