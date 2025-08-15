import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Language detection function
function detectLanguage(text: string): 'tr' | 'en' | 'both' {
  const turkishWords = ['türkçe', 'türkiye', 'istanbul', 'ankara', 'izmir', 'remote türkiye', 'uzaktan çalışma']
  const englishWords = ['english', 'native', 'fluent', 'global', 'worldwide', 'international']
  
  const lowerText = text.toLowerCase()
  const hasTurkish = turkishWords.some(word => lowerText.includes(word))
  const hasEnglish = englishWords.some(word => lowerText.includes(word))
  
  if (hasTurkish && hasEnglish) return 'both'
  if (hasTurkish) return 'tr'
  return 'en'
}

// Diploma requirement detection
function checkDiplomaRequirement(text: string): boolean {
  const diplomaKeywords = [
    'bachelor', 'master', 'phd', 'degree', 'university', 'college',
    'lisans', 'üniversite', 'mezunu', 'yüksek lisans', 'doktora',
    'university degree', 'bachelor\'s degree', 'master\'s degree'
  ]
  
  const lowerText = text.toLowerCase()
  return diplomaKeywords.some(keyword => lowerText.includes(keyword))
}

// Sector detection
function detectSector(title: string, tags: string[]): string {
  const titleLower = title.toLowerCase()
  const allTags = tags.map(tag => tag.toLowerCase())
  
  // Design & Creative
  if (titleLower.includes('design') || titleLower.includes('ui') || titleLower.includes('ux') || 
      allTags.some(tag => ['design', 'ui', 'ux', 'figma', 'sketch', 'photoshop'].includes(tag))) {
    return 'design'
  }
  
  // Marketing & Sales
  if (titleLower.includes('market') || titleLower.includes('sales') || titleLower.includes('growth') ||
      allTags.some(tag => ['marketing', 'seo', 'sem', 'social', 'sales', 'growth'].includes(tag))) {
    return 'marketing'
  }
  
  // Data & Analytics
  if (titleLower.includes('data') || titleLower.includes('analytics') || titleLower.includes('scientist') ||
      allTags.some(tag => ['data', 'analytics', 'sql', 'python', 'r', 'tableau'].includes(tag))) {
    return 'data'
  }
  
  // DevOps & Infrastructure
  if (titleLower.includes('devops') || titleLower.includes('infrastructure') || titleLower.includes('cloud') ||
      allTags.some(tag => ['devops', 'aws', 'docker', 'kubernetes', 'terraform'].includes(tag))) {
    return 'devops'
  }
  
  // Product Management
  if (titleLower.includes('product') && (titleLower.includes('manager') || titleLower.includes('owner')) ||
      allTags.some(tag => ['product', 'pm', 'roadmap', 'agile'].includes(tag))) {
    return 'product'
  }
  
  // Default to technology
  return 'technology'
}

// Clean and validate text
function cleanText(text: string): string {
  if (!text) return ''
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ') // Multiple spaces to single
    .trim()
}

// Fetch jobs from RemoteOK API
async function fetchRemoteOKJobs() {
  try {
    console.log('Fetching jobs from RemoteOK...')
    const response = await fetch('https://remoteok.com/api', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; JobScraper/1.0)'
      }
    })
    
    if (!response.ok) {
      throw new Error(`RemoteOK API error: ${response.status}`)
    }
    
    const data = await response.json()
    console.log(`RemoteOK returned ${data.length} items`)
    
    // Skip first element (metadata) and process jobs
    const validJobs = data.slice(1)
      .filter((job: any) => {
        // Only include jobs with proper data
        return job && 
               job.position && 
               job.company && 
               job.position.trim().length > 2 &&
               job.company.trim().length > 2 &&
               !job.position.toLowerCase().includes('job ') // Filter out generic titles
      })
      .slice(0, 20) // Limit to 20 jobs
      .map((job: any) => {
        const title = cleanText(job.position)
        const company = cleanText(job.company)
        const description = cleanText(job.description || `Remote ${title} position at ${company}. Apply directly through RemoteOK.`)
        const tags = Array.isArray(job.tags) ? job.tags.filter((tag: any) => tag && typeof tag === 'string') : []
        
        return {
          title: title,
          company: company,
          location: 'Remote',
          description: description.length > 10 ? description : `Remote ${title} position at ${company}. Check RemoteOK for full details.`,
          salary: job.salary_max ? `$${job.salary_min || 0} - $${job.salary_max}` : null,
          language: detectLanguage(description + ' ' + title),
          diploma_required: checkDiplomaRequirement(description),
          source: 'RemoteOK',
          apply_url: job.url || `https://remoteok.com/remote-jobs/${job.id}`,
          published_date: job.date ? new Date(job.date * 1000).toISOString() : new Date().toISOString(),
          tags: tags,
          sector: detectSector(title, tags)
        }
      })
    
    console.log(`Processed ${validJobs.length} valid jobs from RemoteOK`)
    return validJobs
  } catch (error) {
    console.error('RemoteOK fetch error:', error)
    return []
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Starting job scraping process...')
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Clear existing data first
    console.log('Clearing existing jobs...')
    const { error: deleteError } = await supabaseClient
      .from('jobs')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

    if (deleteError) {
      console.error('Error clearing jobs:', deleteError)
    }

    // Fetch only from RemoteOK
    const remoteOKJobs = await fetchRemoteOKJobs()
    console.log(`Total jobs collected: ${remoteOKJobs.length}`)

    if (remoteOKJobs.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No valid jobs found from RemoteOK' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Save to database
    const { data, error } = await supabaseClient
      .from('jobs')
      .insert(remoteOKJobs)

    if (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Jobs saved successfully to database')
    
    return new Response(
      JSON.stringify({ 
        message: 'Jobs scraped and saved successfully', 
        count: remoteOKJobs.length,
        source: 'RemoteOK'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})