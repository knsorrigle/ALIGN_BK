import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BLACK, CREAM } from '../../constants/colors';

const OnboardingCompleteScreen = () => {
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnim, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true }),
            Animated.timing(opacityAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ]).start();
    }, []);

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
                    onPress={() => navigation.reset({ index: 0, routes: [{ name: 'MainApp' }] })}
                    style={{ backgroundColor: BLACK, paddingVertical: 16, borderRadius: 32, alignItems: 'center' }}
                >
                    <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' }}>Enter Align</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default OnboardingCompleteScreen;
