import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BLACK, CREAM, ORANGE } from '../constants/colors';

const { width } = Dimensions.get('window');

const PaymentSuccessScreen = () => {
    const navigation = useNavigation<any>();
    const scaleAnim = useRef(new Animated.Value(0.5)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const marqueeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnim, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true }),
            Animated.timing(opacityAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        ]).start();

        Animated.loop(
            Animated.timing(marqueeAnim, { toValue: -width, duration: 10000, easing: Easing.linear, useNativeDriver: true })
        ).start();
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: CREAM, overflow: 'hidden' }}>
            {/* Marquee */}
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', opacity: 0.04 }}>
                <Animated.View style={{ transform: [{ translateX: marqueeAnim }], flexDirection: 'row', width: width * 3 }}>
                    <Text style={{ fontSize: 100, fontWeight: '900', color: BLACK, textTransform: 'uppercase' }}>
                        UNLOCKED · PREMIUM · UNLOCKED · PREMIUM ·
                    </Text>
                </Animated.View>
            </View>

            <SafeAreaView style={{ flex: 1, justifyContent: 'space-between' }}>
                {/* Header */}
                <View style={{ paddingTop: 32, alignItems: 'center' }}>
                    <Text style={{ fontSize: 60, fontWeight: '900', color: BLACK, lineHeight: 56, textAlign: 'center', letterSpacing: -2, textTransform: 'uppercase' }}>
                        PREMIUM{'\n'}ACTIVE.
                    </Text>
                </View>

                {/* Center Visual */}
                <Animated.View style={{ transform: [{ scale: scaleAnim }], opacity: opacityAnim, alignItems: 'center', marginVertical: 32 }}>
                    <View style={{ position: 'absolute', top: 0, right: 40, width: 56, height: 56, borderRadius: 28, backgroundColor: ORANGE }} />
                    <View style={{ width: 200, height: 200, borderRadius: 100, backgroundColor: BLACK, alignItems: 'center', justifyContent: 'center' }}>
                        <MaterialIcons name="check" size={100} color="#FFFFFF" />
                    </View>
                </Animated.View>

                {/* Info & Action */}
                <Animated.View style={{ transform: [{ translateY: slideAnim }], opacity: opacityAnim, paddingHorizontal: 24, paddingBottom: 32 }}>
                    <View style={{ marginBottom: 40, borderTopWidth: 3, borderTopColor: BLACK, paddingTop: 24 }}>
                        <Text style={{ color: BLACK, fontWeight: '900', fontSize: 16, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
                            YOUR PROFESSIONAL EDGE IS NOW UNLOCKED.
                        </Text>
                        <Text style={{ color: '#999', fontWeight: '700', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' }}>
                            ALL PREMIUM FEATURES ARE ACTIVE.
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('DiscoveryMap')}
                        style={{
                            backgroundColor: BLACK, paddingVertical: 20, flexDirection: 'row',
                            alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 32,
                        }}
                    >
                        <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' }}>EXPLORE PREMIUM</Text>
                        <MaterialIcons name="arrow-forward" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </Animated.View>
            </SafeAreaView>
        </View>
    );
};

export default PaymentSuccessScreen;
