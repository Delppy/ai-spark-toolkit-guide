
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ReviewCard } from './ReviewCard';
import { ReviewForm } from './ReviewForm';
import { Star, MessageSquare, Plus, Filter } from 'lucide-react';
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

interface ToolReviewsProps {
  toolId: string;
  toolName: string;
}

export const ToolReviews: React.FC<ToolReviewsProps> = ({ toolId, toolName }) => {
  const { user } = useUserPreferences();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userVotes, setUserVotes] = useState<ReviewVote[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'helpful'>('newest');

  useEffect(() => {
    loadReviews();
    if (user?.id) {
      loadUserVotes();
    }
  }, [toolId, user?.id, sortBy]);

  const loadReviews = async () => {
    try {
      let query = supabase
        .from('reviews')
        .select('*')
        .eq('tool_id', toolId);

      // Apply sorting
      switch (sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'helpful':
          query = query.order('helpful_count', { ascending: false });
          break;
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const loadUserVotes = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('review_votes')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      setUserVotes(data || []);
    } catch (error) {
      console.error('Error loading user votes:', error);
    }
  };

  const handleVoteChange = (reviewId: string, isHelpful: boolean) => {
    // Update local state to reflect the vote change
    loadReviews();
    loadUserVotes();
  };

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    loadReviews();
  };

  const getUserVote = (reviewId: string) => {
    return userVotes.find(vote => vote.review_id === reviewId);
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(review => review.rating === rating).length
  }));

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <div className="bg-slate-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Reviews ({reviews.length})
          </h3>
          <Button 
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Write Review
          </Button>
        </div>

        {reviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(averageRating) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold">
                  {averageRating.toFixed(1)} out of 5
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="space-y-1">
              {ratingCounts.map(({ rating, count }) => (
                <div key={rating} className="flex items-center space-x-2 text-sm">
                  <span className="w-8">{rating} ★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full" 
                      style={{ 
                        width: reviews.length > 0 ? `${(count / reviews.length) * 100}%` : '0%' 
                      }}
                    ></div>
                  </div>
                  <span className="w-8 text-muted-foreground">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <ReviewForm
          toolId={toolId}
          toolName={toolName}
          onReviewSubmitted={handleReviewSubmitted}
          onCancel={() => setShowReviewForm(false)}
        />
      )}

      {/* Reviews List */}
      {reviews.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">All Reviews</h4>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'helpful')}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="helpful">Most Helpful</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                userVote={getUserVote(review.id)}
                onVoteChange={handleVoteChange}
                canEdit={user?.id === review.user_id}
              />
            ))}
          </div>
        </div>
      )}

      {reviews.length === 0 && !showReviewForm && (
        <div className="text-center py-8">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-600 mb-2">No reviews yet</h4>
          <p className="text-gray-500 mb-4">Be the first to share your experience with {toolName}!</p>
          <Button onClick={() => setShowReviewForm(true)}>
            Write the First Review
          </Button>
        </div>
      )}
    </div>
  );
};
