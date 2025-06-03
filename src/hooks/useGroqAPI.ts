
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GroqAPIResponse {
  success: boolean;
  data?: string;
  tokens_used?: number;
  error?: string;
}

export const useGroqAPI = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const callGroqAPI = async (
    toolType: string,
    userInput: string,
    jobDescription?: string
  ): Promise<string | null> => {
    setLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Please sign in to use this feature');
      }

      const { data, error } = await supabase.functions.invoke('groq-api', {
        body: {
          tool_type: toolType,
          user_input: userInput,
          job_description: jobDescription,
        },
      });

      if (error) {
        throw error;
      }

      const response = data as GroqAPIResponse;
      
      if (!response.success) {
        throw new Error(response.error || 'API call failed');
      }

      toast({
        title: "Success!",
        description: `Generated content using ${response.tokens_used || 0} tokens`,
      });

      return response.data || null;
      
    } catch (error: any) {
      console.error('Groq API Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || 'Failed to generate content',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    callGroqAPI,
    loading,
  };
};
