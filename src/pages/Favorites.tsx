
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { ToolCard } from "@/components/ToolCard";
import { Button } from "@/components/ui/button";
import { dataManager } from "@/data/dataManager";
import { AITool } from "@/data/aiTools";
import { Heart, Star } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { Link } from "react-router-dom";

const Favorites = () => {
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
    setFavoriteTools(tools);
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
      toast.error("Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteClick = async (toolId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user?.id) {
      toast.error("Please log in to manage favorites");
      return;
    }

    try {
      const isFavorited = favorites.includes(toolId);
      
      if (isFavorited) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('item_id', toolId);
        
        if (error) throw error;
        
        setFavorites(prev => prev.filter(id => id !== toolId));
        toast.success("Removed from favorites");
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
      toast.error("Failed to update favorites");
    }
  };

  const handleToolClick = (toolId: string, url: string) => {
    console.log(`Navigating to ${url} for tool ${toolId}`);
    window.open(url, "_blank");
  };

  const isFavorite = (toolId: string) => favorites.includes(toolId);

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Sign in to view favorites</h2>
            <p className="text-slate-600 mb-6">Create an account to save and organize your favorite AI tools.</p>
            <Link to="/login">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading your favorites...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-purple-900 to-blue-900 bg-clip-text text-transparent">
            Your Favorite Tools
          </h2>
          <p className="text-xl text-slate-600 mt-4 max-w-2xl mx-auto">
            Quick access to the AI tools you've saved for later.
          </p>
        </div>

        {favoriteTools.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No favorites yet</h3>
            <p className="text-slate-500 mb-6">Start exploring and save tools you love!</p>
            <Link to="/tools">
              <Button>
                <Star className="w-4 h-4 mr-2" />
                Explore Tools
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-slate-600">
                You have {favoriteTools.length} favorite tool{favoriteTools.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteTools.map((tool) => (
                <ToolCard 
                  key={tool.id} 
                  tool={tool}
                  onFavoriteClick={handleFavoriteClick}
                  onToolClick={handleToolClick}
                  isFavorite={isFavorite}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Favorites;
