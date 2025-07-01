import { createContext, useContext, useEffect, useReducer } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const WalletContext = createContext();

const initialState = {
  balance: 0,
  transactions: [],
  loading: false,
  error: null,
  currencies: [],
  exchangeRates: {},
};

const walletReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_BALANCE':
      return { ...state, balance: action.payload, loading: false };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload, loading: false };
    case 'ADD_TRANSACTION':
      return { 
        ...state, 
        transactions: [action.payload, ...state.transactions],
        loading: false 
      };
    case 'SET_CURRENCIES':
      return { ...state, currencies: action.payload };
    case 'SET_EXCHANGE_RATES':
      return { ...state, exchangeRates: action.payload };
    case 'CLEAR_WALLET':
      return initialState;
    default:
      return state;
  }
};

export const WalletProvider = ({ children }) => {
  const [state, dispatch] = useReducer(walletReducer, initialState);
  const { user, token } = useAuth();

  const fetchBalance = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await api.getWalletBalance();
      dispatch({ type: 'SET_BALANCE', payload: response.balance });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const fetchTransactions = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await api.getTransactions();
      dispatch({ type: 'SET_TRANSACTIONS', payload: response.transactions });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const sendMoney = async (recipientEmail, amount, currency) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await api.sendMoney({ recipientEmail, amount, currency });
      dispatch({ type: 'ADD_TRANSACTION', payload: response.transaction });
      await fetchBalance();
      return response;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const depositFunds = async (amount, currency, paymentMethod) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await api.depositFunds({ amount, currency, paymentMethod });
      dispatch({ type: 'ADD_TRANSACTION', payload: response.transaction });
      await fetchBalance();
      return response;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const withdrawFunds = async (amount, currency, bankAccount) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await api.withdrawFunds({ amount, currency, bankAccount });
      dispatch({ type: 'ADD_TRANSACTION', payload: response.transaction });
      await fetchBalance();
      return response;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const exchangeCurrency = async (fromCurrency, toCurrency, amount) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await api.exchangeCurrency({ fromCurrency, toCurrency, amount });
      dispatch({ type: 'ADD_TRANSACTION', payload: response.transaction });
      await fetchBalance();
      return response;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const fetchExchangeRates = async () => {
    try {
      const response = await api.getExchangeRates();
      dispatch({ type: 'SET_EXCHANGE_RATES', payload: response.rates });
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchBalance();
      fetchTransactions();
      fetchExchangeRates();
    } else {
      dispatch({ type: 'CLEAR_WALLET' });
    }
  }, [user, token]);

  const value = {
    ...state,
    fetchBalance,
    fetchTransactions,
    sendMoney,
    depositFunds,
    withdrawFunds,
    exchangeCurrency,
    fetchExchangeRates,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};