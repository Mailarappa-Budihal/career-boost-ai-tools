
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Upload, 
  Search, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  FileText,
  Target,
  Zap,
  Award,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AnalysisResult {
  atsScore: number;
  overallGrade: string;
  strengths: string[];
  improvements: string[];
  keywordMatches: {
    matched: string[];
    missing: string[];
  };
  sections: {
    name: string;
    score: number;
    feedback: string;
  }[];
}

const ResumeAnalyzer = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf' || file.type.includes('document')) {
        setUploadedFile(file);
        toast({
          title: "Resume uploaded successfully",
          description: `${file.name} is ready for analysis`
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or Word document",
          variant: "destructive"
        });
      }
    }
  };

  const analyzeResume = async () => {
    if (!uploadedFile || !jobDescription.trim()) {
      toast({
        title: "Missing information",
        description: "Please upload a resume and provide a job description",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis process
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock analysis result
    const mockResult: AnalysisResult = {
      atsScore: Math.floor(Math.random() * 30) + 70, // 70-100
      overallGrade: 'B+',
      strengths: [
        'Strong technical skills section',
        'Quantified achievements in work experience',
        'Clean, professional formatting',
        'Relevant project descriptions'
      ],
      improvements: [
        'Add more industry-specific keywords',
        'Include a professional summary section',
        'Expand on leadership experience',
        'Add relevant certifications'
      ],
      keywordMatches: {
        matched: ['JavaScript', 'React', 'Node.js', 'Git', 'Agile'],
        missing: ['TypeScript', 'AWS', 'Docker', 'CI/CD', 'Testing']
      },
      sections: [
        { name: 'Contact Information', score: 95, feedback: 'Complete and professional' },
        { name: 'Professional Summary', score: 60, feedback: 'Consider adding a brief summary' },
        { name: 'Technical Skills', score: 88, feedback: 'Good coverage, add missing keywords' },
        { name: 'Work Experience', score: 82, feedback: 'Well-structured with quantified results' },
        { name: 'Education', score: 90, feedback: 'Clear and relevant' },
        { name: 'Projects', score: 75, feedback: 'Good detail, add more technical specifics' }
      ]
    };

    setAnalysisResult(mockResult);
    setIsAnalyzing(false);

    toast({
      title: "Analysis complete!",
      description: `Your resume scored ${mockResult.atsScore}/100 for ATS compatibility`
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeBadgeVariant = (grade: string) => {
    if (grade.includes('A')) return 'default';
    if (grade.includes('B')) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-slate-900">
            Resume Analyzer
          </h1>
          <p className="text-xl text-muted-foreground">
            Get instant ATS compatibility scores and improvement suggestions
          </p>
        </div>

        {/* Input Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Resume Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Upload Resume</span>
              </CardTitle>
              <CardDescription>
                Upload your resume for analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-portfolio-primary transition-colors">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <div className="space-y-1">
                  <p className="font-medium">Drop your resume here</p>
                  <p className="text-sm text-muted-foreground">
                    PDF or Word document
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  id="resume-upload"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                />
                <Label htmlFor="resume-upload" className="cursor-pointer">
                  <Button className="mt-2" variant="outline" size="sm">
                    Choose File
                  </Button>
                </Label>
              </div>
              
              {uploadedFile && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-green-800">
                      {uploadedFile.name}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Job Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Job Description</span>
              </CardTitle>
              <CardDescription>
                Paste the job description you're targeting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste the job description here. Include requirements, qualifications, and key technologies..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={10}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground mt-2">
                More detailed job descriptions provide better analysis
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Analyze Button */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <Button 
              onClick={analyzeResume}
              disabled={!uploadedFile || !jobDescription.trim() || isAnalyzing}
              className="w-full bg-gradient-primary hover:opacity-90"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Analyze My Resume
                </>
              )}
            </Button>
            {isAnalyzing && (
              <p className="text-center text-sm text-muted-foreground mt-2">
                This usually takes 15-30 seconds
              </p>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        {analysisResult && (
          <div className="space-y-6">
            {/* Overall Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>ATS Compatibility Score</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`text-4xl font-bold ${getScoreColor(analysisResult.atsScore)}`}>
                      {analysisResult.atsScore}
                    </div>
                    <div>
                      <Badge variant={getGradeBadgeVariant(analysisResult.overallGrade)} className="mb-1">
                        Grade: {analysisResult.overallGrade}
                      </Badge>
                      <p className="text-sm text-muted-foreground">out of 100</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {analysisResult.atsScore >= 85 ? 'Excellent' : 
                       analysisResult.atsScore >= 70 ? 'Good' : 'Needs Improvement'}
                    </p>
                    <p className="text-xs text-muted-foreground">ATS Compatibility</p>
                  </div>
                </div>
                <Progress value={analysisResult.atsScore} className="h-2" />
              </CardContent>
            </Card>

            {/* Section Scores */}
            <Card>
              <CardHeader>
                <CardTitle>Section Analysis</CardTitle>
                <CardDescription>
                  Detailed breakdown of each resume section
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisResult.sections.map((section, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{section.name}</span>
                        <span className={`font-bold ${getScoreColor(section.score)}`}>
                          {section.score}/100
                        </span>
                      </div>
                      <Progress value={section.score} className="h-1" />
                      <p className="text-sm text-muted-foreground">{section.feedback}</p>
                      {index < analysisResult.sections.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Keyword Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Keyword Analysis</span>
                </CardTitle>
                <CardDescription>
                  Keywords found vs. missing from the job description
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-green-600 mb-3 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Found Keywords ({analysisResult.keywordMatches.matched.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.keywordMatches.matched.map((keyword, index) => (
                        <Badge key={index} variant="outline" className="text-green-600 border-green-200">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-red-600 mb-3 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Missing Keywords ({analysisResult.keywordMatches.missing.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.keywordMatches.missing.map((keyword, index) => (
                        <Badge key={index} variant="outline" className="text-red-600 border-red-200">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feedback */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-green-600">
                    <TrendingUp className="w-5 h-5" />
                    <span>Strengths</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysisResult.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-orange-600">
                    <AlertCircle className="w-5 h-5" />
                    <span>Improvements</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysisResult.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
