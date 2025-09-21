import { useState, useEffect } from "react";
import { BookOpen, Search, Filter, ArrowUpDown, Info, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import apiService from "@/services/api";

interface LegalTerm {
  _id: string;
  term: string;
  displayTerm: string;
  definition: string;
  category: string;
  complexity: 'basic' | 'intermediate' | 'advanced';
  examples: string[];
  relatedTerms: any[];
  synonyms: string[];
  usage: {
    frequency: string;
    contexts: string[];
  };
}

const Glossary = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('alphabetical');
  const [selectedTerm, setSelectedTerm] = useState<LegalTerm | null>(null);
  const [terms, setTerms] = useState<LegalTerm[]>([]);
  const [categories, setCategories] = useState<{category: string; count: number}[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });

  const categoriesList = [
    { value: 'all', label: 'All Categories' },
    { value: 'contract', label: 'Contract Law' },
    { value: 'liability', label: 'Liability' },
    { value: 'intellectual-property', label: 'Intellectual Property' },
    { value: 'employment', label: 'Employment' },
    { value: 'corporate', label: 'Corporate' },
    { value: 'litigation', label: 'Litigation' },
    { value: 'general', label: 'General' }
  ];

  const sampleTerms: LegalTerm[] = [
    {
      _id: "1",
      term: "indemnification",
      displayTerm: "Indemnification",
      definition: "A contractual obligation where one party agrees to compensate another party for losses, damages, or liabilities incurred as a result of specified events or circumstances.",
      category: "contract",
      complexity: "intermediate",
      examples: [
        "The contractor shall indemnify the client against any claims arising from the contractor's negligence.",
        "Each party agrees to indemnify the other against third-party claims related to intellectual property infringement."
      ],
      relatedTerms: [],
      synonyms: ["hold harmless", "compensate", "reimburse"],
      usage: {
        frequency: "Very Common",
        contexts: ["Contracts", "Service Agreements", "Employment Agreements"]
      }
    },
    {
      _id: "2",
      term: "force-majeure",
      displayTerm: "Force Majeure",
      definition: "A contractual provision that excuses a party from performing its obligations when circumstances beyond their control prevent performance.",
      category: "contract",
      complexity: "intermediate",
      examples: [
        "The pandemic was declared a force majeure event, excusing delayed delivery.",
        "Natural disasters, war, and government actions are typically included in force majeure clauses."
      ],
      relatedTerms: [],
      synonyms: ["act of god", "unforeseen circumstances", "impossibility"],
      usage: {
        frequency: "Common",
        contexts: ["Contracts", "Supply Agreements", "Service Contracts"]
      }
    },
    {
      _id: "3",
      term: "liability",
      displayTerm: "Liability",
      definition: "Legal responsibility for one's acts or omissions, which may result in legal obligation to pay damages or perform specific actions.",
      category: "liability",
      complexity: "basic",
      examples: [
        "The company accepted liability for the defective product.",
        "Limited liability protects shareholders from personal financial responsibility."
      ],
      relatedTerms: [],
      synonyms: ["responsibility", "accountability", "obligation"],
      usage: {
        frequency: "Very Common",
        contexts: ["All Legal Documents", "Contracts", "Corporate Law"]
      }
    },
    {
      _id: "4",
      term: "confidentiality",
      displayTerm: "Confidentiality",
      definition: "The obligation to keep certain information secret and not disclose it to unauthorized parties.",
      category: "contract",
      complexity: "basic",
      examples: [
        "The employee signed a confidentiality agreement to protect trade secrets.",
        "Confidentiality clauses prevent disclosure of sensitive business information."
      ],
      relatedTerms: [],
      synonyms: ["non-disclosure", "secrecy", "privacy"],
      usage: {
        frequency: "Very Common",
        contexts: ["Employment Agreements", "NDAs", "Service Contracts"]
      }
    },
    {
      _id: "5",
      term: "termination",
      displayTerm: "Termination",
      definition: "The act of ending or canceling a contract, agreement, or employment relationship before its natural expiration.",
      category: "contract",
      complexity: "basic",
      examples: [
        "Either party may terminate this agreement with 30 days written notice.",
        "Termination for cause allows immediate contract cancellation due to breach."
      ],
      relatedTerms: [],
      synonyms: ["cancellation", "ending", "dissolution"],
      usage: {
        frequency: "Very Common",
        contexts: ["All Contracts", "Employment Agreements", "Service Contracts"]
      }
    },
    {
      _id: "6",
      term: "breach",
      displayTerm: "Breach",
      definition: "A violation or failure to perform a legal obligation, duty, or contractual term.",
      category: "contract",
      complexity: "basic",
      examples: [
        "The supplier's failure to deliver on time constituted a material breach.",
        "Breach of contract may result in damages or contract termination."
      ],
      relatedTerms: [],
      synonyms: ["violation", "infringement", "non-compliance"],
      usage: {
        frequency: "Very Common",
        contexts: ["Contract Law", "Litigation", "All Legal Documents"]
      }
    },
    {
      _id: "7",
      term: "intellectual-property",
      displayTerm: "Intellectual Property",
      definition: "Legal rights protecting creations of the mind, including patents, trademarks, copyrights, and trade secrets.",
      category: "intellectual-property",
      complexity: "intermediate",
      examples: [
        "The company's intellectual property portfolio includes 50 patents.",
        "Intellectual property rights protect innovations and creative works."
      ],
      relatedTerms: [],
      synonyms: ["IP", "proprietary rights", "creative assets"],
      usage: {
        frequency: "Common",
        contexts: ["Technology Agreements", "Licensing", "Corporate Transactions"]
      }
    },
    {
      _id: "8",
      term: "consideration",
      displayTerm: "Consideration",
      definition: "Something of value exchanged between parties to a contract, making the contract legally binding.",
      category: "contract",
      complexity: "intermediate",
      examples: [
        "The consideration for this agreement is the payment of $10,000.",
        "Valid consideration is required for a contract to be enforceable."
      ],
      relatedTerms: [],
      synonyms: ["payment", "compensation", "benefit"],
      usage: {
        frequency: "Common",
        contexts: ["Contract Formation", "Legal Analysis", "All Contracts"]
      }
    },
    {
      _id: "9",
      term: "warranty",
      displayTerm: "Warranty",
      definition: "A promise or guarantee about the quality, condition, or performance of goods or services.",
      category: "contract",
      complexity: "basic",
      examples: [
        "The product comes with a one-year warranty against defects.",
        "Express warranties are explicitly stated, while implied warranties are assumed by law."
      ],
      relatedTerms: [],
      synonyms: ["guarantee", "assurance", "promise"],
      usage: {
        frequency: "Common",
        contexts: ["Sales Agreements", "Service Contracts", "Product Liability"]
      }
    },
    {
      _id: "10",
      term: "arbitration",
      displayTerm: "Arbitration",
      definition: "A method of dispute resolution where parties agree to have their case decided by an impartial third party rather than going to court.",
      category: "litigation",
      complexity: "intermediate",
      examples: [
        "The contract requires arbitration for all disputes.",
        "Arbitration is often faster and less expensive than litigation."
      ],
      relatedTerms: [],
      synonyms: ["mediation", "alternative dispute resolution", "ADR"],
      usage: {
        frequency: "Common",
        contexts: ["Dispute Resolution", "Contracts", "Commercial Agreements"]
      }
    }
  ];

  const fetchTerms = async () => {
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      let filteredTerms = sampleTerms;
      
      // Apply search filter
      if (searchTerm) {
        filteredTerms = filteredTerms.filter(term => 
          term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
          term.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
          term.synonyms.some(syn => syn.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      
      // Apply category filter
      if (selectedCategory !== 'all') {
        filteredTerms = filteredTerms.filter(term => term.category === selectedCategory);
      }
      
      // Apply sorting
      if (sortBy === 'alphabetical') {
        filteredTerms.sort((a, b) => a.displayTerm.localeCompare(b.displayTerm));
      } else if (sortBy === 'category') {
        filteredTerms.sort((a, b) => a.category.localeCompare(b.category));
      } else if (sortBy === 'complexity') {
        const complexityOrder = { basic: 1, intermediate: 2, advanced: 3 };
        filteredTerms.sort((a, b) => complexityOrder[a.complexity] - complexityOrder[b.complexity]);
      }
      
      setTerms(filteredTerms);
      setPagination({
        current: 1,
        pages: 1,
        total: filteredTerms.length
      });
      setLoading(false);
    }, 500);
  };

  const fetchCategories = async () => {
    // Generate categories from sample data
    const categoryCounts = sampleTerms.reduce((acc, term) => {
      acc[term.category] = (acc[term.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const categoriesData = Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count
    }));
    
    setCategories(categoriesData);
  };

  const fetchTermDetails = async (id: string) => {
    const term = sampleTerms.find(t => t._id === id);
    if (term) {
      setSelectedTerm(term);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, [searchTerm, selectedCategory, sortBy]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'contract': return 'primary';
      case 'liability': return 'destructive';
      case 'intellectual-property': return 'accent';
      case 'employment': return 'warning';
      case 'corporate': return 'success';
      case 'litigation': return 'secondary';
      case 'general': return 'outline';
      default: return 'outline';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'basic': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'destructive';
      default: return 'outline';
    }
  };

  const handleSearch = () => {
    fetchTerms();
  };

  const handleTermClick = (term: LegalTerm) => {
    setSelectedTerm(term);
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-background via-secondary/20 to-background min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            Legal Terms Glossary
          </h1>
          <p className="text-muted-foreground">Comprehensive dictionary of legal terms and definitions</p>
        </div>
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{pagination.total} terms</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Terms List */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search and Filters */}
          <Card className="legal-card">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search legal terms..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesList.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alphabetical">Alphabetical</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                    <SelectItem value="complexity">Complexity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Terms Grid */}
          {loading ? (
            <Card className="legal-card">
              <CardContent className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading legal terms...</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {terms.map((term) => (
                <Card 
                  key={term._id} 
                  className="legal-card cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleTermClick(term)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-lg text-foreground">{term.displayTerm}</h3>
                      <div className="flex gap-1">
                        <Badge variant={getCategoryColor(term.category)} className="text-xs">
                          {term.category.replace('-', ' ')}
                        </Badge>
                        <Badge variant={getComplexityColor(term.complexity)} className="text-xs">
                          {term.complexity}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                      {term.definition}
                    </p>
                    
                    <div className="flex flex-wrap gap-1">
                      {term.synonyms.slice(0, 3).map((synonym, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {synonym}
                        </Badge>
                      ))}
                      {term.synonyms.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{term.synonyms.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && terms.length === 0 && (
            <Card className="legal-card">
              <CardContent className="p-8 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No terms found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or browse all terms.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Term Details Sidebar */}
        <div className="space-y-4">
          {selectedTerm ? (
            <Card className="legal-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  {selectedTerm.displayTerm}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Badge variant={getCategoryColor(selectedTerm.category)}>
                    {selectedTerm.category.replace('-', ' ')}
                  </Badge>
                  <Badge variant={getComplexityColor(selectedTerm.complexity)}>
                    {selectedTerm.complexity}
                  </Badge>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Definition</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedTerm.definition}
                  </p>
                </div>
                
                {selectedTerm.examples && selectedTerm.examples.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Examples</h4>
                    <div className="space-y-2">
                      {selectedTerm.examples.map((example, index) => (
                        <div key={index} className="text-sm bg-muted/50 p-2 rounded italic">
                          "{example}"
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedTerm.synonyms && selectedTerm.synonyms.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Synonyms</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedTerm.synonyms.map((synonym, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {synonym}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTerm.usage && (
                  <div>
                    <h4 className="font-semibold mb-2">Usage</h4>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        <strong>Frequency:</strong> {selectedTerm.usage.frequency}
                      </p>
                      {selectedTerm.usage.contexts && selectedTerm.usage.contexts.length > 0 && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            <strong>Contexts:</strong>
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {selectedTerm.usage.contexts.map((context, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {context}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => toast({ title: "External Reference", description: "External legal reference coming soon!" })}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Legal Reference
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="legal-card">
              <CardContent className="p-6 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Select a Term</h3>
                <p className="text-sm text-muted-foreground">
                  Click on any legal term to view detailed information, examples, and related terms.
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="legal-card">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Terms</span>
                <Badge variant="outline">{pagination.total}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Categories</span>
                <Badge variant="outline">{categories.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Basic Level</span>
                <Badge variant="success">{terms.filter(t => t.complexity === 'basic').length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Intermediate</span>
                <Badge variant="warning">{terms.filter(t => t.complexity === 'intermediate').length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Advanced</span>
                <Badge variant="destructive">{terms.filter(t => t.complexity === 'advanced').length}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Glossary;