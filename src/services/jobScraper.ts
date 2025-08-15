import { supabase } from '@/integrations/supabase/client'

// Job data scraping and API integration service
export class JobScraperService {
  
  // RemoteOK API integration
  static async fetchRemoteOKJobs() {
    try {
      const response = await fetch('https://remoteok.com/api')
      const data = await response.json()
      
      // Skip first element (metadata)
      const jobs = data.slice(1).map((job: any) => ({
        title: job.position || '',
        company: job.company || '',
        location: 'Remote',
        description: job.description || '',
        salary: job.salary_max ? `$${job.salary_min || 0} - $${job.salary_max}` : undefined,
        language: this.detectLanguage(job.description || ''),
        diploma_required: this.checkDiplomaRequirement(job.description || ''),
        source: 'RemoteOK',
        apply_url: job.url || '',
        published_date: new Date(job.date).toISOString().split('T')[0],
        tags: job.tags || [],
        sector: this.detectSector(job.position || '', job.tags || [])
      }))
      
      return jobs
    } catch (error) {
      console.error('RemoteOK fetch error:', error)
      return []
    }
  }

  // WeWorkRemotely RSS feed integration
  static async fetchWWRJobs() {
    try {
      // This would require a CORS proxy or backend processing
      // For now, return mock data structure
      return []
    } catch (error) {
      console.error('WWR fetch error:', error)
      return []
    }
  }

  // Language detection
  static detectLanguage(text: string): 'tr' | 'en' | 'both' {
    const turkishWords = ['türkçe', 'türkiye', 'istanbul', 'ankara', 'izmir']
    const englishWords = ['english', 'native', 'fluent', 'global']
    
    const lowerText = text.toLowerCase()
    const hasTurkish = turkishWords.some(word => lowerText.includes(word))
    const hasEnglish = englishWords.some(word => lowerText.includes(word))
    
    if (hasTurkish && hasEnglish) return 'both'
    if (hasTurkish) return 'tr'
    return 'en'
  }

  // Diploma requirement detection
  static checkDiplomaRequirement(text: string): boolean {
    const diplomaKeywords = [
      'bachelor', 'master', 'phd', 'degree', 'university',
      'lisans', 'üniversite', 'mezunu', 'yüksek lisans', 'doktora'
    ]
    
    const lowerText = text.toLowerCase()
    return diplomaKeywords.some(keyword => lowerText.includes(keyword))
  }

  // Sector detection
  static detectSector(title: string, tags: string[]): string {
    const titleLower = title.toLowerCase()
    const allTags = tags.map(tag => tag.toLowerCase())
    
    if (titleLower.includes('design') || allTags.some(tag => ['design', 'ui', 'ux'].includes(tag))) {
      return 'design'
    }
    if (titleLower.includes('market') || allTags.some(tag => ['marketing', 'seo', 'sem'].includes(tag))) {
      return 'marketing'
    }
    if (allTags.some(tag => ['react', 'javascript', 'python', 'java'].includes(tag))) {
      return 'technology'
    }
    
    return 'technology' // Default
  }

  // Save jobs to Supabase
  static async saveJobsToDatabase(jobs: any[]) {
    try {
      const { error } = await supabase
        .from('jobs')
        .upsert(jobs, { onConflict: 'apply_url' })
      
      if (error) throw error
      
      console.log(`${jobs.length} jobs saved to database`)
    } catch (error) {
      console.error('Error saving jobs:', error)
    }
  }

  // Main scraping function
  static async scrapeAllJobs() {
    try {
      const remoteOKJobs = await this.fetchRemoteOKJobs()
      const wwrJobs = await this.fetchWWRJobs()
      
      const allJobs = [...remoteOKJobs, ...wwrJobs]
      
      if (allJobs.length > 0) {
        await this.saveJobsToDatabase(allJobs)
      }
      
      return allJobs
    } catch (error) {
      console.error('Error in scrapeAllJobs:', error)
      return []
    }
  }
}