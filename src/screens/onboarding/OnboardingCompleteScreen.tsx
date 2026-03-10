import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BLACK, CREAM } from '../../constants/colors';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useUser } from '@clerk/expo';

const OnboardingCompleteScreen = () => {
    const insets = useSafeAreaInsets();
    const { user } = useUser();
    const completeOnboarding = useMutation(api.users.completeOnboarding);
    const [isLoading, setIsLoading] = useState(false);

    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnim, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true }),
            Animated.timing(opacityAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ]).start();
    }, []);

    const handleEnter = async () => {
        if (!user || isLoading) return;
        try {
            setIsLoading(true);
            await completeOnboarding({ clerkId: user.id });
            // RootNavigator will automatically re-render and route to MainApp
            // when it detects currentUser.onboardingCompleted === true
        } catch (err) {
            console.error('completeOnboarding error:', err);
            setIsLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: CREAM, alignItems: 'center', justifyContent: 'center', paddingTop: insets.top }}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }], opacity: opacityAnim, alignItems: 'center' }}>
                <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: BLACK, alignItems: 'center', justifyContent: 'center', marginBottom: 48 }}>
                    <MaterialIcons name="done" size={56} color="#FFFFFF" />
                </View>

                <Text style={{ fontSize: 60, fontWeight: '900', color: BLACK, lineHeight: 58, textAlign: 'center', marginBottom: 20, letterSpacing: -2 }}>
                    You're{'\n'}Ready.
                </Text>

                <Text style={{ fontSize: 18, fontWeight: '500', color: '#999', textAlign: 'center', maxWidth: '80%', marginBottom: 48 }}>
                    Your profile is set. {'\n'}Welcome to Align.
                </Text>
            </Animated.View>

            <View style={{ position: 'absolute', bottom: insets.bottom + 24, left: 32, right: 32 }}>
                <TouchableOpacity
                    onPress={handleEnter}
                    disabled={isLoading}
                    style={{ backgroundColor: BLACK, paddingVertical: 16, borderRadius: 32, alignItems: 'center', opacity: isLoading ? 0.7 : 1 }}
                >
                    {isLoading
                        ? <ActivityIndicator size="small" color="#FFFFFF" />
                        : <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' }}>Enter Align</Text>
                    }
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default OnboardingCompleteScreen;
