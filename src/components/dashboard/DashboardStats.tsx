
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Heart, TrendingUp, Star } from "lucide-react";

interface DashboardStatsProps {
  toolsUsed: number;
  favoritesCount: number;
  weeklyUsage: number;
  averageRating: number;
}

const DashboardStats = ({ toolsUsed, favoritesCount, weeklyUsage, averageRating }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Tools Used</p>
              <p className="text-2xl font-bold text-slate-900">{toolsUsed}</p>
            </div>
            <Activity className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-xs text-slate-500 mt-2">Total interactions</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Favorites</p>
              <p className="text-2xl font-bold text-slate-900">{favoritesCount}</p>
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
              <p className="text-2xl font-bold text-slate-900">{weeklyUsage}</p>
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
              <p className="text-2xl font-bold text-slate-900">{averageRating.toFixed(1)}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
          <p className="text-xs text-slate-500 mt-2">Tools you've rated</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
