import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, fonts, spacing } from '../../styles';
import { formatCurrency, formatDate, formatTime, getStatusColor, getTransactionIcon } from '../../utils/helpers';

const TransactionItem = ({ transaction, onPress }) => {
  const {
    id,
    type,
    amount,
    currency,
    status,
    createdAt,
    description,
    recipientEmail,
    senderEmail,
  } = transaction;

  const getTransactionTitle = () => {
    switch (type) {
      case 'send':
        return `Sent to ${recipientEmail}`;
      case 'receive':
        return `Received from ${senderEmail}`;
      case 'deposit':
        return 'Deposit';
      case 'withdraw':
        return 'Withdrawal';
      case 'exchange':
        return 'Currency Exchange';
      default:
        return 'Transaction';
    }
  };

  const getAmountColor = () => {
    if (type === 'receive' || type === 'deposit') {
      return colors.success;
    } else if (type === 'send' || type === 'withdraw') {
      return colors.error;
    }
    return colors.text;
  };

  const getAmountPrefix = () => {
    if (type === 'receive' || type === 'deposit') {
      return '+';
    } else if (type === 'send' || type === 'withdraw') {
      return '-';
    }
    return '';
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onPress && onPress(transaction)}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{getTransactionIcon(type)}</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {getTransactionTitle()}
          </Text>
          <Text style={[styles.amount, { color: getAmountColor() }]}>
            {getAmountPrefix()}{formatCurrency(amount, currency)}
          </Text>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.description} numberOfLines={1}>
            {description || `${formatDate(createdAt)} • ${formatTime(createdAt)}`}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) }]}>
            <Text style={styles.statusText}>{status.toUpperCase()}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  icon: {
    fontSize: fonts.sizes.xl,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  title: {
    flex: 1,
    fontSize: fonts.sizes.md,
    fontFamily: fonts.medium,
    color: colors.text,
    marginRight: spacing.sm,
  },
  amount: {
    fontSize: fonts.sizes.md,
    fontFamily: fonts.bold,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  description: {
    flex: 1,
    fontSize: fonts.sizes.sm,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: fonts.sizes.xs,
    fontFamily: fonts.bold,
    color: colors.secondary,
  },
});

export default TransactionItem;
