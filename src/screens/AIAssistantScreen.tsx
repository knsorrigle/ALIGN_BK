import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image, Animated, Easing } from 'react-native';
import { styled } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BLACK, ORANGE } from '../constants/colors';

const AIAssistantScreen = () => {
    const navigation = useNavigation<any>();

    // Animation Values (Standard RN)
    const titleOpacity = useRef(new Animated.Value(0)).current;
    const cardsOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.timing(titleOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.timing(cardsOpacity, { toValue: 1, duration: 500, useNativeDriver: true })
        ]).start();
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-cream relative">
            <View className="flex-row items-center justify-between p-6">
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <MaterialIcons name="menu" size={30} color={BLACK} />
                </TouchableOpacity>
                <View className="w-16 h-16 rounded-full border-2 border-ink/40 items-center justify-center">
                    <View className="w-12 h-12 rounded-full border border-ink items-center justify-center">
                        <View className="w-2 h-2 bg-white rounded-full" />
                    </View>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('ProfileDetail')}>
                    <MaterialIcons name="account-circle" size={30} color={BLACK} />
                </TouchableOpacity>
            </View>

            <View className="flex-1 px-6 pb-32">
                <Animated.View style={{ opacity: titleOpacity }} className="mt-8 mb-8">
                    <Text className="text-ink text-5xl font-black leading-tight uppercase" style={{ letterSpacing: -1 }}>Who is my {'\n'}<Text className="text-ink/60">best match</Text> {'\n'}today?</Text>
                </Animated.View>

                <Animated.ScrollView style={{ opacity: cardsOpacity }} showsVerticalScrollIndicator={false}>
                    <View className="gap-4">
                        <View className="flex-row gap-2 items-center mb-2">
                            <View className="w-3 h-3 rounded-full bg-[#FFCC00]" />
                            <View className="w-3 h-3 rounded-full bg-[#FF3B30]" />
                            <View className="w-3 h-3 rounded-full bg-[#4CD964]" />
                                <Text className="ml-2 text-ink text-xs font-bold uppercase opacity-60" style={{ letterSpacing: 1 }}>Align is finding...</Text>
                        </View>

                        <TouchableOpacity className="bg-black p-8 rounded-xl justify-between min-h-[220px] overflow-hidden relative" onPress={() => navigation.navigate('ProfileDetail')} activeOpacity={0.9}>
                            <View className="flex-row justify-between items-start">
                                <View>
                                    <Text className="text-primary font-bold text-sm uppercase mb-1" style={{ letterSpacing: 1 }}>Top Alignment</Text>
                                    <Text className="text-ink text-7xl font-black uppercase leading-none" style={{ letterSpacing: -1 }}>ALEX</Text>
                                </View>
                                <View>
                                    <Text className="text-5xl font-black text-ink" style={{ letterSpacing: -1 }}>98%</Text>
                                </View>
                            </View>
                            <View className="mt-8 flex-row items-center justify-between">
                                <View className="flex-row -space-x-3">
                                    <View className="w-10 h-10 rounded-full border-2 border-black bg-zinc-800" />
                                </View>
                                <View className="bg-white px-6 py-2 rounded-full">
                                    <Text className="text-black font-bold uppercase text-sm">View Profile</Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity className="bg-black p-8 rounded-xl justify-between min-h-[180px] border-t border-ink/10 mt-4" activeOpacity={0.9}>
                            <View className="flex-row justify-between items-start">
                                <View>
                                    <Text className="text-ink/40 font-bold text-sm uppercase mb-1" style={{ letterSpacing: 1 }}>Runner Up</Text>
                                    <Text className="text-ink text-5xl font-black uppercase leading-none" style={{ letterSpacing: -1 }}>JORDAN</Text>
                                </View>
                                <View>
                                    <Text className="text-4xl font-black text-ink/60" style={{ letterSpacing: -1 }}>84%</Text>
                                </View>
                            </View>
                            <View className="mt-4">
                                <Text className="text-sm text-ink/60 font-medium">Shared interests in Architecture and Minimalism.</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Animated.ScrollView>
            </View>

            <View className="absolute bottom-0 left-0 w-full p-4 bg-cream">
                <View className="max-w-4xl mx-auto flex-row items-center gap-2">
                    <View className="flex-1 bg-cream border-2 border-ink rounded-xl flex-row items-center px-4 py-4 focus:border-ink">
                        <TextInput
 className="flex-1 text-ink placeholder-white/30 font-bold text-lg uppercase"
                            placeholder="Ask Align anything..."
                            placeholderTextColor="rgba(255,255,255,0.3)"
                        />
                        <TouchableOpacity>
                            <MaterialIcons name="arrow-upward" size={24} color={ORANGE} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity className="bg-white w-14 h-14 rounded-xl items-center justify-center shadow-xl">
                        <MaterialIcons name="mic" size={24} color="#1A1AFF" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default AIAssistantScreen;
