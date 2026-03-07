import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Svg, Path } from 'react-native-svg';
import { ORANGE } from '../constants/colors';

const HelpScreen = () => {
    const navigation = useNavigation<any>();

    return (
        <View className="flex-1 bg-help-cream">
            <SafeAreaView className="flex-1">
                {/* Header */}
                <View className="p-6 flex-row items-center justify-between">
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={32} color="black" />
                    </TouchableOpacity>
                    <View className="flex-row items-center space-x-2">
                        <View className="w-3 h-3 rounded-full bg-primary" />
                            <Text className="text-black text-xs font-bold uppercase" style={{ letterSpacing: 1 }}>Support Online</Text>
                    </View>
                </View>

                <ScrollView className="flex-1">
                    {/* Hero Title */}
                    <View className="px-6 mt-4">
                        <Text className="text-[120px] font-black leading-none text-black uppercase" style={{ letterSpacing: -1 }}>
                            HELP
                        </Text>
                    </View>

                    {/* Wavy Line SVG */}
                    <View className="w-full h-24 mb-12">
                        <Svg width="100%" height="100%" viewBox="0 0 1440 320" preserveAspectRatio="none">
                            <Path
                                fill="none"
                                stroke="black"
                                strokeWidth="40"
                                d="M0,160L80,176C160,192,320,224,480,213.3C640,203,800,149,960,144C1120,139,1280,181,1360,202.7L1440,224"
                            />
                        </Svg>
                    </View>

                    {/* Action Buttons */}
                    <View className="px-6 space-y-4">
                        <TouchableOpacity className="bg-black p-6 rounded-lg flex-row justify-between items-center active:bg-gray-900">
                            <Text className="text-white text-2xl font-black uppercase" style={{ letterSpacing: -1 }}>Chat with us</Text>
                            <MaterialIcons name="chat" size={32} color={ORANGE} />
                        </TouchableOpacity>

                        <TouchableOpacity className="bg-black p-6 rounded-lg flex-row justify-between items-center active:bg-gray-900">
                            <Text className="text-white text-2xl font-black uppercase" style={{ letterSpacing: -1 }}>Help Center</Text>
                            <MaterialIcons name="library-books" size={32} color={ORANGE} />
                        </TouchableOpacity>

                        <TouchableOpacity className="bg-black p-6 rounded-lg flex-row justify-between items-center active:bg-gray-900">
                            <Text className="text-white text-2xl font-black uppercase" style={{ letterSpacing: -1 }}>Email Support</Text>
                            <MaterialIcons name="email" size={32} color={ORANGE} />
                        </TouchableOpacity>
                    </View>

                    {/* Hotline Section */}
                    <View className="px-6 mt-12 mb-8">
                        <Text className="text-black text-sm font-bold uppercase mb-2 border-b-2 border-black self-start pb-1" style={{ letterSpacing: 1 }}>
                            Direct Hotline
                        </Text>
                        <Text className="text-[48px] font-black text-black leading-none mt-2" style={{ letterSpacing: -1 }}>
                            +1 800 ALIGN
                        </Text>
                        <View className="h-2 bg-primary w-48 mt-1" />
                    </View>

                    {/* Footer Promo Box */}
                    <View className="mx-6 h-48 bg-gray-900 rounded-lg overflow-hidden relative items-center justify-center mb-12 border-2 border-black">
                        {/* Abstract shapes mimicking the design */}
                        <View className="absolute w-64 h-64 rounded-full bg-primary -top-12 -left-12 opacity-80" />
                        <View className="border-4 border-white rotate-[-12deg] px-8 py-2 z-10 bg-transparent">
                            <Text className="text-white text-4xl font-black uppercase" style={{ letterSpacing: -1 }}>
                                ALIGN V2.0
                            </Text>
                        </View>
                    </View>

                    {/* Tab Bar placeholder at bottom */}
                    <View className="flex-row justify-around py-6 border-t-4 border-black bg-cream">
                        <MaterialIcons name="home" size={32} color="black" />
                        <MaterialIcons name="fitness-center" size={32} color="black" />
                        <MaterialIcons name="bar-chart" size={32} color="black" />
                        <MaterialIcons name="support-agent" size={32} color={ORANGE} />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default HelpScreen;
