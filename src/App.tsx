import React, { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import Layout from '@/components/Layout';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorBoundary from '@/components/ErrorBoundary';
import { UserPreferencesProvider } from '@/contexts/UserPreferencesContext';
import { TransitionProvider } from '@/contexts/TransitionContext';
import AnalyticsConsent from '@/components/AnalyticsConsent';
import { useAdRemoval } from '@/hooks/useAdRemoval';
import { FixedBottomAd } from '@/components/ads/FixedBottomAd';

// Lazy load all pages for better performance
const Index = lazy(() => import('@/pages/Index'));
const Tools = lazy(() => import('@/pages/Tools'));
const ToolsWithFilters = lazy(() => import('@/pages/ToolsWithFilters'));
const Pricing = lazy(() => import('@/pages/Pricing'));
const PromptRefinery = lazy(() => import('@/pages/PromptRefinery'));
const Prompts = lazy(() => import('@/pages/Prompts'));
const PromptPack = lazy(() => import('@/pages/PromptPack'));
const Content = lazy(() => import('@/pages/Content'));
const Business = lazy(() => import('@/pages/Business'));
const School = lazy(() => import('@/pages/School'));
const Career = lazy(() => import('@/pages/Career'));
const PDFTools = lazy(() => import('@/pages/PDFTools'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy'));
const Help = lazy(() => import('@/pages/Help'));
const Profile = lazy(() => import('@/pages/Profile'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Favorites = lazy(() => import('@/pages/Favorites'));
const PaymentSuccess = lazy(() => import('@/pages/PaymentSuccess'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const Login = lazy(() => import('@/pages/Login'));
const SignUp = lazy(() => import('@/pages/SignUp'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  // Remove ad scripts when user is upgraded to pro
  useAdRemoval();

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <TooltipProvider>
            <UserPreferencesProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <TransitionProvider>
                  <AnalyticsConsent />
                  <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                      <Route path="/" element={<Layout />}>
                        <Route index element={<Index />} />
                        <Route path="login" element={<Login />} />
                        <Route path="signup" element={<SignUp />} />
                        <Route path="forgot-password" element={<ForgotPassword />} />
                        <Route path="reset-password" element={<ResetPassword />} />
                        <Route path="tools" element={<Tools />} />
                        <Route path="tools-with-filters" element={<ToolsWithFilters />} />
                        <Route path="content" element={<Content />} />
                        <Route path="business" element={<Business />} />
                        <Route path="school" element={<School />} />
                        <Route path="career" element={<Career />} />
                        <Route path="pdf-tools" element={<PDFTools />} />
                        <Route path="pricing" element={<Pricing />} />
                        <Route path="about" element={<About />} />
                        <Route path="contact" element={<Contact />} />
                        <Route path="privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="help" element={<Help />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="account" element={<Profile />} />
                        <Route path="prompt-refinery" element={<PromptRefinery />} />
                        <Route path="prompts" element={<Prompts />} />
                        <Route path="prompt/:id" element={<PromptPack />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="favorites" element={<Favorites />} />
                        <Route path="payment-success" element={<PaymentSuccess />} />
                        <Route path="*" element={<NotFound />} />
                      </Route>
                    </Routes>
                  </Suspense>
                </TransitionProvider>
                <FixedBottomAd />
              </BrowserRouter>
            </UserPreferencesProvider>
          </TooltipProvider>
        </HelmetProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;