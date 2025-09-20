import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Calendar, FileText, AlertTriangle, BarChart3, Menu, X, MessageSquare, BookOpen, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ClarioLogo from "@/components/ClarioLogo";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Calendar, label: "Deadlines", path: "/deadlines" },
    { icon: FileText, label: "Documents", path: "/documents" },
    { icon: MessageSquare, label: "AI Chat", path: "/ai-chat" },
    { icon: AlertTriangle, label: "Clause Checker", path: "/clause-checker" },
    { icon: Eye, label: "Side-by-Side", path: "/side-by-side" },
    { icon: BookOpen, label: "Glossary", path: "/glossary" },
    { icon: BarChart3, label: "Reports", path: "/reports" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={cn(
      "h-screen bg-card border-r border-border transition-all duration-300 flex flex-col",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && <ClarioLogo size="sm" />}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  isActive(item.path)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-border">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">© 2025 Clario</p>
            <p className="text-xs text-muted-foreground">Prototype Demo</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;