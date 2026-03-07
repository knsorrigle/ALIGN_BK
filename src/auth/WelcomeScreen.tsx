import React, { useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Animated, Easing, StyleSheet } from 'react-native';
import { Svg, Path, Circle } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useOAuth } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { CREAM, BLACK, ORANGE } from '../constants/colors';
import { w } from '../utils/responsive';

WebBrowser.maybeCompleteAuthSession();

const { width, height } = Dimensions.get('window');
const CENTER_X = width / 2;

// Bezier Curve Configuration
const CURVE_OFFSET = width * 0.22;
const CURVE_PATH = `M${CENTER_X},-50 C${CENTER_X + CURVE_OFFSET},${height * 0.30} ${CENTER_X - CURVE_OFFSET},${height * 0.70} ${CENTER_X},${height + 50}`;

const getBezierPoint = (t: number) => {
    const p0 = { x: CENTER_X, y: -50 };
    const p1 = { x: CENTER_X + CURVE_OFFSET, y: height * 0.30 };
    const p2 = { x: CENTER_X - CURVE_OFFSET, y: height * 0.70 };
    const p3 = { x: CENTER_X, y: height + 50 };

    const x = Math.pow(1 - t, 3) * p0.x +
        3 * Math.pow(1 - t, 2) * t * p1.x +
        3 * (1 - t) * Math.pow(t, 2) * p2.x +
        Math.pow(t, 3) * p3.x;

    const y = Math.pow(1 - t, 3) * p0.y +
        3 * Math.pow(1 - t, 2) * t * p1.y +
        3 * (1 - t) * Math.pow(t, 2) * p2.y +
        Math.pow(t, 3) * p3.y;
    return { x, y };
};

const DOT_YELLOW = getBezierPoint(0.18);
const DOT_RED = getBezierPoint(0.5);
const DOT_BLUE = getBezierPoint(0.82);

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const BG_WORDS = [
    { text: 'ALIGN', size: 80, x: -40, y: 60, rotate: '-8deg', opacity: 0.08 },
    { text: 'REAL', size: 64, x: width * 0.75, y: 100, rotate: '6deg', opacity: 0.07 },
    { text: 'VERIFIED', size: 48, x: 20, y: 200, rotate: '-5deg', opacity: 0.09 },
    { text: 'CONNECT', size: 72, x: width * 0.7, y: 250, rotate: '8deg', opacity: 0.06 },
    { text: 'INTENTIONAL', size: 48, x: -30, y: 350, rotate: '-4deg', opacity: 0.08 },
    { text: 'NO SWIPES', size: 42, x: width * 0.78, y: 420, rotate: '4deg', opacity: 0.07 },
    { text: 'TRUST', size: 64, x: -10, y: 550, rotate: '-7deg', opacity: 0.09 },
    { text: 'MATCH', size: 80, x: width * 0.65, y: 620, rotate: '5deg', opacity: 0.06 },
    { text: 'FIND', size: 64, x: 10, y: 700, rotate: '-3deg', opacity: 0.08 },
    { text: 'REAL PEOPLE', size: 42, x: width * 0.6, y: 780, rotate: '6deg', opacity: 0.07 },
    { text: 'ALIGN', size: 80, x: -20, y: 820, rotate: '-2deg', opacity: 0.09 },
];

interface WelcomeScreenProps {
    onNext?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNext }) => {
    const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

    // Animation Values
    const pathProgress = useRef(new Animated.Value(0)).current;
    const bgTranslateY = useRef(new Animated.Value(0)).current;
    const textTranslateX = useRef(new Animated.Value(-width)).current;
    const redDotScale = useRef(new Animated.Value(0)).current;
    const yellowDotScale = useRef(new Animated.Value(0)).current;
    const blueDotScale = useRef(new Animated.Value(0)).current;
    const buttonTranslateY = useRef(new Animated.Value(100)).current;
    const signInOpacity = useRef(new Animated.Value(0)).current;

    const PATH_LENGTH = 1500;

    useEffect(() => {
        void WebBrowser.warmUpAsync();

        // Background Drift Loop
        Animated.loop(
            Animated.sequence([
                Animated.timing(bgTranslateY, {
                    toValue: -20,
                    duration: 12000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(bgTranslateY, {
                    toValue: 0,
                    duration: 12000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Main Entrance Sequence
        Animated.parallel([
            Animated.timing(pathProgress, {
                toValue: 1,
                duration: 1600,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(textTranslateX, {
                toValue: 0,
                duration: 350,
                easing: Easing.bezier(0.16, 1, 0.3, 1),
                useNativeDriver: true,
            }),
            Animated.sequence([
                Animated.delay(800),
                Animated.spring(redDotScale, {
                    toValue: 1,
                    friction: 5,
                    tension: 100,
                    useNativeDriver: true,
                }),
            ]),
            Animated.sequence([
                Animated.delay(500),
                Animated.spring(yellowDotScale, {
                    toValue: 1,
                    useNativeDriver: true,
                }),
            ]),
            Animated.sequence([
                Animated.delay(1200),
                Animated.spring(blueDotScale, {
                    toValue: 1,
                    useNativeDriver: true,
                }),
            ]),
            Animated.sequence([
                Animated.delay(1400),
                Animated.timing(buttonTranslateY, {
                    toValue: 0,
                    duration: 400,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
            ]),
            Animated.sequence([
                Animated.delay(1800),
                Animated.timing(signInOpacity, {
                    toValue: 0.6,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();

        return () => {
            void WebBrowser.coolDownAsync();
        };
    }, []);

    const handleSignInWithGoogle = useCallback(async () => {
        try {
            const redirectUrl = Linking.createURL('/', { scheme: 'alignfinal' });
            const { createdSessionId, setActive } = await startOAuthFlow({ redirectUrl });

            if (createdSessionId && setActive) {
                await setActive({ session: createdSessionId });
            }
        } catch (err) {
            console.error("OAuth Error:", err);
        }
    }, [startOAuthFlow]);

    const strokeDashoffset = pathProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [PATH_LENGTH, 0],
    });

    return (
        <View style={styles.container}>
            {/* 1. Background Typography Layer */}
            <View style={StyleSheet.absoluteFill} pointerEvents="none">
                {BG_WORDS.map((word, index) => (
                    <Animated.Text
                        key={index}
                        style={{
                            position: 'absolute',
                            left: word.x,
                            top: word.y,
                            fontSize: word.size,
                            transform: [
                                { rotate: word.rotate },
                                { translateY: bgTranslateY }
                            ],
                            opacity: word.opacity,
                            fontWeight: '300',
                            color: 'black',
                            letterSpacing: -1,
                        }}
                    >
                        {word.text}
                    </Animated.Text>
                ))}
            </View>

            {/* 2. ALIGN Wordmark */}
            <View style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center', zIndex: 5 }]} pointerEvents="none">
                <Animated.View style={{
                    transform: [{ translateX: textTranslateX }],
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 15
                }}>
                    <Text style={styles.heroText}>AL</Text>
                    <Text style={styles.heroText}>GN</Text>
                </Animated.View>
            </View>

            {/* 3. SVG Serpentine Curve & Dots */}
            <View style={[StyleSheet.absoluteFill, { zIndex: 10 }]} pointerEvents="none">
                <Svg height="100%" width="100%">
                    <AnimatedPath
                        d={CURVE_PATH}
                        fill="none"
                        stroke="black"
                        strokeWidth="28"
                        strokeLinecap="round"
                        strokeDasharray={PATH_LENGTH}
                        strokeDashoffset={strokeDashoffset}
                    />
                    <AnimatedCircle
                        cx={DOT_YELLOW.x} cy={DOT_YELLOW.y} fill="#FFD600"
                        r={yellowDotScale.interpolate({ inputRange: [0, 1], outputRange: [0, 14] })}
                    />
                    <AnimatedCircle
                        cx={DOT_RED.x} cy={DOT_RED.y} fill="#E03A2F"
                        r={redDotScale.interpolate({ inputRange: [0, 1], outputRange: [0, 14] })}
                    />
                    <AnimatedCircle
                        cx={DOT_BLUE.x} cy={DOT_BLUE.y} fill="#1A1AFF"
                        r={blueDotScale.interpolate({ inputRange: [0, 1], outputRange: [0, 14] })}
                    />
                </Svg>
            </View>

            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'black', opacity: 0.03, zIndex: 15 }]} pointerEvents="none" />

            <SafeAreaView style={{ flex: 1, zIndex: 20, justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 24 }}>
                    <Animated.View style={{ opacity: signInOpacity }}>
                        <TouchableOpacity onPress={handleSignInWithGoogle}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black' }}>Sign In</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>

                <View />

                <View style={{ padding: 24, paddingBottom: 48, gap: 24 }}>
                    <Animated.View style={{ transform: [{ translateY: buttonTranslateY }] }}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleSignInWithGoogle}
                            activeOpacity={0.9}
                        >
                            <Text style={styles.buttonText}>GET STARTED</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
                        <MaterialIcons name="adjust" size={14} color="black" />
                        <Text style={{ fontSize: 10, fontWeight: 'bold', letterSpacing: 3, textTransform: 'uppercase', opacity: 0.4 }}>
                            Poster Art Series No. 01
                        </Text>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#00C853',
        position: 'relative',
        overflow: 'hidden',
    },
    heroText: {
        fontSize: 130,
        fontWeight: '900',
        color: 'black',
        textTransform: 'uppercase',
        letterSpacing: -10,
        lineHeight: 120,
    },
    button: {
        width: '100%',
        height: 64,
        backgroundColor: 'black',
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: CREAM,
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 2,
        textTransform: 'uppercase',
    }
});
