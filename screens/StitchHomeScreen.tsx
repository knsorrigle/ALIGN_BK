import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, Pressable, ScrollView, Image, Animated, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Star, X, Zap } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { BLACK, CREAM, ORANGE } from '../constants/colors';

export default function StitchHomeScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();

    // Animation Values
    const title1Y = useRef(new Animated.Value(60)).current;
    const title2Y = useRef(new Animated.Value(60)).current;
    const title3Y = useRef(new Animated.Value(60)).current;
    const title4Y = useRef(new Animated.Value(60)).current;
    const title1Opacity = useRef(new Animated.Value(0)).current;
    const title2Opacity = useRef(new Animated.Value(0)).current;
    const title3Opacity = useRef(new Animated.Value(0)).current;
    const title4Opacity = useRef(new Animated.Value(0)).current;

    const dotPulse1 = useRef(new Animated.Value(1)).current;
    const dotPulse2 = useRef(new Animated.Value(1)).current;
    const dotPulse3 = useRef(new Animated.Value(1)).current;

    const cardAlexOpacity = useRef(new Animated.Value(0)).current;
    const cardAlexY = useRef(new Animated.Value(20)).current;
    const cardAlexX = useRef(new Animated.Value(0)).current;
    const cardAlexScale = useRef(new Animated.Value(1)).current;
    const cardJordanOpacity = useRef(new Animated.Value(0)).current;
    const cardJordanY = useRef(new Animated.Value(20)).current;
    const cardJordanX = useRef(new Animated.Value(0)).current;
    const cardJordanScale = useRef(new Animated.Value(1)).current;

    const askBarOpacity = useRef(new Animated.Value(0)).current;
    const askBarY = useRef(new Animated.Value(30)).current;

    const [isAlexDismissed, setIsAlexDismissed] = useState(false);
    const [isJordanDismissed, setIsJordanDismissed] = useState(false);
    const [isAlexFavorited, setIsAlexFavorited] = useState(false);
    const [isJordanFavorited, setIsJordanFavorited] = useState(false);
    // Star animation values
    const alexStarScale = useRef(new Animated.Value(1)).current;
    const alexStarRotation = useRef(new Animated.Value(0)).current;
    const jordanStarScale = useRef(new Animated.Value(1)).current;
    const jordanStarRotation = useRef(new Animated.Value(0)).current;

    const animateStar = (scale: Animated.Value, rotation: Animated.Value, wasFavorited: boolean) => {
        // Pop: scale up then spring back with overshoot
        Animated.sequence([
            Animated.spring(scale, {
                toValue: 1.5,
                friction: 3,
                tension: 400,
                useNativeDriver: true,
            }),
            Animated.spring(scale, {
                toValue: 1,
                friction: 4,
                tension: 180,
                useNativeDriver: true,
            }),
        ]).start();

        // Shimmy rotation only when favoriting (not unfavoriting)
        if (!wasFavorited) {
            Animated.sequence([
                Animated.timing(rotation, { toValue: -1, duration: 70, useNativeDriver: true }),
                Animated.timing(rotation, { toValue: 1, duration: 70, useNativeDriver: true }),
                Animated.spring(rotation, { toValue: 0, friction: 5, tension: 200, useNativeDriver: true }),
            ]).start();
        }
    };


    const handleDismissAlex = () => {
        Animated.parallel([
            Animated.timing(cardAlexX, { toValue: -420, duration: 220, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
            Animated.timing(cardAlexOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
        ]).start(() => {
            setIsAlexDismissed(true);
        });
    };

    const handleDismissJordan = () => {
        Animated.parallel([
            Animated.timing(cardJordanX, { toValue: -420, duration: 220, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
            Animated.timing(cardJordanOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
        ]).start(() => {
            setIsJordanDismissed(true);
        });
    };

    useEffect(() => {
        // Staggered title animations
        Animated.stagger(100, [
            Animated.parallel([
                Animated.timing(title1Y, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
                Animated.timing(title1Opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
            ]),
            Animated.parallel([
                Animated.timing(title2Y, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
                Animated.timing(title2Opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
            ]),
            Animated.parallel([
                Animated.timing(title3Y, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
                Animated.timing(title3Opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
            ]),
            Animated.parallel([
                Animated.timing(title4Y, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
                Animated.timing(title4Opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
            ]),
        ]).start();

        // Cards slide in
        Animated.sequence([
            Animated.delay(800),
            Animated.parallel([
                Animated.timing(cardAlexOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
                Animated.timing(cardAlexY, { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            ]),
        ]).start();

        Animated.sequence([
            Animated.delay(900), // Exactly 100ms after Alex
            Animated.parallel([
                Animated.timing(cardJordanOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
                Animated.timing(cardJordanY, { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            ]),
        ]).start();

        // Ask bar
        Animated.sequence([
            Animated.delay(1400),
            Animated.parallel([
                Animated.timing(askBarOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.timing(askBarY, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            ]),
        ]).start();

        // Pulsing dots loop
        const createPulse = (anim: Animated.Value, delay: number) =>
            Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(anim, { toValue: 1.4, duration: 500, useNativeDriver: true }),
                    Animated.timing(anim, { toValue: 1, duration: 500, useNativeDriver: true }),
                ])
            );

        createPulse(dotPulse1, 0).start();
        createPulse(dotPulse2, 150).start();
        createPulse(dotPulse3, 300).start();
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: CREAM }}>
            <StatusBar style="dark" />
            <View style={{ flex: 1, paddingTop: insets.top }}>
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Orange Accent Dot - Top Right */}
                    <View style={{ position: 'absolute', top: 16, right: 0, width: 32, height: 32, borderRadius: 16, backgroundColor: ORANGE }} />

                    {/* Hero Title */}
                    <View style={{ marginTop: 20, marginBottom: 24 }}>
                        <Animated.Text
                            style={{
                                fontSize: 64,
                                fontWeight: '900',
                                color: BLACK,
                                lineHeight: 60,
                                letterSpacing: -2,
                                textTransform: 'uppercase',
                                opacity: title1Opacity,
                                transform: [{ translateY: title1Y }],
                            }}
                        >
                            WHO IS
                        </Animated.Text>
                        <Animated.Text
                            style={{
                                fontSize: 64,
                                fontWeight: '900',
                                color: BLACK,
                                lineHeight: 60,
                                letterSpacing: -2,
                                textTransform: 'uppercase',
                                opacity: title2Opacity,
                                transform: [{ translateY: title2Y }],
                            }}
                        >
                            MY BEST
                        </Animated.Text>
                        <Animated.Text
                            style={{
                                fontSize: 64,
                                fontWeight: '900',
                                color: BLACK,
                                lineHeight: 60,
                                letterSpacing: -2,
                                textTransform: 'uppercase',
                                opacity: title3Opacity,
                                transform: [{ translateY: title3Y }],
                            }}
                        >
                            MATCH
                        </Animated.Text>
                        <Animated.Text
                            style={{
                                fontSize: 64,
                                fontWeight: '900',
                                color: BLACK,
                                lineHeight: 60,
                                letterSpacing: -2,
                                textTransform: 'uppercase',
                                opacity: title4Opacity,
                                transform: [{ translateY: title4Y }],
                            }}
                        >
                            TODAY?
                        </Animated.Text>
                    </View>

                    {/* Loading Indicator - Colored Dots */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 28, gap: 6 }}>
                        <Animated.View
                            style={{
                                width: 10,
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: '#FFD600',
                                transform: [{ scale: dotPulse1 }],
                            }}
                        />
                        <Animated.View
                            style={{
                                width: 10,
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: '#E03A2F',
                                transform: [{ scale: dotPulse2 }],
                            }}
                        />
                        <Animated.View
                            style={{
                                width: 10,
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: '#00C853',
                                transform: [{ scale: dotPulse3 }],
                            }}
                        />
                        <Text
                            style={{
                                fontSize: 11,
                                fontWeight: '700',
                                color: BLACK,
                                letterSpacing: 2,
                                textTransform: 'uppercase',
                                marginLeft: 6,
                            }}
                        >
                            ALIGN IS FINDING...
                        </Text>
                    </View>

                    {/* Top Match Card - ALEX */}
                    {!isAlexDismissed && (
                        <TouchableWithoutFeedback
                            onPressIn={() => Animated.spring(cardAlexScale, { toValue: 0.98, useNativeDriver: true }).start()}
                            onPressOut={() => Animated.spring(cardAlexScale, { toValue: 1, useNativeDriver: true }).start()}
                        >
                            <Animated.View
                                style={{
                                    backgroundColor: BLACK,
                                    borderRadius: 24,
                                    padding: 24,
                                    marginBottom: 16,
                                    opacity: cardAlexOpacity,
                                    transform: [{ translateY: cardAlexY }, { translateX: cardAlexX }, { scale: cardAlexScale }],
                                }}
                            >
                                {/* Top Label + Score */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Text
                                        style={{
                                            fontSize: 10,
                                            fontWeight: '700',
                                            color: '#999',
                                            letterSpacing: 3,
                                            textTransform: 'uppercase',
                                        }}
                                    >
                                        TOP ALIGNMENT
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 36,
                                            fontWeight: '900',
                                            color: '#FFFFFF',
                                            letterSpacing: -1,
                                            lineHeight: 36,
                                        }}
                                    >
                                        98%
                                    </Text>
                                </View>

                                {/* AP Badge */}
                                <View style={{
                                    alignSelf: 'flex-start',
                                    backgroundColor: '#1A1A1A',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 6,
                                    paddingHorizontal: 12,
                                    paddingVertical: 6,
                                    borderRadius: 100,
                                    borderWidth: 1,
                                    borderColor: 'rgba(255,255,255,0.08)',
                                    marginTop: 20,
                                }}>
                                    <Zap size={10} color={ORANGE} fill={ORANGE} />
                                    <Text style={{ fontSize: 10, fontWeight: '800', color: CREAM, paddingBottom: 1, letterSpacing: 1 }}>12 APs</Text>
                                </View>

                                {/* Name */}
                                <Text
                                    style={{
                                        fontSize: 52,
                                        fontWeight: '900',
                                        color: '#FFFFFF',
                                        letterSpacing: -2,
                                        lineHeight: 52,
                                        marginTop: 8,
                                    }}
                                >
                                    ALEX
                                </Text>

                                {/* Bio Descriptor */}
                                <Text
                                    style={{
                                        fontSize: 14,
                                        color: '#AAAAAA',
                                        marginTop: 12,
                                        lineHeight: 20,
                                    }}
                                >
                                    Shared interests in Photography{'\n'}and Indie Music.
                                </Text>

                                {/* Action Buttons Row */}
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 16 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                        <View style={{ flexDirection: 'row', gap: 8 }}>
                                            <TouchableOpacity
                                                activeOpacity={0.8}
                                                onPress={handleDismissAlex}
                                                style={{
                                                    width: 48,
                                                    height: 48,
                                                    borderRadius: 24,
                                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <X size={20} strokeWidth={1.5} color="rgba(245, 240, 235, 0.4)" />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                activeOpacity={1}
                                                onPress={() => {
                                                    animateStar(alexStarScale, alexStarRotation, isAlexFavorited);
                                                    setIsAlexFavorited(!isAlexFavorited);
                                                }}
                                            >
                                                <Animated.View
                                                    style={{
                                                        width: 48,
                                                        height: 48,
                                                        borderRadius: 24,
                                                        backgroundColor: isAlexFavorited ? ORANGE : 'rgba(255, 255, 255, 0.05)',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        transform: [
                                                            { scale: alexStarScale },
                                                            { rotate: alexStarRotation.interpolate({ inputRange: [-1, 0, 1], outputRange: ['-20deg', '0deg', '20deg'] }) },
                                                        ],
                                                    }}
                                                >
                                                    <Star
                                                        size={20}
                                                        strokeWidth={1.5}
                                                        color={isAlexFavorited ? '#F5F0EB' : 'rgba(245, 240, 235, 0.4)'}
                                                        fill={isAlexFavorited ? '#F5F0EB' : 'transparent'}
                                                    />
                                                </Animated.View>
                                            </TouchableOpacity>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => navigation.navigate('ProfileDetail')}
                                            style={{
                                                backgroundColor: CREAM,
                                                paddingHorizontal: 24,
                                                paddingVertical: 14,
                                                borderRadius: 24,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 10,
                                                    fontWeight: '800',
                                                    color: BLACK,
                                                    letterSpacing: 0.5,
                                                    textTransform: 'uppercase',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                VIEW PROFILE
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Animated.View>
                        </TouchableWithoutFeedback>
                    )}

                    {/* Runner Up Card - JORDAN */}
                    {!isJordanDismissed && (
                        <TouchableWithoutFeedback
                            onPressIn={() => Animated.spring(cardJordanScale, { toValue: 0.98, useNativeDriver: true }).start()}
                            onPressOut={() => Animated.spring(cardJordanScale, { toValue: 1, useNativeDriver: true }).start()}
                        >
                            <Animated.View
                                style={{
                                    backgroundColor: BLACK,
                                    borderRadius: 24,
                                    padding: 24,
                                    marginBottom: 16,
                                    opacity: cardJordanOpacity,
                                    transform: [{ translateY: cardJordanY }, { translateX: cardJordanX }, { scale: cardJordanScale }],
                                }}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Text
                                        style={{
                                            fontSize: 10,
                                            fontWeight: '700',
                                            color: '#666',
                                            letterSpacing: 3,
                                            textTransform: 'uppercase',
                                        }}
                                    >
                                        RUNNER UP
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 36,
                                            fontWeight: '900',
                                            color: '#FFFFFF',
                                            letterSpacing: -1,
                                            lineHeight: 36,
                                        }}
                                    >
                                        84%
                                    </Text>
                                </View>

                                <Text
                                    style={{
                                        fontSize: 52,
                                        fontWeight: '900',
                                        color: '#FFFFFF',
                                        letterSpacing: -2,
                                        lineHeight: 52,
                                        marginTop: 8,
                                    }}
                                >
                                    JORDAN
                                </Text>

                                <Text
                                    style={{
                                        fontSize: 14,
                                        color: '#AAAAAA',
                                        marginTop: 12,
                                        lineHeight: 20,
                                    }}
                                >
                                    Shared interests in Architecture{'\n'}and Minimalism.
                                </Text>

                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 16 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                        <View style={{ flexDirection: 'row', gap: 8 }}>
                                            <TouchableOpacity
                                                activeOpacity={0.8}
                                                onPress={handleDismissJordan}
                                                style={{
                                                    width: 48,
                                                    height: 48,
                                                    borderRadius: 24,
                                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <X size={20} strokeWidth={1.5} color="rgba(245, 240, 235, 0.4)" />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                activeOpacity={1}
                                                onPress={() => {
                                                    animateStar(jordanStarScale, jordanStarRotation, isJordanFavorited);
                                                    setIsJordanFavorited(!isJordanFavorited);
                                                }}
                                            >
                                                <Animated.View
                                                    style={{
                                                        width: 48,
                                                        height: 48,
                                                        borderRadius: 24,
                                                        backgroundColor: isJordanFavorited ? ORANGE : 'rgba(255, 255, 255, 0.05)',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        transform: [
                                                            { scale: jordanStarScale },
                                                            { rotate: jordanStarRotation.interpolate({ inputRange: [-1, 0, 1], outputRange: ['-20deg', '0deg', '20deg'] }) },
                                                        ],
                                                    }}
                                                >
                                                    <Star
                                                        size={20}
                                                        strokeWidth={1.5}
                                                        color={isJordanFavorited ? '#F5F0EB' : 'rgba(245, 240, 235, 0.4)'}
                                                        fill={isJordanFavorited ? '#F5F0EB' : 'transparent'}
                                                    />
                                                </Animated.View>
                                            </TouchableOpacity>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => navigation.navigate('ProfileDetail')}
                                            style={{
                                                backgroundColor: CREAM,
                                                paddingHorizontal: 24,
                                                paddingVertical: 14,
                                                borderRadius: 24,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 10,
                                                    fontWeight: '800',
                                                    color: BLACK,
                                                    letterSpacing: 0.5,
                                                    textTransform: 'uppercase',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                VIEW PROFILE
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Animated.View>
                        </TouchableWithoutFeedback>
                    )}

                    {/* END OF SCROLLVIEW */}
                </ScrollView>

                {/* Floating Ask Align Anything Bar */}
                <Animated.View
                    style={{
                        position: 'absolute',
                        bottom: 12,
                        left: 16,
                        right: 16,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#FFFFFF',
                        height: 80,
                        borderRadius: 40,
                        paddingHorizontal: 32,
                        opacity: askBarOpacity,
                        transform: [{ translateY: askBarY }],
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 25 },
                        shadowOpacity: 0.25,
                        shadowRadius: 50,
                        elevation: 20,
                    }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <Ionicons name="mic" size={20} color="rgba(13,13,13,0.3)" />
                        <Text
                            style={{
                                fontSize: 11,
                                fontWeight: '800',
                                color: 'rgba(13,13,13,0.4)',
                                textTransform: 'uppercase',
                                letterSpacing: 2,
                            }}
                        >
                            ASK ALIGN ANYTHING...
                        </Text>
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('AlignAI')}
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: 24,
                            backgroundColor: BLACK, // Static black for simplicity, or we could add the hover state here too
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </View>
    );
}
