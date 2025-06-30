
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Star, 
  Clock, 
  Users, 
  Activity,
  Heart,
  Bookmark,
  ExternalLink
} from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { dataManager } from '@/data/dataManager';
import { AITool } from '@/data/aiTools';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useUserPreferences();
  const [favorites, setFavorites] = useState<AITool[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [usageStats, setUsageStats] = useState<any[]>([]);
  const [categoryStats, setCategoryStats] = useState<any[]>([]);

  const allTools = dataManager.getAllAITools();

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = () => {
    // Mock data - replace with real data from Supabase
    const mockFavorites = allTools.slice(0, 5);
    setFavorites(mockFavorites);

    const mockActivity = [
      { action: 'Used ChatGPT', timestamp: new Date(Date.now() - 1000 * 60 * 30), category: 'General AI' },
      { action: 'Bookmarked Midjourney', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), category: 'Image Generation' },
      { action: 'Reviewed Claude AI', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), category: 'General AI' },
      { action: 'Used Canva AI', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), category: 'Content Creation' },
    ];
    setRecentActivity(mockActivity);

    const mockUsageStats = [
      { name: 'Mon', tools: 3 },
      { name: 'Tue', tools: 5 },
      { name: 'Wed', tools: 2 },
      { name: 'Thu', tools: 8 },
      { name: 'Fri', tools: 4 },
      { name: 'Sat', tools: 6 },
      { name: 'Sun', tools: 1 },
    ];
    setUsageStats(mockUsageStats);

    const mockCategoryStats = [
      { name: 'General AI', value: 40, color: '#8B5CF6' },
      { name: 'Content Creation', value: 25, color: '#10B981' },
      { name: 'Image Generation', value: 20, color: '#F59E0B' },
      { name: 'Business', value: 10, color: '#EF4444' },
      { name: 'Other', value: 5, color: '#6B7280' },
    ];
    setCategoryStats(mockCategoryStats);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 1000 * 60) return 'just now';
    if (diff < 1000 * 60 * 60) return `${Math.floor(diff / (1000 * 60))}m ago`;
    if (diff < 1000 * 60 * 60 * 24) return `${Math.floor(diff / (1000 * 60 * 60))}h ago`;
    return `${Math.floor(diff / (1000 * 60 * 60 * 24))}d ago`;
  };

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <Activity className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Sign in to view your dashboard</h2>
            <p className="text-slate-600 mb-6">Track your AI tool usage and discover new tools tailored to your needs.</p>
            <Link to="/login">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Your AI Dashboard</h1>
          <p className="text-slate-600">Track your AI tool usage and discover insights</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Stats Cards */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Tools Used</p>
                  <p className="text-2xl font-bold text-slate-900">23</p>
                </div>
                <Activity className="w-8 h-8 text-blue-500" />
              </div>
              <p className="text-xs text-slate-500 mt-2">+12% from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Favorites</p>
                  <p className="text-2xl font-bold text-slate-900">{favorites.length}</p>
                </div>
                <Heart className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-xs text-slate-500 mt-2">Your saved tools</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">This Week</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {usageStats.reduce((sum, day) => sum + day.tools, 0)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-xs text-slate-500 mt-2">Tools explored</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Avg. Rating</p>
                  <p className="text-2xl font-bold text-slate-900">4.6</p>
                </div>
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
              <p className="text-xs text-slate-500 mt-2">Tools you've rated</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Usage Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={usageStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="tools" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Category Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {categoryStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: stat.color }}
                      />
                      <span>{stat.name}</span>
                    </div>
                    <span className="font-medium">{stat.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-b-0">
                    <div>
                      <p className="font-medium text-slate-900">{activity.action}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {activity.category}
                        </Badge>
                        <span className="text-xs text-slate-500">
                          {formatTimeAgo(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Access to Favorites */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bookmark className="w-5 h-5" />
                  <span>Favorite Tools</span>
                </div>
                <Link to="/favorites">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {favorites.slice(0, 4).map((tool) => (
                  <div key={tool.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{tool.name}</p>
                      <p className="text-sm text-slate-600">{tool.category}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => window.open(tool.url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
