import { useState } from "react";
import { AlertTriangle, CheckCircle, FileText, Upload, Download, Eye, Shield, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import apiService from "@/services/api";

interface ClauseCheck {
  name: string;
  present: boolean;
  text?: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
}

interface ClauseCheckResult {
  standardClauses: ClauseCheck[];
  missingClauses: string[];
  nonStandardClauses: string[];
  overallRisk: number;
}

const ClauseChecker = () => {
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const [documentText, setDocumentText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [clauseChecks, setClauseChecks] = useState<ClauseCheckResult | null>(null);
  const [overallRisk, setOverallRisk] = useState(0);

  const analyzeDocument = async () => {
    if (!documentText.trim()) {
      toast({
        title: "No Document",
        description: "Please paste a legal document to analyze.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      // Basic clause analysis without API calls
      const text = documentText.toLowerCase();
      
      const standardClauses: ClauseCheck[] = [
        {
          name: "Liability Limitation",
          present: text.includes('liability') && text.includes('limit'),
          text: text.includes('liability') ? "Liability limitation clause found" : undefined,
          riskLevel: text.includes('liability') && text.includes('limit') ? 'low' : 'high',
          recommendation: text.includes('liability') && text.includes('limit') 
            ? "Good: Liability limitation clause is present and properly structured."
            : "Warning: Consider adding a liability limitation clause to protect against excessive damages."
        },
        {
          name: "Termination Clause",
          present: text.includes('termination') || text.includes('terminate'),
          text: text.includes('termination') ? "Termination clause found" : undefined,
          riskLevel: text.includes('termination') ? 'low' : 'medium',
          recommendation: text.includes('termination') 
            ? "Good: Termination clause is present."
            : "Consider adding a clear termination clause specifying when and how the agreement can be ended."
        },
        {
          name: "Payment Terms",
          present: text.includes('payment') || text.includes('compensation') || text.includes('salary'),
          text: text.includes('payment') ? "Payment terms found" : undefined,
          riskLevel: text.includes('payment') ? 'low' : 'high',
          recommendation: text.includes('payment') 
            ? "Good: Payment terms are clearly defined."
            : "Critical: Payment terms must be clearly specified to avoid disputes."
        },
        {
          name: "Confidentiality",
          present: text.includes('confidential') || text.includes('non-disclosure'),
          text: text.includes('confidential') ? "Confidentiality clause found" : undefined,
          riskLevel: text.includes('confidential') ? 'low' : 'medium',
          recommendation: text.includes('confidential') 
            ? "Good: Confidentiality protection is in place."
            : "Consider adding confidentiality provisions to protect sensitive information."
        },
        {
          name: "Indemnification",
          present: text.includes('indemnif') || text.includes('hold harmless'),
          text: text.includes('indemnif') ? "Indemnification clause found" : undefined,
          riskLevel: text.includes('indemnif') ? 'low' : 'medium',
          recommendation: text.includes('indemnif') 
            ? "Good: Indemnification clause provides protection."
            : "Consider adding indemnification provisions to allocate risk appropriately."
        },
        {
          name: "Force Majeure",
          present: text.includes('force majeure') || text.includes('act of god'),
          text: text.includes('force majeure') ? "Force majeure clause found" : undefined,
          riskLevel: text.includes('force majeure') ? 'low' : 'low',
          recommendation: text.includes('force majeure') 
            ? "Good: Force majeure protection is included."
            : "Optional: Force majeure clause can protect against unforeseen circumstances."
        }
      ];

      const missingClauses = standardClauses
        .filter(clause => !clause.present)
        .map(clause => clause.name);

      const highRiskClauses = standardClauses.filter(clause => 
        clause.riskLevel === 'high' || clause.riskLevel === 'critical'
      );

      const overallRisk = Math.round(
        (highRiskClauses.length / standardClauses.length) * 100 +
        (missingClauses.length / standardClauses.length) * 50
      );

      const result: ClauseCheckResult = {
        standardClauses,
        missingClauses,
        nonStandardClauses: [],
        overallRisk
      };

      setClauseChecks(result);
      setOverallRisk(overallRisk);
      
      toast({
        title: "Analysis Complete",
        description: `Found ${standardClauses.length} clauses with ${missingClauses.length} missing.`,
      });
      
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Simple file reading for demo purposes
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
      case 'medium': return AlertCircle;
      case 'low': return CheckCircle;
      default: return CheckCircle;
    }
  };

  const getStatusIcon = (present: boolean) => {
    return present ? CheckCircle : AlertTriangle;
  };

  const clauseTypes = [
    { type: 'liability', label: 'Liability', icon: Shield },
    { type: 'termination', label: 'Termination', icon: FileText },
    { type: 'payment', label: 'Payment', icon: FileText },
    { type: 'confidentiality', label: 'Confidentiality', icon: Shield },
    { type: 'indemnification', label: 'Indemnification', icon: Shield },
    { type: 'force-majeure', label: 'Force Majeure', icon: AlertTriangle },
  ];

  const getClauseTypeIcon = (name: string) => {
    const clauseType = clauseTypes.find(ct => 
      name.toLowerCase().includes(ct.type) || ct.label.toLowerCase().includes(name.toLowerCase())
    );
    return clauseType ? clauseType.icon : FileText;
  };

  const sampleDocument = `WHEREAS, the Company, hereinafter referred to as "Company," and the Employee, hereinafter referred to as "Employee," desire to enter into an employment agreement pursuant to the terms and conditions set forth herein;

NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties hereto agree as follows:

1. EMPLOYMENT. The Company hereby employs the Employee, and the Employee hereby accepts employment with the Company, in accordance with the terms and conditions set forth in this Agreement.

2. COMPENSATION. Notwithstanding the foregoing, the Employee shall be entitled to receive a base salary in the amount of $75,000 per annum, payable in accordance with the Company's standard payroll practices.

3. CONFIDENTIALITY. The Employee acknowledges and agrees that, in connection with the Employee's employment hereunder, the Employee will have access to and become acquainted with various trade secrets, proprietary information, and confidential information belonging to the Company.

4. TERMINATION. Either party may terminate this Agreement at any time, with or without cause, by providing written notice to the other party not less than thirty (30) days prior to the effective date of such termination.

5. INDEMNIFICATION. The Employee shall indemnify and hold harmless the Company from and against any and all claims, damages, losses, costs, and expenses, including reasonable attorneys' fees, arising out of or in connection with the Employee's breach of this Agreement.`;

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-background via-secondary/20 to-background min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-primary" />
            AI Clause Checker
          </h1>
          <p className="text-muted-foreground">Analyze legal documents for standard clauses and risk assessment</p>
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
          <Button variant="outline" onClick={() => toast({ title: "Export Report", description: "Export feature coming soon!" })}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document Input */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="legal-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Document Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 mb-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setDocumentText(sampleDocument)}
                >
                  Load Sample
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setDocumentText('')}
                >
                  Clear
                </Button>
              </div>
              
              <Textarea
                placeholder="Paste your legal document here for clause analysis..."
                value={documentText}
                onChange={(e) => setDocumentText(e.target.value)}
                className="min-h-40"
              />
              <Button 
                onClick={analyzeDocument}
                disabled={isAnalyzing || !documentText.trim()}
                variant="professional"
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing Document...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Analyze Clauses
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Analysis Results */}
          {clauseChecks && (
            <Card className="legal-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  Clause Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">All Clauses</TabsTrigger>
                    <TabsTrigger value="issues">Issues</TabsTrigger>
                    <TabsTrigger value="standard">Standard</TabsTrigger>
                    <TabsTrigger value="missing">Missing</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="space-y-4">
                    {clauseChecks.standardClauses.map((check, index) => {
                      const RiskIcon = getRiskIcon(check.riskLevel);
                      const StatusIcon = getStatusIcon(check.present);
                      const TypeIcon = getClauseTypeIcon(check.name);
                      
                      return (
                        <Card key={index} className="border-l-4 border-l-primary/20">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <TypeIcon className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{check.name}</span>
                              </div>
                              <div className="flex gap-2">
                                <Badge variant={check.present ? 'success' : 'destructive'}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {check.present ? 'Present' : 'Missing'}
                                </Badge>
                                <Badge variant={getRiskColor(check.riskLevel)}>
                                  <RiskIcon className="h-3 w-3 mr-1" />
                                  {check.riskLevel.toUpperCase()}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              {check.text && (
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground mb-1">Clause:</p>
                                  <p className="text-sm italic bg-muted/50 p-2 rounded">
                                    "{check.text}"
                                  </p>
                                </div>
                              )}
                              
                              <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Recommendation:</p>
                                <p className="text-sm">{check.recommendation}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </TabsContent>

                  <TabsContent value="issues" className="space-y-4">
                    {clauseChecks.standardClauses.filter(c => !c.present || c.riskLevel === 'high' || c.riskLevel === 'critical').map((check, index) => {
                      const RiskIcon = getRiskIcon(check.riskLevel);
                      const StatusIcon = getStatusIcon(check.present);
                      const TypeIcon = getClauseTypeIcon(check.name);
                      
                      return (
                        <Card key={index} className="border-l-4 border-l-warning/50">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <TypeIcon className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{check.name}</span>
                              </div>
                              <div className="flex gap-2">
                                <Badge variant={check.present ? 'success' : 'destructive'}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {check.present ? 'Present' : 'Missing'}
                                </Badge>
                                <Badge variant={getRiskColor(check.riskLevel)}>
                                  <RiskIcon className="h-3 w-3 mr-1" />
                                  {check.riskLevel.toUpperCase()}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              {check.text && (
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground mb-1">Clause:</p>
                                  <p className="text-sm italic bg-muted/50 p-2 rounded">
                                    "{check.text}"
                                  </p>
                                </div>
                              )}
                              
                              <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Issue:</p>
                                <p className="text-sm">{check.recommendation}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </TabsContent>

                  <TabsContent value="standard" className="space-y-4">
                    {clauseChecks.standardClauses.filter(c => c.present && c.riskLevel === 'low').map((check, index) => {
                      const TypeIcon = getClauseTypeIcon(check.name);
                      
                      return (
                        <Card key={index} className="border-l-4 border-l-success/50">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <TypeIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{check.name}</span>
                              <Badge variant="success">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Standard
                              </Badge>
                            </div>
                            
                            <div className="space-y-2">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Clause:</p>
                                <p className="text-sm italic bg-muted/50 p-2 rounded">
                                  "{check.text}"
                                </p>
                              </div>
                              
                              <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Status:</p>
                                <p className="text-sm text-success">{check.recommendation}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </TabsContent>

                  <TabsContent value="missing" className="space-y-4">
                    {clauseChecks.missingClauses.map((clause, index) => {
                      const TypeIcon = getClauseTypeIcon(clause);
                      
                      return (
                        <Card key={index} className="border-l-4 border-l-destructive/50">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <TypeIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{clause}</span>
                              <Badge variant="destructive">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Missing
                              </Badge>
                            </div>
                            
                            <div className="space-y-2">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Issue:</p>
                                <p className="text-sm">This standard clause is missing from your document.</p>
                              </div>
                              
                              <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Recommendation:</p>
                                <p className="text-sm">Consider adding this clause to protect your interests and ensure compliance with standard practices.</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Risk Assessment Sidebar */}
        <div className="space-y-4">
          <Card className="legal-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2" style={{ color: overallRisk > 70 ? 'hsl(var(--destructive))' : overallRisk > 40 ? 'hsl(var(--warning))' : 'hsl(var(--success))' }}>
                    {Math.round(overallRisk)}%
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">Overall Risk Level</p>
                  <Progress value={overallRisk} className="mb-2" />
                  <p className="text-xs text-muted-foreground">
                    {overallRisk > 70 ? 'High Risk - Immediate attention required' : 
                     overallRisk > 40 ? 'Medium Risk - Review recommended' : 
                     'Low Risk - Document appears compliant'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {clauseChecks && (
            <Card className="legal-card">
              <CardHeader>
                <CardTitle>Clause Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Clauses</span>
                  <Badge variant="outline">{clauseChecks.standardClauses.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Present</span>
                  <Badge variant="success">{clauseChecks.standardClauses.filter(c => c.present).length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Missing</span>
                  <Badge variant="destructive">{clauseChecks.missingClauses.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">High Risk</span>
                  <Badge variant="warning">{clauseChecks.standardClauses.filter(c => c.riskLevel === 'high' || c.riskLevel === 'critical').length}</Badge>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="legal-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Issues
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View Standards
              </Button>
            </CardContent>
          </Card>

          <Card className="legal-card border-accent/20">
            <CardContent className="p-4">
              <div className="text-center">
                <AlertTriangle className="h-8 w-8 text-accent mx-auto mb-2" />
                <h3 className="font-semibold mb-2">Demo Mode</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  This is a demonstration version. Results are for educational purposes only and do not constitute legal advice.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClauseChecker;