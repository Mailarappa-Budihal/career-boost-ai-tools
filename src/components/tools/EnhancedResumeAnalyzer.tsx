
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useGroqAPI } from '@/hooks/useGroqAPI';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, Search, FileText, Target, CheckCircle, AlertCircle } from 'lucide-react';

interface AnalysisResult {
  ats_score: number;
  missing_keywords: string[];
  improvements: string[];
  strengths: string[];
  recommendations: string[];
}

const EnhancedResumeAnalyzer = () => {
  const { user } = useAuth();
  const { callGroqAPI, loading } = useGroqAPI();
  const [resumeContent, setResumeContent] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!resumeContent.trim() || !jobDescription.trim()) {
      return;
    }

    const result = await callGroqAPI('resume_analyzer', resumeContent, jobDescription);
    if (result) {
      try {
        const parsedResult = JSON.parse(result);
        setAnalysis(parsedResult);
      } catch (error) {
        console.error('Failed to parse analysis result:', error);
      }
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-600';
    if (score >= 60) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto text-center">
          <CardContent className="pt-6">
            <p>Please sign in to use the Resume Analyzer.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">AI Resume Analyzer</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get detailed ATS compatibility analysis and improvement recommendations for your resume against specific job descriptions.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Resume Content
                </CardTitle>
                <CardDescription>
                  Paste your resume content here
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste your resume content here..."
                  value={resumeContent}
                  onChange={(e) => setResumeContent(e.target.value)}
                  className="min-h-[200px]"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Job Description
                </CardTitle>
                <CardDescription>
                  Paste the target job description
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste the job description you're targeting..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[200px]"
                />
              </CardContent>
            </Card>

            <Button 
              onClick={handleAnalyze}
              disabled={loading || !resumeContent.trim() || !jobDescription.trim()}
              className="w-full bg-gradient-primary hover:opacity-90"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Analyze Resume
                </>
              )}
            </Button>
          </div>

          <div className="space-y-6">
            {analysis ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>ATS Compatibility Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-4">
                      <div className={`text-4xl font-bold ${getScoreColor(analysis.ats_score)}`}>
                        {analysis.ats_score}%
                      </div>
                      <Progress 
                        value={analysis.ats_score} 
                        className="w-full"
                      />
                      <Badge 
                        variant={analysis.ats_score >= 80 ? "default" : analysis.ats_score >= 60 ? "secondary" : "destructive"}
                      >
                        {analysis.ats_score >= 80 ? "Excellent" : analysis.ats_score >= 60 ? "Good" : "Needs Work"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.strengths.map((strength, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                      Missing Keywords
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {analysis.missing_keywords.map((keyword, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-600" />
                      Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">
                    Your analysis results will appear here
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedResumeAnalyzer;
