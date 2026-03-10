import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { BLACK, CREAM, ORANGE } from '../../constants/colors';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

const VerificationWaitScreen = () => {
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();
    const verificationStatus = useQuery(api.verifications.getMyVerificationStatus);

    // Spinning circle animation
    const rotateAnim = useRef(new Animated.Value(0)).current;

    // Pulsing dots
    const dot1 = useRef(new Animated.Value(1)).current;
    const dot2 = useRef(new Animated.Value(1)).current;
    const dot3 = useRef(new Animated.Value(1)).current;

    // Looping progress bar (visual only — actual navigation driven by Convex)
    const progress = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Spinning circle
        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 6000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();

        // Pulsing dots
        const pulse = (anim: Animated.Value, delay: number) =>
            Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(anim, { toValue: 1.5, duration: 400, useNativeDriver: true }),
                    Animated.timing(anim, { toValue: 1, duration: 400, useNativeDriver: true }),
                ])
            );
        pulse(dot1, 0).start();
        pulse(dot2, 150).start();
        pulse(dot3, 300).start();

        // Looping progress bar — slow fill and drain, purely visual
        Animated.loop(
            Animated.sequence([
                Animated.timing(progress, { toValue: 0.85, duration: 5000, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
                Animated.timing(progress, { toValue: 0.2, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
            ])
        ).start();
    }, []);

    // Real-time Convex navigation: approved → OnboardingComplete
    useEffect(() => {
        if (verificationStatus === 'approved') {
            navigation.replace('OnboardingComplete');
        }
    }, [verificationStatus]);

    const width = progress.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    // Rejected state
    if (verificationStatus === 'rejected') {
        return (
            <View style={{ flex: 1, backgroundColor: CREAM }}>
                <StatusBar style="dark" />
                <View style={{ flex: 1, paddingTop: insets.top, justifyContent: 'space-between', padding: 32 }}>
                    <View style={{ marginTop: 24 }}>
                        <Text style={{ fontSize: 52, fontWeight: '900', color: BLACK, letterSpacing: -2, lineHeight: 52, textTransform: 'uppercase' }}>
                            NOT{'\n'}VERIFIED.
                        </Text>
                        <Text style={{ fontSize: 15, fontWeight: '500', color: '#999', marginTop: 16, lineHeight: 24, maxWidth: 300 }}>
                            Your submission was rejected. Please retake your selfie with better lighting and make sure your face is clearly visible.
                        </Text>
                    </View>

                    <View style={{ alignItems: 'center', gap: 16 }}>
                        <View style={{ width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: '#E03A2F', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 36, color: '#E03A2F' }}>✕</Text>
                        </View>
                        <Text style={{ fontSize: 12, fontWeight: '700', color: '#E03A2F', letterSpacing: 2, textTransform: 'uppercase' }}>
                            VERIFICATION FAILED
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('LivenessCheck')}
                        style={{ backgroundColor: BLACK, paddingVertical: 18, borderRadius: 32, alignItems: 'center' }}
                    >
                        <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: 14, letterSpacing: 2, textTransform: 'uppercase' }}>
                            TRY AGAIN
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // Pending / waiting state
    return (
        <View style={{ flex: 1, backgroundColor: CREAM }}>
            <StatusBar style="dark" />
            <View style={{ flex: 1, paddingTop: insets.top, justifyContent: 'space-between', padding: 32 }}>
                {/* Top — Title */}
                <View style={{ marginTop: 24 }}>
                    <Text style={{ fontSize: 52, fontWeight: '900', color: BLACK, letterSpacing: -2, lineHeight: 52, textTransform: 'uppercase' }}>
                        VERIFYING{'\n'}ACCOUNT.
                    </Text>
                </View>

                {/* Center — Spinning Circle + Dots */}
                <View style={{ alignItems: 'center', gap: 32 }}>
                    <Animated.View
                        style={{
                            width: 100,
                            height: 100,
                            borderRadius: 50,
                            borderWidth: 2,
                            borderColor: BLACK,
                            alignItems: 'center',
                            justifyContent: 'center',
                            transform: [{ rotate: spin }],
                        }}
                    >
                        <View style={{ width: 40, height: 2, backgroundColor: BLACK, position: 'absolute' }} />
                    </Animated.View>

                    {/* Pulsing Dots */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Animated.View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#FFD600', transform: [{ scale: dot1 }] }} />
                        <Animated.View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#E03A2F', transform: [{ scale: dot2 }] }} />
                        <Animated.View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#00C853', transform: [{ scale: dot3 }] }} />
                    </View>

                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#999', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center' }}>
                        YOUR SUBMISSION IS UNDER{'\n'}REVIEW. THIS MAY TAKE A MOMENT.
                    </Text>
                </View>

                {/* Bottom — Progress Bar */}
                <View>
                    <View style={{ width: '100%', height: 4, backgroundColor: '#E0DDD8', borderRadius: 2, overflow: 'hidden' }}>
                        <Animated.View style={{ width, height: '100%', backgroundColor: ORANGE, borderRadius: 2 }} />
                    </View>
                    <Text style={{ fontSize: 11, fontWeight: '800', color: BLACK, letterSpacing: 1.5, textTransform: 'uppercase', textAlign: 'center', marginTop: 12 }}>
                        PLEASE WAIT
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default VerificationWaitScreen;
