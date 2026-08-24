'use client'

import React, { useState, useTransition } from 'react'
import { MessageSquare, Mail, Trash2, Check, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader, EmptyState } from '@/components/admin/shared'
import { markMessageRead, deleteContactMessage } from '@/lib/actions/content'
import { toast } from '@/hooks/use-toast'
import { formatDate } from '@/lib/utils'
import type { ContactMessage } from '@/types/portfolio'

interface Props { messages: ContactMessage[] }

export function ContactClient({ messages: initial }: Props) {
  const [messages, setMessages] = useState(initial)
  const [selected, setSelected] = useState<ContactMessage | null>(null)

  const handleMarkRead = async (id: string) => {
    await markMessageRead(id)
    setMessages(p => p.map(m => m.id === id ? { ...m, is_read: true } : m))
  }

  const handleDelete = async (id: string) => {
    const r = await deleteContactMessage(id)
    if (r.success) {
      setMessages(p => p.filter(m => m.id !== id))
      if (selected?.id === id) setSelected(null)
      toast({ title: 'Message deleted', variant: 'success' as any })
    }
  }

  return (
    <div>
      <PageHeader title="Contact Messages" description={`${messages.filter(m => !m.is_read).length} unread messages`} />

      {messages.length === 0 ? (
        <EmptyState title="No messages" description="Contact form submissions will appear here" />
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Message list */}
          <div className="space-y-3">
            {messages.map(msg => (
              <button
                key={msg.id}
                onClick={() => { setSelected(msg); handleMarkRead(msg.id) }}
                className={`w-full text-left glass-card p-4 hover:border-violet-500/30 transition-all ${selected?.id === msg.id ? 'border-violet-500/50' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-semibold text-sm shrink-0">
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">{msg.name}</p>
                      {!msg.is_read && <span className="w-2 h-2 rounded-full bg-violet-500 shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{msg.subject || msg.message.slice(0, 40)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {new Date(msg.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Message detail */}
          {selected ? (
            <div className="glass-card p-6 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold">{selected.name}</h3>
                  <a href={`mailto:${selected.email}`} className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {selected.email}
                  </a>
                </div>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(selected.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>

              {selected.subject && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Subject</p>
                  <p className="text-sm font-medium">{selected.subject}</p>
                </div>
              )}

              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Message</p>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>

              <div className="flex items-center justify-between border-t border-border/50 pt-4">
                <p className="text-xs text-muted-foreground">{new Date(selected.created_at).toLocaleString()}</p>
                <a
                  href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your message'}`}
                  className="text-sm font-medium text-violet-400 hover:text-violet-300"
                >
                  Reply →
                </a>
              </div>
            </div>
          ) : (
            <div className="glass-card flex items-center justify-center p-12 text-center">
              <div>
                <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Select a message to view</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
