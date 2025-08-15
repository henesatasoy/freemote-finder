import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Job, JobFilters } from '@/types/job'

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('published_date', { ascending: false })

      if (error) throw error
      setJobs((data || []) as Job[])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const searchJobs = async (filters: JobFilters) => {
    try {
      setLoading(true)
      let query = supabase.from('jobs').select('*')

      // Dil filtresi
      if (filters.language !== 'all') {
        if (filters.language === 'both') {
          query = query.eq('language', 'both')
        } else {
          query = query.in('language', [filters.language, 'both'])
        }
      }

      // Diploma şartı filtresi
      if (filters.diploma_required === 'required') {
        query = query.eq('diploma_required', true)
      } else if (filters.diploma_required === 'not_required') {
        query = query.eq('diploma_required', false)
      }

      // Sektör filtresi
      if (filters.sector) {
        query = query.eq('sector', filters.sector)
      }

      // Arama filtresi
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,company.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      query = query.order('published_date', { ascending: false })

      const { data, error } = await query

      if (error) throw error
      setJobs((data || []) as Job[])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Arama sırasında hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  return {
    jobs,
    loading,
    error,
    fetchJobs,
    searchJobs
  }
}