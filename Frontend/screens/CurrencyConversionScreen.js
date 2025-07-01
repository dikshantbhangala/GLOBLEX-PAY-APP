import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { api } from '../services/api';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';

const CurrencyConverterScreen = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [conversionHistory, setConversionHistory] = useState([]);
  const [exchangeRate, setExchangeRate] = useState(null);

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
  ];

  useEffect(() => {
    loadConversionHistory();
  }, []);

  const loadConversionHistory = async () => {
    try {
      const history = await api.getConversionHistory();
      setConversionHistory(history);
    } catch (error) {
      console.log('Error loading conversion history:', error);
    }
  };

  const handleConvert = async () => {
    if (!amount || isNaN(amount)) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (fromCurrency === toCurrency) {
      Alert.alert('Error', 'Please select different currencies');
      return;
    }

    setLoading(true);
    try {
      const response = await api.convertCurrency({
        amount: parseFloat(amount),
        from: fromCurrency,
        to: toCurrency,
      });

      setConvertedAmount(response.convertedAmount);
      setExchangeRate(response.exchangeRate);

      // Add to history
      const historyItem = {
        id: Date.now().toString(),
        amount: parseFloat(amount),
        fromCurrency,
        toCurrency,
        convertedAmount: response.convertedAmount,
        exchangeRate: response.exchangeRate,
        timestamp: new Date().toISOString(),
      };

      setConversionHistory(prev => [historyItem, ...prev.slice(0, 9)]);
    } catch (error) {
      Alert.alert('Error', 'Failed to convert currency. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setConvertedAmount(null);
    setExchangeRate(null);
  };

  const getCurrencySymbol = (code) => {
    const currency = currencies.find(c => c.code === code);
    return currency ? currency.symbol : code;
  };

  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyItem}>
      <View style={styles.historyDetails}>
        <Text style={styles.historyAmount}>
          {getCurrencySymbol(item.fromCurrency)}{item.amount.toFixed(2)} → {getCurrencySymbol(item.toCurrency)}{item.convertedAmount.toFixed(2)}
        </Text>
        <Text style={styles.historyRate}>
          1 {item.fromCurrency} = {item.exchangeRate.toFixed(4)} {item.toCurrency}
        </Text>
        <Text style={styles.historyDate}>
          {new Date(item.timestamp).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={globalStyles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Currency Converter</Text>
      </View>

      <View style={styles.converterCard}>
        <View style={styles.amountSection}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            placeholderTextColor={colors.gray}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.currencySection}>
          <View style={styles.currencyContainer}>
            <Text style={styles.label}>From</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={fromCurrency}
                onValueChange={setFromCurrency}
                style={styles.picker}
                dropdownIconColor={colors.gold}
              >
                {currencies.map((currency) => (
                  <Picker.Item
                    key={currency.code}
                    label={`${currency.code} - ${currency.name}`}
                    value={currency.code}
                    color={colors.white}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <TouchableOpacity style={styles.swapButton} onPress={swapCurrencies}>
            <Ionicons name="swap-horizontal" size={24} color={colors.gold} />
          </TouchableOpacity>

          <View style={styles.currencyContainer}>
            <Text style={styles.label}>To</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={toCurrency}
                onValueChange={setToCurrency}
                style={styles.picker}
                dropdownIconColor={colors.gold}
              >
                {currencies.map((currency) => (
                  <Picker.Item
                    key={currency.code}
                    label={`${currency.code} - ${currency.name}`}
                    value={currency.code}
                    color={colors.white}
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.convertButton, loading && styles.convertButtonDisabled]}
          onPress={handleConvert}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.black} />
          ) : (
            <Text style={styles.convertButtonText}>Convert</Text>
          )}
        </TouchableOpacity>

        {convertedAmount && (
          <View style={styles.resultSection}>
            <Text style={styles.resultLabel}>Converted Amount</Text>
            <Text style={styles.resultAmount}>
              {getCurrencySymbol(toCurrency)}{convertedAmount.toFixed(2)}
            </Text>
            {exchangeRate && (
              <Text style={styles.exchangeRate}>
                1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
              </Text>
            )}
          </View>
        )}
      </View>

      {conversionHistory.length > 0 && (
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Recent Conversions</Text>
          <FlatList
            data={conversionHistory}
            renderItem={renderHistoryItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = {
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  converterCard: {
    backgroundColor: colors.cardBackground,
    margin: 16,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  amountSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 8,
  },
  amountInput: {
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: colors.white,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  currencySection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  currencyContainer: {
    flex: 1,
  },
  pickerContainer: {
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  picker: {
    color: colors.white,
    height: 50,
  },
  swapButton: {
    marginHorizontal: 16,
    padding: 8,
  },
  convertButton: {
    backgroundColor: colors.gold,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  convertButtonDisabled: {
    opacity: 0.6,
  },
  convertButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
  },
  resultSection: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.gray,
  },
  resultLabel: {
    fontSize: 16,
    color: colors.gray,
    marginBottom: 8,
  },
  resultAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.gold,
    marginBottom: 8,
  },
  exchangeRate: {
    fontSize: 14,
    color: colors.gray,
  },
  historySection: {
    margin: 16,
    marginTop: 0,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 16,
  },
  historyItem: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  historyDetails: {
    flex: 1,
  },
  historyAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  historyRate: {
    fontSize: 14,
    color: colors.gold,
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 12,
    color: colors.gray,
  },
};

export default CurrencyConverterScreen;