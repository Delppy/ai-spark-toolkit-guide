
import React, { lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import ErrorBoundary from '@/components/ErrorBoundary';
import LazyWrapper from '@/components/LazyWrapper';
import LoadingSpinner from '@/components/LoadingSpinner';
import AnalyticsConsent from '@/components/AnalyticsConsent';
import { usePageTracking } from '@/hooks/usePageTracking';
// Lazy load pages for better performance
const Index = lazy(() => import('@/pages/Index'));
const Login = lazy(() => import('@/pages/Login'));
const Signup = lazy(() => import('@/pages/Signup'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const Profile = lazy(() => import('@/pages/Profile'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const CategorySchool = lazy(() => import('@/pages/CategorySchool'));
const CategoryBusiness = lazy(() => import('@/pages/CategoryBusiness'));
const CategoryContent = lazy(() => import('@/pages/CategoryContent'));
const CategoryCareer = lazy(() => import('@/pages/CategoryCareer'));
const CategoryPDF = lazy(() => import('@/pages/CategoryPDF'));
const Pricing = lazy(() => import('@/pages/Pricing'));
const PaymentVerify = lazy(() => import('@/pages/PaymentVerify'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));
const Help = lazy(() => import('@/pages/Help'));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy'));
const NotFound = lazy(() => import('@/pages/NotFound'));
import { UserPreferencesProvider } from "@/contexts/UserPreferencesContext";
import { TransitionProvider } from "@/contexts/TransitionContext";

const ToolsWithFilters = lazy(() => import('@/pages/ToolsWithFilters'));
const Favorites = lazy(() => import('@/pages/Favorites'));
const Prompts = lazy(() => import('@/pages/Prompts'));
const PromptPack = lazy(() => import('@/pages/PromptPack'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (replaces cacheTime)
    },
  },
});

// Page tracking component
const PageTracker = () => {
  usePageTracking();
  return null;
};

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <UserPreferencesProvider>
            <Router>
              <PageTracker />
              <TransitionProvider>
                <LazyWrapper fallback={
                  <div className="min-h-screen flex items-center justify-center">
                    <LoadingSpinner size="lg" text="Loading..." />
                  </div>
                }>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/tools" element={<ToolsWithFilters />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/prompts" element={<Prompts />} />
                    <Route path="/prompts/:packId" element={<PromptPack />} />
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
                </LazyWrapper>
                <AnalyticsConsent />
              </TransitionProvider>
            </Router>
          </UserPreferencesProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
