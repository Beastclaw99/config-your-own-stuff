
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, CheckCircle, Clock, MessageSquare, DollarSign, User } from 'lucide-react';

const Notifications: React.FC = () => {
  const [notifications] = useState([
    {
      id: '1',
      type: 'application',
      title: 'New Application Received',
      message: 'John Smith applied to your Kitchen Renovation project',
      timestamp: '2 hours ago',
      read: false,
      icon: User
    },
    {
      id: '2',
      type: 'payment',
      title: 'Payment Processed',
      message: 'Payment of TTD 2,500 has been processed for Bathroom Plumbing project',
      timestamp: '5 hours ago',
      read: false,
      icon: DollarSign
    },
    {
      id: '3',
      type: 'message',
      title: 'New Message',
      message: 'You have a new message from Maria Rodriguez',
      timestamp: '1 day ago',
      read: true,
      icon: MessageSquare
    },
    {
      id: '4',
      type: 'project',
      title: 'Project Completed',
      message: 'Your Electrical Installation project has been marked as completed',
      timestamp: '2 days ago',
      read: true,
      icon: CheckCircle
    },
    {
      id: '5',
      type: 'reminder',
      title: 'Project Deadline Approaching',
      message: 'Home Painting project deadline is in 3 days',
      timestamp: '3 days ago',
      read: true,
      icon: Clock
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'application': return 'bg-blue-100 text-blue-800';
      case 'payment': return 'bg-green-100 text-green-800';
      case 'message': return 'bg-purple-100 text-purple-800';
      case 'project': return 'bg-orange-100 text-orange-800';
      case 'reminder': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="bg-gray-50 py-8">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Notifications</h1>
              <p className="text-gray-600">
                Stay updated with your project activities and platform updates
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Bell className="h-3 w-3" />
                {unreadCount} unread
              </Badge>
              <Button variant="outline" size="sm">
                Mark all as read
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            {notifications.map((notification) => {
              const IconComponent = notification.icon;
              return (
                <Card key={notification.id} className={`${!notification.read ? 'border-l-4 border-l-ttc-blue-600 bg-ttc-blue-50' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-full bg-white">
                        <IconComponent className="h-5 w-5 text-ttc-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{notification.title}</h3>
                              <Badge variant="outline" className={getTypeColor(notification.type)}>
                                {notification.type}
                              </Badge>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-ttc-blue-600 rounded-full"></div>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                            <span className="text-xs text-gray-500">{notification.timestamp}</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {notifications.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No notifications yet</h3>
                <p className="text-gray-600">
                  When you start using ProLinkTT, your notifications will appear here.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Notifications;
