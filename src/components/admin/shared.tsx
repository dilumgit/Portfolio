'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8',
        className
      )}
    >
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

interface EmptyStateProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mb-4">
        <span className="text-3xl">📭</span>
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mt-2 max-w-sm">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

interface FormFieldProps {
  label: string
  htmlFor: string
  required?: boolean
  description?: string
  error?: string
  children: React.ReactNode
}

export function FormField({
  label,
  htmlFor,
  required,
  description,
  error,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      {children}
      {description && !error && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

interface ToggleVisibilityProps {
  isVisible: boolean
  onChange: (visible: boolean) => void
  disabled?: boolean
}

export function ToggleVisibility({
  isVisible,
  onChange,
  disabled,
}: ToggleVisibilityProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!isVisible)}
      disabled={disabled}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50',
        isVisible ? 'bg-primary' : 'bg-secondary'
      )}
      aria-label={isVisible ? 'Hide item' : 'Show item'}
    >
      <span
        className={cn(
          'inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform',
          isVisible ? 'translate-x-6' : 'translate-x-1'
        )}
      />
    </button>
  )
}
