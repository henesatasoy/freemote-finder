import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Language detection function
function detectLanguage(text: string): 'tr' | 'en' | 'both' {
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
function checkDiplomaRequirement(text: string): boolean {
  const diplomaKeywords = [
    'bachelor', 'master', 'phd', 'degree', 'university', 'college',
    'lisans', 'üniversite', 'mezunu', 'yüksek lisans', 'doktora'
  ]
  
  const lowerText = text.toLowerCase()
  return diplomaKeywords.some(keyword => lowerText.includes(keyword))
}

// Sector detection
function detectSector(title: string, tags: string[]): string {
  const titleLower = title.toLowerCase()
  const allTags = tags.map(tag => tag.toLowerCase())
  
  if (titleLower.includes('design') || titleLower.includes('ui') || titleLower.includes('ux')) {
    return 'design'
  }
  if (titleLower.includes('market') || titleLower.includes('sales')) {
    return 'marketing'
  }
  if (titleLower.includes('data') || titleLower.includes('analytics')) {
    return 'data'
  }
  
  return 'technology'
}

// Create some sample jobs for testing
function createSampleJobs() {
  return [
    {
      title: 'Frontend Developer',
      company: 'Tech Company',
      location: 'Remote',
      description: 'We are looking for a skilled Frontend Developer to join our team. Experience with React, TypeScript, and modern web technologies required.',
      salary: '$60,000 - $90,000',
      language: 'en',
      diploma_required: false,
      source: 'Sample',
      apply_url: 'https://example.com/jobs/frontend-1',
      published_date: new Date().toISOString(),
      tags: ['react', 'typescript', 'frontend'],
      sector: 'technology'
    },
    {
      title: 'Backend Developer',
      company: 'Software Inc',
      location: 'Remote',
      description: 'Join our backend team! Looking for Node.js and Python developers with database experience.',
      salary: '$70,000 - $100,000',
      language: 'en',
      diploma_required: false,
      source: 'Sample',
      apply_url: 'https://example.com/jobs/backend-1',
      published_date: new Date().toISOString(),
      tags: ['nodejs', 'python', 'backend'],
      sector: 'technology'
    },
    {
      title: 'UI/UX Designer',
      company: 'Design Studio',
      location: 'Remote',
      description: 'Creative UI/UX Designer needed for digital products. Figma and Adobe Suite experience required.',
      salary: '$50,000 - $80,000',
      language: 'en',
      diploma_required: false,
      source: 'Sample',
      apply_url: 'https://example.com/jobs/designer-1',
      published_date: new Date().toISOString(),
      tags: ['design', 'figma', 'ui', 'ux'],
      sector: 'design'
    },
    {
      title: 'Full Stack Developer',
      company: 'Startup Co',
      location: 'Remote',
      description: 'Versatile Full Stack Developer for our growing startup. React, Node.js, and database skills needed.',
      salary: '$65,000 - $95,000',
      language: 'en',
      diploma_required: true,
      source: 'Sample',
      apply_url: 'https://example.com/jobs/fullstack-1',
      published_date: new Date().toISOString(),
      tags: ['react', 'nodejs', 'fullstack'],
      sector: 'technology'
    },
    {
      title: 'DevOps Engineer',
      company: 'Cloud Corp',
      location: 'Remote',
      description: 'DevOps Engineer to manage our cloud infrastructure. AWS, Docker, and Kubernetes experience preferred.',
      salary: '$75,000 - $110,000',
      language: 'en',
      diploma_required: false,
      source: 'Sample',
      apply_url: 'https://example.com/jobs/devops-1',
      published_date: new Date().toISOString(),
      tags: ['devops', 'aws', 'docker'],
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

    // Clear existing jobs first
    console.log('Clearing existing jobs...')
    const { error: deleteError } = await supabaseClient
      .from('jobs')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')

    if (deleteError) {
      console.error('Error clearing jobs:', deleteError)
    }

    // For now, use sample jobs to ensure the system works
    const sampleJobs = createSampleJobs()
    console.log(`Created ${sampleJobs.length} sample jobs`)

    // Save to database
    const { data, error } = await supabaseClient
      .from('jobs')
      .insert(sampleJobs)

    if (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Sample jobs saved successfully to database')
    
    return new Response(
      JSON.stringify({ 
        message: 'Sample jobs created successfully', 
        count: sampleJobs.length,
        source: 'Sample Data'
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