import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Animated, Easing, StyleSheet, Platform } from 'react-native';
import { Svg, Path, Circle } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { CREAM } from '../constants/colors';

const { width, height } = Dimensions.get('window');
const CENTER_X = width / 2;

// Bezier Curve Configuration
// P0=(CENTER, -50), P1=(CENTER + Offset, h*0.3), P2=(CENTER - Offset, h*0.7), P3=(CENTER, h+50)
const CURVE_OFFSET = width * 0.22; // ~85px on standard screen, keeps within 30-70% range
// SVG Path String
const CURVE_PATH = `M${CENTER_X},-50 C${CENTER_X + CURVE_OFFSET},${height * 0.30} ${CENTER_X - CURVE_OFFSET},${height * 0.70} ${CENTER_X},${height + 50}`;

// Helper to calculate point on cubic bezier for dots (Approximate for t)
// B(t) = (1-t)^3 P0 + 3(1-t)^2 t P1 + 3(1-t) t^2 P2 + t^3 P3
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

const DOT_YELLOW = getBezierPoint(0.18); // Top
const DOT_RED = getBezierPoint(0.5);   // Middle (Center)
const DOT_BLUE = getBezierPoint(0.82); // Bottom

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// --- Background Typography Configuration ---
// Avoid center strip: x < width * 0.25 OR x > width * 0.75
const BG_WORDS = [
    { text: 'ALIGN', size: 80, x: -40, y: 60, rotate: '-8deg', opacity: 0.08 },
    { text: 'REAL', size: 64, x: width * 0.75, y: 100, rotate: '6deg', opacity: 0.07 },
    { text: 'VERIFIED', size: 48, x: 20, y: 200, rotate: '-5deg', opacity: 0.09 },
    { text: 'CONNECT', size: 72, x: width * 0.7, y: 250, rotate: '8deg', opacity: 0.06 },
    { text: 'INTENTIONAL', size: 48, x: -30, y: 350, rotate: '-4deg', opacity: 0.08 },
    // Gap around y=400-500 (Center)
    { text: 'NO SWIPES', size: 42, x: width * 0.78, y: 420, rotate: '4deg', opacity: 0.07 },
    { text: 'TRUST', size: 64, x: -10, y: 550, rotate: '-7deg', opacity: 0.09 },
    { text: 'MATCH', size: 80, x: width * 0.65, y: 620, rotate: '5deg', opacity: 0.06 },
    { text: 'FIND', size: 64, x: 10, y: 700, rotate: '-3deg', opacity: 0.08 },
    { text: 'REAL PEOPLE', size: 42, x: width * 0.6, y: 780, rotate: '6deg', opacity: 0.07 },
    { text: 'ALIGN', size: 80, x: -20, y: 820, rotate: '-2deg', opacity: 0.09 },
];

const WelcomeScreen = () => {
    const navigation = useNavigation<any>();

    // Animation Values
    const pathProgress = useRef(new Animated.Value(0)).current;
    const bgTranslateY = useRef(new Animated.Value(0)).current;

    // Foreground Animations
    const textTranslateX = useRef(new Animated.Value(-width)).current;
    const redDotScale = useRef(new Animated.Value(0)).current;
    const yellowDotScale = useRef(new Animated.Value(0)).current;
    const blueDotScale = useRef(new Animated.Value(0)).current;
    const buttonTranslateY = useRef(new Animated.Value(100)).current;
    const signInOpacity = useRef(new Animated.Value(0)).current;

    const PATH_LENGTH = 1500;

    useEffect(() => {
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
            // 1. Draw Path
            Animated.timing(pathProgress, {
                toValue: 1,
                duration: 1600,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }),
            // 2. Text Slam
            Animated.timing(textTranslateX, {
                toValue: 0,
                duration: 350,
                easing: Easing.bezier(0.16, 1, 0.3, 1),
                useNativeDriver: true,
            }),
            // 3. Red Dot (Middle)
            Animated.sequence([
                Animated.delay(800), // Wait for curve to pass middle
                Animated.spring(redDotScale, {
                    toValue: 1,
                    friction: 5,
                    tension: 100,
                    useNativeDriver: true,
                }),
            ]),
            // 4. Yellow Dot (Top)
            Animated.sequence([
                Animated.delay(500),
                Animated.spring(yellowDotScale, {
                    toValue: 1,
                    useNativeDriver: true,
                }),
            ]),
            // 5. Blue Dot (Bottom)
            Animated.sequence([
                Animated.delay(1200),
                Animated.spring(blueDotScale, {
                    toValue: 1,
                    useNativeDriver: true,
                }),
            ]),
            // 6. Button
            Animated.sequence([
                Animated.delay(1400),
                Animated.timing(buttonTranslateY, {
                    toValue: 0,
                    duration: 400,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
            ]),
            // 7. Sign In
            Animated.sequence([
                Animated.delay(1800),
                Animated.timing(signInOpacity, {
                    toValue: 0.6,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    }, []);

    const strokeDashoffset = pathProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [PATH_LENGTH, 0],
    });

    return (
        <View style={styles.container}>
            {/* 1. Background Typography Layer (Bottom) */}
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
                            fontWeight: '300', // Thin/Light weight
                            color: 'black',
                            letterSpacing: -1, // Numeric value to avoid crash
                        }}
                    >
                        {word.text}
                    </Animated.Text>
                ))}
            </View>

            {/* 2. ALIGN Wordmark (Behind Curve) */}
            <View style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center', zIndex: 5 }]} pointerEvents="none">
                <Animated.View style={{
                    transform: [{ translateX: textTranslateX }],
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    // The gap here is sized to let the curve pass through perfectly
                    gap: 15
                }}>
                    <Text style={styles.heroText}>AL</Text>
                    {/* The "I" is implied by the red dot on the curve below, or we can add a placeholder if needed */}
                    <Text style={styles.heroText}>GN</Text>
                </Animated.View>
            </View>

            {/* 3. SVG Serpentine Curve & Dots (Top Intermediary) */}
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
                    {/* Yellow Dot (Top) */}
                    <AnimatedCircle
                        cx={DOT_YELLOW.x} cy={DOT_YELLOW.y} fill="#FFD600"
                        r={yellowDotScale.interpolate({ inputRange: [0, 1], outputRange: [0, 14] })}
                    />
                    {/* Red Dot (Center - Acts as the 'I') */}
                    <AnimatedCircle
                        cx={DOT_RED.x} cy={DOT_RED.y} fill="#E03A2F"
                        r={redDotScale.interpolate({ inputRange: [0, 1], outputRange: [0, 14] })}
                    />
                    {/* Blue Dot (Bottom) */}
                    <AnimatedCircle
                        cx={DOT_BLUE.x} cy={DOT_BLUE.y} fill="#1A1AFF"
                        r={blueDotScale.interpolate({ inputRange: [0, 1], outputRange: [0, 14] })}
                    />
                </Svg>
            </View>

            {/* Texture Overlay (Grain) */}
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'black', opacity: 0.03, zIndex: 15 }]} pointerEvents="none" />

            {/* 4. Foreground UI (Buttons, Header) */}
            <SafeAreaView style={{ flex: 1, zIndex: 20, justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 24 }}>
                    <Animated.View style={{ opacity: signInOpacity }}>
                        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black' }}>Sign In</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>

                {/* Empty center Middle because Wordmark is absolute positioned behind */}
                <View />

                <View style={{ padding: 24, paddingBottom: 48, gap: 24 }}>
                    <Animated.View style={{ transform: [{ translateY: buttonTranslateY }] }}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate('SignIn')}
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
        backgroundColor: '#00C853', // Electric Green
        position: 'relative',
        overflow: 'hidden',
    },
    heroText: {
        fontSize: 130, // Slightly larger
        fontWeight: '900',
        color: 'black',
        textTransform: 'uppercase',
        letterSpacing: -10, // Very tight, numeric
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
        color: CREAM, // Cream
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 2, // Numeric
        textTransform: 'uppercase',
    }
});

export default WelcomeScreen;
