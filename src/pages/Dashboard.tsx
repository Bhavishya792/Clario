import { useState, useEffect } from "react";
import { Calendar, FileText, AlertTriangle, BarChart3, Upload, Users, Bell, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import apiService from "@/services/api";

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [riskScore, setRiskScore] = useState(72);
  const [stats, setStats] = useState({
    documents: 0,
    deadlines: 0,
    upcoming: 0,
    overdue: 0,
    highPriority: 0,
    compliance: 0
  });
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);

  const quickActions = [
    { title: "Document Assistant", icon: FileText, description: "Generate legal documents", action: () => navigate('/documents') },
    { title: "Schedule Consultation", icon: Calendar, description: "Book time with lawyer", action: () => toast({ title: "Consultation Booking", description: "Consultation scheduling feature coming soon!" }) },
    { title: "View Reports", icon: BarChart3, description: "Legal health reports", action: () => navigate('/reports') },
  ];

  const handleUpload = () => {
    toast({
      title: "Document Upload",
      description: "File upload functionality will be available soon!",
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getDashboardStats();
      
      if (response.success) {
        setStats(response.data.stats);
        setUpcomingDeadlines(response.data.upcomingDeadlines);
      }
    } catch (error: any) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateHealthCheckup = async () => {
    try {
      toast({
        title: "Generating Legal Health Checkup",
        description: "Your comprehensive legal health report is being prepared...",
      });

      const response = await apiService.generateHealthCheck();
      
      if (response.success) {
        setRiskScore(response.data.riskScore);
        toast({
          title: "Health Check Complete",
          description: `Your legal risk score is ${response.data.riskScore}%. Check recommendations for details.`,
        });
      }
    } catch (error: any) {
      console.error('Error generating health check:', error);
      toast({
        title: "Error",
        description: "Failed to generate health checkup",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-background via-secondary/20 to-background min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome, {user?.firstName || 'User'}!
          </h1>
          <p className="text-muted-foreground">Here's your legal health overview</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => toast({ title: "Notifications", description: "No new notifications" })}>
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => toast({ title: "Settings", description: "Settings panel coming soon!" })}>
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => toast({ title: "Team Management", description: "Team features coming soon!" })}>
            <Users className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="legal-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{loading ? '...' : stats.documents}</p>
                <p className="text-sm text-muted-foreground">Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="legal-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">{loading ? '...' : stats.deadlines}</p>
                <p className="text-sm text-muted-foreground">Deadlines</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="legal-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-destructive" />
              <div>
                <p className="text-2xl font-bold">{loading ? '...' : stats.highPriority}</p>
                <p className="text-sm text-muted-foreground">High Priority</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="legal-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-8 w-8 text-success" />
              <div>
                <p className="text-2xl font-bold">{loading ? '...' : `${stats.compliance}%`}</p>
                <p className="text-sm text-muted-foreground">Compliance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document Upload Section */}
        <Card className="legal-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Upload Document
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Upload your legal documents</h3>
              <p className="text-muted-foreground mb-4">Drag and drop files here, or click to browse</p>
              <Button variant="professional" onClick={handleUpload}>Upload Document</Button>
            </div>
          </CardContent>
        </Card>

        {/* Legal Risk Score */}
        <Card className="legal-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Legal Risk Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-success mb-2">{riskScore}</div>
              <p className="text-sm text-muted-foreground mb-4">out of 100</p>
              <Progress value={riskScore} className="mb-4" />
              <p className="text-sm font-medium text-success">Good legal health</p>
              <Button variant="outline" className="w-full mt-4" onClick={generateHealthCheckup}>
                Generate Legal Health Checkup
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Deadlines */}
        <Card className="legal-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming Deadlines
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/deadlines')}>View All →</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-muted-foreground mt-2">Loading deadlines...</p>
                </div>
              ) : upcomingDeadlines.length > 0 ? (
                upcomingDeadlines.map((deadline, index) => {
                  const dueDate = new Date(deadline.dueDate);
                  const today = new Date();
                  const daysLeft = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                  
                  const getPriorityColor = (priority) => {
                    switch (priority) {
                      case 'critical': return 'bg-destructive';
                      case 'high': return 'bg-destructive';
                      case 'medium': return 'bg-warning';
                      case 'low': return 'bg-success';
                      default: return 'bg-muted';
                    }
                  };

                  return (
                    <div key={deadline._id || index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(deadline.priority)}`}></div>
                        <div>
                          <p className="font-medium">{deadline.title}</p>
                          <p className="text-sm text-muted-foreground">{dueDate.toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{daysLeft} days</p>
                        <p className="text-xs text-muted-foreground">remaining</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-4">
                  <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No upcoming deadlines</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="legal-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start h-auto p-3"
                  onClick={action.action}
                >
                  <action.icon className="h-5 w-5 mr-3 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">{action.title}</p>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;