import { registerRootComponent } from 'expo';
import React from 'react';
import OnboardingScreen from '../../screens/OnboardingScreen';

export default function App() {
  const handleOnboardingComplete = () => {
    console.log('Onboarding completed!');
    // You can navigate here if needed using expo-router's useRouter
  };

  return (
    <OnboardingScreen onComplete={handleOnboardingComplete} />
  );
}

registerRootComponent(App);
