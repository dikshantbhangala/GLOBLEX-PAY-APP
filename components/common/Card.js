import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { colors, spacing } from '../../styles';

const Card = ({ 
  children, 
  style, 
  onPress, 
  elevated = true, 
  padding = 'medium',
  ...props 
}) => {
  const getPadding = () => {
    switch (padding) {
      case 'small':
        return spacing.sm;
      case 'large':
        return spacing.lg;
      case 'none':
        return 0;
      default:
        return spacing.md;
    }
  };

  const cardStyle = [
    styles.card,
    elevated && styles.elevated,
    { padding: getPadding() },
    style
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.95}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  elevated: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});

export default Card;