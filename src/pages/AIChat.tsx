import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Bot, User, FileText, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const AIChat = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m Clario\'s AI legal assistant. I can help explain legal terms, analyze contract clauses, and provide general legal information. How can I assist you today?',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [documentText, setDocumentText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = (message: string): string => {
    const msg = message.toLowerCase();
    
    // Create a more dynamic response system
    const responses = {
      indemnification: [
        'Indemnification is a contractual obligation where one party agrees to compensate another party for losses, damages, or liabilities. It\'s a way to allocate risk between parties in a contract.',
        'An indemnification clause essentially means one party will "hold harmless" the other party from certain claims or losses. This is common in business contracts to protect against potential legal issues.',
        'Indemnification clauses transfer risk from one party to another. The indemnifying party promises to cover costs, damages, and legal fees if certain events occur.'
      ],
      liability: [
        'Liability refers to legal responsibility for one\'s acts or omissions. In contracts, liability clauses define who is responsible for what damages and to what extent.',
        'Limited liability clauses can cap the amount of damages one party can be held responsible for. This protects businesses from excessive financial exposure.',
        'Liability in contracts determines who pays when things go wrong. It\'s crucial to clearly define liability limits to protect both parties\' interests.'
      ],
      termination: [
        'Termination clauses specify how and when a contract can be ended. They typically include notice periods, reasons for termination, and what happens to obligations after termination.',
        'A good termination clause protects both parties by clearly stating when and how the agreement can be ended, including notice requirements and consequences.',
        'Termination clauses are essential for contract flexibility. They should specify whether termination can be "with cause" or "without cause" and the required notice period.'
      ],
      confidential: [
        'Confidentiality agreements (NDAs) protect sensitive information shared between parties. Key elements include definition of confidential information and obligations of the receiving party.',
        'NDAs are crucial for protecting trade secrets and proprietary information. They should clearly define what information is confidential and how long the obligation lasts.',
        'Confidentiality clauses prevent parties from sharing sensitive business information. They typically include exceptions for publicly available information and court-ordered disclosures.'
      ],
      'force majeure': [
        'Force majeure clauses excuse parties from performing contractual obligations when circumstances beyond their control prevent performance. Common events include natural disasters, war, and pandemics.',
        'Force majeure is French for "superior force" and refers to unforeseeable circumstances that prevent contract performance. These clauses should be carefully drafted to cover relevant scenarios.',
        'A force majeure clause protects parties when "acts of God" or other extraordinary events make contract performance impossible or impractical.'
      ],
      breach: [
        'A breach of contract occurs when one party fails to perform their obligations under the contract. Remedies can include damages, specific performance, or contract termination.',
        'Contract breaches can be material (serious) or minor. Material breaches go to the heart of the contract and may allow termination, while minor breaches typically only entitle the non-breaching party to damages.',
        'When a contract is breached, the non-breaching party has several remedies available, including monetary damages, specific performance (forcing completion), or contract termination.'
      ],
      hello: [
        'Hello! I\'m Clario\'s AI legal assistant. I can help explain legal terms, analyze contract clauses, and provide general legal information. What would you like to know?',
        'Hi there! I\'m here to help with legal questions and document analysis. I can discuss topics like contracts, liability, confidentiality, and much more. How can I assist you?',
        'Welcome! I\'m your AI legal assistant. I can help explain complex legal concepts in simple terms and analyze legal documents. What legal topic interests you today?'
      ],
      contract: [
        'A contract is a legally binding agreement between two or more parties. It must include offer, acceptance, consideration, and mutual intent to be bound by the terms.',
        'Contracts can be written or oral, though written contracts are generally preferred for clarity and enforceability. They should clearly define all terms and conditions.',
        'For a contract to be valid, it must have all essential elements: competent parties, mutual agreement, consideration, legal purpose, and proper form.'
      ],
      damages: [
        'Damages in contract law refer to monetary compensation awarded to the non-breaching party. They can be compensatory, punitive, or nominal depending on the circumstances.',
        'There are several types of damages: compensatory (actual losses), consequential (indirect losses), punitive (punishment), and liquidated (pre-agreed amounts).',
        'The goal of damages is to put the non-breaching party in the position they would have been in had the contract been performed properly.'
      ]
    };

    // Check for specific topics and return random response
    for (const [topic, topicResponses] of Object.entries(responses)) {
      if (msg.includes(topic)) {
        return topicResponses[Math.floor(Math.random() * topicResponses.length)];
      }
    }
    
    // General responses for unrecognized queries
    const generalResponses = [
      'I\'m here to help with legal questions and document analysis. I can explain legal terms, discuss contract clauses, and provide general legal information. What specific legal topic would you like to explore?',
      'That\'s an interesting legal question! I can help explain legal concepts, analyze contract terms, or discuss various areas of law. Could you be more specific about what you\'d like to know?',
      'I\'m your AI legal assistant, ready to help with legal questions and document analysis. I can discuss contracts, liability, confidentiality, termination clauses, and much more. What would you like to learn about?',
      'I can help explain legal terms and concepts in simple language. I\'m knowledgeable about contract law, business law, and general legal principles. What legal topic interests you?',
      'I\'m here to provide legal information and analysis. Please note that this is for educational purposes only and does not constitute legal advice. For specific legal matters, please consult with a qualified attorney. What can I help you understand?'
    ];
    
    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
  };

  const handleSendMessage = () => {
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

    // Simulate AI response
    setTimeout(() => {
      let aiResponse: Message;

      if (documentText && !inputMessage) {
        // Document analysis
        const clauses = documentText.split('\n').filter(line => 
          line.trim().length > 0 && 
          (line.includes('.') || line.includes(':') || line.includes(';'))
        ).slice(0, 3);
        
        const analysis = clauses.map((clause, index) => 
          `Clause ${index + 1}: ${clause.trim()}\nAnalysis: This appears to be a ${index % 2 === 0 ? 'standard' : 'non-standard'} clause with ${index % 3 === 0 ? 'low' : index % 3 === 1 ? 'medium' : 'high'} risk level.`
        ).join('\n\n');
        
        aiResponse = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: `I've analyzed your document and found ${clauses.length} clauses:\n\n${analysis}`,
          timestamp: new Date(),
        };
        setDocumentText('');
      } else {
        // Regular chat
        const response = getAIResponse(inputMessage);
        aiResponse = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: response,
          timestamp: new Date(),
        };
      }

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setDocumentText(text);
      toast({
        title: "Document Loaded",
        description: "Document loaded successfully. You can now analyze it.",
      });
    };
    reader.readAsText(file);
  };

  const quickQuestions = [
    "What is indemnification?",
    "Explain liability clauses",
    "What is force majeure?",
    "How do termination clauses work?",
    "What is a breach of contract?"
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
        <div className="flex gap-2">
          <input
            type="file"
            id="file-upload"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
          <label htmlFor="file-upload">
            <Button variant="outline" asChild>
              <span><Upload className="h-4 w-4 mr-2" />Upload</span>
            </Button>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="legal-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Chat with Clario AI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96 w-full mb-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.type === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.type === 'ai' && (
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Bot className="h-4 w-4 text-primary" />
                          </div>
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.type === 'user'
                            ? 'bg-primary text-primary-foreground ml-auto'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                      {message.type === 'user' && (
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-4 w-4" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          <span className="text-sm">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {documentText && (
                <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium mb-2">Document to analyze:</p>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {documentText.substring(0, 200)}...
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Input
                  placeholder="Ask a legal question or paste document text..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={isLoading || (!inputMessage.trim() && !documentText.trim())}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="legal-card">
            <CardHeader>
              <CardTitle>Quick Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => setInputMessage(question)}
                >
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
                <div className="w-2 h-2 rounded-full bg-success"></div>
                <span>Clause-by-clause analysis</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-success"></div>
                <span>Risk assessment</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-success"></div>
                <span>Legal term explanations</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-success"></div>
                <span>Compliance checking</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-success"></div>
                <span>Document simplification</span>
              </div>
            </CardContent>
          </Card>

          <Card className="legal-card border-accent/20">
            <CardContent className="p-4">
              <div className="text-center">
                <MessageSquare className="h-8 w-8 text-accent mx-auto mb-2" />
                <h3 className="font-semibold mb-2">Demo Mode</h3>
                <p className="text-sm text-muted-foreground">
                  This is a demonstration version. Responses are for educational purposes only and do not constitute legal advice.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIChat;