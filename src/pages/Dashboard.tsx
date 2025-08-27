
import React from 'react';
import { Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Link } from 'react-router-dom';
import { useDashboardData } from '@/hooks/useDashboardData';
import DashboardStats from '@/components/dashboard/DashboardStats';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import RecentActivity from '@/components/dashboard/RecentActivity';
import FavoritesList from '@/components/dashboard/FavoritesList';

const Dashboard = () => {
  const { user } = useUserPreferences();
  const dashboardData = useDashboardData(user?.id || null);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <Activity className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-primary mb-4">Sign in to view your dashboard</h2>
            <p className="text-muted-foreground mb-6">Track your AI tool usage and discover new tools tailored to your needs.</p>
            <Link to="/login">
              <Button>Sign In</Button>
            </Link>
        </div>
      </div>
    );
  }

  if (dashboardData.loading) {
    return (
      <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
            <span className="ml-3 text-muted-foreground">Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Your AI Dashboard</h1>
          <p className="text-muted-foreground">Track your AI tool usage and discover insights</p>
        </div>

        <div className="space-y-8">
          <DashboardStats
            toolsUsed={dashboardData.totalToolsUsed}
            favoritesCount={dashboardData.favorites.length}
            weeklyUsage={dashboardData.weeklyUsage}
            averageRating={dashboardData.averageRating}
          />

          <DashboardCharts
            usageStats={dashboardData.usageStats}
            categoryStats={dashboardData.categoryStats}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RecentActivity activities={dashboardData.recentActivity} />
            <FavoritesList 
              favoriteTools={dashboardData.favoriteTools}
              totalFavorites={dashboardData.favorites.length}
            />
          </div>
      </div>
    </div>
  );
};

export default Dashboard;
