import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { StarRating } from '@/components/ui/star-rating';

/**
 * ReviewSubmissionForm - Component for submitting end-of-project mutual reviews
 * This is used after project completion for both clients and professionals to review each other
 */
interface ReviewSubmissionFormProps {
  projectId: string;
  revieweeId: string;
  revieweeType: 'client' | 'professional';
  onSubmit?: (review: any) => void;
}

const ReviewSubmissionForm: React.FC<ReviewSubmissionFormProps> = ({
  projectId,
  revieweeId,
  revieweeType,
  onSubmit
}) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({
        projectId,
        revieweeId,
        revieweeType,
        rating,
        comment: reviewText
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit {revieweeType === 'client' ? 'Client' : 'Professional'} Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Rating</Label>
            <StarRating
              value={rating}
              onChange={setRating}
              className="mt-2"
            />
          </div>
          
          <div>
            <Label htmlFor="review">Review</Label>
            <Textarea
              id="review"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder={`Share your experience working with this ${revieweeType}...`}
              className="mt-2"
              rows={4}
            />
          </div>

          <Button type="submit" disabled={rating === 0 || !reviewText.trim()}>
            Submit Review
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewSubmissionForm;
