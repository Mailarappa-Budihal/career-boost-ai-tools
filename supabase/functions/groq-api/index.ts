
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { tool_type, user_input, job_description } = await req.json()
    
    // Validate input
    if (!tool_type || !user_input) {
      throw new Error('Missing required parameters: tool_type and user_input')
    }
    
    // Get GROQ API key from environment
    const groqApiKey = Deno.env.get('GROQ_API_KEY')
    if (!groqApiKey) {
      throw new Error('GROQ API key not configured')
    }

    // Get user from auth header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    // Define prompts for different tools
    const prompts = {
      portfolio: `You are an expert web developer helping early-career engineers create professional portfolios. 

Based on the following resume/information, generate a complete HTML portfolio website structure with embedded CSS.

User Information:
${user_input}

Requirements:
1. Create a single, responsive HTML file with embedded CSS
2. Include sections: Header, About, Skills, Projects, Experience, Contact
3. Use modern, clean design with professional colors
4. Make it mobile-responsive
5. Include placeholder content where information is missing
6. Use semantic HTML structure
7. Add smooth scrolling and hover effects

Generate only the HTML code with embedded CSS, no explanations.`,

      resume_analyzer: `You are an expert ATS (Applicant Tracking System) specialist and career counselor.

Analyze the following resume against the job description and provide detailed feedback.

Resume Content:
${user_input}

${job_description ? `Job Description:\n${job_description}` : ''}

Provide your analysis with:
1. An ATS compatibility score (0-100)
2. Specific areas for improvement
3. Missing keywords ${job_description ? 'from the job description' : ''}
4. Formatting and structure feedback
5. Actionable recommendations

Format your response as a structured analysis with clear sections.`,

      cover_letter: `You are an expert career counselor specializing in cover letter writing.

Write a professional, tailored cover letter based on:

Resume/Background:
${user_input}

${job_description ? `Target Job Description:\n${job_description}` : ''}

Requirements:
1. Professional business format
2. 3-4 paragraphs maximum
3. Highlight relevant experience from the resume
4. ${job_description ? 'Address specific requirements from the job description' : 'Focus on general professional strengths'}
5. Show enthusiasm for the role${job_description ? ' and company' : ''}
6. Include a strong opening and closing

Generate only the cover letter text, no additional formatting or explanations.`,

      resume_enhancer: `You are an expert resume writer and career counselor.

Enhance the following resume content:

Current Resume:
${user_input}

${job_description ? `Target Job Description:\n${job_description}` : ''}

Requirements:
1. Optimize keywords for ATS compatibility
2. Strengthen bullet points with quantifiable achievements
3. Reorder and emphasize relevant experience
4. Improve action verbs and impact statements
5. Maintain truthfulness while maximizing appeal
6. Keep the same general structure and format

Provide the enhanced resume content in a clean, professional format.`,

      mock_interview: `You are an expert interviewer conducting a mock interview session.

Based on the following information, generate relevant interview questions:

${job_description ? `Job Information:\n${job_description}` : `Professional Background:\n${user_input}`}

Requirements:
1. Generate 5 relevant interview questions
2. Mix of behavioral and technical questions appropriate for the role
3. Include follow-up prompts for deeper discussion
4. Focus on real-world scenarios
5. Progressive difficulty from basic to advanced

Format each question clearly with the question type and potential follow-up.`
    }

    const prompt = prompts[tool_type as keyof typeof prompts]
    if (!prompt) {
      throw new Error('Invalid tool type')
    }

    console.log('Making request to Groq API with model: llama-3.1-70b-versatile')

    // Call Groq API with corrected request format
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        model: 'llama-3.1-70b-versatile',
        temperature: 0.7,
        max_tokens: 4000,
        top_p: 1,
        stream: false
      }),
    })

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text()
      console.error(`Groq API error: ${groqResponse.status} ${groqResponse.statusText}`, errorText)
      throw new Error(`Groq API error: ${groqResponse.status} ${groqResponse.statusText}`)
    }

    const groqData = await groqResponse.json()
    
    if (!groqData.choices || !groqData.choices[0] || !groqData.choices[0].message) {
      console.error('Invalid response structure from Groq:', groqData)
      throw new Error('Invalid response from AI service')
    }

    const aiResponse = groqData.choices[0].message.content

    // Log usage
    await supabaseClient
      .from('usage_logs')
      .insert({
        user_id: user.id,
        tool_type,
        tokens_used: groqData.usage?.total_tokens || 0,
        success: true
      })

    console.log('Successfully processed request for tool:', tool_type)

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: aiResponse,
        tokens_used: groqData.usage?.total_tokens || 0
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )

  } catch (error) {
    console.error('Error in groq-api function:', error)
    
    // Try to log failed usage if we have user context
    try {
      const authHeader = req.headers.get('Authorization')
      if (authHeader) {
        const supabaseClient = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        )
        const { data: { user } } = await supabaseClient.auth.getUser(
          authHeader.replace('Bearer ', '')
        )
        if (user) {
          const { tool_type } = await req.json().catch(() => ({}))
          await supabaseClient
            .from('usage_logs')
            .insert({
              user_id: user.id,
              tool_type: tool_type || 'unknown',
              tokens_used: 0,
              success: false
            })
        }
      }
    } catch (logError) {
      console.error('Failed to log usage:', logError)
    }

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
