import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
}

export const createNotification = async (
  userId: string,
  title: string,
  message: string,
  type: Notification['type'] = 'info'
): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert([
        {
          user_id: userId,
          title,
          message,
          type,
          read: false
        }
      ]);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { error: error as Error };
  }
};

export const markNotificationAsRead = async (
  notificationId: string
): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { error: error as Error };
  }
};

export const getUnreadNotifications = async (
  userId: string
): Promise<{ data: Notification[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('read', false)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching unread notifications:', error);
    return { data: null, error: error as Error };
  }
}; 