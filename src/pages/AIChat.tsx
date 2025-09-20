import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Bot, User, FileText, Sparkles, AlertTriangle, CheckCircle, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import apiService from "@/services/api";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  clauseAnalysis?: ClauseAnalysis[];
}

interface ClauseAnalysis {
  clause: string;
  analysis: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  suggestions: string[];
}

const AIChat = () => {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m Clario\'s AI legal assistant. I can help you analyze legal documents clause by clause, explain legal terms, and provide insights on your legal documents. How can I assist you today?',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [documentText, setDocumentText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !documentText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage || 'Please analyze this document:',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      let aiResponse: Message;

      if (documentText && !inputMessage) {
        // Document analysis mode
        setIsAnalyzing(true);
        const analysis = await apiService.analyzeClauses(documentText);
        
        aiResponse = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: 'I\'ve analyzed your document and found several clauses that need attention. Here\'s my clause-by-clause breakdown:',
          timestamp: new Date(),
          clauseAnalysis: analysis.data.analysis.clauses || [],
        };
        setDocumentText('');
      } else {
        // Regular chat mode
        const response = await apiService.chatWithAI(inputMessage, documentText);
        
        aiResponse = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: response.data.response,
          timestamp: new Date(),
        };
      }

      setMessages(prev => [...prev, aiResponse]);
      
      toast({
        title: "Analysis Complete",
        description: documentText ? "AI has finished analyzing your document." : "AI has responded to your message.",
      });
    } catch (error: any) {
      console.error('AI Chat error:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `I apologize, but I encountered an error: ${error.message}. Please try again or contact support if the issue persists.`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: error.message || "Failed to process your request",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upload and analyze documents.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsAnalyzing(true);
      const response = await apiService.uploadDocument(file, {
        title: file.name,
        type: 'other'
      });

      if (response.success) {
        setDocumentText(response.data.document.content.original);
        toast({
          title: "Document Uploaded",
          description: "Document uploaded successfully. You can now analyze it.",
        });
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload document",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'critical': return AlertTriangle;
      case 'high': return AlertTriangle;
      case 'medium': return AlertTriangle;
      case 'low': return CheckCircle;
      default: return CheckCircle;
    }
  };

  const quickQuestions = [
    "Explain the difference between liability and indemnification clauses",
    "What are the standard terms in an NDA?",
    "How do I check if a contract has proper termination clauses?",
    "What is force majeure and when should it be included?",
    "Explain the key elements of a confidentiality agreement"
  ];

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-background via-secondary/20 to-background min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-primary" />
            AI Legal Assistant
          </h1>
          <p className="text-muted-foreground">Get clause-by-clause analysis and legal insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          <span className="text-sm text-muted-foreground">Powered by Clario AI</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="legal-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                Chat with Clario AI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96 w-full border rounded-lg p-4 mb-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {message.type === 'ai' && (
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Bot className="h-4 w-4 text-primary" />
                          </div>
                        </div>
                      )}
                      
                      <div className={`max-w-[80%] ${message.type === 'user' ? 'order-first' : ''}`}>
                        <div className={`rounded-lg p-3 ${
                          message.type === 'user' 
                            ? 'bg-primary text-primary-foreground ml-auto' 
                            : 'bg-muted'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                        
                        {/* Clause Analysis */}
                        {message.clauseAnalysis && (
                          <div className="mt-3 space-y-3">
                            <h4 className="font-semibold text-sm text-muted-foreground">Clause Analysis:</h4>
                            {message.clauseAnalysis.map((analysis, index) => {
                              const RiskIcon = getRiskIcon(analysis.riskLevel);
                              return (
                                <Card key={index} className="border-l-4 border-l-primary/20">
                                  <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                      <Badge variant={getRiskColor(analysis.riskLevel)} className="mb-2">
                                        <RiskIcon className="h-3 w-3 mr-1" />
                                        {analysis.riskLevel.toUpperCase()} RISK
                                      </Badge>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <div>
                                        <p className="text-xs font-medium text-muted-foreground mb-1">Clause:</p>
                                        <p className="text-sm italic bg-muted/50 p-2 rounded">
                                          "{analysis.clause}"
                                        </p>
                                      </div>
                                      
                                      <div>
                                        <p className="text-xs font-medium text-muted-foreground mb-1">Analysis:</p>
                                        <p className="text-sm">{analysis.analysis}</p>
                                      </div>
                                      
                                      <div>
                                        <p className="text-xs font-medium text-muted-foreground mb-1">Suggestions:</p>
                                        <ul className="text-sm space-y-1">
                                          {analysis.suggestions.map((suggestion, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                              <span className="text-primary mt-1">•</span>
                                              <span>{suggestion}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      
                      {message.type === 'user' && (
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                            <User className="h-4 w-4 text-accent" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          <span className="text-sm">
                            {isAnalyzing ? 'Analyzing document...' : 'Thinking...'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Textarea
                    placeholder="Paste your legal document here for clause-by-clause analysis..."
                    value={documentText}
                    onChange={(e) => setDocumentText(e.target.value)}
                    className="min-h-20 flex-1"
                  />
                  <div className="flex flex-col gap-2">
                    <input
                      type="file"
                      id="file-upload"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label htmlFor="file-upload">
                      <Button variant="outline" size="icon" asChild>
                        <Upload className="h-4 w-4" />
                      </Button>
                    </label>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask a legal question..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={isLoading || (!inputMessage.trim() && !documentText.trim())}
                    variant="professional"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="legal-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Quick Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickQuestions.map((question, index) => (
                <Button 
                  key={index}
                  variant="outline" 
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => setInputMessage(question)}
                >
                  <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="text-sm">{question}</span>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className="legal-card">
            <CardHeader>
              <CardTitle>AI Capabilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Clause-by-clause analysis</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Risk assessment</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Legal term explanations</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Compliance checking</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Document simplification</span>
              </div>
            </CardContent>
          </Card>

          {!isAuthenticated && (
            <Card className="legal-card border-warning/20">
              <CardContent className="p-4">
                <div className="text-center">
                  <AlertTriangle className="h-8 w-8 text-warning mx-auto mb-2" />
                  <h3 className="font-semibold mb-2">Sign in for full features</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Upload documents and save your analysis history
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Sign In
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIChat;