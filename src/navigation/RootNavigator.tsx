import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthNavigator, OnboardingNavigator } from './StackNavigators';
import MainTabNavigator from './MainTabNavigator';
import ReportScreen from '../screens/ReportScreen';
import SubscriptionScreen from '../screens/onboarding/SubscriptionScreen';

const RootStack = createNativeStackNavigator();

export default function RootNavigator() {
    return (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
            <RootStack.Screen name="Auth" component={AuthNavigator} />
            <RootStack.Screen name="Onboarding" component={OnboardingNavigator} />
            <RootStack.Screen name="MainApp" component={MainTabNavigator} />
            <RootStack.Group screenOptions={{ presentation: 'modal' }}>
                <RootStack.Screen name="Report" component={ReportScreen} />
                <RootStack.Screen name="SubscriptionModal" component={SubscriptionScreen} />
            </RootStack.Group>
        </RootStack.Navigator>
    );
}
