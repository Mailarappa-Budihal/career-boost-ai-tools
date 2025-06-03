
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useGroqAPI } from '@/hooks/useGroqAPI';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Copy, Download, Loader2, FileText, Target, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ResumeEnhancer = () => {
  const { user } = useAuth();
  const { callGroqAPI, loading } = useGroqAPI();
  const { toast } = useToast();
  const [resumeContent, setResumeContent] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [enhancedResume, setEnhancedResume] = useState('');

  const handleEnhance = async () => {
    if (!resumeContent.trim() || !jobDescription.trim()) {
      return;
    }

    const result = await callGroqAPI('resume_enhancer', resumeContent, jobDescription);
    if (result) {
      setEnhancedResume(result);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(enhancedResume);
      toast({
        title: "Copied!",
        description: "Enhanced resume copied to clipboard",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy to clipboard",
      });
    }
  };

  const downloadAsText = () => {
    const blob = new Blob([enhancedResume], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'enhanced-resume.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto text-center">
          <CardContent className="pt-6">
            <p>Please sign in to use the Resume Enhancer.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">AI Resume Enhancer</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Optimize your resume content for specific job applications with AI-powered enhancements and keyword optimization.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Current Resume
                </CardTitle>
                <CardDescription>
                  Paste your current resume content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste your current resume content here..."
                  value={resumeContent}
                  onChange={(e) => setResumeContent(e.target.value)}
                  className="min-h-[250px]"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Target Job Description
                </CardTitle>
                <CardDescription>
                  Paste the job description you want to optimize for
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste the target job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[200px]"
                />
              </CardContent>
            </Card>

            <Button 
              onClick={handleEnhance}
              disabled={loading || !resumeContent.trim() || !jobDescription.trim()}
              className="w-full bg-gradient-primary hover:opacity-90"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enhancing Resume...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Enhance Resume
                </>
              )}
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Enhanced Resume
              </CardTitle>
              <CardDescription>
                Your optimized resume will appear here
              </CardDescription>
            </CardHeader>
            <CardContent>
              {enhancedResume ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Resume Enhanced</Badge>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                      <Button 
                        size="sm"
                        onClick={downloadAsText}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-6 rounded-lg border max-h-[600px] overflow-auto">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {enhancedResume}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Your enhanced resume will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResumeEnhancer;
