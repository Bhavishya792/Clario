import { useState } from "react";
import { FileText, Upload, Download, Search, Plus, Star, ArrowLeft, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const Documents = () => {
  const { toast } = useToast();
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [documents, setDocuments] = useState([
    { name: "Employment Contract Template", type: "Contract", lastModified: "2 days ago", starred: true },
    { name: "NDA - Standard Form", type: "Legal Agreement", lastModified: "1 week ago", starred: false },
    { name: "Privacy Policy - Updated", type: "Compliance", lastModified: "3 days ago", starred: true },
    { name: "Trademark Application", type: "IP", lastModified: "1 month ago", starred: false },
    { name: "Board Resolution - Q3", type: "Corporate", lastModified: "2 weeks ago", starred: false },
    { name: "Software License Agreement", type: "Contract", lastModified: "5 days ago", starred: true },
  ]);

  const toggleStar = (index: number) => {
    setDocuments(prev => prev.map((doc, i) => 
      i === index ? { ...doc, starred: !doc.starred } : doc
    ));
    toast({
      title: documents[index].starred ? "Removed from favorites" : "Added to favorites",
      description: `${documents[index].name} ${documents[index].starred ? "removed from" : "added to"} your favorites.`,
    });
  };

  const handleSearch = () => {
    toast({
      title: "Document Search",
      description: "Advanced search functionality coming soon!",
    });
  };

  const handleUpload = () => {
    toast({
      title: "Document Upload",
      description: "File upload functionality will be available soon!",
    });
  };

  const handleTemplateLibrary = () => {
    toast({
      title: "Template Library",
      description: "Template library access coming soon!",
    });
  };
  
  if (selectedDocument === "assistant") {
    return <DocumentAssistant onBack={() => setSelectedDocument(null)} />;
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-background via-secondary/20 to-background min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Document Management</h1>
          <p className="text-muted-foreground">Organize, analyze, and generate legal documents</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button variant="professional" onClick={() => setSelectedDocument("assistant")}>
            <Sparkles className="h-4 w-4 mr-2" />
            AI Assistant
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="legal-card cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedDocument("assistant")}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-accent/20">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold">Document Assistant</h3>
                <p className="text-sm text-muted-foreground">AI-powered document generation</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="legal-card cursor-pointer hover:shadow-lg transition-shadow" onClick={handleUpload}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-primary/20">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Upload Documents</h3>
                <p className="text-sm text-muted-foreground">Add existing legal documents</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="legal-card cursor-pointer hover:shadow-lg transition-shadow" onClick={handleTemplateLibrary}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-success/20">
                <FileText className="h-6 w-6 text-success" />
              </div>
              <div>
                <h3 className="font-semibold">Template Library</h3>
                <p className="text-sm text-muted-foreground">Access pre-built templates</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document Library */}
      <Card className="legal-card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Document Library</CardTitle>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Documents</SelectItem>
                  <SelectItem value="contracts">Contracts</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="intellectual-property">IP Documents</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                </SelectContent>
              </Select>
              <Input 
                placeholder="Search documents..." 
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {documents.map((doc, index) => (
              <Card key={index} className="border hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleStar(index)}>
                      <Star className={`h-4 w-4 ${doc.starred ? 'fill-warning text-warning' : 'text-muted-foreground'}`} />
                    </Button>
                  </div>
                  <h4 className="font-medium text-sm mb-1">{doc.name}</h4>
                  <p className="text-xs text-muted-foreground mb-2">{doc.type}</p>
                  <p className="text-xs text-muted-foreground">Modified {doc.lastModified}</p>
                  <div className="flex gap-1 mt-3">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-7 text-xs"
                      onClick={() => toast({ title: "Document Viewer", description: `Opening ${doc.name}...` })}
                    >
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-7 text-xs"
                      onClick={() => toast({ title: "Download", description: `Downloading ${doc.name}...` })}
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const DocumentAssistant = ({ onBack }: { onBack: () => void }) => {
  const { toast } = useToast();
  const [selectedDocType, setSelectedDocType] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    toast({
      title: "Generating Document",
      description: `Creating your ${selectedDocType.replace('-', ' ')} document...`,
    });
    
    // Simulate generation
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Document Generated!",
        description: "Your document has been successfully generated and is ready for review.",
      });
    }, 3000);
  };

  const handleFileUpload = () => {
    toast({
      title: "File Upload",
      description: "Document upload and analysis feature coming soon!",
    });
  };
  
  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-background via-secondary/20 to-background min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Document Drafting Assistant</h1>
          <div className="flex items-center gap-2 mt-1">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-accent font-medium">AI-Powered</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card className="legal-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Upload Document (Optional)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Drop your document here</h3>
              <p className="text-muted-foreground mb-4">Upload an existing document to analyze or modify</p>
              <Button variant="outline" onClick={handleFileUpload}>
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Generated Document */}
        <Card className="legal-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-success" />
              Generated Document
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-8 text-center bg-muted/20">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No document generated yet</h3>
              <p className="text-muted-foreground">Select a document type and click "Generate Sample" to create your document</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document Type Selection */}
      <Card className="legal-card">
        <CardHeader>
          <CardTitle>Select Document Type</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedDocType} onValueChange={setSelectedDocType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a document type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nda">Non-Disclosure Agreement (NDA)</SelectItem>
              <SelectItem value="employment">Employment Contract</SelectItem>
              <SelectItem value="service">Service Agreement</SelectItem>
              <SelectItem value="privacy">Privacy Policy</SelectItem>
              <SelectItem value="terms">Terms of Service</SelectItem>
              <SelectItem value="partnership">Partnership Agreement</SelectItem>
              <SelectItem value="lease">Lease Agreement</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="professional" 
            className="w-full mt-4" 
            disabled={!selectedDocType || isGenerating}
            onClick={handleGenerate}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {isGenerating ? "Generating..." : "Generate Sample Document"}
          </Button>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Generate a customizable template based on your selection
          </p>
        </CardContent>
      </Card>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="legal-card">
          <CardContent className="p-6 text-center">
            <div className="p-3 rounded-lg bg-primary/20 w-fit mx-auto mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">AI-Powered Generation</h3>
            <p className="text-sm text-muted-foreground">
              Smart document creation based on legal best practices
            </p>
          </CardContent>
        </Card>

        <Card className="legal-card">
          <CardContent className="p-6 text-center">
            <div className="p-3 rounded-lg bg-success/20 w-fit mx-auto mb-4">
              <FileText className="h-6 w-6 text-success" />
            </div>
            <h3 className="font-semibold mb-2">Multiple Formats</h3>
            <p className="text-sm text-muted-foreground">
              Generate documents in various formats (PDF, DOCX, TXT)
            </p>
          </CardContent>
        </Card>

        <Card className="legal-card">
          <CardContent className="p-6 text-center">
            <div className="p-3 rounded-lg bg-accent/20 w-fit mx-auto mb-4">
              <Upload className="h-6 w-6 text-accent" />
            </div>
            <h3 className="font-semibold mb-2">Template Library</h3>
            <p className="text-sm text-muted-foreground">
              Access hundreds of pre-built legal document templates
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Documents;