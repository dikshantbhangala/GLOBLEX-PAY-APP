import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, fonts, spacing } from '../../styles';
import { formatCurrency } from '../../utils/helpers';

const BalanceCard = ({ balance, currency = 'USD', onPress, loading = false }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <LinearGradient
        colors={[colors.primary, colors.darkGray]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Total Balance</Text>
            <View style={styles.goldAccent} />
          </View>
          
          <View style={styles.balanceContainer}>
            {loading ? (
              <Text style={styles.loadingText}>Loading...</Text>
            ) : (
              <>
                <Text style={styles.balance}>
                  {formatCurrency(balance, currency)}
                </Text>
                <Text style={styles.currency}>{currency}</Text>
              </>
            )}
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Tap to view details
            </Text>
            <Text style={styles.arrow}>→</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gradient: {
    borderRadius: 20,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
  },
  content: {
    padding: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fonts.sizes.md,
    fontFamily: fonts.medium,
    color: colors.secondary,
    opacity: 0.8,
  },
  goldAccent: {
    width: 4,
    height: 20,
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.lg,
  },
  balance: {
    fontSize: fonts.sizes.xxxl,
    fontFamily: fonts.bold,
    color: colors.secondary,
    marginRight: spacing.sm,
  },
  currency: {
    fontSize: fonts.sizes.lg,
    fontFamily: fonts.medium,
    color: colors.accent,
  },
  loadingText: {
    fontSize: fonts.sizes.xl,
    fontFamily: fonts.medium,
    color: colors.secondary,
    opacity: 0.6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: fonts.sizes.sm,
    fontFamily: fonts.regular,
    color: colors.secondary,
    opacity: 0.7,
  },
  arrow: {
    fontSize: fonts.sizes.lg,
    color: colors.accent,
  },
});

export default BalanceCard;