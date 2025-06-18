
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Profile from '@/pages/Profile';
import CategorySchool from '@/pages/CategorySchool';
import CategoryBusiness from '@/pages/CategoryBusiness';
import CategoryContent from '@/pages/CategoryContent';
import CategoryCareer from '@/pages/CategoryCareer';
import CategoryPDF from '@/pages/CategoryPDF';
import Pricing from '@/pages/Pricing';
import PaymentVerify from '@/pages/PaymentVerify';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Help from '@/pages/Help';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import NotFound from '@/pages/NotFound';
import { UserPreferencesProvider } from "@/contexts/UserPreferencesContext";
import { TransitionProvider } from "@/contexts/TransitionContext";
import ToolsWithFilters from "@/pages/ToolsWithFilters";
import Favorites from "@/pages/Favorites";
import Prompts from "@/pages/Prompts";

const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <UserPreferencesProvider>
          <Router>
            <TransitionProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/tools" element={<ToolsWithFilters />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/prompts" element={<Prompts />} />
                <Route path="/school" element={<CategorySchool />} />
                <Route path="/business" element={<CategoryBusiness />} />
                <Route path="/content" element={<CategoryContent />} />
                <Route path="/career" element={<CategoryCareer />} />
                <Route path="/pdf" element={<CategoryPDF />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/payment-verify" element={<PaymentVerify />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/help" element={<Help />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TransitionProvider>
          </Router>
        </UserPreferencesProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
