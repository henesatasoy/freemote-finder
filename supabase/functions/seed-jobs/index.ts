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

// Fetch jobs from RemoteOK API
async function fetchRemoteOKJobs() {
  try {
    console.log('Fetching jobs from RemoteOK...')
    const response = await fetch('https://remoteok.com/api')
    
    if (!response.ok) {
      throw new Error(`RemoteOK API error: ${response.status}`)
    }
    
    const data = await response.json()
    console.log(`RemoteOK returned ${data.length} items`)
    
    // Skip first element (metadata) and process jobs
    const jobs = data.slice(1).filter((job: any) => job.position && job.company).map((job: any) => {
      const description = job.description || ''
      const tags = Array.isArray(job.tags) ? job.tags : []
      
      return {
        title: job.position.trim(),
        company: job.company.trim(),
        location: 'Remote',
        description: description,
        salary: job.salary_max ? `$${job.salary_min || 0} - $${job.salary_max}` : null,
        language: detectLanguage(description + ' ' + job.position),
        diploma_required: checkDiplomaRequirement(description),
        source: 'RemoteOK',
        apply_url: job.url || `https://remoteok.com/remote-jobs/${job.id}`,
        published_date: job.date ? new Date(job.date * 1000).toISOString() : new Date().toISOString(),
        tags: tags,
        sector: detectSector(job.position, tags)
      }
    })
    
    console.log(`Processed ${jobs.length} jobs from RemoteOK`)
    return jobs
  } catch (error) {
    console.error('RemoteOK fetch error:', error)
    return []
  }
}

// Fetch jobs from WeWorkRemotely (RSS feed)
async function fetchWWRJobs() {
  try {
    console.log('Fetching jobs from WeWorkRemotely...')
    // WWR RSS feed
    const response = await fetch('https://weworkremotely.com/remote-jobs.rss')
    
    if (!response.ok) {
      throw new Error(`WWR RSS error: ${response.status}`)
    }
    
    const text = await response.text()
    
    // Simple RSS parsing
    const items = text.match(/<item>(.*?)<\/item>/gs) || []
    console.log(`Found ${items.length} items in WWR RSS`)
    
    const jobs = items.slice(0, 20).map((item, index) => {
      const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] || `Job ${index + 1}`
      const link = item.match(/<link>(.*?)<\/link>/)?.[1] || ''
      const description = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)?.[1] || ''
      const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || ''
      
      // Extract company from title (usually in format "Company: Job Title")
      const titleParts = title.split(':')
      const company = titleParts.length > 1 ? titleParts[0].trim() : 'WeWorkRemotely'
      const jobTitle = titleParts.length > 1 ? titleParts.slice(1).join(':').trim() : title
      
      return {
        title: jobTitle,
        company: company,
        location: 'Remote',
        description: description.replace(/<[^>]*>/g, '').trim(), // Remove HTML tags
        salary: null,
        language: detectLanguage(description + ' ' + title),
        diploma_required: checkDiplomaRequirement(description),
        source: 'WeWorkRemotely',
        apply_url: link,
        published_date: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        tags: [],
        sector: detectSector(jobTitle, [])
      }
    }).filter(job => job.title && job.apply_url)
    
    console.log(`Processed ${jobs.length} jobs from WeWorkRemotely`)
    return jobs
  } catch (error) {
    console.error('WeWorkRemotely fetch error:', error)
    return []
  }
}

// Add some quality test jobs
function getTestJobs() {
  return [
    {
      title: 'Senior React Developer',
      company: 'Tech Innovation Corp',
      location: 'Remote',
      description: 'We are looking for an experienced React developer to join our growing team. You will work with modern technologies including React, TypeScript, and Node.js. Strong problem-solving skills and 3+ years of experience required.',
      salary: '$80,000 - $120,000',
      language: 'en',
      diploma_required: false,
      source: 'Freemote',
      apply_url: 'https://freemote.example.com/jobs/react-senior-1',
      published_date: new Date().toISOString(),
      tags: ['react', 'typescript', 'javascript', 'frontend'],
      sector: 'technology'
    },
    {
      title: 'UI/UX Tasarımcısı',
      company: 'Dijital Ajans',
      location: 'İstanbul / Remote',
      description: 'Kullanıcı deneyimi ve arayüz tasarımında uzman bir tasarımcı arıyoruz. Figma, Adobe Creative Suite ve prototyping araçlarında deneyim sahibi olmalısınız.',
      salary: '₺45,000 - ₺65,000',
      language: 'tr',
      diploma_required: false,
      source: 'Freemote',
      apply_url: 'https://freemote.example.com/jobs/uiux-designer-1',
      published_date: new Date().toISOString(),
      tags: ['design', 'figma', 'ui', 'ux', 'adobe'],
      sector: 'design'
    },
    {
      title: 'Full Stack Developer',
      company: 'StartupHub',
      location: 'Remote',
      description: 'Join our startup team! We need a versatile full-stack developer with experience in both frontend and backend development. University degree preferred but not required if you have strong portfolio.',
      salary: '$60,000 - $100,000',
      language: 'both',
      diploma_required: true,
      source: 'Freemote',
      apply_url: 'https://freemote.example.com/jobs/fullstack-1',
      published_date: new Date().toISOString(),
      tags: ['fullstack', 'javascript', 'nodejs', 'react'],
      sector: 'technology'
    }
  ]
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

    // Fetch from all sources
    const [remoteOKJobs, wwrJobs, testJobs] = await Promise.all([
      fetchRemoteOKJobs(),
      fetchWWRJobs(), 
      getTestJobs()
    ])

    // Combine all jobs
    const allJobs = [...remoteOKJobs, ...wwrJobs, ...testJobs]
    console.log(`Total jobs collected: ${allJobs.length}`)

    if (allJobs.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No jobs found from any source' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Save to database with upsert
    const { data, error } = await supabaseClient
      .from('jobs')
      .upsert(allJobs, { 
        onConflict: 'apply_url',
        ignoreDuplicates: false 
      })

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
        sources: {
          remoteOK: remoteOKJobs.length,
          wwr: wwrJobs.length,
          test: testJobs.length,
          total: allJobs.length
        }
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