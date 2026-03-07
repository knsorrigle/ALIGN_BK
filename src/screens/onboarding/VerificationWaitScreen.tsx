import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { BLACK, CREAM, ORANGE } from '../../constants/colors';

const VerificationWaitScreen = () => {
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();
    const progress = useRef(new Animated.Value(0)).current;

    // Spinning circle animation
    const rotateAnim = useRef(new Animated.Value(0)).current;

    // Pulsing dots
    const dot1 = useRef(new Animated.Value(1)).current;
    const dot2 = useRef(new Animated.Value(1)).current;
    const dot3 = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Progress bar
        Animated.timing(progress, {
            toValue: 1,
            duration: 3000,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start(() => {
            navigation.replace('OnboardingComplete');
        });

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
    }, []);

    const width = progress.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={{ flex: 1, backgroundColor: CREAM }}>
            <StatusBar style="dark" />
            <View style={{ flex: 1, paddingTop: insets.top, justifyContent: 'space-between', padding: 32 }}>
                {/* Top — Title */}
                <View style={{ marginTop: 24 }}>
                    <Text
                        style={{
                            fontSize: 52,
                            fontWeight: '900',
                            color: BLACK,
                            letterSpacing: -2,
                            lineHeight: 52,
                            textTransform: 'uppercase',
                        }}
                    >
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
                        <View
                            style={{
                                width: 40,
                                height: 2,
                                backgroundColor: BLACK,
                                position: 'absolute',
                            }}
                        />
                    </Animated.View>

                    {/* Pulsing Dots */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Animated.View
                            style={{
                                width: 10,
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: '#FFD600',
                                transform: [{ scale: dot1 }],
                            }}
                        />
                        <Animated.View
                            style={{
                                width: 10,
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: '#E03A2F',
                                transform: [{ scale: dot2 }],
                            }}
                        />
                        <Animated.View
                            style={{
                                width: 10,
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: '#00C853',
                                transform: [{ scale: dot3 }],
                            }}
                        />
                    </View>

                    <Text
                        style={{
                            fontSize: 13,
                            fontWeight: '700',
                            color: '#999',
                            letterSpacing: 2,
                            textTransform: 'uppercase',
                            textAlign: 'center',
                        }}
                    >
                        SECURING YOUR DATA AND{'\n'}SETTING UP YOUR PROFILE SPACE
                    </Text>
                </View>

                {/* Bottom — Progress Bar */}
                <View>
                    <View
                        style={{
                            width: '100%',
                            height: 4,
                            backgroundColor: '#E0DDD8',
                            borderRadius: 2,
                            overflow: 'hidden',
                        }}
                    >
                        <Animated.View
                            style={{
                                width,
                                height: '100%',
                                backgroundColor: ORANGE,
                                borderRadius: 2,
                            }}
                        />
                    </View>
                    <Text
                        style={{
                            fontSize: 11,
                            fontWeight: '800',
                            color: BLACK,
                            letterSpacing: 1.5,
                            textTransform: 'uppercase',
                            textAlign: 'center',
                            marginTop: 12,
                        }}
                    >
                        PLEASE WAIT
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default VerificationWaitScreen;
