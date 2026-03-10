import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth, useUser } from '@clerk/expo';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { AuthNavigator, OnboardingNavigator } from './StackNavigators';
import MainTabNavigator from './MainTabNavigator';
import ReportScreen from '../screens/ReportScreen';
import SubscriptionScreen from '../screens/onboarding/SubscriptionScreen';
import { CREAM, ORANGE } from '../constants/colors';

const RootStack = createNativeStackNavigator();

export default function RootNavigator() {
    const { isSignedIn, isLoaded } = useAuth();
    const { user } = useUser();
    const [isCreatingUser, setIsCreatingUser] = useState(false);

    const currentUser = useQuery(
        api.users.getCurrentUser,
        isSignedIn ? {} : 'skip'
    );

    const createUser = useMutation(api.users.createUserIfNotExists);

    // Create Convex user record after first Google sign-in
    useEffect(() => {
        if (isSignedIn && user && currentUser === null && !isCreatingUser) {
            setIsCreatingUser(true);
            createUser({
                clerkId: user.id,
                name: user.fullName || user.firstName || user.username || '',
                email: user.primaryEmailAddress?.emailAddress || '',
                imageUrl: user.imageUrl || '',
            })
                .catch(console.error)
                .finally(() => setIsCreatingUser(false));
        }
    }, [isSignedIn, user, currentUser]);

    // Show loading while Clerk initializes, Convex query is in-flight, or user is being created
    if (!isLoaded || (isSignedIn && currentUser === undefined) || isCreatingUser) {
        return (
            <View style={{ flex: 1, backgroundColor: CREAM, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator color={ORANGE} size="large" />
            </View>
        );
    }

    return (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
            {!isSignedIn ? (
                // Not authenticated — show Welcome + SignIn
                <RootStack.Screen name="Auth" component={AuthNavigator} />
            ) : !currentUser?.onboardingCompleted ? (
                // Authenticated but onboarding incomplete
                <RootStack.Screen name="Onboarding" component={OnboardingNavigator} />
            ) : (
                // Fully onboarded — main app
                <>
                    <RootStack.Screen name="MainApp" component={MainTabNavigator} />
                    <RootStack.Group screenOptions={{ presentation: 'modal' }}>
                        <RootStack.Screen name="Report" component={ReportScreen} />
                        <RootStack.Screen name="SubscriptionModal" component={SubscriptionScreen} />
                    </RootStack.Group>
                </>
            )}
        </RootStack.Navigator>
    );
}
