
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ExternalLink, Star } from "lucide-react";
import { dataManager } from "@/data/dataManager";
import { AITool } from "@/data/aiTools";
import { supabase } from "@/integrations/supabase/client";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const ProfileFavorites = () => {
  const { user } = useUserPreferences();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteTools, setFavoriteTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);

  const allTools = dataManager.getAllAITools();

  useEffect(() => {
    if (user?.id) {
      loadFavorites();
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    // Update favorite tools whenever favorites change
    const tools = allTools.filter(tool => favorites.includes(tool.id));
    setFavoriteTools(tools.slice(0, 6)); // Show only first 6 in profile
  }, [favorites, allTools]);

  const loadFavorites = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('item_id')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      const favoriteIds = data?.map(fav => fav.item_id) || [];
      setFavorites(favoriteIds);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (toolId: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('item_id', toolId);
      
      if (error) throw error;
      
      setFavorites(prev => prev.filter(id => id !== toolId));
      toast.success("Removed from favorites");
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error("Failed to remove favorite");
    }
  };

  if (loading) {
    return (
      <Card className="w-full animate-fade-in">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Favorites</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-6">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
            <span className="ml-2 text-sm text-muted-foreground">Loading favorites...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Favorites</CardTitle>
          {favoriteTools.length > 0 && (
            <Link to="/favorites">
              <Button variant="outline" size="sm">
                View All ({favorites.length})
              </Button>
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {favoriteTools.length === 0 ? (
          <div className="text-center py-6">
            <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-4">No favorites saved yet</p>
            <Link to="/tools">
              <Button variant="outline" size="sm">
                <Star className="w-4 h-4 mr-2" />
                Explore Tools
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {favoriteTools.map((tool) => (
              <div key={tool.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-sm truncate">{tool.name}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {tool.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {tool.description}
                  </p>
                </div>
                <div className="flex items-center space-x-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(tool.url, "_blank")}
                    className="h-8 w-8 p-0"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFavorite(tool.id)}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </Button>
                </div>
              </div>
            ))}
            {favorites.length > 6 && (
              <div className="text-center pt-2">
                <Link to="/favorites">
                  <Button variant="ghost" size="sm">
                    View {favorites.length - 6} more favorites
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileFavorites;
