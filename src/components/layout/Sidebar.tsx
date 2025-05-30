import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/contexts/NotificationContext';
import {
  Home,
  Briefcase,
  MessageSquare,
  Bell,
  User,
  Settings,
  LogOut
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { unreadCount } = useNotifications();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/projects', icon: Briefcase, label: 'Projects' },
    { path: '/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/notifications', icon: Bell, label: 'Notifications', badge: unreadCount },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="flex flex-col h-full bg-white border-r">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-ttc-blue-600">ProLinkTT</h1>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md',
                location.pathname === item.path
                  ? 'bg-ttc-blue-50 text-ttc-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className="h-5 w-5 mr-3" />
              <span className="flex-1">{item.label}</span>
              {item.badge > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:text-gray-900"
          onClick={() => {
            // Handle logout
          }}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar; 