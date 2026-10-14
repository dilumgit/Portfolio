'use client'

import React, { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { PageHeader, FormField } from '@/components/admin/shared'
import { ProfileImageUpload } from '@/components/admin/profile-image-upload'
import { upsertProfile } from '@/lib/actions/profile'
import { toast } from '@/hooks/use-toast'
import type { Profile } from '@/types/portfolio'

const profileSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  professional_title: z.string().min(1, 'Professional title is required'),
  tagline: z.string().optional().nullable(),
  about_me: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  email: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => !val || val.trim() === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()),
      { message: 'Please enter a valid email address' }
    ),
  phone: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  github_url: z.string().optional().nullable(),
  linkedin_url: z.string().optional().nullable(),
  profile_image_url: z.string().optional().nullable(),
  hero_heading: z.string().optional().nullable(),
  hero_subtitle: z.string().optional().nullable(),
  hero_description: z.string().optional().nullable(),
  hero_cta_text: z.string().optional().nullable(),
  hero_cta_url: z.string().optional().nullable(),
  hero_secondary_cta_text: z.string().optional().nullable(),
  hero_secondary_cta_url: z.string().optional().nullable(),
})

type ProfileFormData = z.infer<typeof profileSchema>

interface ProfileFormProps {
  profile: Profile | null
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      professional_title: profile?.professional_title || '',
      tagline: profile?.tagline || '',
      about_me: profile?.about_me || '',
      location: profile?.location || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      website: profile?.website || '',
      github_url: profile?.github_url || '',
      linkedin_url: profile?.linkedin_url || '',
      profile_image_url: profile?.profile_image_url || '',
      hero_heading: profile?.hero_heading || '',
      hero_subtitle: profile?.hero_subtitle || '',
      hero_description: profile?.hero_description || '',
      hero_cta_text: profile?.hero_cta_text || '',
      hero_cta_url: profile?.hero_cta_url || '',
      hero_secondary_cta_text: profile?.hero_secondary_cta_text || '',
      hero_secondary_cta_url: profile?.hero_secondary_cta_url || '',
    },
  })

  const onSubmit = (data: ProfileFormData) => {
    startTransition(async () => {
      const sanitizedData = {
        ...data,
        full_name: data.full_name.trim(),
        professional_title: data.professional_title.trim(),
      }
      const result = await upsertProfile(sanitizedData)
      if (result.success) {
        toast({
          title: 'Profile updated',
          description: result.message || 'Your profile has been saved successfully.',
          variant: 'success' as any,
        })
      } else {
        toast({
          title: 'Failed to save profile',
          description: result.error || 'An unexpected error occurred while saving profile.',
          variant: 'destructive',
        })
      }
    })
  }

  const onInvalid = (formErrors: any) => {
    const errorKeys = Object.keys(formErrors)
    if (errorKeys.length > 0) {
      const firstError = formErrors[errorKeys[0]]
      const fieldLabel = errorKeys[0].replace(/_/g, ' ')
      toast({
        title: 'Validation Error',
        description:
          firstError?.message ||
          `Please check the ${fieldLabel} field and fix any errors before saving.`,
        variant: 'destructive',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-10">
      {/* Personal Information */}
      <section className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Personal Information</h2>
          <p className="text-sm text-muted-foreground">
            Basic details displayed throughout your portfolio
          </p>
        </div>

        {/* Profile Image Upload & Management */}
        <ProfileImageUpload
          currentImageUrl={watch('profile_image_url')}
          fullName={watch('full_name') || profile?.full_name || 'Your Name'}
          onImageChange={(newUrl) => {
            setValue('profile_image_url', newUrl, { shouldDirty: true })
          }}
        />

        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            label="Full Name"
            htmlFor="full_name"
            required
            error={errors.full_name?.message}
          >
            <Input
              id="full_name"
              placeholder="Your full name"
              {...register('full_name')}
            />
          </FormField>

          <FormField
            label="Professional Title"
            htmlFor="professional_title"
            required
            error={errors.professional_title?.message}
          >
            <Input
              id="professional_title"
              placeholder="e.g. AI & Machine Learning Engineer"
              {...register('professional_title')}
            />
          </FormField>

          <FormField
            label="Tagline"
            htmlFor="tagline"
            description="A short memorable phrase about you"
            error={errors.tagline?.message}
          >
            <Input
              id="tagline"
              placeholder="e.g. Building intelligent systems"
              {...register('tagline')}
            />
          </FormField>

          <FormField
            label="Location"
            htmlFor="location"
            error={errors.location?.message}
          >
            <Input
              id="location"
              placeholder="e.g. Colombo, Sri Lanka"
              {...register('location')}
            />
          </FormField>

          <FormField
            label="Email"
            htmlFor="email"
            error={errors.email?.message}
          >
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              {...register('email')}
            />
          </FormField>

          <FormField
            label="Phone"
            htmlFor="phone"
            error={errors.phone?.message}
          >
            <Input
              id="phone"
              placeholder="+1 234 567 8900"
              {...register('phone')}
            />
          </FormField>

          <FormField
            label="Website"
            htmlFor="website"
            className="md:col-span-2"
            error={errors.website?.message}
          >
            <Input
              id="website"
              placeholder="https://yourwebsite.com"
              {...register('website')}
            />
          </FormField>
        </div>

        <FormField
          label="About Me"
          htmlFor="about_me"
          description="Detailed description of yourself (use new lines for paragraphs)"
          error={errors.about_me?.message}
        >
          <Textarea
            id="about_me"
            placeholder="Write about yourself, your background, interests, and goals..."
            className="min-h-[180px]"
            {...register('about_me')}
          />
        </FormField>
      </section>

      {/* Social Links */}
      <section className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Social Links</h2>
          <p className="text-sm text-muted-foreground">
            Links displayed in the navigation and footer
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            label="GitHub URL"
            htmlFor="github_url"
            error={errors.github_url?.message}
          >
            <Input
              id="github_url"
              placeholder="https://github.com/username"
              {...register('github_url')}
            />
          </FormField>

          <FormField
            label="LinkedIn URL"
            htmlFor="linkedin_url"
            error={errors.linkedin_url?.message}
          >
            <Input
              id="linkedin_url"
              placeholder="https://linkedin.com/in/username"
              {...register('linkedin_url')}
            />
          </FormField>
        </div>
      </section>

      {/* Hero Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Hero Section</h2>
          <p className="text-sm text-muted-foreground">
            Content displayed in the main hero area at the top of your portfolio
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            label="Hero Heading"
            htmlFor="hero_heading"
            description="Leave blank to use 'Hi, I'm [Name]'"
            error={errors.hero_heading?.message}
          >
            <Input
              id="hero_heading"
              placeholder="Hi, I'm Your Name"
              {...register('hero_heading')}
            />
          </FormField>

          <FormField
            label="Typewriter Text / Subtitle"
            htmlFor="hero_subtitle"
            description="Text shown with typewriter effect (e.g. 'AI & ML Engineer')"
            error={errors.hero_subtitle?.message}
          >
            <Input
              id="hero_subtitle"
              placeholder="AI & Machine Learning Engineer"
              {...register('hero_subtitle')}
            />
          </FormField>

          <FormField
            label="Primary CTA Text"
            htmlFor="hero_cta_text"
            error={errors.hero_cta_text?.message}
          >
            <Input
              id="hero_cta_text"
              placeholder="View My Work"
              {...register('hero_cta_text')}
            />
          </FormField>

          <FormField
            label="Primary CTA URL"
            htmlFor="hero_cta_url"
            error={errors.hero_cta_url?.message}
          >
            <Input
              id="hero_cta_url"
              placeholder="#projects"
              {...register('hero_cta_url')}
            />
          </FormField>

          <FormField
            label="Secondary CTA Text"
            htmlFor="hero_secondary_cta_text"
            error={errors.hero_secondary_cta_text?.message}
          >
            <Input
              id="hero_secondary_cta_text"
              placeholder="Download CV"
              {...register('hero_secondary_cta_text')}
            />
          </FormField>
        </div>

        <FormField
          label="Hero Description"
          htmlFor="hero_description"
          description="Paragraph below your headline"
          error={errors.hero_description?.message}
        >
          <Textarea
            id="hero_description"
            placeholder="Passionate about building intelligent systems..."
            className="min-h-[100px]"
            {...register('hero_description')}
          />
        </FormField>
      </section>

      {/* Save button */}
      <div className="flex justify-end pt-4 border-t border-border/50">
        <Button
          type="submit"
          variant="gradient"
          size="lg"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Profile
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
