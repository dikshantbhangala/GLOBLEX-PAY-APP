import { Ionicons } from '@expo/vector-icons';
import { useContext, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import { WalletContext } from '../context/WalletContext';
import api from '../services/api';
import styles from '../styles/commonStyles';

const WalletScreen = ({ navigation }) => {
  const { walletData, updateWalletData } = useContext(WalletContext);
  const { user } = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
    { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬' },
  ];

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const response = await api.getWalletData();
      updateWalletData(response.data);
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWalletData();
    setRefreshing(false);
  };

  const addCurrency = async (currencyCode) => {
    setLoading(true);
    try {
      await api.addCurrencyToWallet(currencyCode);
      await fetchWalletData();
      Alert.alert('Success', `${currencyCode} wallet added successfully!`);
    } catch (error) {
      Alert.alert('Error', 'Failed to add currency wallet');
    } finally {
      setLoading(false);
    }
  };

  const fundWallet = (currency) => {
    navigation.navigate('Transaction', { 
      mode: 'deposit',
      currency: currency.code 
    });
  };

  const withdrawFunds = (currency) => {
    if (currency.balance <= 0) {
      Alert.alert('Insufficient Funds', 'You don\'t have enough balance to withdraw');
      return;
    }
    navigation.navigate('Transaction', { 
      mode: 'withdraw',
      currency: currency.code,
      maxAmount: currency.balance
    });
  };

  const getCurrencyInfo = (code) => {
    return currencies.find(curr => curr.code === code) || { 
      code, 
      name: code, 
      symbol: '', 
      flag: '💰' 
    };
  };

  const formatBalance = (amount, currency) => {
    const currencyInfo = getCurrencyInfo(currency);
    return `${currencyInfo.symbol}${parseFloat(amount || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const calculateTotalInUSD = () => {
    let total = 0;
    walletData.balances?.forEach(balance => {
      // Simple conversion rates (in real app, get from API)
      const rates = {
        USD: 1,
        EUR: 1.08,
        GBP: 1.26,
        CAD: 0.74,
        AUD: 0.67,
        JPY: 0.0067,
        INR: 0.012,
        NGN: 0.0013,
      };
      total += (balance.amount || 0) * (rates[balance.currency] || 1);
    });
    return total;
  };

  const renderWalletCard = (balance) => {
    const currencyInfo = getCurrencyInfo(balance.currency);
    
    return (
      <View key={balance.currency} style={styles.walletCard}>
        <View style={styles.walletCardHeader}>
          <View style={styles.currencyInfo}>
            <Text style={styles.currencyFlag}>{currencyInfo.flag}</Text>
            <View>
              <Text style={styles.currencyCode}>{balance.currency}</Text>
              <Text style={styles.currencyName}>{currencyInfo.name}</Text>
            </View>
          </View>
          <View style={styles.balanceInfo}>
            <Text style={styles.balanceAmount}>
              {formatBalance(balance.amount, balance.currency)}
            </Text>
            <Text style={styles.balanceLabel}>Available Balance</Text>
          </View>
        </View>
        
        <View style={styles.walletActions}>
          <TouchableOpacity
            style={styles.walletActionButton}
            onPress={() => fundWallet(balance)}
          >
            <Ionicons name="add-circle-outline" size={20} color="#FFD700" />
            <Text style={styles.walletActionText}>Add Money</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.walletActionButton}
            onPress={() => withdrawFunds(balance)}
          >
            <Ionicons name="remove-circle-outline" size={20} color="#FFD700" />
            <Text style={styles.walletActionText}>Withdraw</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.walletActionButton}
            onPress={() => navigation.navigate('Transaction', { 
              recipientEmail: '',
              fromCurrency: balance.currency 
            })}
          >
            <Ionicons name="send-outline" size={20} color="#FFD700" />
            <Text style={styles.walletActionText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderAddCurrencyCard = () => (
    <View style={styles.addCurrencyCard}>
      <Text style={styles.addCurrencyTitle}>Add New Currency</Text>
      <Text style={styles.addCurrencySubtitle}>
        Expand your wallet by adding more currencies
      </Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.currencySelector}
      >
        {currencies
          .filter(curr => !walletData.balances?.some(bal => bal.currency === curr.code))
          .map(currency => (
            <TouchableOpacity
              key={currency.code}
              style={styles.addCurrencyButton}
              onPress={() => addCurrency(currency.code)}
              disabled={loading}
            >
              <Text style={styles.addCurrencyFlag}>{currency.flag}</Text>
              <Text style={styles.addCurrencyCode}>{currency.code}</Text>
              <Text style={styles.addCurrencyName}>{currency.name}</Text>
            </TouchableOpacity>
          ))
        }
      </ScrollView>
    </View>
  );

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
          <Text style={styles.headerTitle}>My Wallet</Text>
          <TouchableOpacity onPress={() => navigation.navigate('TransactionHistory')}>
            <Ionicons name="time-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Total Balance Overview */}
        <View style={styles.totalBalanceCard}>
          <Text style={styles.totalBalanceLabel}>Total Balance (USD Equivalent)</Text>
          <Text style={styles.totalBalanceAmount}>
            ${calculateTotalInUSD().toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
          <View style={styles.balanceActions}>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('Transaction')}
            >
              <Ionicons name="send" size={16} color="#000000" />
              <Text style={styles.quickActionText}>Send Money</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('CurrencyConverter')}
            >
              <Ionicons name="swap-horizontal" size={16} color="#000000" />
              <Text style={styles.quickActionText}>Convert</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Currency Wallets */}
        <Text style={styles.sectionTitle}>Currency Wallets</Text>
        
        {walletData.balances?.length > 0 ? (
          walletData.balances.map(balance => renderWalletCard(balance))
        ) : (
          <View style={styles.emptyWallet}>
            <Ionicons name="wallet-outline" size={60} color="#666666" />
            <Text style={styles.emptyWalletText}>No currency wallets yet</Text>
            <Text style={styles.emptyWalletSubtext}>
              Add your first currency wallet to get started
            </Text>
          </View>
        )}

        {/* Add Currency Section */}
        {currencies.some(curr => !walletData.balances?.some(bal => bal.currency === curr.code)) && (
          renderAddCurrencyCard()
        )}

        {/* Recent Transactions */}
        <View style={styles.recentTransactions}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => navigation.navigate('TransactionHistory')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {walletData.recentTransactions?.length > 0 ? (
            walletData.recentTransactions.slice(0, 3).map((transaction, index) => (
              <View key={index} style={styles.transactionItem}>
                <View style={styles.transactionIcon}>
                  <Ionicons 
                    name={transaction.type === 'send' ? 'arrow-up' : 'arrow-down'} 
                    size={20} 
                    color={transaction.type === 'send' ? '#FF6B6B' : '#4CAF50'} 
                  />
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionTitle}>
                    {transaction.type === 'send' ? 'Sent to' : 'Received from'} {transaction.recipient || transaction.sender}
                  </Text>
                  <Text style={styles.transactionDate}>{transaction.date}</Text>
                </View>
                <View style={styles.transactionAmount}>
                  <Text style={[
                    styles.transactionAmountText,
                    { color: transaction.type === 'send' ? '#FF6B6B' : '#4CAF50' }
                  ]}>
                    {transaction.type === 'send' ? '-' : '+'}
                    {formatBalance(transaction.amount, transaction.currency)}
                  </Text>
                  <Text style={styles.transactionStatus}>{transaction.status}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.noTransactions}>
              <Text style={styles.noTransactionsText}>No recent transactions</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFD700" />
        </View>
      )}
    </SafeAreaView>
  );
};

export default WalletScreen;