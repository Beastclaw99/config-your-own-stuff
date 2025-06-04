import { Project } from '../types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EditProjectDialog } from '../dialogs/EditProjectDialog';
import { DeleteProjectDialog } from '../dialogs/DeleteProjectDialog';
import { ReviewDialog } from '../dialogs/ReviewDialog';
import { formatDate } from '@/utils/dateUtils';
import { formatCurrency } from '@/utils/currencyUtils';

interface ProjectsTabProps {
  projects: Project[];
  editProject: Project | null;
  projectToDelete: string | null;
  editedProject: Partial<Project> | null;
  isSubmitting: boolean;
  onEditInitiate: (project: Project) => void;
  onEditCancel: () => void;
  onUpdateProject: (projectId: string, updates: Partial<Project>) => Promise<void>;
  onDeleteInitiate: (projectId: string) => void;
  onDeleteCancel: () => void;
  onDeleteProject: (projectId: string) => Promise<void>;
  onReviewInitiate: (projectId: string) => void;
}

export const ProjectsTab = ({
  projects,
  editProject,
  projectToDelete,
  editedProject,
  isSubmitting,
  onEditInitiate,
  onEditCancel,
  onUpdateProject,
  onDeleteInitiate,
  onDeleteCancel,
  onDeleteProject,
  onReviewInitiate
}: ProjectsTabProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-purple-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                  <CardDescription>
                    Posted on {formatDate(project.created_at)}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(project.status)}>
                  {project.status.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="flex-grow">
              <p className="text-sm text-gray-600 mb-4">
                {project.description}
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Budget:</span>
                  <span className="text-sm">{formatCurrency(project.budget)}</span>
                </div>
                {project.deadline && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Deadline:</span>
                    <span className="text-sm">{formatDate(project.deadline)}</span>
                  </div>
                )}
                {project.category && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Category:</span>
                    <span className="text-sm">{project.category}</span>
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditInitiate(project)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteInitiate(project.id)}
                >
                  Delete
                </Button>
              </div>
              {project.status === 'completed' && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onReviewInitiate(project.id)}
                >
                  Review
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Dialogs */}
      <EditProjectDialog
        project={editProject}
        editedProject={editedProject}
        isSubmitting={isSubmitting}
        onCancel={onEditCancel}
        onUpdate={onUpdateProject}
      />

      <DeleteProjectDialog
        projectId={projectToDelete}
        isSubmitting={isSubmitting}
        onCancel={onDeleteCancel}
        onDelete={onDeleteProject}
      />

      <ReviewDialog
        projectId={projectToDelete}
        isSubmitting={isSubmitting}
        onCancel={onDeleteCancel}
        onSubmit={onUpdateProject}
      />
    </div>
  );
}; 