'use client'

import React, { useRef, useState } from 'react'
import Image from 'next/image'
import {
  Upload,
  Trash2,
  Loader2,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  Link as LinkIcon,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { uploadEducationLogo, removeEducationLogo } from '@/lib/actions/storage'
import { toast } from '@/hooks/use-toast'
import { getInitials } from '@/lib/utils'

interface EducationLogoUploadProps {
  value: string
  onChange: (url: string) => void
  institutionName?: string
  disabled?: boolean
}

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/gif',
]
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

export function EducationLogoUpload({
  value,
  onChange,
  institutionName = '',
  disabled = false,
}: EducationLogoUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [manualUrl, setManualUrl] = useState(value || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Keep manual URL in sync with value
  React.useEffect(() => {
    setManualUrl(value || '')
  }, [value])

  const processFile = async (file: File) => {
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      toast({
        title: 'Unsupported file type',
        description: 'Please upload a PNG, JPG, WebP, or SVG image.',
        variant: 'destructive',
      })
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: 'File too large',
        description: 'Logo size must be less than 5 MB.',
        variant: 'destructive',
      })
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    // Local instant preview
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const result = await uploadEducationLogo(formData)

      if (result.success) {
        if (result.data?.url) {
          onChange(result.data.url)
        }
        toast({
          title: 'Logo uploaded',
          description: result.message || 'Institution logo uploaded to Supabase Storage.',
          variant: 'success' as any,
        })
      } else {
        setPreviewUrl(null)
        toast({
          title: 'Upload failed',
          description: result.error || 'Failed to upload logo.',
          variant: 'destructive',
        })
      }
    } catch (err: any) {
      setPreviewUrl(null)
      toast({
        title: 'Upload error',
        description: err?.message || 'An unexpected error occurred during upload.',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled && !isUploading) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (disabled || isUploading) return

    const file = e.dataTransfer.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleRemove = async () => {
    if (!value && !previewUrl) return
    setIsRemoving(true)

    try {
      const currentUrl = value
      onChange('')
      setPreviewUrl(null)

      if (currentUrl && currentUrl.includes('/portfolio-images/')) {
        await removeEducationLogo(currentUrl)
      }

      toast({
        title: 'Logo removed',
        description: 'Institution logo has been removed.',
        variant: 'success' as any,
      })
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to remove logo.',
        variant: 'destructive',
      })
    } finally {
      setIsRemoving(false)
    }
  }

  const handleApplyManualUrl = () => {
    onChange(manualUrl.trim())
    setPreviewUrl(null)
    setShowUrlInput(false)
    if (manualUrl.trim()) {
      toast({
        title: 'Logo URL set',
        description: 'Using external logo URL.',
        variant: 'success' as any,
      })
    }
  }

  const currentDisplayUrl = previewUrl || value

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <span>Institution Logo</span>
          {currentDisplayUrl && (
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-normal">
              <CheckCircle2 className="w-3 h-3" />
              Attached
            </span>
          )}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-xs text-violet-400 hover:text-violet-300 transition-colors inline-flex items-center gap-1"
        >
          <LinkIcon className="w-3 h-3" />
          {showUrlInput ? 'Hide URL input' : 'Or paste URL'}
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
        onChange={handleFileSelect}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {/* Manual URL Input (collapsible) */}
      {showUrlInput && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-secondary/30 border border-border/60">
          <Input
            placeholder="https://example.com/logo.png"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            className="h-8 text-xs"
            disabled={disabled || isUploading}
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleApplyManualUrl}
            className="h-8 text-xs shrink-0"
          >
            Apply
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setShowUrlInput(false)}
            className="h-8 w-8 p-0 shrink-0 text-muted-foreground hover:text-foreground"
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}

      {/* Main Upload / Preview Area */}
      {currentDisplayUrl ? (
        /* Preview Card */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative flex items-center gap-4 p-4 rounded-xl border bg-card/40 backdrop-blur-sm transition-all ${
            isDragging
              ? 'border-violet-500 bg-violet-500/10 ring-2 ring-violet-500/30'
              : 'border-border/80 hover:border-border'
          }`}
        >
          {/* Logo container */}
          <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-border/80 bg-background/80 shrink-0 flex items-center justify-center shadow-inner">
            <Image
              src={currentDisplayUrl}
              alt={institutionName || 'Institution logo'}
              fill
              sizes="64px"
              className="object-contain p-2"
              unoptimized
            />
            {(isUploading || isRemoving) && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-xs flex items-center justify-center z-10">
                <Loader2 className="w-5 h-5 animate-spin text-violet-400" />
              </div>
            )}
          </div>

          {/* Details & Actions */}
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-foreground truncate max-w-[200px]">
                {institutionName ? `${institutionName} Logo` : 'Institution Logo'}
              </span>
              {value && (
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  title="Open logo in new tab"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground">
              {isDragging ? 'Drop new file to replace' : 'Logo will appear on your education timeline'}
            </p>

            <div className="flex items-center gap-2 pt-1">
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={disabled || isUploading || isRemoving}
                onClick={() => fileInputRef.current?.click()}
                className="h-7 text-xs px-2.5 gap-1.5"
              >
                {isUploading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <RefreshCw className="w-3 h-3" />
                )}
                Replace Logo
              </Button>

              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled={disabled || isUploading || isRemoving}
                onClick={handleRemove}
                className="h-7 text-xs px-2.5 gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                {isRemoving ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Trash2 className="w-3 h-3" />
                )}
                Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Drag-and-Drop Dropzone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
          className={`relative cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all ${
            isDragging
              ? 'border-violet-500 bg-violet-500/10 scale-[1.01]'
              : 'border-border/70 hover:border-violet-500/50 hover:bg-violet-500/5 bg-card/20'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              {isUploading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : institutionName ? (
                <span className="text-sm font-bold">{getInitials(institutionName)}</span>
              ) : (
                <Upload className="w-5 h-5" />
              )}
            </div>

            <div className="space-y-0.5">
              <p className="text-xs font-medium text-foreground">
                {isUploading ? (
                  'Uploading logo to Supabase Storage...'
                ) : isDragging ? (
                  <span className="text-violet-400 font-semibold">Drop image file here</span>
                ) : (
                  <>
                    <span className="text-violet-400 font-semibold">Click to upload</span> or drag and drop
                  </>
                )}
              </p>
              <p className="text-[11px] text-muted-foreground">
                PNG, JPG, SVG, WebP • Max 5 MB
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
