import { useNavigate } from "react-router-dom";
import { BarChart3, Calendar, FileText, Users, ArrowRight, CheckCircle, MessageSquare, AlertTriangle, Eye, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ClarioLogo from "@/components/ClarioLogo";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: BarChart3,
      title: "Dashboard",
      description: "Main dashboard with overview, risk score, and quick actions.",
      color: "text-primary",
      bgColor: "bg-primary/10",
      path: "/dashboard"
    },
    {
      icon: Calendar,
      title: "Deadline Tracking",
      description: "Comprehensive deadline management with filtering and status tracking.",
      color: "text-warning",
      bgColor: "bg-warning/10",
      path: "/deadlines"
    },
    {
      icon: FileText,
      title: "Document Assistant",
      description: "AI-powered document generation including NDAs and contracts.",
      color: "text-accent",
      bgColor: "bg-accent/10",
      path: "/documents"
    },
    {
      icon: MessageSquare,
      title: "AI Chat",
      description: "Clause-by-clause analysis with AI-powered legal insights.",
      color: "text-primary",
      bgColor: "bg-primary/10",
      path: "/ai-chat"
    },
    {
      icon: AlertTriangle,
      title: "Clause Checker",
      description: "AI standard clause checker with risk level warnings.",
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      path: "/clause-checker"
    },
    {
      icon: Eye,
      title: "Side-by-Side View",
      description: "Compare original vs simplified legal documents.",
      color: "text-success",
      bgColor: "bg-success/10",
      path: "/side-by-side"
    }
  ];

  const benefits = [
    "Track all legal deadlines in one place",
    "Generate professional legal documents with AI",
    "Monitor your legal risk score",
    "Never miss important compliance dates",
    "Access pre-built legal templates",
    "Get proactive legal health insights",
    "AI-powered clause-by-clause analysis",
    "Standard clause checking with risk assessment",
    "Side-by-side document comparison",
    "Comprehensive legal terms glossary"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <ClarioLogo size="md" />
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Login
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Clario
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your comprehensive legal health dashboard. Track deadlines, manage documents, and stay compliant.
          </p>
          
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => (
              <Card key={index} className="legal-card hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => navigate(feature.path)}>
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mx-auto mb-4`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    View {feature.title}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Get Started</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="text-center">
              <Button 
                variant="professional" 
                size="lg" 
                className="w-64 h-12"
                onClick={() => navigate("/dashboard")}
              >
                <Users className="h-5 w-5 mr-2" />
                Login as Startup
              </Button>
            </div>
            <div className="text-center">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-64 h-12"
                onClick={() => navigate("/dashboard")}
              >
                <User className="h-5 w-5 mr-2" />
                Login as Individual
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What's Inside Section */}
      <section className="bg-secondary/30 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">What's Inside</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Smart Dashboard</h3>
                <p className="text-muted-foreground">
                  Risk scoring, document upload, and deadline overview
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-lg bg-warning/10 flex items-center justify-center mx-auto mb-6">
                  <Calendar className="h-8 w-8 text-warning" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Deadline Management</h3>
                <p className="text-muted-foreground">
                  Never miss important legal deadlines again
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-6">
                  <FileText className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Document Generation</h3>
                <p className="text-muted-foreground">
                  AI-powered legal document creation
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">AI Chat Assistant</h3>
                <p className="text-muted-foreground">
                  Clause-by-clause analysis with AI insights
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-lg bg-destructive/10 flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Clause Checker</h3>
                <p className="text-muted-foreground">
                  AI-powered standard clause verification
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-lg bg-success/10 flex items-center justify-center mx-auto mb-6">
                  <Eye className="h-8 w-8 text-success" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Side-by-Side View</h3>
                <p className="text-muted-foreground">
                  Compare original vs simplified documents
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Clario?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                <span className="text-muted-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <ClarioLogo size="sm" />
          </div>
          <p className="text-muted-foreground">© 2025 Clario. Legal Life Organizer.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
