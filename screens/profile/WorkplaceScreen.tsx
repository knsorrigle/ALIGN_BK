import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Animated, Easing, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const WorkplaceScreen = () => {
    const navigation = useNavigation<any>();
    const [company, setCompany] = useState('');

    // Animations
    const titleTranslateX = useRef(new Animated.Value(-100)).current;
    const contentOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(titleTranslateX, { toValue: -50, duration: 800, useNativeDriver: true }),
            Animated.timing(contentOpacity, { toValue: 1, duration: 800, delay: 200, useNativeDriver: true }),
        ]).start();
    }, []);

    return (
        <View className="flex-1 bg-cream relative overflow-hidden">

            <SafeAreaView className="flex-1">
                {/* Header Nav */}
                <View className="flex-row items-center justify-between px-6 py-4 z-20">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="w-12 h-12 items-center justify-center rounded-full hover:bg-black/5"
                    >
                        <MaterialIcons name="arrow-back" size={32} color="black" />
                    </TouchableOpacity>
                </View>

                {/* Massive Bleeding Text */}
                <View className="px-6 pt-2 z-0">
                    <Animated.Text
                        style={{ transform: [{ translateX: titleTranslateX }] }}
 className="text-[140px] leading-[0.8] font-black text-black uppercase"
                        numberOfLines={1}
                    >
                        WORK
                    </Animated.Text>
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1 px-8 pt-12"
                >
                    <Animated.View style={{ opacity: contentOpacity }}>
                        <Text className="text-black text-sm font-lightst uppercase mb-12" style={{ letterSpacing: 1 }}>
                            Where do you work?
                        </Text>

                        <View className="relative">
                            <TextInput
                                className="w-full text-3xl font-bold text-black border-b-4 border-black pb-2 bg-transparent"
                                placeholder="COMPANY NAME"
                                placeholderTextColor="rgba(0,0,0,0.2)"
                                value={company}
                                onChangeText={setCompany}
                                autoCapitalize="characters"
                            />
                        </View>
                    </Animated.View>
                </KeyboardAvoidingView>

                {/* Footer */}
                <View className="px-8 pb-10 flex-row items-end justify-between">
                    {/* Bauhaus Dot */}
                    <View className="w-24 h-24 bg-[#1A1AFF] rounded-full mb-4" />

                    {/* Continue Button */}
                    <TouchableOpacity
                        className="bg-black py-6 px-10 items-center justify-center active:scale-95 shadow-lg"
                        onPress={() => navigation.navigate('Politics')} // Next screen in Stitch 3
                    >
                        <Text className="text-white text-xl font-black uppercase" style={{ letterSpacing: -1 }}>CONTINUE</Text>
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
        </View>
    );
};

export default WorkplaceScreen;
