import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Animated, Easing, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ORANGE } from '../../constants/colors';

const BirthdayScreen = () => {
    const navigation = useNavigation<any>();
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');
    const [year, setYear] = useState('');

    const dayInput = useRef<TextInput>(null);
    const yearInput = useRef<TextInput>(null);

    const titleTranslateY = useRef(new Animated.Value(-100)).current;
    const contentOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(titleTranslateY, {
                toValue: -20,
                duration: 800,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(contentOpacity, {
                toValue: 1,
                duration: 800,
                delay: 200,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleMonthChange = (text: string) => {
        setMonth(text);
        if (text.length === 2) dayInput.current?.focus();
    };

    const handleDayChange = (text: string) => {
        setDay(text);
        if (text.length === 2) yearInput.current?.focus();
    };

    return (
        <View className="flex-1 bg-cream relative overflow-hidden">

            {/* Bleeding Background Text */}
            <View className="absolute -top-4 left-4 z-0 pointer-events-none select-none">
                <Animated.Text
                    style={{ transform: [{ translateY: titleTranslateY }] }}
                    className="text-[140px] leading-[0.8] font-black text-black opacity-5"
                >
                    BIRTHDAY
                </Animated.Text>
            </View>

            {/* Graphic Accent: Blue Dot */}
            <View className="absolute -bottom-10 -left-16 w-[120px] h-[120px] bg-[#1A1AFF] rounded-full z-0 opacity-10" />

            <SafeAreaView className="flex-1 z-10">
                {/* Header */}
                <View className="flex-row items-center justify-between px-6 py-4">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="w-10 h-10 items-center justify-center rounded-full"
                    >
                        <MaterialIcons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text className="text-xs font-black uppercase text-black/40" style={{ letterSpacing: 2 }}>Step 02 / 05</Text>
                    <View className="w-10" />
                </View>

                {/* Progress Bar */}
                <View className="mx-6 h-1 bg-black/10 rounded-full overflow-hidden mb-2">
                    <View style={{ height: '100%', backgroundColor: ORANGE, width: '40%', borderRadius: 4 }} />
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1 justify-center px-8"
                >
                    <Animated.View style={{ opacity: contentOpacity }}>
                        <Text className="text-black text-[42px] font-black leading-tight mb-12" style={{ letterSpacing: -1 }}>
                            What's your {'\n'}date of birth?
                        </Text>

                        {/* Date Inputs */}
                        <View className="flex-row gap-6 items-end mb-8">
                            {/* Month */}
                            <View className="flex-1">
                                <Text className="text-xs font-black uppercase text-black/40 mb-2" style={{ letterSpacing: 2 }}>MM</Text>
                                <TextInput
                                    className="w-full text-5xl font-black text-black py-2 border-b-2 border-black text-center"
                                    maxLength={2}
                                    placeholder="01"
                                    placeholderTextColor="rgba(0,0,0,0.1)"
                                    keyboardType="number-pad"
                                    value={month}
                                    onChangeText={handleMonthChange}
                                />
                            </View>
                            {/* Day */}
                            <View className="flex-1">
                                <Text className="text-xs font-black uppercase text-black/40 mb-2" style={{ letterSpacing: 2 }}>DD</Text>
                                <TextInput
                                    ref={dayInput}
                                    className="w-full text-5xl font-black text-black py-2 border-b-2 border-black text-center"
                                    maxLength={2}
                                    placeholder="01"
                                    placeholderTextColor="rgba(0,0,0,0.1)"
                                    keyboardType="number-pad"
                                    value={day}
                                    onChangeText={handleDayChange}
                                />
                            </View>
                            {/* Year */}
                            <View className="flex-[1.5]">
                                <Text className="text-xs font-black uppercase text-black/40 mb-2" style={{ letterSpacing: 2 }}>YYYY</Text>
                                <TextInput
                                    ref={yearInput}
                                    className="w-full text-5xl font-black text-black py-2 border-b-2 border-black text-center"
                                    maxLength={4}
                                    placeholder="1995"
                                    placeholderTextColor="rgba(0,0,0,0.1)"
                                    keyboardType="number-pad"
                                    value={year}
                                    onChangeText={setYear}
                                />
                            </View>
                        </View>

                        <Text className="text-sm font-medium text-black/50">
                            We use this to show your age and help you find the right connections.
                        </Text>
                    </Animated.View>
                </KeyboardAvoidingView>

                {/* Continue Button */}
                <View className="px-8 pb-10 items-center">
                    <TouchableOpacity
                        className="bg-black py-4 rounded-full w-full items-center active:scale-95"
                        onPress={() => navigation.navigate('Gender')}
                    >
                        <Text className="text-cream text-base font-black uppercase" style={{ letterSpacing: 2 }}>CONTINUE</Text>
                    </TouchableOpacity>

                    <View className="mt-5 flex-row items-center gap-2 opacity-30">
                        <MaterialIcons name="lock" size={13} color="black" />
                        <Text className="text-xs font-black uppercase text-black" style={{ letterSpacing: 2 }}>Secure & Private</Text>
                    </View>
                </View>

            </SafeAreaView>
        </View>
    );
};

export default BirthdayScreen;
