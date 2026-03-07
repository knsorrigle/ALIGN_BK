import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BLACK } from '../constants/colors';

const AboutScreen = () => {
    const navigation = useNavigation<any>();

    // Animations (Standard RN)
    const titleTranslateX = useRef(new Animated.Value(-100)).current;
    const titleOpacity = useRef(new Animated.Value(0)).current;
    const contentOpacity = useRef(new Animated.Value(0)).current;
    const contentTranslateY = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            // 1. Title Slam
            Animated.timing(titleTranslateX, {
                toValue: 0,
                duration: 400,
                easing: Easing.out(Easing.poly(4)),
                useNativeDriver: true,
            }),
            Animated.timing(titleOpacity, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
            // 2. Content Fade in
            Animated.sequence([
                Animated.delay(400),
                Animated.parallel([
                    Animated.timing(contentOpacity, {
                        toValue: 1,
                        duration: 600,
                        useNativeDriver: true,
                    }),
                    Animated.timing(contentTranslateY, {
                        toValue: 0,
                        duration: 600,
                        easing: Easing.out(Easing.quad),
                        useNativeDriver: true,
                    })
                ])
            ])
        ]).start();
    }, []);

    return (
        <View className="flex-1 bg-cream">
            <SafeAreaView className="flex-1 relative">
                {/* Header */}
                <View className="px-6 py-4 flex-row items-center justify-between">
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={32} color={BLACK} />
                    </TouchableOpacity>
                    <Text className="text-gray-500 text-xs font-bold uppercase" style={{ letterSpacing: 1 }}>
                        Settings / About
                    </Text>
                </View>

                <ScrollView className="flex-1 px-6 pt-12">
                    {/* Huge Title */}
                    <Animated.Text style={{ letterSpacing: -1, transform: [{ translateX: titleTranslateX }], opacity: titleOpacity }} className="text-cream text-[80px] font-black leading-[0.85] uppercase mb-12">
                        ABOUT{'\n'}ALIGN
                    </Animated.Text>

                    {/* Divider */}
                    <Animated.View style={{ opacity: contentOpacity, transform: [{ translateY: contentTranslateY }] }} className="h-[2px] bg-primary w-full mb-12" />

                    {/* Version */}
                    <Animated.Text style={{ letterSpacing: -1, opacity: contentOpacity, transform: [{ translateY: contentTranslateY }] }} className="text-cream text-[80px] font-medium mb-12">
                        v1.0.4
                    </Animated.Text>

                    {/* Description Text */}
                    <Animated.Text style={{ letterSpacing: 1, opacity: contentOpacity, transform: [{ translateY: contentTranslateY }] }} className="text-gray-400 text-sm leading-6 uppercase mb-20 font-bold max-w-[90%]">
                        Align is a minimalist coordination tool designed for clarity and precision. Our mission is to streamline focus through high-contrast interfaces and structural simplicity.{'\n'}{'\n'}
                        Designed with passion by the Align Team.{'\n'}
                        Stockholm / San Francisco / Tokyo.{'\n'}
                        All rights reserved © 2024.
                    </Animated.Text>

                    {/* Terms Button */}
                    <Animated.View style={{ opacity: contentOpacity, transform: [{ translateY: contentTranslateY }] }}>
                        <TouchableOpacity className="bg-primary py-5 rounded-full items-center shadow-lg shadow-orange-500/30 mb-12">
                            <Text className="text-ink text-lg font-black uppercase" style={{ letterSpacing: 2 }}>
                                Terms of Service
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Social Icons */}
                    <Animated.View style={{ opacity: contentOpacity, transform: [{ translateY: contentTranslateY }] }} className="flex-row justify-center space-x-8 pb-12">
                        <TouchableOpacity>
                            <MaterialIcons name="share" size={32} color="#666" />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <MaterialIcons name="language" size={32} color="#666" />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <MaterialIcons name="mail" size={32} color="#666" />
                        </TouchableOpacity>
                    </Animated.View>
                </ScrollView>

                {/* Decorative Geo Lines (Background) */}
                <View className="absolute bottom-0 right-0 w-64 h-64 border border-orange-500/20 rotate-45 translate-x-32 translate-y-32 pointer-events-none" />
                <View className="absolute bottom-0 right-0 w-64 h-64 border border-orange-500/20 rotate-[30deg] translate-x-24 translate-y-24 pointer-events-none" />
            </SafeAreaView>
        </View>
    );
};

export default AboutScreen;
