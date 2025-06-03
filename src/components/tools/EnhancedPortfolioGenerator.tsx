
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useGroqAPI } from '@/hooks/useGroqAPI';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Download, Loader2, User, FileText } from 'lucide-react';

const EnhancedPortfolioGenerator = () => {
  const { user } = useAuth();
  const { callGroqAPI, loading } = useGroqAPI();
  const [input, setInput] = useState('');
  const [generatedPortfolio, setGeneratedPortfolio] = useState('');

  const handleGenerate = async () => {
    if (!input.trim()) {
      return;
    }

    const result = await callGroqAPI('portfolio', input);
    if (result) {
      setGeneratedPortfolio(result);
    }
  };

  const downloadPortfolio = () => {
    const blob = new Blob([generatedPortfolio], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio.html';
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
            <p>Please sign in to use the Portfolio Generator.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">AI Portfolio Generator</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Generate a professional portfolio website from your resume or experience description.
            Our AI will create a complete HTML file with modern styling.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Input Your Information
              </CardTitle>
              <CardDescription>
                Paste your resume content or describe your experience, skills, and projects
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="input">Resume Content or Experience Description</Label>
                <Textarea
                  id="input"
                  placeholder="Paste your resume content here or describe your skills, experience, and projects..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[300px] mt-2"
                />
              </div>
              
              <Button 
                onClick={handleGenerate}
                disabled={loading || !input.trim()}
                className="w-full bg-gradient-primary hover:opacity-90"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Portfolio...
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4 mr-2" />
                    Generate Portfolio
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Generated Portfolio
              </CardTitle>
              <CardDescription>
                Your AI-generated portfolio website will appear here
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedPortfolio ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">HTML Portfolio Ready</Badge>
                    <Button 
                      onClick={downloadPortfolio}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download HTML
                    </Button>
                  </div>
                  
                  <div className="bg-slate-100 p-4 rounded-lg max-h-[400px] overflow-auto">
                    <pre className="text-sm whitespace-pre-wrap break-words">
                      {generatedPortfolio.substring(0, 500)}...
                    </pre>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    Preview shows first 500 characters. Download the full HTML file to view your complete portfolio.
                  </p>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Your generated portfolio will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnhancedPortfolioGenerator;
