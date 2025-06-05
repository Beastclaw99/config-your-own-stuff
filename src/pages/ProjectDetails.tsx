import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/components/dashboard/types';
import ProjectUpdateTimeline from '@/components/shared/UnifiedProjectUpdateTimeline';
import ProjectChat from '@/components/project/ProjectChat';
import { MapPin, DollarSign, Calendar, User, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { ChatBubbleLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { getProject, applyToProject, sendMessage, getProjectMessages } from '@/services/api';
import type { Project, Message } from '@/types';

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (id) {
      loadProject();
      loadMessages();
    }
  }, [id]);

  const loadProject = async () => {
    if (!id) return;
    try {
      const projectData = await getProject(id);
      setProject(projectData);
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    if (!id) return;
    try {
      const messagesData = await getProjectMessages(id);
      setMessages(messagesData);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleApplyToProject = async () => {
    if (!id || !currentUser) return;
    try {
      setIsApplying(true);
      await applyToProject(id);
      await loadProject();
    } catch (error) {
      console.error('Error applying to project:', error);
    } finally {
      setIsApplying(false);
    }
  };

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    setShowMessageModal(true);
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !id) return;
    
    try {
      const newMessage: Message = {
        id: Date.now().toString(),
        content,
        senderId: currentUser?.id || '',
        senderName: currentUser?.name || 'Unknown',
        timestamp: new Date().toISOString(),
        projectId: id,
        read: false
      };

      // Optimistically update UI
      setMessages((prev: Message[]) => [newMessage, ...prev]);
      
      // Send to backend
      await sendMessage(id, content);
      
      // Refresh messages to get server state
      await loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      // Revert optimistic update on error
      setMessages((prev: Message[]) => prev.filter((m: Message) => m.id !== Date.now().toString()));
    }
  };

  const handleCloseMessageModal = () => {
    setShowMessageModal(false);
    setSelectedMessage(null);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container-custom py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="container-custom py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Project not found</h1>
            <Button onClick={() => navigate('/dashboard')}>
              Return to Dashboard
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      'open': 'bg-green-100 text-green-800',
      'in_progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-gray-100 text-gray-800',
      'cancelled': 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={statusColors[status] || 'bg-gray-100 text-gray-800'}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
      </Badge>
    );
  };

  const requiredSkills = project.required_skills && typeof project.required_skills === 'string' 
    ? project.required_skills.split(',').map(skill => skill.trim())
    : [];

  return (
    <Layout>
      <div className="bg-gray-50 py-8">
        <div className="container-custom">
          <Button 
            variant="outline" 
            onClick={() => navigate('/project-marketplace')}
            className="mb-6"
          >
            ← Back to Projects
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl mb-2">{project.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Posted {new Date(project.created_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {project.client?.first_name} {project.client?.last_name}
                        </span>
                      </div>
                    </div>
                    {getStatusBadge(project.status)}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>
                      <p className="text-gray-700">{project.description}</p>
                    </div>

                    {project.requirements && project.requirements.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">Requirements</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {project.requirements.map((req, index) => (
                            <li key={index} className="text-gray-700">{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {requiredSkills.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">Required Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {requiredSkills.map((skill, index) => (
                            <Badge key={index} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Project Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProjectUpdateTimeline 
                    projectId={project.id}
                    projectStatus={project.status}
                    showAddUpdate={false}
                  />
                </CardContent>
              </Card>

              {/* Project Chat */}
              {project.professional_id && (
                <ProjectChat
                  projectId={project.id}
                  projectStatus={project.status}
                  clientId={project.client_id}
                  professionalId={project.professional_id}
                />
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Budget:</span>
                    <span>{project.budget}</span>
                  </div>

                  {project.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Location:</span>
                      <span>{project.location}</span>
                    </div>
                  )}

                  {project.expected_timeline && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Timeline:</span>
                      <span>{project.expected_timeline}</span>
                    </div>
                  )}

                  {project.urgency && (
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Urgency:</span>
                      <span className="capitalize">{project.urgency}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {project.status === 'open' && (
                <Card>
                  <CardContent className="pt-6">
                    <Button 
                      onClick={handleApplyToProject}
                      disabled={isApplying}
                      className="w-full bg-ttc-blue-700 hover:bg-ttc-blue-800"
                    >
                      {isApplying ? "Applying..." : "Apply for this Project"}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {project.professional && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Assigned Professional
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium">
                      {project.professional.first_name} {project.professional.last_name}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Project Messages Section */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Project Messages</h3>
                    <button
                      onClick={() => setShowMessageModal(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <ChatBubbleLeftIcon className="h-5 w-5 mr-2" />
                      New Message
                    </button>
                  </div>

                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <ChatBubbleLeftIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No messages</h3>
                      <p className="mt-1 text-sm text-gray-500">Get started by sending a message.</p>
                      <div className="mt-6">
                        <button
                          onClick={() => setShowMessageModal(true)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <ChatBubbleLeftIcon className="h-5 w-5 mr-2" />
                          Send Message
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          onClick={() => handleMessageClick(message)}
                          className="p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900">{message.senderName}</span>
                                <span className="text-sm text-gray-500">
                                  {new Date(message.timestamp).toLocaleString()}
                                </span>
                              </div>
                              <p className="mt-1 text-gray-700">{message.content}</p>
                            </div>
                            {!message.read && message.senderId !== currentUser?.id && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                New
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Message Modal */}
              {showMessageModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {selectedMessage ? 'View Message' : 'New Message'}
                        </h3>
                        <button
                          onClick={handleCloseMessageModal}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <XMarkIcon className="h-6 w-6" />
                        </button>
                      </div>

                      {selectedMessage ? (
                        <div className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900">{selectedMessage.senderName}</span>
                              <span className="text-sm text-gray-500">
                                {new Date(selectedMessage.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="mt-2 text-gray-700">{selectedMessage.content}</p>
                          </div>
                          <div className="flex justify-end">
                            <button
                              onClick={handleCloseMessageModal}
                              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={handleCloseMessageModal}
                              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => {
                                handleSendMessage(newMessage);
                                setNewMessage('');
                                setShowMessageModal(false);
                              }}
                              disabled={!newMessage.trim()}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Send Message
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetails;
