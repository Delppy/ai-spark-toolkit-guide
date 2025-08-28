
import React, { useState } from "react";
import { ToolCard } from "@/components/ToolCard";
import { schoolAITools, contentAITools, businessAITools, careerAITools, AITool } from "@/data/aiTools";
import { toast } from "sonner";

const Tools = () => {
  const aiTools: AITool[] = [...schoolAITools, ...contentAITools, ...businessAITools, ...careerAITools];
  const [favorites, setFavorites] = useState<string[]>([]);

  const handleFavoriteClick = (toolId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      if (prev.includes(toolId)) {
        toast.info("Removed from favorites");
        return prev.filter((id) => id !== toolId);
      } else {
        toast.success("Added to favorites");
        return [...prev, toolId];
      }
    });
  };

  const handleToolClick = (toolId: string, url: string) => {
    console.log(`Navigating to ${url} for tool ${toolId}`);
    window.open(url, "_blank");
  };

  const isFavorite = (toolId: string) => favorites.includes(toolId);
  
  return (
    <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Explore AI Tools
          </h2>
          <p className="text-xl text-slate-600 mt-4 max-w-2xl mx-auto">
            Find the best AI tools to help you with any task. Here's a list of all available tools.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiTools.map((tool) => (
            <ToolCard 
              key={tool.id} 
              tool={tool}
              onFavoriteClick={handleFavoriteClick}
              onToolClick={handleToolClick}
              isFavorite={isFavorite}
            />
          ))}
      </div>
    </div>
  );
};

export default Tools;
