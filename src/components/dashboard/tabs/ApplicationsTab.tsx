import { Application } from '../types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from '@/utils/dateUtils';
import { formatCurrency } from '@/utils/currencyUtils';

interface ApplicationsTabProps {
  applications: Application[];
  onApplicationUpdate: (applicationId: string, status: string) => Promise<void>;
}

export const ApplicationsTab = ({
  applications,
  onApplicationUpdate
}: ApplicationsTabProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'accepted':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    try {
      await onApplicationUpdate(applicationId, newStatus);
    } catch (error) {
      console.error('Failed to update application status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {applications.map((application) => (
          <Card key={application.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">
                    {application.project?.title || 'Project Title Not Available'}
                  </CardTitle>
                  <CardDescription>
                    Applied by {application.professional?.first_name} {application.professional?.last_name} on {formatDate(application.created_at)}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(application.status)}>
                  {application.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="flex-grow">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Cover Letter</h4>
                  <p className="text-sm text-gray-600">
                    {application.cover_letter}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Proposal</h4>
                  <p className="text-sm text-gray-600">
                    {application.proposal_message}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium">Bid Amount:</span>
                    <p className="text-sm">{formatCurrency(application.bid_amount)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Availability:</span>
                    <p className="text-sm">{application.availability}</p>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end space-x-2">
              {application.status === 'pending' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusUpdate(application.id, 'rejected')}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleStatusUpdate(application.id, 'accepted')}
                  >
                    Accept
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}; 