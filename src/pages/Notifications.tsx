import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NotificationList from '@/components/notifications/NotificationList';
import { useAuth } from '@/contexts/AuthContext';

const Notifications: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="container-custom py-8">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <NotificationList userId={user.id} />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Notifications;
