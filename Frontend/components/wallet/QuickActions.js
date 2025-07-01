import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, fonts, spacing } from '../../styles';

const QuickAction = ({ icon, title, onPress, color = colors.primary }) => (
  <TouchableOpacity style={styles.actionContainer} onPress={onPress}>
    <View style={[styles.actionIcon, { backgroundColor: color }]}>
      <Text style={styles.iconText}>{icon}</Text>
    </View>
    <Text style={styles.actionTitle}>{title}</Text>
  </TouchableOpacity>
);

const QuickActions = ({ 
  onSend, 
  onReceive, 
  onDeposit, 
  onWithdraw, 
  onExchange,
  onQRCode 
}) => {
  const actions = [
    { icon: '↗️', title: 'Send', onPress: onSend, color: colors.primary },
    { icon: '↙️', title: 'Receive', onPress: onReceive, color: colors.success },
    { icon: '⬇️', title: 'Deposit', onPress: onDeposit, color: colors.accent },
    { icon: '⬆️', title: 'Withdraw', onPress: onWithdraw, color: colors.warning },
    { icon: '🔄', title: 'Exchange', onPress: onExchange, color: colors.primary },
    { icon: '📱', title: 'QR Code', onPress: onQRCode, color: colors.darkGray },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.actionsContainer}
      >
        {actions.map((action, index) => (
          <QuickAction
            key={index}
            icon={action.icon}
            title={action.title}
            onPress={action.onPress}
            color={action.color}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  sectionTitle: {
    fontSize: fonts.sizes.lg,
    fontFamily: fonts.bold,
    color: colors.text,
    marginBottom: spacing.md,
    marginHorizontal: spacing.md,
  },
  actionsContainer: {
    paddingHorizontal: spacing.md,
  },
  actionContainer: {
    alignItems: 'center',
    marginRight: spacing.lg,
    minWidth: 60,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  iconText: {
    fontSize: fonts.sizes.xl,
  },
  actionTitle: {
    fontSize: fonts.sizes.sm,
    fontFamily: fonts.medium,
    color: colors.text,
    textAlign: 'center',
  },
});

export default QuickActions;