import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { BauhausWrapper } from '../../components/BauhausComponents';
import { Ionicons } from '@expo/vector-icons';

const ChatBubble = ({ message, time, isSent = false }: { message: string; time: string; isSent?: boolean }) => (
    <View className={`p-3 max-w-[80%] mb-4 ${isSent ? 'bg-black self-end' : 'bg-align-cream-1 border border-black self-start'}`}>
        <Text className={isSent ? 'text-align-cream-1' : 'text-black'}>{message}</Text>
        <Text className={`text-[10px] mt-1 opacity-60 ${isSent ? 'text-align-cream-1' : 'text-black'}`}>
            {time}
        </Text>
    </View>
);

const SafetyNotice = () => (
    <View className="border border-align-red p-1 my-5 items-center">
        <Text className="text-align-red text-xs font-bold text-center" style={{ letterSpacing: 1 }}>
            MESSAGE REVIEWED BY ALIGN SAFETY
        </Text>
    </View>
);

export default function ChatScreen() {
    const insets = useSafeAreaInsets();

    return (
        <View className="flex-1 bg-align-cream-1 relative">
            <StatusBar style="dark" />
            <BauhausWrapper watermarkText="CHAT · CONNECT · REAL · ALIGN · SAFE">

                {/* Custom Header */}
                <View style={{ paddingTop: insets.top }} className="bg-black flex-row justify-between items-center px-4 py-4 z-50">
                    <View className="flex-row items-center gap-2">
                        <TouchableOpacity><Text className="text-white text-xl">←</Text></TouchableOpacity>
                        <Text className="text-white font-bold text-lgst uppercase" style={{ letterSpacing: 1 }}>ALEX</Text>
                        <View className="w-4 h-4 bg-blue-500 items-center justify-center">
                            <Text className="text-[10px] text-white">✓</Text>
                        </View>
                    </View>
                    <View className="flex-row items-center gap-4">
                        <View className="w-3 h-3 bg-orange-500" />
                        <TouchableOpacity className="bg-red-600 w-10 h-10 items-center justify-center">
                            <Text className="text-white font-bold text-xl">!</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
                    <ChatBubble message="Hey, are we still meeting at the gallery later?" time="10:02 AM" />
                    <ChatBubble message="Yes, definitely. I'll be there around 7." time="10:05 AM" isSent />
                    <SafetyNotice />
                    <ChatBubble message="Perfect. I'm wearing the black jacket so you can spot me easily." time="10:06 AM" />
                    <ChatBubble message="Got it. See you then." time="10:10 AM" isSent />
                </ScrollView>

                {/* Footer Input */}
                <View className="absolute bottom-0 left-0 w-full bg-align-cream-1 border-t border-black p-4 pb-8">
                    <View className="flex-row">
                        <TextInput
                            className="flex-1 bg-transparent border border-black border-r-0 h-12 px-4 uppercase text-sm font-medium"
                            placeholder="TYPE MESSAGE..."
                            placeholderTextColor="rgba(0,0,0,0.5)"
                        />
                        <TouchableOpacity className="bg-black px-6 h-12 items-center justify-center">
                            <Text className="text-align-cream-1 font-bold text-sm" style={{ letterSpacing: 1 }}>SEND</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </BauhausWrapper>
        </View>
    );
}
