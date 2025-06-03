
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useGroqAPI } from '@/hooks/useGroqAPI';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, MessageSquare, Play, Send } from 'lucide-react';

interface Question {
  question: string;
  type: 'behavioral' | 'technical';
  follow_up: string;
}

interface InterviewData {
  questions: Question[];
}

const MockInterview = () => {
  const { user } = useAuth();
  const { callGroqAPI, loading } = useGroqAPI();
  const [jobInfo, setJobInfo] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [answers, setAnswers] = useState<string[]>([]);
  const [interviewStarted, setInterviewStarted] = useState(false);

  const startInterview = async () => {
    if (!jobInfo.trim()) return;

    const result = await callGroqAPI('mock_interview', jobInfo);
    if (result) {
      try {
        const parsedResult: InterviewData = JSON.parse(result);
        setQuestions(parsedResult.questions);
        setInterviewStarted(true);
        setCurrentQuestionIndex(0);
        setAnswers([]);
      } catch (error) {
        console.error('Failed to parse interview questions:', error);
      }
    }
  };

  const submitAnswer = () => {
    if (!userAnswer.trim()) return;

    const newAnswers = [...answers, userAnswer];
    setAnswers(newAnswers);
    setUserAnswer('');

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const resetInterview = () => {
    setInterviewStarted(false);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setUserAnswer('');
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto text-center">
          <CardContent className="pt-6">
            <p>Please sign in to use the Mock Interview tool.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">AI Mock Interview</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Practice interviews with AI-generated questions tailored to your target role.
          </p>
        </div>

        {!interviewStarted ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Setup Your Interview
              </CardTitle>
              <CardDescription>
                Describe the role or paste a job description to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Describe the role you're interviewing for or paste the job description..."
                value={jobInfo}
                onChange={(e) => setJobInfo(e.target.value)}
                className="min-h-[200px]"
              />
              
              <Button 
                onClick={startInterview}
                disabled={loading || !jobInfo.trim()}
                className="w-full bg-gradient-primary hover:opacity-90"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Preparing Interview...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start Mock Interview
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge variant="secondary">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </Badge>
                <Badge variant={questions[currentQuestionIndex]?.type === 'technical' ? 'default' : 'outline'}>
                  {questions[currentQuestionIndex]?.type}
                </Badge>
              </div>
              <Button variant="outline" onClick={resetInterview}>
                Reset Interview
              </Button>
            </div>

            {questions[currentQuestionIndex] && (
              <Card>
                <CardHeader>
                  <CardTitle>Interview Question</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="font-medium mb-2">
                      {questions[currentQuestionIndex].question}
                    </p>
                    {questions[currentQuestionIndex].follow_up && (
                      <p className="text-sm text-muted-foreground">
                        Follow-up: {questions[currentQuestionIndex].follow_up}
                      </p>
                    )}
                  </div>

                  <div>
                    <Textarea
                      placeholder="Type your answer here..."
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className="min-h-[150px]"
                    />
                  </div>

                  <Button 
                    onClick={submitAnswer}
                    disabled={!userAnswer.trim()}
                    className="w-full"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {currentQuestionIndex < questions.length - 1 ? 'Submit & Next Question' : 'Submit Final Answer'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {answers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Previous Answers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {answers.map((answer, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <p className="font-medium text-sm text-muted-foreground mb-1">
                          Question {index + 1}: {questions[index]?.question}
                        </p>
                        <p className="text-sm">{answer}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {currentQuestionIndex >= questions.length - 1 && answers.length === questions.length && (
              <Card>
                <CardContent className="pt-6 text-center">
                  <h3 className="text-lg font-semibold mb-2">Interview Complete!</h3>
                  <p className="text-muted-foreground mb-4">
                    You've answered all {questions.length} questions. Great job!
                  </p>
                  <Button onClick={resetInterview} className="bg-gradient-primary hover:opacity-90">
                    Start New Interview
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MockInterview;
