
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserPreferencesProvider } from "@/contexts/UserPreferencesContext";
import { TransitionProvider } from "@/contexts/TransitionContext";
import Index from "./pages/Index";
import Tools from "./pages/Tools";
import Prompts from "./pages/Prompts";
import CategorySchool from "./pages/CategorySchool";
import CategoryContent from "./pages/CategoryContent";
import CategoryBusiness from "./pages/CategoryBusiness";
import CategoryCareer from "./pages/CategoryCareer";
import CategoryPDF from "./pages/CategoryPDF";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Help from "./pages/Help";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Pricing from "./pages/Pricing";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserPreferencesProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <TransitionProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/prompts" element={<Prompts />} />
              <Route path="/school" element={<CategorySchool />} />
              <Route path="/content" element={<CategoryContent />} />
              <Route path="/business" element={<CategoryBusiness />} />
              <Route path="/career" element={<CategoryCareer />} />
              <Route path="/pdf" element={<CategoryPDF />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/help" element={<Help />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TransitionProvider>
        </BrowserRouter>
      </TooltipProvider>
    </UserPreferencesProvider>
  </QueryClientProvider>
);

export default App;
