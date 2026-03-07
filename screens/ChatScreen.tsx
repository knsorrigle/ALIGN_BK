import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Animated, Easing, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const ChatScreen = () => {
    const navigation = useNavigation<any>();
    const [messages, setMessages] = useState<any[]>([]); // Start empty to show SILENCE state
    const [inputText, setInputText] = useState('');

    // Animation Values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const marqueeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();

        // Background marquee animation
        Animated.loop(
            Animated.timing(marqueeAnim, {
                toValue: -width,
                duration: 15000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const handleStartDiscovering = () => {
        navigation.navigate('DiscoveryMap');
    };

    if (messages.length === 0) {
        return (
            <View className="flex-1 bg-cream relative overflow-hidden">
                {/* Background Decorations */}
                <View className="absolute inset-0 z-0 justify-between py-20 pointer-events-none opacity-[0.08]">
                    <Animated.View style={{ transform: [{ translateX: marqueeAnim }] }}>
                        <Text className="text-[14px] font-bold uppercase whitespace-nowrap text-black" style={{ letterSpacing: 3 }}>
                            MESSAGES · CHAT · ALIGN · CONNECTION · MESSAGES · CHAT · ALIGN · CONNECTION ·
                        </Text>
                    </Animated.View>
                    <Animated.View style={{ transform: [{ translateX: Animated.multiply(marqueeAnim, -1) }] }}>
                        <Text className="text-[14px] font-bold uppercase whitespace-nowrap text-black" style={{ letterSpacing: 3 }}>
                            CONNECTION · ALIGN · CHAT · MESSAGES · CONNECTION · ALIGN · CHAT · MESSAGES ·
                        </Text>
                    </Animated.View>
                </View>

                {/* Red Accent Dot */}
                <View className="absolute top-12 left-8 w-4 h-4 rounded-full bg-[#E03A2F] z-10" />

                <SafeAreaView className="flex-1 justify-center items-center px-6 relative">
                    <Animated.View style={{ opacity: fadeAnim }} className="w-full items-start">
                        {/* Circle Decoration */}
                        <View className="absolute -top-40 -left-20 w-[340px] h-[340px] border-[12px] border-[#1A1AFF] rounded-full opacity-100 z-0" />

                        <View className="relative z-10 ml-4">
                            <Text className="text-[100px] font-black loading-none uppercase text-black" style={{ letterSpacing: -1, lineHeight: 100 }}>
                                Silence.
                            </Text>
                            <Text className="mt-8 text-black font-light text-lg leading-tight max-w-[200px]">
                                Your connections will appear here once you've aligned.
                            </Text>
                        </View>
                    </Animated.View>
                </SafeAreaView>

                {/* Fixed Footer */}
                <View className="p-6 bg-transparent absolute bottom-0 w-full">
                    <TouchableOpacity
                        onPress={handleStartDiscovering}
                        className="w-full bg-black py-6 items-center active:bg-[#1A1AFF]"
                    >
                        <Text className="text-cream text-sm font-bold uppercase" style={{ letterSpacing: 3 }}>Start Discovering</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-cream">
            <SafeAreaView className="flex-1">
                {/* Header */}
                <View className="px-6 py-4 border-b-2 border-black flex-row justify-between items-center bg-cream z-10">
                    <Text className="text-xl font-black uppercase" style={{ letterSpacing: -1 }}>Messages</Text>
                    <View className="w-3 h-3 bg-green-500 rounded-full border border-black" />
                </View>

                {/* Chat List would go here */}
                <View className="flex-1 items-center justify-center">
                    <Text className="text-black/50 font-bold uppercase" style={{ letterSpacing: 1 }}>No active chats</Text>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default ChatScreen;
