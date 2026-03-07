import React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { ClerkProvider, ClerkLoaded } from '@clerk/expo';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import * as SecureStore from 'expo-secure-store';
import {
  useFonts,
  PublicSans_400Regular,
  PublicSans_700Bold,
  PublicSans_900Black,
} from '@expo-google-fonts/public-sans';
import RootNavigator from './src/navigation/RootNavigator';
import { CREAM } from './src/constants/colors';

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

const tokenCache = {
  async getToken(key: string) {
    return SecureStore.getItemAsync(key);
  },
  async saveToken(key: string, value: string) {
    return SecureStore.setItemAsync(key, value);
  },
};

function AppContent() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
 // const [fontsLoaded] = useFonts({
//   PublicSans_400Regular,
//   PublicSans_700Bold,
//   PublicSans_900Black,
// });
const fontsLoaded = true;

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: CREAM }} />;
  }

  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <ClerkLoaded>
        <ConvexProvider client={convex}>
          <SafeAreaProvider>
            <AppContent />
          </SafeAreaProvider>
        </ConvexProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}