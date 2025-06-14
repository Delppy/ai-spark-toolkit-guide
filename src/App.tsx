
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserPreferencesProvider } from "@/contexts/UserPreferencesContext";
import Index from "./pages/Index";
import Tools from "./pages/Tools";
import Prompts from "./pages/Prompts";
import CategorySchool from "./pages/CategorySchool";
import CategoryContent from "./pages/CategoryContent";
import CategoryBusiness from "./pages/CategoryBusiness";
import CategoryCareer from "./pages/CategoryCareer";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserPreferencesProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/prompts" element={<Prompts />} />
            <Route path="/school" element={<CategorySchool />} />
            <Route path="/content" element={<CategoryContent />} />
            <Route path="/business" element={<CategoryBusiness />} />
            <Route path="/career" element={<CategoryCareer />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserPreferencesProvider>
  </QueryClientProvider>
);

export default App;
