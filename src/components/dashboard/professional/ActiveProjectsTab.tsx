
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Briefcase, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  MapPin, 
  DollarSign,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Target,
  FileText,
  Edit,
  Eye
} from "lucide-react";
import { Project } from '../types';
import ProjectUpdateTimeline from "@/components/project/ProjectUpdateTimeline";
import ProjectMilestones from "@/components/project/ProjectMilestones";
import ProjectDeliverables from "@/components/project/ProjectDeliverables";
import { ProgressIndicator } from "@/components/ui/progress-indicator";

interface ActiveProjectsTabProps {
  isLoading: boolean;
  projects: Project[];
  userId: string;
  markProjectComplete: (projectId: string) => Promise<void>;
}

const ActiveProjectsTab: React.FC<ActiveProjectsTabProps> = ({ 
  isLoading, 
  projects, 
  userId, 
  markProjectComplete 
}) => {
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<Record<string, string>>({});

  const toggleProjectExpansion = (projectId: string) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  const setProjectTab = (projectId: string, tabValue: string) => {
    setActiveTab(prev => ({
      ...prev,
      [projectId]: tabValue
    }));
  };

  const getProjectProgress = (project: Project) => {
    // Calculate progress based on project status and milestones
    if (project.status === 'completed') return 100;
    if (project.status === 'open') return 0;
    if (project.status === 'assigned') return 25;
    return 50; // default for in-progress
  };

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'assigned':
        return <Target className="h-4 w-4 text-blue-600" />;
      case 'open':
        return <Clock className="h-4 w-4 text-gray-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getProjectSteps = (project: Project) => {
    return [
      {
        id: 'assigned',
        title: 'Assigned',
        status: project.status === 'assigned' ? 'current' : 'completed' as 'completed' | 'current' | 'pending'
      },
      {
        id: 'in_progress',
        title: 'In Progress',
        status: project.status === 'in_progress' ? 'current' : 
               ['assigned'].includes(project.status) ? 'pending' : 'completed' as 'completed' | 'current' | 'pending'
      },
      {
        id: 'review',
        title: 'Review',
        status: project.status === 'review' ? 'current' : 
               ['assigned', 'in_progress'].includes(project.status) ? 'pending' : 'completed' as 'completed' | 'current' | 'pending'
      },
      {
        id: 'completed',
        title: 'Completed',
        status: project.status === 'completed' ? 'completed' : 'pending' as 'completed' | 'current' | 'pending'
      }
    ];
  };

  const activeProjects = projects.filter(p => 
    ['assigned', 'in_progress', 'review'].includes(p.status) && p.assigned_to === userId
  );

  const completedProjects = projects.filter(p => 
    p.status === 'completed' && p.assigned_to === userId
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Active Projects Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Target className="h-6 w-6 text-blue-600" />
            Active Projects ({activeProjects.length})
          </h2>
          <Badge variant="outline" className="px-3 py-1">
            {activeProjects.length} in progress
          </Badge>
        </div>

        {activeProjects.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="text-center py-12">
              <Briefcase className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Projects</h3>
              <p className="text-gray-600">You don't have any active projects at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {activeProjects.map(project => (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{project.title}</CardTitle>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(project.status)}
                          <Badge variant="outline" className="capitalize">
                            {project.status.replace('_', ' ')}
                          </Badge>
                          {project.urgency && (
                            <Badge className={`border ${getUrgencyColor(project.urgency)}`}>
                              {project.urgency} Priority
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <CardDescription className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Started {new Date(project.created_at || '').toLocaleDateString()}
                        </span>
                        {project.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {project.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          ${project.budget?.toLocaleString()}
                        </span>
                      </CardDescription>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleProjectExpansion(project.id)}
                      >
                        {expandedProjects[project.id] ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Project Progress */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Project Progress</span>
                      <span className="text-gray-600">{getProjectProgress(project)}%</span>
                    </div>
                    <Progress value={getProjectProgress(project)} className="h-2" />
                    <ProgressIndicator 
                      steps={getProjectSteps(project)}
                      orientation="horizontal"
                    />
                  </div>

                  <Separator />

                  {/* Project Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Client:</span>
                      <p>{project.client?.first_name} {project.client?.last_name}</p>
                    </div>
                    {project.expected_timeline && (
                      <div>
                        <span className="font-medium text-gray-700">Timeline:</span>
                        <p>{project.expected_timeline}</p>
                      </div>
                    )}
                    {project.category && (
                      <div>
                        <span className="font-medium text-gray-700">Category:</span>
                        <p className="capitalize">{project.category}</p>
                      </div>
                    )}
                  </div>

                  {project.description && (
                    <div>
                      <span className="font-medium text-gray-700">Description:</span>
                      <p className="text-gray-600 mt-1">{project.description}</p>
                    </div>
                  )}

                  {/* Expanded Content */}
                  {expandedProjects[project.id] && (
                    <div className="mt-6 border-t pt-6">
                      <Tabs 
                        value={activeTab[project.id] || 'timeline'} 
                        onValueChange={(value) => setProjectTab(project.id, value)}
                        className="w-full"
                      >
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="timeline" className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Timeline
                          </TabsTrigger>
                          <TabsTrigger value="milestones" className="flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Milestones
                          </TabsTrigger>
                          <TabsTrigger value="deliverables" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Deliverables
                          </TabsTrigger>
                          <TabsTrigger value="details" className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            Details
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="timeline" className="mt-4">
                          <ProjectUpdateTimeline 
                            projectId={project.id} 
                            projectStatus={project.status}
                          />
                        </TabsContent>

                        <TabsContent value="milestones" className="mt-4">
                          <ProjectMilestones 
                            projectId={project.id}
                            canEdit={true}
                          />
                        </TabsContent>

                        <TabsContent value="deliverables" className="mt-4">
                          <ProjectDeliverables 
                            projectId={project.id}
                            canUpload={true}
                          />
                        </TabsContent>

                        <TabsContent value="details" className="mt-4">
                          <div className="space-y-4">
                            {project.requirements && project.requirements.length > 0 && (
                              <div>
                                <h4 className="font-medium mb-2">Requirements</h4>
                                <ul className="list-disc pl-5 space-y-1">
                                  {project.requirements.map((req, index) => (
                                    <li key={index} className="text-sm text-gray-600">{req}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {project.required_skills && (
                              <div>
                                <h4 className="font-medium mb-2">Required Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                  {project.required_skills.split(',').map((skill, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {skill.trim()}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="bg-gray-50 border-t">
                  <div className="flex w-full gap-3">
                    <Button 
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => markProjectComplete(project.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Completed
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <FileText className="h-4 w-4 mr-2" />
                      Submit Update
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Completed Projects Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Completed Projects ({completedProjects.length})
          </h2>
        </div>

        {completedProjects.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="text-center py-8">
              <CheckCircle className="w-10 h-10 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600">You don't have any completed projects yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {completedProjects.map(project => (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <Badge className="bg-green-100 text-green-800">
                      Completed
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    Completed {new Date(project.created_at || '').toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Client:</span>
                      <span>{project.client?.first_name} {project.client?.last_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Budget:</span>
                      <span className="font-medium">${project.budget?.toLocaleString()}</span>
                    </div>
                  </div>
                  {project.description && (
                    <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                      {project.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveProjectsTab;
