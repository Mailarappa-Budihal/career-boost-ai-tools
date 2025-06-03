
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Search, 
  MessageSquare, 
  Briefcase, 
  User, 
  Zap,
  Shield,
  Clock,
  Download,
  CheckCircle
} from 'lucide-react';
import Header from '@/components/Header';
import AuthPage from '@/components/auth/AuthPage';
import EnhancedPortfolioGenerator from '@/components/tools/EnhancedPortfolioGenerator';
import EnhancedResumeAnalyzer from '@/components/tools/EnhancedResumeAnalyzer';
import CoverLetterGenerator from '@/components/tools/CoverLetterGenerator';
import ResumeEnhancer from '@/components/tools/ResumeEnhancer';
import MockInterview from '@/components/tools/MockInterview';

const Index = () => {
  const { user, loading } = useAuth();
  const [activeToolIndex, setActiveToolIndex] = useState<number | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  const tools = [
    {
      id: 'portfolio-generator',
      title: 'Portfolio Generator',
      description: 'Generate a professional portfolio website from your resume or guided prompts',
      icon: User,
      color: 'bg-blue-500',
      features: ['Static HTML/CSS files', 'Responsive design', 'Downloadable package'],
      status: 'Available',
      component: EnhancedPortfolioGenerator
    },
    {
      id: 'cover-letter',
      title: 'Cover Letter Generator',
      description: 'Create tailored cover letters that match job descriptions perfectly',
      icon: FileText,
      color: 'bg-purple-500',
      features: ['Job-specific tailoring', 'Multiple formats', 'Download options'],
      status: 'Available',
      component: CoverLetterGenerator
    },
    {
      id: 'resume-analyzer',
      title: 'Resume Analyzer',
      description: 'Get ATS compatibility scores and improvement suggestions',
      icon: Search,
      color: 'bg-green-500',
      features: ['ATS score analysis', 'Keyword matching', 'Actionable feedback'],
      status: 'Available',
      component: EnhancedResumeAnalyzer
    },
    {
      id: 'resume-enhancer',
      title: 'Resume Enhancer',
      description: 'Optimize your resume content for specific job applications',
      icon: Zap,
      color: 'bg-orange-500',
      features: ['Content optimization', 'Keyword enhancement', 'AI-powered improvements'],
      status: 'Available',
      component: ResumeEnhancer
    },
    {
      id: 'job-search',
      title: 'Job Search',
      description: 'Find relevant opportunities through LinkedIn integration',
      icon: Briefcase,
      color: 'bg-cyan-500',
      features: ['LinkedIn integration', 'Advanced filtering', 'Direct application links'],
      status: 'Coming Soon'
    },
    {
      id: 'mock-interview',
      title: 'Mock Interview',
      description: 'Practice interviews with AI-powered feedback and coaching',
      icon: MessageSquare,
      color: 'bg-pink-500',
      features: ['Role-specific questions', 'Real-time feedback', 'Performance insights'],
      status: 'Available',
      component: MockInterview
    }
  ];

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Powered by Groq API for instant AI processing'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Stateless processing - your data is never stored'
    },
    {
      icon: Clock,
      title: 'On-Demand',
      description: 'Use any tool instantly without setup or profiles'
    },
    {
      icon: Download,
      title: 'Export Ready',
      description: 'Download all generated content in professional formats'
    }
  ];

  const handleToolClick = (index: number) => {
    const tool = tools[index];
    if (tool.status === 'Available') {
      if (!user) {
        setShowAuth(true);
        return;
      }
      setActiveToolIndex(index);
    }
  };

  const handleBackToTools = () => {
    setActiveToolIndex(null);
  };

  const handleGetStarted = () => {
    if (!user) {
      setShowAuth(true);
    }
  };

  useEffect(() => {
    if (user && showAuth) {
      setShowAuth(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-portfolio-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (showAuth) {
    return <AuthPage />;
  }

  if (activeToolIndex !== null) {
    const ActiveComponent = tools[activeToolIndex].component;
    return ActiveComponent ? (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        <Header onBack={handleBackToTools} />
        <ActiveComponent />
      </div>
    ) : null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              PortfolioAI
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
              AI-Powered Job Application Tool Suite for Early-Career Engineers
            </p>
            <p className="text-lg mb-12 text-slate-300 max-w-2xl mx-auto">
              Generate portfolios, analyze resumes, create cover letters, and practice interviews - all powered by cutting-edge AI
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-white text-slate-900 hover:bg-slate-100 transition-all duration-300 transform hover:scale-105"
                onClick={handleGetStarted}
              >
                Get Started Free
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900 transition-all duration-300">
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-slate-900">
              Professional Tools Suite
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create outstanding job applications, powered by AI
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, index) => {
              const IconComponent = tool.icon;
              const isAvailable = tool.status === 'Available';
              
              return (
                <Card 
                  key={tool.id} 
                  className={`group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${
                    isAvailable ? 'cursor-pointer' : 'opacity-75'
                  }`}
                  onClick={() => handleToolClick(index)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-lg ${tool.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <Badge variant={isAvailable ? "default" : "secondary"}>
                        {tool.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl group-hover:text-portfolio-primary transition-colors">
                      {tool.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {tool.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {isAvailable && (
                      <Button className="w-full mt-4 bg-gradient-primary hover:opacity-90 transition-opacity">
                        {user ? 'Launch Tool' : 'Sign In to Use'}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-primary text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Job Search?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join thousands of engineers who have accelerated their careers with PortfolioAI
          </p>
          <Button 
            size="lg" 
            className="bg-white text-portfolio-primary hover:bg-slate-100 transition-all duration-300 transform hover:scale-105"
            onClick={handleGetStarted}
          >
            Start Building Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            PortfolioAI
          </h3>
          <p className="text-slate-400 mb-6">
            Empowering engineers with AI-driven job application tools
          </p>
          <Separator className="my-6 bg-slate-700" />
          <p className="text-sm text-slate-500">
            © 2025 PortfolioAI. Built with privacy and security in mind.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
