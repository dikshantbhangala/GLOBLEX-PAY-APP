import { Ionicons } from '@expo/vector-icons';
import { useContext, useEffect, useState } from 'react';
import {
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import { WalletContext } from '../context/WalletContext';
import { apiService } from '../services/api';

import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import BalanceCard from '../components/wallet/BalanceCard';
import QuickActions from '../components/wallet/QuickActions';
import TransactionItem from '../components/wallet/TransactionItem';

import { colors } from '../styles/colors';
import { fonts } from '../styles/fonts';
import { spacing } from '../styles/spacing';

const DashboardScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const { balance, transactions, updateBalance, updateTransactions } = useContext(WalletContext);
  const { unreadCount } = useContext(NotificationContext);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exchangeRates, setExchangeRates] = useState({});
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [balanceResponse, transactionsResponse, ratesResponse] = await Promise.all([
        apiService.getBalance(),
        apiService.getTransactions({ limit: 5 }),
        apiService.getExchangeRates(),
      ]);

      if (balanceResponse.success) {
        updateBalance(balanceResponse.data);
      }

      if (transactionsResponse.success) {
        setRecentTransactions(transactionsResponse.data.transactions);
      }

      if (ratesResponse.success) {
        setExchangeRates(ratesResponse.data);
      }
    } catch (error) {
      console.error('Dashboard data load error:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'send':
        navigation.navigate('Send');
        break;
      case 'receive':
        navigation.navigate('Receive');
        break;
      case 'exchange':
        navigation.navigate('Converter');
        break;
      case 'topup':
        navigation.navigate('TopUp');
        break;
      default:
        break;
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>
              {user?.firstName} {user?.lastName}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
            {unreadCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Balance Section */}
        <View style={styles.balanceSection}>
          <BalanceCard
            balance={balance}
            exchangeRates={exchangeRates}
            onPress={() => navigation.navigate('Wallet')}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <QuickActions onActionPress={handleQuickAction} />
        </View>

        {/* Exchange Rates Preview */}
        <Card style={styles.exchangeRatesCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Exchange Rates</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Converter')}>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.exchangeRatesList}>
            {Object.entries(exchangeRates).slice(0, 3).map(([currency, rate]) => (
              <View key={currency} style={styles.exchangeRateItem}>
                <View style={styles.exchangeRateLeft}>
                  <Text style={styles.currencyCode}>USD/{currency}</Text>
                  <Text style={styles.currencyName}>
                    {currency === 'EUR' ? 'Euro' : 
                     currency === 'GBP' ? 'British Pound' :
                     currency === 'JPY' ? 'Japanese Yen' : currency}
                  </Text>
                </View>
                <View style={styles.exchangeRateRight}>
                  <Text style={styles.exchangeRateValue}>
                    {parseFloat(rate).toFixed(currency === 'JPY' ? 0 : 4)}
                  </Text>
                  <Text style={[
                    styles.exchangeRateChange,
                    Math.random() > 0.5 ? styles.positiveChange : styles.negativeChange
                  ]}>
                    {Math.random() > 0.5 ? '+' : '-'}{(Math.random() * 2).toFixed(2)}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Card>

        {/* Recent Transactions */}
        <Card style={styles.transactionsCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {recentTransactions.length > 0 ? (
            <View style={styles.transactionsList}>
              {recentTransactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  onPress={() => {
                    // Navigate to transaction details
                    Alert.alert('Transaction Details', JSON.stringify(transaction, null, 2));
                  }}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyTransactions}>
              <Ionicons name="receipt-outline" size={48} color={colors.textSecondary} />
              <Text style={styles.emptyTransactionsText}>No recent transactions</Text>
              <Text style={styles.emptyTransactionsSubtext}>
                Your transactions will appear here
              </Text>
            </View>
          )}
        </Card>

        {/* KYC Status */}
        {!user?.kycVerified && (
          <Card style={styles.kycCard}>
            <View style={styles.kycContent}>
              <View style={styles.kycIcon}>
                <Ionicons name="shield-checkmark-outline" size={24} color={colors.warning} />
              </View>
              <View style={styles.kycText}>
                <Text style={styles.kycTitle}>Complete Identity Verification</Text>
                <Text style={styles.kycSubtitle}>
                  Verify your identity to unlock higher transaction limits
                </Text>
              </View>
              <TouchableOpacity
                style={styles.kycButton}
                onPress={() => navigation.navigate('KYC')}
              >
                <Text style={styles.kycButtonText}>Verify</Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    fontFamily: fonts.bold,
    marginTop: 2,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
    fontFamily: fonts.semibold,
  },
  balanceSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  quickActionsSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  exchangeRatesCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  transactionsCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  kycCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    backgroundColor: colors.warningLight,
    borderColor: colors.warning,
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    fontFamily: fonts.semibold,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontFamily: fonts.medium,
  },
  exchangeRatesList: {
    gap: spacing.md,
  },
  exchangeRateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  exchangeRateLeft: {
    flex: 1,
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    fontFamily: fonts.semibold,
  },
  currencyName: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    marginTop: 2,
  },
  exchangeRateRight: {
    alignItems: 'flex-end',
  },
  exchangeRateValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    fontFamily: fonts.semibold,
  },
  exchangeRateChange: {
    fontSize: 12,
    fontFamily: fonts.medium,
    marginTop: 2,
  },
  positiveChange: {
    color: colors.success,
  },
  negativeChange: {
    color: colors.error,
  },
  transactionsList: {
    gap: spacing.xs,
  },
  emptyTransactions: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyTransactionsText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    fontFamily: fonts.semibold,
    marginTop: spacing.md,
  },
  emptyTransactionsSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    marginTop: spacing.xs,
  },
  kycContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  kycIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.warning,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  kycText: {
    flex: 1,
  },
  kycTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    fontFamily: fonts.semibold,
  },
  kycSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    marginTop: 2,
  },
  kycButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 8,
  },
  kycButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: fonts.semibold,
  },
});

export default DashboardScreen;