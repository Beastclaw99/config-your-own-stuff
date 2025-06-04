
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectCard from './ProjectCard';
import ProjectListItem from './ProjectListItem';
import { Project } from '@/components/dashboard/types';

interface ProjectsDisplayProps {
  projects: Project[];
  loading: boolean;
  viewMode: 'grid' | 'list';
}

const ProjectsDisplay: React.FC<ProjectsDisplayProps> = ({ projects, loading, viewMode }) => {
  const navigate = useNavigate();
  
  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };
  
  if (loading) {
    return (
      <div className="my-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4 animate-pulse">
              <div className="h-6 bg-gray-200 rounded-md w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
              <div className="h-20 bg-gray-200 rounded-md w-full"></div>
              <div className="h-4 bg-gray-200 rounded-md w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (projects.length === 0) {
    return (
      <div className="my-8 text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No projects found</h3>
        <p className="text-gray-500">Try adjusting your filters or search term.</p>
      </div>
    );
  }
  
  return (
    <div className="my-8">
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onClick={() => handleProjectClick(project.id)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map(project => (
            <ProjectListItem 
              key={project.id} 
              project={project}
              onClick={() => handleProjectClick(project.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsDisplay;
