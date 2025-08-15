import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const testJobs = [
      {
        title: 'React Developer',
        company: 'Tech Solutions',
        location: 'Remote',
        description: 'React ve TypeScript ile modern web uygulamaları geliştirme. 3+ yıl deneyim gereken senior pozisyon.',
        language: 'tr',
        diploma_required: false,
        source: 'Test',
        apply_url: 'https://example.com/job/react-dev-1',
        published_date: new Date().toISOString(),
        tags: ['react', 'typescript', 'frontend'],
        sector: 'technology'
      },
      {
        title: 'Full Stack Developer',
        company: 'StartupCorp',
        location: 'Remote',
        description: 'Join our team to build amazing applications with Node.js, React, and MongoDB. University degree required.',
        language: 'en',
        diploma_required: true,
        source: 'Test',
        apply_url: 'https://example.com/job/fullstack-1',
        published_date: new Date().toISOString(),
        tags: ['nodejs', 'react', 'mongodb', 'fullstack'],
        sector: 'technology'
      },
      {
        title: 'UI/UX Designer',
        company: 'Design Studio',
        location: 'İstanbul / Remote',
        description: 'Kullanıcı deneyimi ve arayüz tasarımında uzman tasarımcı. Figma ve Adobe Creative Suite bilgisi gerekli.',
        language: 'both',
        diploma_required: false,
        source: 'Test',
        apply_url: 'https://example.com/job/designer-1',
        published_date: new Date().toISOString(),
        tags: ['design', 'figma', 'ui', 'ux'],
        sector: 'design'
      },
      {
        title: 'Marketing Specialist',
        company: 'Growth Co',
        location: 'Remote',
        description: 'Digital marketing campaigns and SEO optimization. Social media management experience preferred.',
        language: 'en',
        diploma_required: false,
        source: 'Test',
        apply_url: 'https://example.com/job/marketing-1',
        published_date: new Date().toISOString(),
        tags: ['marketing', 'seo', 'social media'],
        sector: 'marketing'
      },
      {
        title: 'Python Developer',
        company: 'Data Analytics Inc',
        location: 'Remote',
        description: 'Backend development with Python and Django. Experience with data analysis and machine learning is a plus.',
        language: 'en',
        diploma_required: true,
        source: 'Test',
        apply_url: 'https://example.com/job/python-1',
        published_date: new Date().toISOString(),
        tags: ['python', 'django', 'backend', 'data'],
        sector: 'technology'
      }
    ]

    const { data, error } = await supabaseClient
      .from('jobs')
      .upsert(testJobs, { onConflict: 'apply_url' })

    if (error) {
      console.error('Error inserting jobs:', error)
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ 
        message: 'Test jobs added successfully', 
        count: testJobs.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})