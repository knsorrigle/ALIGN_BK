import React, { useEffect, useRef, useCallback, useState } from 'react';
import {
    View, Text, TouchableOpacity, Animated, Easing,
    Dimensions, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useOAuth } from '@clerk/expo';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { BLACK, CREAM, ORANGE } from '../../constants/colors';

WebBrowser.maybeCompleteAuthSession();

const { width } = Dimensions.get('window');

const SignInScreen = () => {
    const navigation = useNavigation<any>();
    const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
    const [isLoading, setIsLoading] = useState(false);

    const titleOpacity = useRef(new Animated.Value(0)).current;
    const contentTranslateY = useRef(new Animated.Value(50)).current;
    const marqueeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        void WebBrowser.warmUpAsync();

        Animated.parallel([
            Animated.timing(titleOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
            Animated.timing(contentTranslateY, { toValue: 0, duration: 800, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        ]).start();

        Animated.loop(
            Animated.timing(marqueeAnim, { toValue: -width, duration: 10000, easing: Easing.linear, useNativeDriver: true })
        ).start();

        return () => { void WebBrowser.coolDownAsync(); };
    }, []);

    // Single OAuth handler for both buttons — RootNavigator handles routing after sign-in
    const handleGoogleOAuth = useCallback(async () => {
        if (isLoading) return;
        try {
            setIsLoading(true);
            const redirectUrl = Linking.createURL('/');
            const { createdSessionId, setActive } = await startOAuthFlow({ redirectUrl });
            if (createdSessionId && setActive) {
                await setActive({ session: createdSessionId });
                // Auth state changes → RootNavigator re-renders → routes to Onboarding or MainApp
            }
        } catch (err) {
            console.error('OAuth error:', err);
        } finally {
            setIsLoading(false);
        }
    }, [startOAuthFlow, isLoading]);

    return (
        <View style={{ flex: 1, backgroundColor: CREAM }}>
            {/* Peach Circle Accent — top right */}
            <View
                style={{
                    position: 'absolute',
                    top: -40,
                    right: -40,
                    width: 200,
                    height: 200,
                    borderRadius: 100,
                    backgroundColor: '#F5CBA7',
                    opacity: 0.5,
                }}
            />

            <SafeAreaView style={{ flex: 1, justifyContent: 'space-between', paddingHorizontal: 32, paddingVertical: 16 }}>
                {/* Back Button */}
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: 'rgba(0,0,0,0.08)',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <MaterialIcons name="arrow-back" size={20} color={BLACK} />
                </TouchableOpacity>

                {/* Main Content */}
                <Animated.View style={{ opacity: titleOpacity, transform: [{ translateY: contentTranslateY }] }}>
                    {/* Title */}
                    <Text
                        style={{
                            fontSize: 72,
                            fontWeight: '900',
                            fontStyle: 'italic',
                            color: BLACK,
                            lineHeight: 68,
                            letterSpacing: -2,
                            textTransform: 'uppercase',
                            marginBottom: 16,
                        }}
                    >
                        SIGN{'\n'}IN.
                    </Text>

                    <Text
                        style={{
                            fontSize: 12,
                            fontWeight: '700',
                            color: '#999',
                            letterSpacing: 4,
                            textTransform: 'uppercase',
                            marginBottom: 32,
                        }}
                    >
                        WELCOME BACK.
                    </Text>

                    {/* Divider */}
                    <View style={{ height: 3, backgroundColor: '#E0DDD8', marginBottom: 32, borderRadius: 2 }} />

                    {/* Google Sign-In Button */}
                    <TouchableOpacity
                        onPress={handleGoogleOAuth}
                        disabled={isLoading}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#FFFFFF',
                            borderWidth: 1.5,
                            borderColor: '#E0DDD8',
                            paddingVertical: 16,
                            borderRadius: 32,
                            gap: 12,
                            opacity: isLoading ? 0.7 : 1,
                        }}
                    >
                        {isLoading
                            ? <ActivityIndicator size="small" color={BLACK} />
                            : <AntDesign name="google" size={20} color={BLACK} />
                        }
                        <Text
                            style={{
                                fontSize: 14,
                                fontWeight: '900',
                                color: BLACK,
                                letterSpacing: 1,
                                textTransform: 'uppercase',
                            }}
                        >
                            {isLoading ? 'SIGNING IN...' : 'CONTINUE WITH GOOGLE'}
                        </Text>
                    </TouchableOpacity>

                    {/* Create Account */}
                    <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
                        <Text style={{ fontSize: 11, fontWeight: '700', color: '#999', letterSpacing: 1, textTransform: 'uppercase' }}>
                            NEW HERE? —
                        </Text>
                        <TouchableOpacity onPress={handleGoogleOAuth} disabled={isLoading}>
                            <Text
                                style={{
                                    fontSize: 11,
                                    fontWeight: '900',
                                    color: ORANGE,
                                    letterSpacing: 1,
                                    textTransform: 'uppercase',
                                    textDecorationLine: 'underline',
                                }}
                            >
                                CREATE ACCOUNT
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                <View style={{ flex: 1 }} />

                {/* Marquee Footer */}
                <View style={{ position: 'absolute', bottom: 60, left: 0, right: 0, overflow: 'hidden', opacity: 0.06 }}>
                    <Animated.View style={{ transform: [{ translateX: marqueeAnim }], flexDirection: 'row', width: width * 3 }}>
                        <Text style={{ fontSize: 56, fontWeight: '900', color: BLACK, textTransform: 'uppercase', letterSpacing: 1 }}>
                            • VERIFIED • WELCOME • VERIFIED • WELCOME • VERIFIED • WELCOME •
                        </Text>
                        <Text style={{ fontSize: 56, fontWeight: '900', color: BLACK, textTransform: 'uppercase', letterSpacing: 1 }}>
                            • VERIFIED • WELCOME • VERIFIED • WELCOME • VERIFIED • WELCOME •
                        </Text>
                    </Animated.View>
                </View>

                {/* Terms */}
                <Text style={{ textAlign: 'center', fontSize: 10, color: '#BBB', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
                    By continuing you agree to our{'\n'}
                    <Text style={{ textDecorationLine: 'underline' }}>Terms & Privacy Policy.</Text>
                </Text>
            </SafeAreaView>
        </View>
    );
};

export default SignInScreen;
