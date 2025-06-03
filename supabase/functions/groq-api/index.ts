
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

Analyze the following resume against the job description and provide:
1. An ATS compatibility score (0-100)
2. Specific areas for improvement
3. Missing keywords from the job description
4. Formatting and structure feedback
5. Actionable recommendations

Resume Content:
${user_input}

Job Description:
${job_description}

Provide your analysis in JSON format:
{
  "ats_score": number,
  "missing_keywords": string[],
  "improvements": string[],
  "strengths": string[],
  "recommendations": string[]
}`,

      cover_letter: `You are an expert career counselor specializing in cover letter writing.

Write a professional, tailored cover letter based on:

Resume/Background:
${user_input}

Target Job Description:
${job_description}

Requirements:
1. Professional business format
2. 3-4 paragraphs maximum
3. Highlight relevant experience from the resume
4. Address specific requirements from the job description
5. Show enthusiasm for the role and company
6. Include a strong opening and closing

Generate only the cover letter text, no additional formatting or explanations.`,

      resume_enhancer: `You are an expert resume writer and career counselor.

Enhance the following resume to better match the target job description:

Current Resume:
${user_input}

Target Job Description:
${job_description}

Requirements:
1. Optimize keywords for ATS compatibility
2. Strengthen bullet points with quantifiable achievements
3. Reorder and emphasize relevant experience
4. Improve action verbs and impact statements
5. Maintain truthfulness while maximizing appeal
6. Keep the same general structure and format

Provide the enhanced resume content in a clean, professional format.`,

      mock_interview: `You are an expert technical interviewer conducting a mock interview.

Based on the job role/description provided, generate 5 relevant interview questions:

Job Information:
${job_description || user_input}

Requirements:
1. Mix of behavioral and technical questions
2. Questions appropriate for the role level
3. Include follow-up prompts
4. Focus on real-world scenarios

Provide questions in JSON format:
{
  "questions": [
    {
      "question": "string",
      "type": "behavioral|technical",
      "follow_up": "string"
    }
  ]
}`
    }

    const prompt = prompts[tool_type as keyof typeof prompts]
    if (!prompt) {
      throw new Error('Invalid tool type')
    }

    // Call Groq API
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
      }),
    })

    if (!groqResponse.ok) {
      throw new Error(`Groq API error: ${groqResponse.statusText}`)
    }

    const groqData = await groqResponse.json()
    const aiResponse = groqData.choices[0]?.message?.content

    // Log usage
    await supabaseClient
      .from('usage_logs')
      .insert({
        user_id: user.id,
        tool_type,
        tokens_used: groqData.usage?.total_tokens || 0,
        success: true
      })

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
    console.error('Error:', error)
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
