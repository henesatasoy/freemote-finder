import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const fetchFavorites = async () => {
    try {
      // For now, use localStorage for anonymous users
      const storedFavorites = localStorage.getItem('job_favorites')
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites))
      }
    } catch (error) {
      console.error('Error fetching favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = async (jobId: string) => {
    try {
      const newFavorites = favorites.includes(jobId)
        ? favorites.filter(id => id !== jobId)
        : [...favorites, jobId]
      
      setFavorites(newFavorites)
      localStorage.setItem('job_favorites', JSON.stringify(newFavorites))
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const getFavoriteJobs = async () => {
    try {
      if (favorites.length === 0) return []
      
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .in('id', favorites)
        .order('published_date', { ascending: false })

      if (error) throw error
      return (data || []) as any[]
    } catch (error) {
      console.error('Error fetching favorite jobs:', error)
      return []
    }
  }

  useEffect(() => {
    fetchFavorites()
  }, [])

  return {
    favorites,
    loading,
    toggleFavorite,
    getFavoriteJobs
  }
}