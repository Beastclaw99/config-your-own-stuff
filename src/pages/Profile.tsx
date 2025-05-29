
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Star, 
  Calendar, 
  Phone, 
  Mail, 
  Briefcase,
  Award,
  MessageCircle,
  Edit,
  Camera
} from 'lucide-react';

const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isOwnProfile, setIsOwnProfile] = useState(!id); // If no ID, it's own profile
  
  // Mock profile data - in real app, this would be fetched based on ID
  const [profile] = useState({
    id: id || 'current-user',
    name: 'John Smith',
    profession: 'Licensed Electrician',
    location: 'Port of Spain, Trinidad',
    rating: 4.8,
    completedProjects: 23,
    joinDate: '2023-03-15',
    phone: '+1 (868) 555-0123',
    email: 'john.smith@email.com',
    bio: 'Experienced electrician with over 10 years in residential and commercial electrical work. Specialized in modern electrical installations, smart home setups, and electrical safety compliance.',
    skills: ['Electrical Installation', 'Home Wiring', 'Commercial Electric', 'Smart Home Setup', 'Safety Compliance'],
    certifications: ['Licensed Electrician TT', 'Electrical Safety Certification', 'Smart Home Installation'],
    hourlyRate: 75,
    availability: 'Available'
  });

  const [recentProjects] = useState([
    {
      id: '1',
      title: 'Smart Home Electrical Setup',
      client: 'Maria Rodriguez',
      completedDate: '2024-01-15',
      rating: 5,
      review: 'Excellent work! John was professional and completed the installation perfectly.'
    },
    {
      id: '2',
      title: 'Commercial Office Wiring',
      client: 'TechCorp Ltd.',
      completedDate: '2024-01-08',
      rating: 4,
      review: 'Great job on the office rewiring. Clean work and finished on time.'
    },
    {
      id: '3',
      title: 'Home Electrical Repair',
      client: 'David Chen',
      completedDate: '2023-12-20',
      rating: 5,
      review: 'Fixed our electrical issues quickly and explained everything clearly.'
    }
  ]);

  return (
    <Layout>
      <div className="bg-gray-50 py-8">
        <div className="container-custom">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="relative">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={`https://api.dicebear.com/6/initials/svg?seed=${profile.name}`} />
                    <AvatarFallback className="text-2xl">{profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  {isOwnProfile && (
                    <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full p-2">
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
                      <p className="text-xl text-ttc-blue-600 font-medium mb-2">{profile.profession}</p>
                      <div className="flex items-center gap-4 text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {profile.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {profile.rating} ({profile.completedProjects} projects)
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Joined {new Date(profile.joinDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {isOwnProfile ? (
                        <Button className="flex items-center gap-2">
                          <Edit className="h-4 w-4" />
                          Edit Profile
                        </Button>
                      ) : (
                        <>
                          <Button variant="outline" className="flex items-center gap-2">
                            <MessageCircle className="h-4 w-4" />
                            Message
                          </Button>
                          <Button className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4" />
                            Hire Now
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 mb-4">
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                      {profile.availability}
                    </Badge>
                    <span className="text-lg font-semibold">TTD {profile.hourlyRate}/hour</span>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Skills & Expertise</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {profile.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Award className="h-5 w-5" />
                          Certifications
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {profile.certifications.map((cert, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <Award className="h-5 w-5 text-ttc-blue-600" />
                              <span>{cert}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="projects">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentProjects.map((project) => (
                          <div key={project.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold">{project.title}</h3>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm">{project.rating}</span>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">Client: {project.client}</p>
                            <p className="text-gray-600 text-sm mb-3">Completed: {new Date(project.completedDate).toLocaleDateString()}</p>
                            <p className="text-gray-700 italic">"{project.review}"</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews">
                  <Card>
                    <CardHeader>
                      <CardTitle>Client Reviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {recentProjects.map((project) => (
                          <div key={project.id} className="border-b pb-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>{project.client.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{project.client}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < project.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-700 mb-2">"{project.review}"</p>
                            <p className="text-sm text-gray-500">{project.title} • {new Date(project.completedDate).toLocaleDateString()}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!isOwnProfile && (
                    <>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-gray-500" />
                        <span>{profile.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-gray-500" />
                        <span>{profile.email}</span>
                      </div>
                    </>
                  )}
                  
                  {isOwnProfile && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Contact details are only visible to clients you're working with.</p>
                      <Button variant="outline" size="sm">
                        Update Contact Info
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Projects Completed</span>
                    <span className="font-semibold">{profile.completedProjects}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Rating</span>
                    <span className="font-semibold">{profile.rating}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Response Rate</span>
                    <span className="font-semibold">95%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">On-Time Completion</span>
                    <span className="font-semibold">98%</span>
                  </div>
                </CardContent>
              </Card>

              {!isOwnProfile && (
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full">Request Quote</Button>
                    <Button variant="outline" className="w-full">Add to Network</Button>
                    <Button variant="outline" className="w-full">Report Profile</Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
