import { Ionicons } from '@expo/vector-icons';
import { useContext, useEffect, useState } from 'react';
import {
    Alert,
    RefreshControl,
    ScrollView,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NotificationContext } from '../context/NotificationContext';
import api from '../services/api';
import styles from '../styles/commonStyles';

const NotificationsScreen = ({ navigation }) => {
  const { notifications, markAsRead, clearAllNotifications } = useContext(NotificationContext);
  const [refreshing, setRefreshing] = useState(false);
  const [settings, setSettings] = useState({
    transactionAlerts: true,
    rateAlerts: true,
    promotionalOffers: false,
    securityAlerts: true,
    emailNotifications: true,
    pushNotifications: true,
  });

  useEffect(() => {
    fetchNotificationSettings();
  }, []);

  const fetchNotificationSettings = async () => {
    try {
      const response = await api.getNotificationSettings();
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to fetch notification settings:', error);
    }
  };

  const updateNotificationSetting = async (key, value) => {
    try {
      const updatedSettings = { ...settings, [key]: value };
      setSettings(updatedSettings);
      await api.updateNotificationSettings(updatedSettings);
    } catch (error) {
      Alert.alert('Error', 'Failed to update notification settings');
      // Revert the change
      setSettings(prevSettings => ({ ...prevSettings, [key]: !value }));
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchNotificationSettings();
    } catch (error) {
      console.error('Failed to refresh:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return { name: 'checkmark-circle', color: '#4CAF50' };
      case 'warning':
        return { name: 'warning', color: '#FF9800' };
      case 'error':
        return { name: 'close-circle', color: '#F44336' };
      case 'info':
        return { name: 'information-circle', color: '#2196F3' };
      case 'security':
        return { name: 'shield-checkmark', color: '#FFD700' };
      case 'rate':
        return { name: 'trending-up', color: '#9C27B0' };
      default:
        return { name: 'notifications', color: '#FFD700' };
    }
  };

  const renderNotificationItem = (notification) => {
    const iconInfo = getNotificationIcon(notification.type);
    
    return (
      <TouchableOpacity
        key={notification.id}
        style={[
          styles.notificationItem,
          !notification.read && styles.unreadNotification
        ]}
        onPress={() => {
          markAsRead(notification.id);
          // Handle navigation based on notification type
          if (notification.action) {
            navigation.navigate(notification.action.screen, notification.action.params);
          }
        }}
      >
        <View style={styles.notificationIcon}>
          <Ionicons name={iconInfo.name} size={24} color={iconInfo.color} />
        </View>
        
        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>{notification.title}</Text>
          <Text style={styles.notificationMessage}>{notification.message}</Text>
          <Text style={styles.notificationTime}>
            {formatTimestamp(notification.timestamp)}
          </Text>
        </View>
        
        {!notification.read && <View style={styles.unreadIndicator} />}
      </TouchableOpacity>
    );
  };

  const renderNotificationSettings = () => (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Notification Settings</Text>
      
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>Transaction Alerts</Text>
          <Text style={styles.settingDescription}>
            Get notified when money is sent or received
          </Text>
        </View>
        <Switch
          value={settings.transactionAlerts}
          onValueChange={(value) => updateNotificationSetting('transactionAlerts', value)}
          trackColor={{ false: '#333333', true: '#FFD700' }}
          thumbColor={settings.transactionAlerts ? '#000000' : '#666666'}
        />
      </View>

      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>Rate Alerts</Text>
          <Text style={styles.settingDescription}>
            Notify when exchange rates reach your targets
          </Text>
        </View>
        <Switch
          value={settings.rateAlerts}
          onValueChange={(value) => updateNotificationSetting('rateAlerts', value)}
          trackColor={{ false: '#333333', true: '#FFD700' }}
          thumbColor={settings.rateAlerts ? '#000000' : '#666666'}
        />
      </View>

      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>Security Alerts</Text>
          <Text style={styles.settingDescription}>
            Important security and account notifications
          </Text>
        </View>
        <Switch
          value={settings.securityAlerts}
          onValueChange={(value) => updateNotificationSetting('securityAlerts', value)}
          trackColor={{ false: '#333333', true: '#FFD700' }}
          thumbColor={settings.securityAlerts ? '#000000' : '#666666'}
        />
      </View>

      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>Promotional Offers</Text>
          <Text style={styles.settingDescription}>
            Special offers and feature announcements
          </Text>
        </View>
        <Switch
          value={settings.promotionalOffers}
          onValueChange={(value) => updateNotificationSetting('promotionalOffers', value)}
          trackColor={{ false: '#333333', true: '#FFD700' }}
          thumbColor={settings.promotionalOffers ? '#000000' : '#666666'}
        />
      </View>

      <View style={styles.settingDivider} />

      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>Email Notifications</Text>
          <Text style={styles.settingDescription}>
            Receive notifications via email
          </Text>
        </View>
        <Switch
          value={settings.emailNotifications}
          onValueChange={(value) => updateNotificationSetting('emailNotifications', value)}
          trackColor={{ false: '#333333', true: '#FFD700' }}
          thumbColor={settings.emailNotifications ? '#000000' : '#666666'}
        />
      </View>

      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>Push Notifications</Text>
          <Text style={styles.settingDescription}>
            Receive push notifications on your device
          </Text>
        </View>
        <Switch
          value={settings.pushNotifications}
          onValueChange={(value) => updateNotificationSetting('pushNotifications', value)}
          trackColor={{ false: '#333333', true: '#FFD700' }}
          thumbColor={settings.pushNotifications ? '#000000' : '#666666'}
        />
      </View>
    </View>
  );

  const groupNotificationsByDate = (notifications) => {
    const groups = {};
    
    notifications.forEach(notification => {
      const date = new Date(notification.timestamp);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let dateKey;
      if (date.toDateString() === today.toDateString()) {
        dateKey = 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        dateKey = 'Yesterday';
      } else {
        dateKey = date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'short', 
          day: 'numeric' 
        });
      }
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(notification);
    });
    
    return groups;
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const groupedNotifications = groupNotificationsByDate(notifications);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            Notifications {unreadCount > 0 && `(${unreadCount})`}
          </Text>
          <TouchableOpacity 
            onPress={() => {
              Alert.alert(
                'Clear All Notifications',
                'Are you sure you want to clear all notifications?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Clear All', 
                    style: 'destructive',
                    onPress: clearAllNotifications
                  }
                ]
              );
            }}
          >
            <Ionicons name="trash-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Notification Summary */}
        <View style={styles.notificationSummary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{notifications.length}</Text>
            <Text style={styles.summaryLabel}>Total</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryNumber, { color: '#FFD700' }]}>{unreadCount}</Text>
            <Text style={styles.summaryLabel}>Unread</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryNumber, { color: '#4CAF50' }]}>
              {notifications.filter(n => n.read).length}
            </Text>
            <Text style={styles.summaryLabel}>Read</Text>
          </View>
        </View>

        {/* Notifications List */}
        {notifications.length > 0 ? (
          Object.entries(groupedNotifications).map(([dateKey, dayNotifications]) => (
            <View key={dateKey} style={styles.notificationGroup}>
              <Text style={styles.notificationGroupTitle}>{dateKey}</Text>
              {dayNotifications.map(notification => renderNotificationItem(notification))}
            </View>
          ))
        ) : (
          <View style={styles.emptyNotifications}>
            <Ionicons name="notifications-off-outline" size={60} color="#666666" />
            <Text style={styles.emptyNotificationsTitle}>No notifications yet</Text>
            <Text style={styles.emptyNotificationsText}>
              You'll see transaction updates, rate alerts, and other important notifications here
            </Text>
          </View>
        )}

        {/* Notification Settings */}
        {renderNotificationSettings()}

        {/* Quick Actions */}
        <View style={styles.quickActionsCard}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Transaction')}
          >
            <Ionicons name="send-outline" size={20} color="#FFD700" />
            <Text style={styles.actionButtonText}>Send Money</Text>
            <Ionicons name="chevron-forward" size={16} color="#666666" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Wallet')}
          >
            <Ionicons name="wallet-outline" size={20} color="#FFD700" />
            <Text style={styles.actionButtonText}>View Wallet</Text>
            <Ionicons name="chevron-forward" size={16} color="#666666" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('CurrencyConverter')}
          >
            <Ionicons name="swap-horizontal-outline" size={20} color="#FFD700" />
            <Text style={styles.actionButtonText}>Convert Currency</Text>
            <Ionicons name="chevron-forward" size={16} color="#666666" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationsScreen;