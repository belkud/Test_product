export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatRelativeDate(date: string | Date): string {
  const now = new Date()
  const target = new Date(date)
  const diffMs = now.getTime() - target.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'success',
    inactive: 'info',
    pending: 'warning',
    'in-progress': 'primary',
    completed: 'success',
    planning: 'info',
    review: 'warning',
    'on-hold': 'danger',
    todo: 'info',
    done: 'success',
    low: 'info',
    medium: 'warning',
    high: 'danger',
  }
  return colors[status] || 'info'
}

export function getStatusType(status: string): 'success' | 'warning' | 'info' | 'danger' | 'primary' {
  const types: Record<string, 'success' | 'warning' | 'info' | 'danger' | 'primary'> = {
    active: 'success',
    inactive: 'info',
    pending: 'warning',
    'in-progress': 'primary',
    completed: 'success',
    planning: 'info',
    review: 'warning',
    'on-hold': 'danger',
    todo: 'info',
    done: 'success',
    low: 'info',
    medium: 'warning',
    high: 'danger',
  }
  return types[status] || 'info'
}

export function getPriorityType(priority: string): 'success' | 'warning' | 'info' | 'danger' | 'primary' {
  const types: Record<string, 'success' | 'warning' | 'info' | 'danger' | 'primary'> = {
    low: 'info',
    medium: 'warning',
    high: 'danger',
  }
  return types[priority] || 'info'
}
