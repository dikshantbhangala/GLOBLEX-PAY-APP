import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useContext, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import { WalletContext } from '../context/WalletContext';
import api from '../services/api';
import styles from '../styles/commonStyles';

const TransactionScreen = ({ navigation, route }) => {
  const { walletData, updateWalletBalance } = useContext(WalletContext);
  const { user } = useContext(AuthContext);
  const { addNotification } = useContext(NotificationContext);
  
  const [step, setStep] = useState(1); // 1: Form, 2: Confirmation, 3: Success
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    recipientEmail: route.params?.recipientEmail || '',
    recipientName: '',
    amount: '',
    fromCurrency: 'USD',
    toCurrency: 'EUR',
    purpose: 'Personal',
    note: '',
  });
  const [conversionData, setConversionData] = useState(null);
  const [transactionFee, setTransactionFee] = useState(0);

  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'INR', 'NGN'];
  const purposes = ['Personal', 'Business', 'Education', 'Medical', 'Travel', 'Investment'];

  const calculateConversion = async () => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const response = await api.convertCurrency({
        amount: parseFloat(formData.amount),
        from: formData.fromCurrency,
        to: formData.toCurrency,
      });

      setConversionData(response.data);
      setTransactionFee(response.data.fee || parseFloat(formData.amount) * 0.02);
    } catch (error) {
      Alert.alert('Error', 'Failed to get conversion rate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateRecipient = async () => {
    if (!formData.recipientEmail) {
      Alert.alert('Error', 'Please enter recipient email');
      return false;
    }

    try {
      const response = await api.validateRecipient(formData.recipientEmail);
      setFormData(prev => ({ ...prev, recipientName: response.data.name }));
      return true;
    } catch (error) {
      Alert.alert('Error', 'Recipient not found. Please check the email address.');
      return false;
    }
  };

  const proceedToConfirmation = async () => {
    const isRecipientValid = await validateRecipient();
    if (!isRecipientValid) return;

    await calculateConversion();
    if (conversionData) {
      setStep(2);
    }
  };

  const executeTransaction = async () => {
    setLoading(true);
    try {
      const transactionData = {
        recipientEmail: formData.recipientEmail,
        amount: parseFloat(formData.amount),
        fromCurrency: formData.fromCurrency,
        toCurrency: formData.toCurrency,
        convertedAmount: conversionData.convertedAmount,
        exchangeRate: conversionData.exchangeRate,
        fee: transactionFee,
        purpose: formData.purpose,
        note: formData.note,
      };

      const response = await api.sendMoney(transactionData);
      
      // Update wallet balance
      updateWalletBalance(formData.fromCurrency, -(parseFloat(formData.amount) + transactionFee));
      
      // Add notification
      addNotification({
        id: Date.now().toString(),
        title: 'Transaction Successful',
        message: `Sent ${formData.amount} ${formData.fromCurrency} to ${formData.recipientName}`,
        type: 'success',
        timestamp: new Date(),
      });

      setStep(3);
    } catch (error) {
      Alert.alert('Transaction Failed', error.message || 'Unable to process transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderTransactionForm = () => (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Send Money</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Recipient Details</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Recipient Email</Text>
          <TextInput
            style={styles.input}
            value={formData.recipientEmail}
            onChangeText={(text) => setFormData(prev => ({ ...prev, recipientEmail: text }))}
            placeholder="Enter recipient's email"
            placeholderTextColor="#666666"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Transaction Details</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Amount</Text>
          <TextInput
            style={styles.input}
            value={formData.amount}
            onChangeText={(text) => setFormData(prev => ({ ...prev, amount: text }))}
            placeholder="0.00"
            placeholderTextColor="#666666"
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.inputLabel}>From Currency</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.fromCurrency}
                onValueChange={(value) => setFormData(prev => ({ ...prev, fromCurrency: value }))}
                style={styles.picker}
                dropdownIconColor="#FFD700"
              >
                {currencies.map(currency => (
                  <Picker.Item key={currency} label={currency} value={currency} color="#FFFFFF" />
                ))}
              </Picker>
            </View>
          </View>

          <View style={[styles.inputContainer, { flex: 1, marginLeft: 10 }]}>
            <Text style={styles.inputLabel}>To Currency</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.toCurrency}
                onValueChange={(value) => setFormData(prev => ({ ...prev, toCurrency: value }))}
                style={styles.picker}
                dropdownIconColor="#FFD700"
              >
                {currencies.map(currency => (
                  <Picker.Item key={currency} label={currency} value={currency} color="#FFFFFF" />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Purpose</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.purpose}
              onValueChange={(value) => setFormData(prev => ({ ...prev, purpose: value }))}
              style={styles.picker}
              dropdownIconColor="#FFD700"
            >
              {purposes.map(purpose => (
                <Picker.Item key={purpose} label={purpose} value={purpose} color="#FFFFFF" />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Note (Optional)</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            value={formData.note}
            onChangeText={(text) => setFormData(prev => ({ ...prev, note: text }))}
            placeholder="Add a note for the recipient"
            placeholderTextColor="#666666"
            multiline
            textAlignVertical="top"
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, loading && styles.disabledButton]}
        onPress={proceedToConfirmation}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#000000" />
        ) : (
          <Text style={styles.primaryButtonText}>Continue</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );

  const renderConfirmation = () => (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setStep(1)}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Transaction</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Transaction Summary</Text>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Recipient:</Text>
          <Text style={styles.summaryValue}>{formData.recipientName || formData.recipientEmail}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>You Send:</Text>
          <Text style={styles.summaryValue}>{formData.amount} {formData.fromCurrency}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Exchange Rate:</Text>
          <Text style={styles.summaryValue}>
            1 {formData.fromCurrency} = {conversionData?.exchangeRate} {formData.toCurrency}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>They Receive:</Text>
          <Text style={[styles.summaryValue, { color: '#FFD700' }]}>
            {conversionData?.convertedAmount} {formData.toCurrency}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Transaction Fee:</Text>
          <Text style={styles.summaryValue}>{transactionFee.toFixed(2)} {formData.fromCurrency}</Text>
        </View>

        <View style={[styles.summaryRow, { borderTopWidth: 1, borderTopColor: '#333333', paddingTop: 15 }]}>
          <Text style={[styles.summaryLabel, { fontWeight: 'bold' }]}>Total Debit:</Text>
          <Text style={[styles.summaryValue, { fontWeight: 'bold', color: '#FFD700' }]}>
            {(parseFloat(formData.amount) + transactionFee).toFixed(2)} {formData.fromCurrency}
          </Text>
        </View>

        {formData.note && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Note:</Text>
            <Text style={styles.summaryValue}>{formData.note}</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, loading && styles.disabledButton]}
        onPress={executeTransaction}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#000000" />
        ) : (
          <Text style={styles.primaryButtonText}>Confirm & Send</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => setStep(1)}
      >
        <Text style={styles.secondaryButtonText}>Edit Transaction</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderSuccess = () => (
    <View style={[styles.container, styles.centerContent]}>
      <View style={styles.successIcon}>
        <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
      </View>
      
      <Text style={styles.successTitle}>Transaction Successful!</Text>
      <Text style={styles.successMessage}>
        Your money has been sent to {formData.recipientName || formData.recipientEmail}
      </Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Transaction Details</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Amount Sent:</Text>
          <Text style={styles.summaryValue}>{formData.amount} {formData.fromCurrency}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Amount Received:</Text>
          <Text style={styles.summaryValue}>{conversionData?.convertedAmount} {formData.toCurrency}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Reference ID:</Text>
          <Text style={styles.summaryValue}>TXN{Date.now().toString().slice(-8)}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate('Dashboard')}
      >
        <Text style={styles.primaryButtonText}>Back to Dashboard</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => {
          setStep(1);
          setFormData({
            recipientEmail: '',
            recipientName: '',
            amount: '',
            fromCurrency: 'USD',
            toCurrency: 'EUR',
            purpose: 'Personal',
            note: '',
          });
          setConversionData(null);
        }}
      >
        <Text style={styles.secondaryButtonText}>Send Another</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {step === 1 && renderTransactionForm()}
        {step === 2 && renderConfirmation()}
        {step === 3 && renderSuccess()}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default TransactionScreen;