export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          professional_title: string
          tagline: string | null
          about_me: string | null
          location: string | null
          email: string | null
          phone: string | null
          website: string | null
          github_url: string | null
          linkedin_url: string | null
          profile_image_url: string | null
          hero_heading: string | null
          hero_subtitle: string | null
          hero_description: string | null
          hero_cta_text: string | null
          hero_cta_url: string | null
          hero_secondary_cta_text: string | null
          hero_secondary_cta_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          professional_title: string
          tagline?: string | null
          about_me?: string | null
          location?: string | null
          email?: string | null
          phone?: string | null
          website?: string | null
          github_url?: string | null
          linkedin_url?: string | null
          profile_image_url?: string | null
          hero_heading?: string | null
          hero_subtitle?: string | null
          hero_description?: string | null
          hero_cta_text?: string | null
          hero_cta_url?: string | null
          hero_secondary_cta_text?: string | null
          hero_secondary_cta_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          professional_title?: string
          tagline?: string | null
          about_me?: string | null
          location?: string | null
          email?: string | null
          phone?: string | null
          website?: string | null
          github_url?: string | null
          linkedin_url?: string | null
          profile_image_url?: string | null
          hero_heading?: string | null
          hero_subtitle?: string | null
          hero_description?: string | null
          hero_cta_text?: string | null
          hero_cta_url?: string | null
          hero_secondary_cta_text?: string | null
          hero_secondary_cta_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      education: {
        Row: {
          id: string
          institution: string
          degree: string
          field_of_study: string | null
          start_date: string | null
          end_date: string | null
          is_current: boolean
          description: string | null
          grade: string | null
          logo_url: string | null
          location: string | null
          relevant_coursework: string[] | null
          achievements: string[] | null
          is_visible: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          institution: string
          degree: string
          field_of_study?: string | null
          start_date?: string | null
          end_date?: string | null
          is_current?: boolean
          description?: string | null
          grade?: string | null
          logo_url?: string | null
          location?: string | null
          relevant_coursework?: string[] | null
          achievements?: string[] | null
          is_visible?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          institution?: string
          degree?: string
          field_of_study?: string | null
          start_date?: string | null
          end_date?: string | null
          is_current?: boolean
          description?: string | null
          grade?: string | null
          logo_url?: string | null
          location?: string | null
          relevant_coursework?: string[] | null
          achievements?: string[] | null
          is_visible?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      qualifications: {
        Row: {
          id: string
          name: string
          institution: string | null
          issuing_organization: string | null
          issue_date: string | null
          description: string | null
          certificate_url: string | null
          credential_id: string | null
          logo_url: string | null
          is_visible: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          institution?: string | null
          issuing_organization?: string | null
          issue_date?: string | null
          description?: string | null
          certificate_url?: string | null
          credential_id?: string | null
          logo_url?: string | null
          is_visible?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          institution?: string | null
          issuing_organization?: string | null
          issue_date?: string | null
          description?: string | null
          certificate_url?: string | null
          credential_id?: string | null
          logo_url?: string | null
          is_visible?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      skill_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          display_order: number
          is_visible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          display_order?: number
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          display_order?: number
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          id: string
          category_id: string
          name: string
          level: number | null
          icon_url: string | null
          years_of_experience: number | null
          description: string | null
          display_order: number
          is_visible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id: string
          name: string
          level?: number | null
          icon_url?: string | null
          years_of_experience?: number | null
          description?: string | null
          display_order?: number
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          name?: string
          level?: number | null
          icon_url?: string | null
          years_of_experience?: number | null
          description?: string | null
          display_order?: number
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          title: string
          slug: string
          short_description: string | null
          full_description: string | null
          image_url: string | null
          category: string | null
          technologies: string[] | null
          github_url: string | null
          live_url: string | null
          documentation_url: string | null
          paper_url: string | null
          start_date: string | null
          end_date: string | null
          status: string | null
          is_featured: boolean
          is_visible: boolean
          display_order: number
          key_features: string[] | null
          challenges: string | null
          solutions: string | null
          results: string | null
          my_role: string | null
          team_info: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          short_description?: string | null
          full_description?: string | null
          image_url?: string | null
          category?: string | null
          technologies?: string[] | null
          github_url?: string | null
          live_url?: string | null
          documentation_url?: string | null
          paper_url?: string | null
          start_date?: string | null
          end_date?: string | null
          status?: string | null
          is_featured?: boolean
          is_visible?: boolean
          display_order?: number
          key_features?: string[] | null
          challenges?: string | null
          solutions?: string | null
          results?: string | null
          my_role?: string | null
          team_info?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          short_description?: string | null
          full_description?: string | null
          image_url?: string | null
          category?: string | null
          technologies?: string[] | null
          github_url?: string | null
          live_url?: string | null
          documentation_url?: string | null
          paper_url?: string | null
          start_date?: string | null
          end_date?: string | null
          status?: string | null
          is_featured?: boolean
          is_visible?: boolean
          display_order?: number
          key_features?: string[] | null
          challenges?: string | null
          solutions?: string | null
          results?: string | null
          my_role?: string | null
          team_info?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_images: {
        Row: {
          id: string
          project_id: string
          image_url: string
          caption: string | null
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          image_url: string
          caption?: string | null
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          image_url?: string
          caption?: string | null
          display_order?: number
          created_at?: string
        }
        Relationships: []
      }
      research: {
        Row: {
          id: string
          title: string
          abstract: string | null
          research_area: string | null
          research_question: string | null
          methodology: string | null
          technologies: string[] | null
          publication_status: string | null
          conference_journal: string | null
          publication_date: string | null
          paper_url: string | null
          doi: string | null
          github_url: string | null
          dataset_url: string | null
          image_url: string | null
          description: string | null
          is_visible: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          abstract?: string | null
          research_area?: string | null
          research_question?: string | null
          methodology?: string | null
          technologies?: string[] | null
          publication_status?: string | null
          conference_journal?: string | null
          publication_date?: string | null
          paper_url?: string | null
          doi?: string | null
          github_url?: string | null
          dataset_url?: string | null
          image_url?: string | null
          description?: string | null
          is_visible?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          abstract?: string | null
          research_area?: string | null
          research_question?: string | null
          methodology?: string | null
          technologies?: string[] | null
          publication_status?: string | null
          conference_journal?: string | null
          publication_date?: string | null
          paper_url?: string | null
          doi?: string | null
          github_url?: string | null
          dataset_url?: string | null
          image_url?: string | null
          description?: string | null
          is_visible?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      certifications: {
        Row: {
          id: string
          name: string
          issuing_organization: string
          issue_date: string | null
          expiry_date: string | null
          credential_id: string | null
          credential_url: string | null
          image_url: string | null
          description: string | null
          is_visible: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          issuing_organization: string
          issue_date?: string | null
          expiry_date?: string | null
          credential_id?: string | null
          credential_url?: string | null
          image_url?: string | null
          description?: string | null
          is_visible?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          issuing_organization?: string
          issue_date?: string | null
          expiry_date?: string | null
          credential_id?: string | null
          credential_url?: string | null
          image_url?: string | null
          description?: string | null
          is_visible?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      experience: {
        Row: {
          id: string
          job_title: string
          company: string
          company_logo_url: string | null
          employment_type: string | null
          start_date: string | null
          end_date: string | null
          is_current: boolean
          location: string | null
          description: string | null
          responsibilities: string[] | null
          technologies: string[] | null
          achievements: string[] | null
          is_visible: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          job_title: string
          company: string
          company_logo_url?: string | null
          employment_type?: string | null
          start_date?: string | null
          end_date?: string | null
          is_current?: boolean
          location?: string | null
          description?: string | null
          responsibilities?: string[] | null
          technologies?: string[] | null
          achievements?: string[] | null
          is_visible?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          job_title?: string
          company?: string
          company_logo_url?: string | null
          employment_type?: string | null
          start_date?: string | null
          end_date?: string | null
          is_current?: boolean
          location?: string | null
          description?: string | null
          responsibilities?: string[] | null
          technologies?: string[] | null
          achievements?: string[] | null
          is_visible?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      achievements: {
        Row: {
          id: string
          title: string
          description: string | null
          date: string | null
          organization: string | null
          image_url: string | null
          certificate_url: string | null
          url: string | null
          category: string | null
          is_visible: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          date?: string | null
          organization?: string | null
          image_url?: string | null
          certificate_url?: string | null
          url?: string | null
          category?: string | null
          is_visible?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          date?: string | null
          organization?: string | null
          image_url?: string | null
          certificate_url?: string | null
          url?: string | null
          category?: string | null
          is_visible?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          id: string
          title: string
          description: string | null
          icon: string | null
          is_visible: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          icon?: string | null
          is_visible?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          icon?: string | null
          is_visible?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      social_links: {
        Row: {
          id: string
          platform: string
          url: string
          icon: string | null
          is_visible: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          platform: string
          url: string
          icon?: string | null
          is_visible?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          platform?: string
          url?: string
          icon?: string | null
          is_visible?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: string
          key: string
          value: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          subject: string | null
          message: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          subject?: string | null
          message: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          subject?: string | null
          message?: string
          is_read?: boolean
          created_at?: string
        }
        Relationships: []
      }
      resume: {
        Row: {
          id: string
          file_name: string
          file_url: string
          file_size: number | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          file_name: string
          file_url: string
          file_size?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          file_name?: string
          file_url?: string
          file_size?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
