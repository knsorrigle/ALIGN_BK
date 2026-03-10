import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ORANGE } from '../../constants/colors';

const IntroStatementScreen = () => {
    const navigation = useNavigation<any>();

    // Animations
    const opacity1 = useRef(new Animated.Value(0)).current;
    const opacity2 = useRef(new Animated.Value(0)).current;
    const opacity3 = useRef(new Animated.Value(0)).current;
    const subtextOpacity = useRef(new Animated.Value(0)).current;


    useEffect(() => {
        Animated.stagger(200, [
            Animated.timing(opacity1, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.timing(opacity2, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.timing(opacity3, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.timing(subtextOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        ]).start();
    }, []);

    return (
        <View className="flex-1 bg-cream relative overflow-hidden">

            {/* Graphic Accents: Circle */}
            <View className="absolute -top-10 -right-10 w-40 h-40 border-[12px] border-primary/20 rounded-full" />

            {/* Graphic Accents: Bars */}
            <View className="absolute left-0 top-1/4 flex-col gap-2">
                <View className="w-12 h-2 bg-primary" />
                <View className="w-8 h-2 bg-black" />
            </View>

            <SafeAreaView className="flex-1">
                {/* Navigation */}
                <View className="flex-row items-center justify-between px-6 py-4">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="w-10 h-10 items-center justify-center rounded-full bg-primary/10"
                    >
                        <MaterialIcons name="arrow-back" size={20} color={ORANGE} />
                    </TouchableOpacity>

                    {/* Progress Dots */}
                    <View className="flex-row gap-1">
                        <View className="w-8 h-1 bg-primary rounded-full" />
                        <View className="w-2 h-1 bg-primary/20 rounded-full" />
                        <View className="w-2 h-1 bg-primary/20 rounded-full" />
                    </View>
                </View>

                <View className="flex-1 justify-center px-6">
                    {/* Typography Block */}
                    <View className="flex-col">
                        <Animated.Text
                            style={{ opacity: opacity1, letterSpacing: -8 }}
                            className="text-[72px] font-black leading-[0.8] text-black opacity-90 mb-0"
                        >
                            YOU'RE
                        </Animated.Text>

                        <Animated.View style={{ opacity: opacity2 }} className="relative">
                            <Text className="text-[64px] font-black leading-[0.9] text-black" style={{ letterSpacing: -6 }}>
                                ONE OF
                            </Text>
                        </Animated.View>

                        <Animated.View style={{ opacity: opacity3 }} className="relative">
                            <Text className="text-[82px] font-black leading-[0.9] text-black" style={{ letterSpacing: -8 }}>
                                A KIND
                            </Text>
                        </Animated.View>

                        {/* Sub-headline */}
                        <Animated.View style={{ opacity: subtextOpacity }} className="mt-8 flex-row items-start gap-4">
                            <View className="w-1 h-12 bg-primary mt-1" />
                            <Text className="text-primary text-2xl font-bold leading-tight max-w-[200px] uppercase italic">
                                your profile should be, too.
                            </Text>
                        </Animated.View>
                    </View>

                    {/* Abstract Decorative Element */}
                    <View className="mt-12 items-end">
                        <View className="flex-row flex-wrap w-24 gap-2 justify-end">
                            <View className="w-12 h-12 bg-black rounded-lg" />
                            <View className="w-12 h-12 border-2 border-primary rounded-full" />
                            <View className="w-12 h-12 bg-primary/30 rounded-lg" />
                            <View className="w-12 h-12 bg-primary rounded-full" />
                        </View>
                    </View>
                </View>

                {/* Footer Action */}
                <View className="p-6 pb-10">
                    <TouchableOpacity
                        className="w-full bg-black py-4 rounded-full items-center active:scale-95 shadow-lg"
                        onPress={() => navigation.navigate('MediaSelection')}
                    >
                        <Text className="text-white text-base font-black uppercase" style={{ letterSpacing: 2 }}>START MY JOURNEY</Text>
                    </TouchableOpacity>

                    <Text className="text-center mt-4 text-xs font-bold uppercase text-black/40" style={{ letterSpacing: 2 }}>
                        Step 04 — Introduction
                    </Text>
                </View>

            </SafeAreaView>
        </View>
    );
};

export default IntroStatementScreen;
