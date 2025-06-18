
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, ThumbsUp, ThumbsDown, MoreVertical } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { toast } from 'sonner';

interface Review {
  id: string;
  user_id: string;
  tool_id: string;
  rating: number;
  title?: string;
  content?: string;
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

interface ReviewVote {
  user_id: string;
  review_id: string;
  is_helpful: boolean;
}

interface ReviewCardProps {
  review: Review;
  userVote?: ReviewVote;
  onVoteChange: (reviewId: string, isHelpful: boolean) => void;
  canEdit?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  userVote,
  onVoteChange,
  canEdit = false,
  onEdit,
  onDelete
}) => {
  const { user } = useUserPreferences();
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (isHelpful: boolean) => {
    if (!user?.id) {
      toast.error("Please log in to vote on reviews");
      return;
    }

    if (user.id === review.user_id) {
      toast.error("You cannot vote on your own review");
      return;
    }

    setIsVoting(true);
    try {
      if (userVote) {
        if (userVote.is_helpful === isHelpful) {
          // Remove vote if clicking the same button
          const { error } = await supabase
            .from('review_votes')
            .delete()
            .eq('user_id', user.id)
            .eq('review_id', review.id);
          
          if (error) throw error;
          onVoteChange(review.id, !isHelpful); // Toggle for removal
        } else {
          // Update existing vote
          const { error } = await supabase
            .from('review_votes')
            .update({ is_helpful: isHelpful })
            .eq('user_id', user.id)
            .eq('review_id', review.id);
          
          if (error) throw error;
          onVoteChange(review.id, isHelpful);
        }
      } else {
        // Create new vote
        const { error } = await supabase
          .from('review_votes')
          .insert({
            user_id: user.id,
            review_id: review.id,
            is_helpful: isHelpful
          });
        
        if (error) throw error;
        onVoteChange(review.id, isHelpful);
      }
    } catch (error) {
      console.error('Error voting on review:', error);
      toast.error("Failed to record your vote");
    } finally {
      setIsVoting(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getUserInitials = (userId: string) => {
    // Simple function to create initials from user ID
    return userId.substring(0, 2).toUpperCase();
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="text-xs">
                {getUserInitials(review.user_id)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  {renderStars(review.rating)}
                </div>
                <Badge variant="secondary" className="text-xs">
                  {review.rating}/5
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
          {canEdit && (
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="w-4 h-4" />
            </Button>
          )}
        </div>
        {review.title && (
          <h4 className="font-semibold text-sm mt-2">{review.title}</h4>
        )}
      </CardHeader>
      
      <CardContent className="pt-0">
        {review.content && (
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            {review.content}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVote(true)}
              disabled={isVoting || user?.id === review.user_id}
              className={`h-8 px-2 ${
                userVote?.is_helpful === true 
                  ? 'bg-green-100 text-green-700 hover:bg-green-100' 
                  : ''
              }`}
            >
              <ThumbsUp className="w-3 h-3 mr-1" />
              <span className="text-xs">Helpful</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVote(false)}
              disabled={isVoting || user?.id === review.user_id}
              className={`h-8 px-2 ${
                userVote?.is_helpful === false 
                  ? 'bg-red-100 text-red-700 hover:bg-red-100' 
                  : ''
              }`}
            >
              <ThumbsDown className="w-3 h-3 mr-1" />
              <span className="text-xs">Not helpful</span>
            </Button>
          </div>
          
          {review.helpful_count > 0 && (
            <span className="text-xs text-muted-foreground">
              {review.helpful_count} found this helpful
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
