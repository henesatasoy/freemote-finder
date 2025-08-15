import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://your-project.supabase.co'
const supabaseKey = 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types
export interface Database {
  public: {
    Tables: {
      jobs: {
        Row: {
          id: string
          title: string
          company: string
          location: string
          description: string
          salary?: string
          language: 'tr' | 'en' | 'both'
          diploma_required: boolean
          source: string
          apply_url: string
          published_date: string
          tags: string[]
          sector: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          company: string
          location: string
          description: string
          salary?: string
          language: 'tr' | 'en' | 'both'
          diploma_required: boolean
          source: string
          apply_url: string
          published_date: string
          tags: string[]
          sector: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          company?: string
          location?: string
          description?: string
          salary?: string
          language?: 'tr' | 'en' | 'both'
          diploma_required?: boolean
          source?: string
          apply_url?: string
          published_date?: string
          tags?: string[]
          sector?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_favorites: {
        Row: {
          id: string
          user_id: string
          job_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          job_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          job_id?: string
          created_at?: string
        }
      }
    }
  }
}