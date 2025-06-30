
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Scale, 
  Star, 
  Users, 
  Check, 
  X, 
  ExternalLink, 
  Plus,
  Trash2
} from 'lucide-react';
import { AITool } from '@/data/aiTools';

interface ToolComparisonProps {
  tools: AITool[];
  onToolSelect?: (tool: AITool) => void;
}

export const ToolComparison: React.FC<ToolComparisonProps> = ({
  tools,
  onToolSelect
}) => {
  const [selectedTools, setSelectedTools] = useState<AITool[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  const addToComparison = (tool: AITool) => {
    if (selectedTools.length < 3 && !selectedTools.find(t => t.id === tool.id)) {
      setSelectedTools([...selectedTools, tool]);
    }
  };

  const removeFromComparison = (toolId: string) => {
    setSelectedTools(selectedTools.filter(t => t.id !== toolId));
  };

  const clearComparison = () => {
    setSelectedTools([]);
  };

  const ComparisonTable = () => {
    if (selectedTools.length === 0) return null;

    const allFeatures = Array.from(
      new Set(selectedTools.flatMap(tool => tool.features))
    ).sort();

    const priceComparison = selectedTools.map(tool => ({
      tool: tool.name,
      free: tool.freeOffering,
      rating: tool.rating,
      users: tool.users
    }));

    return (
      <div className="space-y-6">
        {/* Basic Info Comparison */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feature</TableHead>
                {selectedTools.map(tool => (
                  <TableHead key={tool.id} className="text-center">
                    {tool.name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Category</TableCell>
                {selectedTools.map(tool => (
                  <TableCell key={tool.id} className="text-center">
                    <Badge variant="secondary">{tool.category}</Badge>
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Rating</TableCell>
                {selectedTools.map(tool => (
                  <TableCell key={tool.id} className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{tool.rating}</span>
                    </div>
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Users</TableCell>
                {selectedTools.map(tool => (
                  <TableCell key={tool.id} className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{tool.users}</span>
                    </div>
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Free Offering</TableCell>
                {selectedTools.map(tool => (
                  <TableCell key={tool.id} className="text-center">
                    <Badge variant="outline">{tool.freeOffering.replace('_', ' ')}</Badge>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Features Comparison */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Features Comparison</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feature</TableHead>
                {selectedTools.map(tool => (
                  <TableHead key={tool.id} className="text-center">
                    {tool.name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {allFeatures.map(feature => (
                <TableRow key={feature}>
                  <TableCell className="font-medium">{feature}</TableCell>
                  {selectedTools.map(tool => (
                    <TableCell key={tool.id} className="text-center">
                      {tool.features.includes(feature) ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-500 mx-auto" />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          {selectedTools.map(tool => (
            <Button key={tool.id} onClick={() => window.open(tool.url, '_blank')}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Try {tool.name}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Comparison Floating Bar */}
      {selectedTools.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <Card className="p-4 shadow-lg border-2 border-purple-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Scale className="w-5 h-5 text-purple-600" />
                <span className="font-medium">
                  {selectedTools.length} tool{selectedTools.length !== 1 ? 's' : ''} selected
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                {selectedTools.map(tool => (
                  <Badge 
                    key={tool.id} 
                    variant="secondary" 
                    className="flex items-center space-x-1"
                  >
                    <span>{tool.name}</span>
                    <button
                      onClick={() => removeFromComparison(tool.id)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <Dialog open={isComparisonOpen} onOpenChange={setIsComparisonOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">Compare</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Tool Comparison</DialogTitle>
                    </DialogHeader>
                    <ComparisonTable />
                  </DialogContent>
                </Dialog>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearComparison}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Add to Comparison Buttons (these would be added to ToolCard) */}
      <div className="hidden">
        {tools.map(tool => (
          <Button
            key={tool.id}
            variant="outline"
            size="sm"
            onClick={() => addToComparison(tool)}
            disabled={selectedTools.length >= 3 || selectedTools.find(t => t.id === tool.id) !== undefined}
          >
            <Plus className="w-4 h-4 mr-1" />
            Compare
          </Button>
        ))}
      </div>
    </div>
  );
};
