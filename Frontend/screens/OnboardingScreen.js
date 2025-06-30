import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const {width , height} = Dimensions.get('window');

export default function OnboardingScreen({ onComplete }){
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const logoRotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        startAnimations();
    } ,[]);
    const startAnimations =() => {
        Animated.parallel([
            Animated.timing(fadeAnim , {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim , {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim , {
                toValue: 1,
                duration: 1200,
                useNativeDriver: true,
            }),
            Animated.timing(logoRotateAnim , {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const logoRotate = logoRotateAnim.interpolate({
        inputRange: [0,1],
        outputRange:['0deg' , '360deg'],
    });
    return(
       <LinearGradient
      colors={['#000000', '#1a1a1a', '#000000']}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim }
            ],
          },
        ]}
      >
        {/* Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            { transform: [{ rotate: logoRotate }] }
          ]}
        >
          <View style={styles.logoCircle}>
            <Ionicons name="globe-outline" size={60} color="#FFD700" />
          </View>
        </Animated.View>

        {/* Welcome Text */}
        <View style={styles.textContainer}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.brandText}>GLOBLEX</Text>
          <Text style={styles.taglineText}>
            Premium Cross-Border Payments
          </Text>
          <Text style={styles.descriptionText}>
            Experience seamless international transfers with enterprise-grade security and lightning-fast processing.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <FeatureItem 
            icon="shield-checkmark-outline"
            text="Bank-Level Security"
          />
          <FeatureItem 
            icon="flash-outline"
            text="Instant Transfers"
          />
          <FeatureItem 
            icon="globe-outline"
            text="200+ Countries"
          />
        </View>

        {/* Get Started Button */}
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={onComplete}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#FFD700', '#FFA500']}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={20} color="#000" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Bottom Accent */}
      <View style={styles.bottomAccent}>
        <View style={styles.accentLine} />
      </View>
    </LinearGradient>
  );
}

function FeatureItem({ icon, text }) {
  return (
    <View style={styles.featureItem}>
      <View style={styles.featureIcon}>
        <Ionicons name={icon} size={24} color="#FFD700" />
      </View>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 60,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderWidth: 2,
    borderColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  welcomeText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: 'Inter-Regular',
    marginBottom: 10,
  },
  brandText: {
    fontSize: 48,
    color: '#FFD700',
    fontFamily: 'Inter-Bold',
    letterSpacing: 2,
    marginBottom: 10,
  },
  taglineText: {
    fontSize: 18,
    color: '#CCCCCC',
    fontFamily: 'Inter-Medium',
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 16,
    color: '#999999',
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 60,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderWidth: 1,
    borderColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  featureText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
  },
  getStartedButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
  },
  buttonGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  buttonText: {
    fontSize: 18,
    color: '#000000',
    fontFamily: 'Inter-SemiBold',
    marginRight: 10,
  },
  bottomAccent: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  accentLine: {
    width: 60,
    height: 4,
    backgroundColor: '#FFD700',
    borderRadius: 2,
  },
});