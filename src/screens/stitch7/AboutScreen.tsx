import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BLACK, ORANGE } from '../../constants/colors';

export default function AboutScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const watermarkText = "ABOUT · ALIGN · REAL · VERIFIED · TRUST · v1".repeat(20);

    return (
        <View className="flex-1 bg-cream relative">
            <StatusBar style="dark" />

            {/* Watermark — full-screen background, very subtle */}
            <View
                pointerEvents="none"
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.04, zIndex: 0, padding: 16, overflow: 'hidden' }}
            >
                <Text className="text-ink text-6xl font-black uppercase leading-none" style={{ letterSpacing: -1 }}>
                    {watermarkText}
                </Text>
            </View>

            <View style={{ paddingTop: insets.top, zIndex: 1, flex: 1, paddingHorizontal: 24 }}>
                {/* Header */}
                <View className="py-6 flex-row justify-between items-center">
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color={BLACK} />
                    </TouchableOpacity>
                    <View className="flex-row items-center gap-2">
                        <Text className="text-ink text-xs font-bold opacity-80" style={{ letterSpacing: 1 }}>SETTINGS / ABOUT</Text>
                        <View className="w-3 h-3 bg-align-yellow" />
                    </View>
                </View>

                <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
                    <View className="mt-12">
                        <Text className="text-[90px] font-black text-ink leading-[0.85] mb-6 uppercase" style={{ letterSpacing: -1 }}>
                            ABOUT{'\n'}ALIGN.
                        </Text>

                        <View className="h-2 w-full bg-align-orange-2 mb-8" />

                        <Text className="text-4xl font-bold text-ink mb-10">v1.0.0</Text>

                        <View className="max-w-[70%] mb-12">
                            <Text className="text-ink text-sm leading-tight uppercase font-bold" style={{ letterSpacing: -1 }}>
                                ALIGN IS A TRUST-FIRST DATING APP BUILT FOR REAL CONNECTIONS. WE PRIORITIZE AUTHENTICITY OVER ALGORITHMS, ENSURING EVERY PROFILE IS VERIFIED AND EVERY INTERACTION IS GENUINE.
                            </Text>
                        </View>

                        <View className="gap-4">
                            <TouchableOpacity><Text className="text-ink text-lg font-bold underline decoration-2 underline-offset-4">PRIVACY POLICY</Text></TouchableOpacity>
                            <TouchableOpacity><Text className="text-ink text-lg font-bold underline decoration-2 underline-offset-4">TERMS OF SERVICE</Text></TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>

                {/* Footer */}
                <View className="absolute bottom-0 left-0 w-full p-6 flex-row justify-between items-end bg-cream/50">
                    <View className="max-w-[70%]">
                        <Text className="text-ink text-[10px] uppercase font-bold leading-relaxed" style={{ letterSpacing: 1 }}>
                            DESIGNED WITH INTENTION.{'\n'}BANGALORE / DELHI / MUMBAI.
                        </Text>
                    </View>

                    {/* Simple triangle using border hack */}
                    <View style={{
                        width: 0,
                        height: 0,
                        backgroundColor: 'transparent',
                        borderStyle: 'solid',
                        borderLeftWidth: 0,
                        borderRightWidth: 80,
                        borderBottomWidth: 80,
                        borderLeftColor: 'transparent',
                        borderRightColor: 'transparent',
                        borderBottomColor: ORANGE // align-orange-2
                    }} />
                </View>
            </View>
        </View>
    );
}
