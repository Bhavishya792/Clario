import { useState } from "react";
import { Eye, FileText, Upload, Download, Copy, RotateCcw, Maximize2, Minimize2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import apiService from "@/services/api";

interface DocumentVersion {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
  type: 'original' | 'simplified' | 'comparison';
}

const SideBySide = () => {
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const [originalText, setOriginalText] = useState('');
  const [simplifiedText, setSimplifiedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('side-by-side');
  const [documentVersions, setDocumentVersions] = useState<DocumentVersion[]>([]);

  const generateSimplified = async () => {
    if (!originalText.trim()) {
      toast({
        title: "No Document",
        description: "Please paste a legal document to simplify.",
        variant: "destructive"
      });
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to use the document simplification feature.",
        variant: "destructive"
      });
      return;
    }

    if (user?.subscription === 'free') {
      toast({
        title: "Upgrade Required",
        description: "Document simplification requires a Pro subscription. Please upgrade to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await apiService.simplifyDocumentText(originalText);
      
      if (response.success) {
        setSimplifiedText(response.data.simplified);
        
        // Save versions
        const versions: DocumentVersion[] = [
          {
            id: '1',
            title: 'Original Document',
            content: originalText,
            timestamp: new Date(),
            type: 'original'
          },
          {
            id: '2',
            title: 'Simplified Version',
            content: response.data.simplified,
            timestamp: new Date(),
            type: 'simplified'
          }
        ];
        setDocumentVersions(versions);
        setActiveTab('side-by-side');
        
        toast({
          title: "Simplification Complete",
          description: "Your document has been simplified and is ready for comparison.",
        });
      }
    } catch (error: any) {
      console.error('Document simplification error:', error);
      toast({
        title: "Simplification Failed",
        description: error.message || "Failed to simplify document",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
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
      setIsGenerating(true);
      const response = await apiService.uploadDocument(file, {
        title: file.name,
        type: 'other'
      });

      if (response.success) {
        setOriginalText(response.data.document.content.original);
        toast({
          title: "Document Uploaded",
          description: "Document uploaded successfully. You can now simplify it.",
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
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: `${type} version copied successfully.`,
    });
  };

  const resetDocument = () => {
    setOriginalText('');
    setSimplifiedText('');
    setDocumentVersions([]);
    toast({
      title: "Document Reset",
      description: "All content has been cleared.",
    });
  };

  const loadSampleDocument = () => {
    const sampleText = `WHEREAS, the Company, hereinafter referred to as "Company," and the Employee, hereinafter referred to as "Employee," desire to enter into an employment agreement pursuant to the terms and conditions set forth herein;

NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties hereto agree as follows:

1. EMPLOYMENT. The Company hereby employs the Employee, and the Employee hereby accepts employment with the Company, in accordance with the terms and conditions set forth in this Agreement.

2. COMPENSATION. Notwithstanding the foregoing, the Employee shall be entitled to receive a base salary in the amount of $75,000 per annum, payable in accordance with the Company's standard payroll practices.

3. CONFIDENTIALITY. The Employee acknowledges and agrees that, in connection with the Employee's employment hereunder, the Employee will have access to and become acquainted with various trade secrets, proprietary information, and confidential information belonging to the Company.

4. TERMINATION. Either party may terminate this Agreement at any time, with or without cause, by providing written notice to the other party not less than thirty (30) days prior to the effective date of such termination.

5. INDEMNIFICATION. The Employee shall indemnify and hold harmless the Company from and against any and all claims, damages, losses, costs, and expenses, including reasonable attorneys' fees, arising out of or in connection with the Employee's breach of this Agreement.`;

    setOriginalText(sampleText);
    toast({
      title: "Sample Loaded",
      description: "A sample employment agreement has been loaded.",
    });
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-background via-secondary/20 to-background min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Eye className="h-8 w-8 text-primary" />
            Side-by-Side Document View
          </h1>
          <p className="text-muted-foreground">Compare original legal documents with AI-simplified versions</p>
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
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </label>
          <Button variant="outline" onClick={loadSampleDocument}>
            <FileText className="h-4 w-4 mr-2" />
            Load Sample
          </Button>
          <Button variant="outline" onClick={resetDocument}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Document Input */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="legal-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Document Simplification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Original Legal Document
                  </label>
                  <Textarea
                    placeholder="Paste your legal document here..."
                    value={originalText}
                    onChange={(e) => setOriginalText(e.target.value)}
                    className="min-h-32"
                  />
                </div>
                
                <Button 
                  onClick={generateSimplified}
                  disabled={isGenerating || !originalText.trim()}
                  variant="professional"
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Simplifying Document...
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Generate Simplified Version
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Comparison Views */}
          {simplifiedText && (
            <Card className="legal-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  Document Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="side-by-side">Side by Side</TabsTrigger>
                    <TabsTrigger value="original">Original Only</TabsTrigger>
                    <TabsTrigger value="simplified">Simplified Only</TabsTrigger>
                  </TabsList>

                  <TabsContent value="side-by-side" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Original Document */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-foreground">Original Document</h3>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(originalText, 'Original')}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Maximize2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <ScrollArea className="h-96 w-full border rounded-lg p-4 bg-muted/20">
                          <div className="text-sm whitespace-pre-wrap font-mono">
                            {originalText}
                          </div>
                        </ScrollArea>
                      </div>

                      {/* Simplified Document */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-foreground">Simplified Version</h3>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(simplifiedText, 'Simplified')}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Maximize2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <ScrollArea className="h-96 w-full border rounded-lg p-4 bg-success/5">
                          <div className="text-sm whitespace-pre-wrap">
                            {simplifiedText}
                          </div>
                        </ScrollArea>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="original" className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">Original Document</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(originalText, 'Original')}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                      <ScrollArea className="h-96 w-full border rounded-lg p-4 bg-muted/20">
                        <div className="text-sm whitespace-pre-wrap font-mono">
                          {originalText}
                        </div>
                      </ScrollArea>
                    </div>
                  </TabsContent>

                  <TabsContent value="simplified" className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">Simplified Version</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(simplifiedText, 'Simplified')}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                      <ScrollArea className="h-96 w-full border rounded-lg p-4 bg-success/5">
                        <div className="text-sm whitespace-pre-wrap">
                          {simplifiedText}
                        </div>
                      </ScrollArea>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="legal-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Document Versions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {documentVersions.length > 0 ? (
                <div className="space-y-3">
                  {documentVersions.map((version) => (
                    <div key={version.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{version.title}</h4>
                        <Badge variant={version.type === 'original' ? 'outline' : 'default'}>
                          {version.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {version.timestamp.toLocaleTimeString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {version.content.length} characters
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No document versions yet
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="legal-card">
            <CardHeader>
              <CardTitle>Simplification Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-success"></div>
                <span>Legal jargon replacement</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-success"></div>
                <span>Sentence structure improvement</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-success"></div>
                <span>Plain language conversion</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-success"></div>
                <span>Readability enhancement</span>
              </div>
            </CardContent>
          </Card>

          <Card className="legal-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Both
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Save Versions
              </Button>
            </CardContent>
          </Card>

          {!isAuthenticated && (
            <Card className="legal-card border-warning/20">
              <CardContent className="p-4">
                <div className="text-center">
                  <Eye className="h-8 w-8 text-warning mx-auto mb-2" />
                  <h3 className="font-semibold mb-2">Sign in required</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Please sign in to use document simplification
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Sign In
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {isAuthenticated && user?.subscription === 'free' && (
            <Card className="legal-card border-accent/20">
              <CardContent className="p-4">
                <div className="text-center">
                  <Eye className="h-8 w-8 text-accent mx-auto mb-2" />
                  <h3 className="font-semibold mb-2">Upgrade to Pro</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Get access to AI-powered document simplification
                  </p>
                  <Button variant="professional" size="sm" className="w-full">
                    Upgrade Now
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

export default SideBySide;