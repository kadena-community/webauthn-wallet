import React, { createContext, useContext, useState } from 'react';

import { Notification } from '@/components/shared/Notification/Notification';

export type NotificationVariant = 'error' | 'warning' | 'notice' | 'success';

export interface Notification {
  id: number;
  variant: NotificationVariant;
  title: string;
  message?: string;
  timeout?: number;
}

export interface AddNotification extends Omit<Notification, 'id'> {}

interface NotificationsContextType {
  notifications: Notification[];
  addNotification: (props: AddNotification) => void;
}

const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      'useNotifications must be used within a NotificationsProvider',
    );
  }
  return context;
};

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = ({
    variant,
    title,
    message,
    timeout = 3000,
  }: AddNotification) => {
    const id = Date.now();
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      { id, variant, title, message },
    ]);
    setTimeout(() => {
      setNotifications((prevNotifications) =>
        prevNotifications.filter((n) => n.id !== id),
      );
    }, timeout);
  };

  return (
    <NotificationsContext.Provider value={{ notifications, addNotification }}>
      {children}
    </NotificationsContext.Provider>
  );
};
