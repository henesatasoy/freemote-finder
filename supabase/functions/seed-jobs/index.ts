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

// Skip WeWorkRemotely for now and focus on working sources
async function fetchWWRJobs() {
  console.log('Skipping WeWorkRemotely for now due to parsing issues')
  return []
}

// Add more quality test jobs with better variety
function getTestJobs() {
  return [
    {
      title: 'Senior React Developer',
      company: 'Tech Innovation Corp',
      location: 'Remote',
      description: 'We are looking for an experienced React developer to join our growing team. You will work with modern technologies including React, TypeScript, and Node.js. Strong problem-solving skills and 3+ years of experience required. Build scalable web applications and collaborate with cross-functional teams.',
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
      description: 'Kullanıcı deneyimi ve arayüz tasarımında uzman bir tasarımcı arıyoruz. Figma, Adobe Creative Suite ve prototyping araçlarında deneyim sahibi olmalısınız. Modern web ve mobil uygulamalar için tasarım çözümleri geliştireceksiniz.',
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
      description: 'Join our startup team! We need a versatile full-stack developer with experience in both frontend and backend development. University degree preferred but not required if you have strong portfolio. Work with React, Node.js, PostgreSQL, and cloud technologies.',
      salary: '$60,000 - $100,000',
      language: 'both',
      diploma_required: true,
      source: 'Freemote',
      apply_url: 'https://freemote.example.com/jobs/fullstack-1',
      published_date: new Date().toISOString(),
      tags: ['fullstack', 'javascript', 'nodejs', 'react'],
      sector: 'technology'
    },
    {
      title: 'Digital Marketing Manager',
      company: 'Growth Marketing Co',
      location: 'Remote',
      description: 'Lead our digital marketing efforts across multiple channels. Experience with SEO, SEM, social media marketing, and analytics required. Develop and execute marketing campaigns to drive customer acquisition and retention.',
      salary: '$55,000 - $85,000',
      language: 'en',
      diploma_required: false,
      source: 'Freemote',
      apply_url: 'https://freemote.example.com/jobs/marketing-manager-1',
      published_date: new Date().toISOString(),
      tags: ['marketing', 'seo', 'sem', 'analytics'],
      sector: 'marketing'
    },
    {
      title: 'Python Backend Developer',
      company: 'Data Solutions Inc',
      location: 'Remote',
      description: 'Backend development with Python, Django, and FastAPI. Experience with databases, APIs, and cloud platforms required. Work on data processing pipelines and web services for our analytics platform.',
      salary: '$70,000 - $110,000',
      language: 'en',
      diploma_required: true,
      source: 'Freemote',
      apply_url: 'https://freemote.example.com/jobs/python-backend-1',
      published_date: new Date().toISOString(),
      tags: ['python', 'django', 'fastapi', 'backend'],
      sector: 'technology'
    },
    {
      title: 'DevOps Engineer',
      company: 'Cloud Infrastructure Ltd',
      location: 'Remote',
      description: 'Manage and optimize our cloud infrastructure on AWS. Experience with Docker, Kubernetes, Terraform, and CI/CD pipelines required. Help scale our applications and improve deployment processes.',
      salary: '$75,000 - $115,000',
      language: 'en',
      diploma_required: false,
      source: 'Freemote',
      apply_url: 'https://freemote.example.com/jobs/devops-1',
      published_date: new Date().toISOString(),
      tags: ['devops', 'aws', 'docker', 'kubernetes'],
      sector: 'devops'
    },
    {
      title: 'Product Manager',
      company: 'SaaS Startup',
      location: 'Remote',
      description: 'Drive product strategy and roadmap for our B2B SaaS platform. Work closely with engineering, design, and sales teams. Experience with agile methodologies and user research required.',
      salary: '$90,000 - $130,000',
      language: 'en',
      diploma_required: true,
      source: 'Freemote',
      apply_url: 'https://freemote.example.com/jobs/product-manager-1',
      published_date: new Date().toISOString(),
      tags: ['product', 'saas', 'agile', 'strategy'],
      sector: 'product'
    },
    {
      title: 'Data Scientist',
      company: 'Analytics Pro',
      location: 'Remote',
      description: 'Apply machine learning and statistical analysis to solve business problems. Experience with Python, R, SQL, and data visualization tools required. Work with large datasets and build predictive models.',
      salary: '$85,000 - $125,000',
      language: 'en',
      diploma_required: true,
      source: 'Freemote',
      apply_url: 'https://freemote.example.com/jobs/data-scientist-1',
      published_date: new Date().toISOString(),
      tags: ['data', 'python', 'ml', 'analytics'],
      sector: 'data'
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

    // Fetch from working sources only
    const [remoteOKJobs, testJobs] = await Promise.all([
      fetchRemoteOKJobs(),
      getTestJobs()
    ])

    // Combine all jobs
    const allJobs = [...remoteOKJobs, ...testJobs]
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
          wwr: 0, // Disabled for now
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