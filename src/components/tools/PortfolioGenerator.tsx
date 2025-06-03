
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileText, 
  MessageSquare, 
  Download, 
  Sparkles, 
  Code, 
  Palette,
  Globe,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PortfolioGenerator = () => {
  const [activeMethod, setActiveMethod] = useState<'upload' | 'guided'>('upload');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedPortfolio, setGeneratedPortfolio] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const [guidedAnswers, setGuidedAnswers] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    skills: '',
    experience: '',
    education: '',
    projects: '',
    interests: ''
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf' || file.type.includes('document')) {
        setUploadedFile(file);
        toast({
          title: "File uploaded successfully",
          description: `${file.name} is ready for processing`
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

  const handleGuidedInputChange = (field: string, value: string) => {
    setGuidedAnswers(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generatePortfolio = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate portfolio generation process
    const steps = [
      "Analyzing your information...",
      "Designing layout structure...",
      "Generating HTML content...",
      "Creating CSS styles...",
      "Optimizing for responsiveness...",
      "Finalizing portfolio package..."
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setGenerationProgress(((i + 1) / steps.length) * 100);
      
      toast({
        title: steps[i],
        description: `Step ${i + 1} of ${steps.length}`,
      });
    }

    // Simulate generated portfolio
    setGeneratedPortfolio(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${guidedAnswers.name || 'Your'} Portfolio</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        header { background: linear-gradient(135deg, #1e40af, #7c3aed); color: white; padding: 4rem 0; text-align: center; }
        .hero h1 { font-size: 3rem; margin-bottom: 1rem; }
        .hero p { font-size: 1.2rem; margin-bottom: 2rem; }
        .section { padding: 4rem 0; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
        .card { background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        @media (max-width: 768px) { .hero h1 { font-size: 2rem; } }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <div class="hero">
                <h1>${guidedAnswers.name || 'Your Name'}</h1>
                <p>${guidedAnswers.title || 'Software Engineer'}</p>
                <p>${guidedAnswers.email || 'your.email@example.com'}</p>
            </div>
        </div>
    </header>
    <main>
        <section class="section">
            <div class="container">
                <h2>About Me</h2>
                <p>${guidedAnswers.summary || 'Your professional summary will appear here.'}</p>
            </div>
        </section>
        <section class="section">
            <div class="container">
                <h2>Skills</h2>
                <div class="grid">
                    ${(guidedAnswers.skills || 'JavaScript, React, Node.js, Python').split(',').map(skill => 
                      `<div class="card"><h3>${skill.trim()}</h3></div>`
                    ).join('')}
                </div>
            </div>
        </section>
    </main>
</body>
</html>
    `);

    setIsGenerating(false);
    
    toast({
      title: "Portfolio generated successfully!",
      description: "Your professional portfolio is ready to download",
    });
  };

  const downloadPortfolio = () => {
    if (!generatedPortfolio) return;

    const blob = new Blob([generatedPortfolio], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download started",
      description: "Your portfolio HTML file is being downloaded",
    });
  };

  const guidedQuestions = [
    { key: 'name', label: 'Full Name', type: 'input', placeholder: 'John Doe' },
    { key: 'title', label: 'Professional Title', type: 'input', placeholder: 'Frontend Developer' },
    { key: 'email', label: 'Email Address', type: 'input', placeholder: 'john@example.com' },
    { key: 'phone', label: 'Phone Number', type: 'input', placeholder: '+1 (555) 123-4567' },
    { key: 'location', label: 'Location', type: 'input', placeholder: 'San Francisco, CA' },
    { key: 'summary', label: 'Professional Summary', type: 'textarea', placeholder: 'Brief overview of your experience and goals...' },
    { key: 'skills', label: 'Technical Skills', type: 'textarea', placeholder: 'JavaScript, React, Node.js, Python...' },
    { key: 'experience', label: 'Work Experience', type: 'textarea', placeholder: 'Describe your work experience...' },
    { key: 'education', label: 'Education', type: 'textarea', placeholder: 'Your educational background...' },
    { key: 'projects', label: 'Key Projects', type: 'textarea', placeholder: 'Describe your notable projects...' },
    { key: 'interests', label: 'Interests & Hobbies', type: 'textarea', placeholder: 'Your personal interests...' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-slate-900">
            Portfolio Generator
          </h1>
          <p className="text-xl text-muted-foreground">
            Create a professional portfolio website in minutes
          </p>
        </div>

        {/* Method Selection */}
        <Tabs value={activeMethod} onValueChange={(value) => setActiveMethod(value as 'upload' | 'guided')} className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" className="flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>Upload Resume</span>
            </TabsTrigger>
            <TabsTrigger value="guided" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Guided Setup</span>
            </TabsTrigger>
          </TabsList>

          {/* Upload Method */}
          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Upload Your Resume</span>
                </CardTitle>
                <CardDescription>
                  Upload your resume and we'll extract information to build your portfolio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:border-portfolio-primary transition-colors">
                  <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">Drop your resume here</p>
                    <p className="text-sm text-muted-foreground">
                      Supports PDF and Word documents (Max 10MB)
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
                    <Button className="mt-4" variant="outline">
                      Choose File
                    </Button>
                  </Label>
                </div>
                
                {uploadedFile && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="font-medium text-green-800">
                        {uploadedFile.name} uploaded successfully
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Guided Method */}
          <TabsContent value="guided" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Guided Portfolio Setup</span>
                </CardTitle>
                <CardDescription>
                  Answer a few questions to create your portfolio from scratch
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {guidedQuestions.map((question) => (
                    <div key={question.key} className="space-y-2">
                      <Label htmlFor={question.key}>{question.label}</Label>
                      {question.type === 'input' ? (
                        <Input
                          id={question.key}
                          placeholder={question.placeholder}
                          value={guidedAnswers[question.key as keyof typeof guidedAnswers]}
                          onChange={(e) => handleGuidedInputChange(question.key, e.target.value)}
                        />
                      ) : (
                        <Textarea
                          id={question.key}
                          placeholder={question.placeholder}
                          value={guidedAnswers[question.key as keyof typeof guidedAnswers]}
                          onChange={(e) => handleGuidedInputChange(question.key, e.target.value)}
                          rows={3}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Generation Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span>Generate Portfolio</span>
            </CardTitle>
            <CardDescription>
              AI will create a professional portfolio based on your information
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isGenerating && !generatedPortfolio && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="flex items-center space-x-1">
                    <Code className="w-3 h-3" />
                    <span>HTML/CSS</span>
                  </Badge>
                  <Badge variant="outline" className="flex items-center space-x-1">
                    <Palette className="w-3 h-3" />
                    <span>Modern Design</span>
                  </Badge>
                  <Badge variant="outline" className="flex items-center space-x-1">
                    <Globe className="w-3 h-3" />
                    <span>Responsive</span>
                  </Badge>
                </div>
                <Button 
                  onClick={generatePortfolio}
                  disabled={activeMethod === 'upload' ? !uploadedFile : !guidedAnswers.name}
                  className="w-full bg-gradient-primary hover:opacity-90"
                  size="lg"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate My Portfolio
                </Button>
              </div>
            )}

            {isGenerating && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="font-medium">Generating your portfolio...</span>
                </div>
                <Progress value={generationProgress} className="w-full" />
                <p className="text-sm text-muted-foreground">
                  This usually takes 30-60 seconds
                </p>
              </div>
            )}

            {generatedPortfolio && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Portfolio generated successfully!</span>
                </div>
                <div className="bg-slate-50 border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Generated Files:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• index.html - Main portfolio page</li>
                    <li>• styles.css - Professional styling</li>
                    <li>• images/ - Optimized assets folder</li>
                  </ul>
                </div>
                <Button onClick={downloadPortfolio} className="w-full" size="lg">
                  <Download className="w-4 h-4 mr-2" />
                  Download Portfolio Package
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preview Section */}
        {generatedPortfolio && (
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Preview</CardTitle>
              <CardDescription>
                Preview of your generated portfolio website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <iframe
                  srcDoc={generatedPortfolio}
                  className="w-full h-96"
                  title="Portfolio Preview"
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PortfolioGenerator;
