'use client'

import React, { useState } from 'react'
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DeleteButtonProps {
  onDelete: () => Promise<void>
  itemName?: string
  size?: 'sm' | 'default'
}

export function DeleteButton({
  onDelete,
  itemName = 'this item',
  size = 'sm',
}: DeleteButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleClick = () => {
    if (!isConfirming) {
      setIsConfirming(true)
      setTimeout(() => setIsConfirming(false), 3000)
    } else {
      handleDelete()
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete()
    } finally {
      setIsDeleting(false)
      setIsConfirming(false)
    }
  }

  return (
    <Button
      variant="destructive"
      size={size}
      onClick={handleClick}
      disabled={isDeleting}
      className={`transition-all duration-200 ${isConfirming ? 'animate-pulse' : ''}`}
      title={isConfirming ? `Click again to confirm deletion of ${itemName}` : `Delete ${itemName}`}
    >
      {isDeleting ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : isConfirming ? (
        <>
          <AlertTriangle className="w-3.5 h-3.5" />
          Confirm
        </>
      ) : (
        <Trash2 className="w-3.5 h-3.5" />
      )}
    </Button>
  )
}
