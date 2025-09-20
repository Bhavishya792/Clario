import { useState } from "react";
import { Calendar, AlertTriangle, Clock, CheckCircle, Plus, Filter, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const Deadlines = () => {
  const { toast } = useToast();
  const [deadlines, setDeadlines] = useState([
    {
      id: 1,
      title: "GST Filing - Q3 2024",
      description: "Quarterly GST return filing for July-September 2024",
      dueDate: "Sep 30, 2025",
      daysLeft: 5,
      priority: "high",
      status: "overdue",
      category: "Tax Compliance",
      assignedTo: "Finance Team",
      tags: ["Tax", "Quarterly", "Urgent"]
    },
    {
      id: 2,
      title: "Trademark Renewal - Logo",
      description: "Renewal of trademark registration for company logo",
      dueDate: "Oct 15, 2025",
      daysLeft: 20,
      priority: "medium",
      status: "upcoming",
      category: "Intellectual Property",
      assignedTo: "Legal Team",
      tags: ["Trademark", "Renewal", "IP"]
    },
    {
      id: 3,
      title: "Annual Board Resolution",
      description: "Annual board meeting and resolution documentation",
      dueDate: "Nov 2, 2025",
      daysLeft: 38,
      priority: "medium",
      status: "upcoming",
      category: "Corporate Governance",
      assignedTo: "Corporate Secretary",
      tags: ["Board", "Annual", "Governance"]
    },
    {
      id: 4,
      title: "Employee Contract Reviews",
      description: "Annual review of all employee contracts",
      dueDate: "Dec 15, 2025",
      daysLeft: 81,
      priority: "low",
      status: "upcoming",
      category: "HR Compliance",
      assignedTo: "HR Department",
      tags: ["HR", "Contracts", "Review"]
    },
    {
      id: 5,
      title: "Data Protection Audit",
      description: "Quarterly data protection compliance audit",
      dueDate: "Oct 8, 2025",
      daysLeft: 13,
      priority: "high",
      status: "in-progress",
      category: "Data Compliance",
      assignedTo: "IT Security Team",
      tags: ["Data Protection", "Audit", "Privacy"]
    },
    {
      id: 6,
      title: "Insurance Policy Renewal",
      description: "Annual renewal of business insurance policy",
      dueDate: "Dec 1, 2025",
      daysLeft: 67,
      priority: "medium",
      status: "upcoming",
      category: "Insurance",
      assignedTo: "Admin Team",
      tags: ["Insurance", "Renewal", "Business"]
    },
    {
      id: 7,
      title: "Software License Audit",
      description: "Annual audit of software licensing compliance",
      dueDate: "Nov 15, 2025",
      daysLeft: 51,
      priority: "low",
      status: "upcoming",
      category: "IT Compliance",
      assignedTo: "IT Department",
      tags: ["Software", "Licensing", "Audit"]
    },
    {
      id: 8,
      title: "Vendor Agreement Review",
      description: "Review of existing vendor agreements and terms",
      dueDate: "Oct 22, 2025",
      daysLeft: 27,
      priority: "medium",
      status: "upcoming",
      category: "Vendor Management",
      assignedTo: "Procurement Team",
      tags: ["Vendor", "Agreement", "Review"]
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "overdue": return "destructive";
      case "upcoming": return "warning";
      case "in-progress": return "default";
      case "completed": return "success";
      default: return "secondary";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "warning";
      case "low": return "success";
      default: return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "overdue": return AlertTriangle;
      case "upcoming": return Clock;
      case "in-progress": return Clock;
      case "completed": return CheckCircle;
      default: return Clock;
    }
  };

  const statusCounts = deadlines.reduce((acc, deadline) => {
    acc[deadline.status] = (acc[deadline.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const markComplete = (id: number) => {
    setDeadlines(prev => prev.map(deadline => 
      deadline.id === id 
        ? { ...deadline, status: "completed" }
        : deadline
    ));
    toast({
      title: "Deadline marked as complete",
      description: "The deadline has been successfully completed.",
    });
  };

  const addNewDeadline = (newDeadline: any) => {
    const deadline = {
      ...newDeadline,
      id: deadlines.length + 1,
      daysLeft: Math.ceil((new Date(newDeadline.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
      status: "upcoming"
    };
    setDeadlines(prev => [...prev, deadline]);
    toast({
      title: "New deadline added",
      description: `${deadline.title} has been added to your deadlines.`,
    });
  };

  const renderDeadlineCard = (deadline: any) => {
    const StatusIcon = getStatusIcon(deadline.status);
    
    return (
      <Card key={deadline.id} className="legal-card hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <StatusIcon className={`h-5 w-5 ${deadline.status === 'overdue' ? 'text-destructive' : 'text-muted-foreground'}`} />
              <div>
                <h3 className="font-semibold text-lg">{deadline.title}</h3>
                <p className="text-sm text-muted-foreground">{deadline.description}</p>
              </div>
            </div>
            <Badge variant={getStatusColor(deadline.status)} className="capitalize">
              {deadline.status.replace('-', ' ')}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{deadline.dueDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{deadline.daysLeft} days remaining</span>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Category:</span>
              <span>{deadline.category}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Assigned to:</span>
              <span>{deadline.assignedTo}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Priority:</span>
              <Badge variant={getPriorityColor(deadline.priority)} size="sm" className="capitalize">
                {deadline.priority}
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-4">
            {deadline.tags.map((tag: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <DeadlineDetailsDialog deadline={deadline}>
              <Button size="sm" variant="outline" className="flex-1">
                View Details
              </Button>
            </DeadlineDetailsDialog>
            <Button 
              size="sm" 
              variant="professional" 
              className="flex-1"
              onClick={() => markComplete(deadline.id)}
              disabled={deadline.status === "completed"}
            >
              {deadline.status === "completed" ? "Completed" : "Mark Complete"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-background via-secondary/20 to-background min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Deadline Tracking</h1>
          <p className="text-muted-foreground">Manage and track all your legal deadlines</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast({ title: "AI Planner", description: "AI deadline planning feature coming soon!" })}>
            <Filter className="h-4 w-4 mr-2" />
            AI Planner
          </Button>
          <AddDeadlineDialog onAdd={addNewDeadline}>
            <Button variant="professional">
              <Plus className="h-4 w-4 mr-2" />
              Add Deadline
            </Button>
          </AddDeadlineDialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="legal-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <div>
                <p className="text-2xl font-bold">{deadlines.length}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="legal-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              <div>
                <p className="text-2xl font-bold">{statusCounts.overdue || 0}</p>
                <p className="text-sm text-muted-foreground">Overdue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="legal-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-6 w-6 text-warning" />
              <div>
                <p className="text-2xl font-bold">{statusCounts.upcoming || 0}</p>
                <p className="text-sm text-muted-foreground">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="legal-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-6 w-6 text-success" />
              <div>
                <p className="text-2xl font-bold">{statusCounts.completed || 0}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deadlines List */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Deadlines</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {deadlines.map(renderDeadlineCard)}
          </div>
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {deadlines.filter(d => d.status === 'overdue').map(renderDeadlineCard)}
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {deadlines.filter(d => d.status === 'upcoming').map(renderDeadlineCard)}
          </div>
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {deadlines.filter(d => d.status === 'in-progress').map(renderDeadlineCard)}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {deadlines.filter(d => d.status === 'completed').map(renderDeadlineCard)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const DeadlineDetailsDialog = ({ deadline, children }: { deadline: any; children: React.ReactNode }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{deadline.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{deadline.description}</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Due Date</Label>
              <p className="font-medium">{deadline.dueDate}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Days Left</Label>
              <p className="font-medium">{deadline.daysLeft} days</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Category</Label>
              <p className="font-medium">{deadline.category}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Assigned to</Label>
              <p className="font-medium">{deadline.assignedTo}</p>
            </div>
          </div>
          
          <div>
            <Label className="text-xs text-muted-foreground">Tags</Label>
            <div className="flex flex-wrap gap-1 mt-1">
              {deadline.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4">
            <Badge variant={deadline.status === 'overdue' ? 'destructive' : 'default'} className="capitalize">
              {deadline.status.replace('-', ' ')}
            </Badge>
            <Badge variant={deadline.priority === 'high' ? 'destructive' : deadline.priority === 'medium' ? 'warning' : 'success'} className="capitalize">
              {deadline.priority} Priority
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const AddDeadlineDialog = ({ onAdd, children }: { onAdd: (deadline: any) => void; children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    category: "",
    assignedTo: "",
    priority: "medium",
    tags: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.dueDate) return;
    
    onAdd({
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    });
    
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      category: "",
      assignedTo: "",
      priority: "medium",
      tags: ""
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Deadline</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter deadline title"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter deadline description"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="e.g., Tax Compliance"
              />
            </div>
            <div>
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Input
                id="assignedTo"
                value={formData.assignedTo}
                onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
                placeholder="e.g., Legal Team"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="e.g., Tax, Quarterly, Urgent"
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="professional">
              Add Deadline
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Deadlines;