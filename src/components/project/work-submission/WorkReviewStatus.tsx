import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface WorkReviewStatusProps {
  status: 'pending_review' | 'approved' | 'revision_requested';
  submittedAt?: string;
  reviewedAt?: string;
  revisionNotes?: string;
}

const WorkReviewStatus: React.FC<WorkReviewStatusProps> = ({
  status,
  submittedAt,
  reviewedAt,
  revisionNotes
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending_review':
        return {
          icon: Clock,
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          text: 'Pending Review'
        };
      case 'approved':
        return {
          icon: CheckCircle,
          color: 'bg-green-100 text-green-800 border-green-200',
          text: 'Approved'
        };
      case 'revision_requested':
        return {
          icon: AlertCircle,
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          text: 'Revision Requested'
        };
      default:
        return {
          icon: Clock,
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          text: 'Unknown Status'
        };
    }
  };

  const statusConfig = getStatusConfig();
  const Icon = statusConfig.icon;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            <Badge variant="outline" className={statusConfig.color}>
              {statusConfig.text}
            </Badge>
          </div>
        </div>

        <div className="mt-4 space-y-2 text-sm text-gray-600">
          {submittedAt && (
            <p>Submitted: {new Date(submittedAt).toLocaleString()}</p>
          )}
          {reviewedAt && (
            <p>Reviewed: {new Date(reviewedAt).toLocaleString()}</p>
          )}
          {revisionNotes && (
            <div className="mt-2 p-2 bg-orange-50 rounded">
              <p className="font-medium text-orange-800">Revision Notes:</p>
              <p className="text-orange-700">{revisionNotes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkReviewStatus; 