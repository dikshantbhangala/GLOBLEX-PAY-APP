import { createContext, useContext, useEffect, useReducer } from 'react';
import { api } from '../services/api';
import { NotificationService } from '../services/notifications';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

const initialState = {
  notifications: [],
  unreadCount: 0,
  pushToken: null,
  loading: false,
  error: null,
};

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_NOTIFICATIONS':
      return { 
        ...state, 
        notifications: action.payload,
        unreadCount: action.payload.filter(n => !n.read).length,
        loading: false 
      };
    case 'ADD_NOTIFICATION':
      return { 
        ...state, 
        notifications: [action.payload, ...state.notifications],
        unreadCount: action.payload.read ? state.unreadCount : state.unreadCount + 1
      };
    case 'MARK_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => 
          n.id === action.payload ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      };
    case 'MARK_ALL_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0
      };
    case 'SET_PUSH_TOKEN':
      return { ...state, pushToken: action.payload };
    case 'CLEAR_NOTIFICATIONS':
      return initialState;
    default:
      return state;
  }
};

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const { user, token } = useAuth();

  const registerForPushNotifications = async () => {
    try {
      const token = await NotificationService.registerForPushNotifications();
      if (token) {
        dispatch({ type: 'SET_PUSH_TOKEN', payload: token });
        await api.updatePushToken(token);
      }
    } catch (error) {
      console.error('Failed to register for push notifications:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await api.getNotifications();
      dispatch({ type: 'SET_NOTIFICATIONS', payload: response.notifications });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.markNotificationAsRead(notificationId);
      dispatch({ type: 'MARK_AS_READ', payload: notificationId });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.markAllNotificationsAsRead();
      dispatch({ type: 'MARK_ALL_AS_READ' });
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const sendLocalNotification = async (title, body, data = {}) => {
    await NotificationService.scheduleNotification(title, body, data);
  };

  useEffect(() => {
    if (user && token) {
      registerForPushNotifications();
      fetchNotifications();
    } else {
      dispatch({ type: 'CLEAR_NOTIFICATIONS' });
    }
  }, [user, token]);

  const value = {
    ...state,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    sendLocalNotification,
    registerForPushNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};