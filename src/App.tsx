import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Deadlines from "./pages/Deadlines";
import Documents from "./pages/Documents";
import AIChat from "./pages/AIChat";
import ClauseChecker from "./pages/ClauseChecker";
import SideBySide from "./pages/SideBySide";
import Glossary from "./pages/Glossary";
import NotFound from "./pages/NotFound";
import Sidebar from "./components/Sidebar";

const queryClient = new QueryClient();

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  if (isLandingPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/deadlines" element={<Deadlines />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/ai-chat" element={<AIChat />} />
              <Route path="/clause-checker" element={<ClauseChecker />} />
              <Route path="/side-by-side" element={<SideBySide />} />
              <Route path="/glossary" element={<Glossary />} />
              <Route path="/reports" element={<Dashboard />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;