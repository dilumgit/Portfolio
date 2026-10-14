'use client'

import React, { useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import { Upload, Trash2, Camera, Loader2, AlertCircle, CheckCircle2, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { uploadProfileImage, removeProfileImage } from '@/lib/actions/storage'
import { toast } from '@/hooks/use-toast'
import { getInitials } from '@/lib/utils'

interface ProfileImageUploadProps {
  currentImageUrl?: string | null
  fullName?: string
  onImageChange?: (newUrl: string | null) => void
}

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

export function ProfileImageUpload({
  currentImageUrl,
  fullName = 'User',
  onImageChange,
}: ProfileImageUploadProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(currentImageUrl || null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [isRemoving, setIsRemoving] = useState(false)
  const [showConfirmRemove, setShowConfirmRemove] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sync state if prop changes
  React.useEffect(() => {
    setImageUrl(currentImageUrl || null)
  }, [currentImageUrl])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      toast({
        title: 'Unsupported file format',
        description: 'Please select a JPG, PNG, or WebP image.',
        variant: 'destructive',
      })
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: 'File too large',
        description: 'Image size must be less than 5 MB.',
        variant: 'destructive',
      })
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    // Generate local preview immediately
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)

    // Execute upload
    const formData = new FormData()
    formData.append('file', file)

    startTransition(async () => {
      const result = await uploadProfileImage(formData)
      if (result.success) {
        if (result.data) {
          setImageUrl(result.data.url)
          onImageChange?.(result.data.url)
        }
        setPreviewUrl(null)
        toast({
          title: 'Profile image updated',
          description: 'Your new profile photo has been uploaded and saved.',
          variant: 'success' as any,
        })
      } else {
        setPreviewUrl(null)
        toast({
          title: 'Upload failed',
          description: result.error || 'Failed to upload profile image.',
          variant: 'destructive',
        })
      }
      if (fileInputRef.current) fileInputRef.current.value = ''
    })
  }

  const handleRemove = async () => {
    setIsRemoving(true)
    setShowConfirmRemove(false)
    try {
      const result = await removeProfileImage()
      if (result.success) {
        setImageUrl(null)
        setPreviewUrl(null)
        onImageChange?.(null)
        toast({
          title: 'Profile image removed',
          description: 'Your profile photo has been deleted. Initials will be displayed.',
          variant: 'success' as any,
        })
      } else {
        toast({
          title: 'Failed to remove image',
          description: result.error || 'Could not delete profile photo.',
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while removing the image.',
        variant: 'destructive',
      })
    } finally {
      setIsRemoving(false)
    }
  }

  const activeDisplayUrl = previewUrl || imageUrl

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 rounded-2xl border border-border/60 bg-card/40 backdrop-blur-md shadow-sm">
        {/* Avatar Display */}
        <div className="relative group shrink-0">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-border/80 bg-secondary/50 shadow-inner flex items-center justify-center">
            {activeDisplayUrl ? (
              <Image
                src={activeDisplayUrl}
                alt={fullName}
                fill
                sizes="128px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                unoptimized={!!previewUrl}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-violet-600/30 via-purple-600/20 to-cyan-600/30 flex flex-col items-center justify-center text-violet-300">
                <span className="text-3xl font-bold tracking-wider">
                  {getInitials(fullName)}
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-widest opacity-60 mt-1">
                  Initials
                </span>
              </div>
            )}

            {/* Uploading Overlay */}
            {(isPending || isRemoving) && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-xs flex flex-col items-center justify-center gap-1 z-20">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="text-[11px] font-medium text-foreground">
                  {isRemoving ? 'Removing...' : 'Uploading...'}
                </span>
              </div>
            )}
          </div>

          {/* Quick change camera button overlay on avatar */}
          {!isPending && !isRemoving && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-primary text-primary-foreground shadow-md hover:scale-110 active:scale-95 transition-transform"
              title="Select new image"
            >
              <Camera className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Controls & Instructions */}
        <div className="flex-1 space-y-3">
          <div className="space-y-1">
            <h3 className="font-semibold text-sm text-foreground">
              Profile Photo
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Upload a clear personal photo. This will be prominently showcased on your public homepage hero and about sections.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />

            <Button
              type="button"
              variant="gradient"
              size="sm"
              disabled={isPending || isRemoving}
              onClick={() => fileInputRef.current?.click()}
              className="gap-2"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {imageUrl ? 'Change Image' : 'Upload Image'}
            </Button>

            {imageUrl && !showConfirmRemove && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isPending || isRemoving}
                onClick={() => setShowConfirmRemove(true)}
                className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </Button>
            )}

            {/* Confirmation dialog for removal */}
            {showConfirmRemove && (
              <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 rounded-xl px-3 py-1.5 animate-in fade-in zoom-in-95 duration-150">
                <span className="text-xs text-destructive font-medium">Remove photo?</span>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={handleRemove}
                  className="h-7 text-xs px-2.5"
                >
                  Yes, remove
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowConfirmRemove(false)}
                  className="h-7 text-xs px-2"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-muted-foreground pt-0.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-violet-400/60" />
            <span>Accepts JPG, PNG, or WebP • Max size 5 MB</span>
          </div>
        </div>
      </div>
    </div>
  )
}
