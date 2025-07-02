
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, ExternalLink } from "lucide-react";
import { AITool } from "@/data/aiTools";
import { Link } from "react-router-dom";

interface FavoritesListProps {
  favoriteTools: AITool[];
  totalFavorites: number;
}

const FavoritesList = ({ favoriteTools, totalFavorites }: FavoritesListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bookmark className="w-5 h-5" />
            <span>Favorite Tools</span>
          </div>
          {totalFavorites > 0 && (
            <Link to="/favorites">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {favoriteTools.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">No favorites yet</p>
          ) : (
            favoriteTools.slice(0, 4).map((tool) => (
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
            ))
          )}
          {totalFavorites > 4 && (
            <div className="text-center pt-2">
              <Link to="/favorites">
                <Button variant="ghost" size="sm">
                  View {totalFavorites - 4} more favorites
                </Button>
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FavoritesList;
