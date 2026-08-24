'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { submitContactMessage } from '@/lib/actions/content'
import type { Profile } from '@/types/portfolio'

interface ContactProps {
  profile: Profile | null
}

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

export function Contact({ profile }: ContactProps) {
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setSubmitStatus('loading')
    try {
      const result = await submitContactMessage(data)
      if (result.success) {
        setSubmitStatus('success')
        reset()
      } else {
        setSubmitStatus('error')
        setErrorMessage(result.error)
      }
    } catch {
      setSubmitStatus('error')
      setErrorMessage('Something went wrong. Please try again.')
    }
  }

  const contactInfo = [
    profile?.email && {
      icon: Mail,
      label: 'Email',
      value: profile.email,
      href: `mailto:${profile.email}`,
    },
    profile?.phone && {
      icon: Phone,
      label: 'Phone',
      value: profile.phone,
      href: `tel:${profile.phone}`,
    },
    profile?.location && {
      icon: MapPin,
      label: 'Location',
      value: profile.location,
      href: null,
    },
  ].filter(Boolean)

  return (
    <section id="contact" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/10 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          transition={{ staggerChildren: 0.15 }}
          className="space-y-16"
        >
          {/* Header */}
          <motion.div variants={fadeInUp} className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-sm font-medium">
              <Mail className="w-3.5 h-3.5" />
              Contact
            </div>
            <h2 className="section-title">
              Get In <span className="gradient-text">Touch</span>
            </h2>
            <p className="section-subtitle mx-auto">
              Have a question or want to work together? I&apos;d love to hear from you.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact info */}
            <motion.div variants={fadeInUp} className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">
                  Let&apos;s connect
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Whether you have a project in mind, want to discuss research,
                  or just want to say hello — I&apos;m always open to interesting
                  conversations and opportunities.
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((item) => {
                  if (!item) return null
                  const Icon = item.icon
                  return (
                    <div key={item.label} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-violet-400" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {item.label}
                        </p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="font-medium hover:text-violet-400 transition-colors"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="font-medium">{item.value}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            {/* Contact form */}
            <motion.div variants={fadeInUp}>
              <div className="glass-card p-8">
                <h3 className="text-xl font-bold mb-6">Send a message</h3>

                {submitStatus === 'success' ? (
                  <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                    <CheckCircle className="w-16 h-16 text-green-400" />
                    <div>
                      <h4 className="text-lg font-semibold">Message sent!</h4>
                      <p className="text-muted-foreground text-sm mt-1">
                        Thank you for reaching out. I&apos;ll get back to you soon.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSubmitStatus('idle')}
                    >
                      Send another
                    </Button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                    noValidate
                  >
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="contact-name">
                          Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="contact-name"
                          placeholder="Your name"
                          {...register('name')}
                          aria-invalid={!!errors.name}
                        />
                        {errors.name && (
                          <p className="text-xs text-destructive">
                            {errors.name.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contact-email">
                          Email <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="contact-email"
                          type="email"
                          placeholder="your@email.com"
                          {...register('email')}
                          aria-invalid={!!errors.email}
                        />
                        {errors.email && (
                          <p className="text-xs text-destructive">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact-subject">
                        Subject <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="contact-subject"
                        placeholder="What is this about?"
                        {...register('subject')}
                        aria-invalid={!!errors.subject}
                      />
                      {errors.subject && (
                        <p className="text-xs text-destructive">
                          {errors.subject.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact-message">
                        Message <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="contact-message"
                        placeholder="Your message..."
                        className="min-h-[140px]"
                        {...register('message')}
                        aria-invalid={!!errors.message}
                      />
                      {errors.message && (
                        <p className="text-xs text-destructive">
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    {submitStatus === 'error' && (
                      <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-3">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {errorMessage}
                      </div>
                    )}

                    <Button
                      type="submit"
                      variant="gradient"
                      className="w-full"
                      disabled={submitStatus === 'loading'}
                    >
                      {submitStatus === 'loading' ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
