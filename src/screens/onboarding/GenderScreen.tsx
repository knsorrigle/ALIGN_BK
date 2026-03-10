import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ORANGE } from '../../constants/colors';
import { useUpdateOnboarding } from '../../hooks/useUpdateOnboarding';

const genders = ['Man', 'Woman', 'Nonbinary'];

const GenderScreen = () => {
    const navigation = useNavigation<any>();
    const saveField = useUpdateOnboarding();
    const [selectedGender, setSelectedGender] = useState<string | null>(null);

    const titleTranslateY = useRef(new Animated.Value(-100)).current;
    const contentOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(titleTranslateY, {
                toValue: -15,
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

    return (
        <View className="flex-1 bg-cream relative overflow-hidden">

            {/* Bleeding Background Text */}
            <View className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none select-none z-0">
                <Animated.Text
                    style={{ transform: [{ translateY: titleTranslateY }], letterSpacing: -8 }}
                    className="text-[140px] leading-[0.8] font-black text-black opacity-5 uppercase -ml-4"
                >
                    GENDER
                </Animated.Text>
            </View>

            <SafeAreaView className="flex-1 z-10">
                {/* Header */}
                <View className="flex-row items-center justify-between px-6 py-4">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="w-10 h-10 items-center justify-center rounded-full"
                    >
                        <MaterialIcons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text className="text-xs font-black uppercase text-black/40" style={{ letterSpacing: 2 }}>Step 03 / 05</Text>
                    <View className="w-10" />
                </View>

                {/* Progress Bar */}
                <View className="mx-6 h-1 bg-black/10 rounded-full overflow-hidden mb-2">
                    <View style={{ height: '100%', backgroundColor: ORANGE, width: '60%', borderRadius: 4 }} />
                </View>

                <ScrollView className="flex-1 px-6 pt-12" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                    <Animated.View style={{ opacity: contentOpacity }}>
                        <Text className="text-black text-[42px] font-black leading-tight mb-12" style={{ letterSpacing: -1 }}>
                            Which gender{'\n'}best describes{'\n'}you?
                        </Text>

                        {/* Options */}
                        <View className="gap-4">
                            {genders.map((gender) => {
                                const isSelected = selectedGender === gender;
                                return (
                                    <TouchableOpacity
                                        key={gender}
                                        onPress={() => setSelectedGender(gender)}
                                        activeOpacity={0.85}
                                        className={`flex-row items-center justify-between w-full p-5 rounded-2xl border-2 ${isSelected ? 'bg-black border-black' : 'bg-white border-black/10'}`}
                                    >
                                        <Text className={`text-xl font-black uppercase ${isSelected ? 'text-cream' : 'text-black'}`} style={{ letterSpacing: 1 }}>
                                            {gender}
                                        </Text>
                                        <View className={`w-5 h-5 rounded-full border-2 items-center justify-center ${isSelected ? 'border-cream bg-[#FFD600]' : 'border-black/20'}`}>
                                            {isSelected && <View className="w-2 h-2 rounded-full bg-black" />}
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </Animated.View>
                </ScrollView>

                {/* Continue Button */}
                <View className="px-6 pb-10">
                    <TouchableOpacity
                        className={`py-4 rounded-full w-full items-center active:scale-95 ${selectedGender ? 'bg-black' : 'bg-black/20'}`}
                        onPress={async () => {
                            if (selectedGender) await saveField({ gender: selectedGender.toLowerCase() });
                            navigation.navigate('Location');
                        }}
                        disabled={!selectedGender}
                    >
                        <Text className={`text-base font-black uppercase ${selectedGender ? 'text-cream' : 'text-black/30'}`} style={{ letterSpacing: 2 }}>Continue</Text>
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
        </View>
    );
};

export default GenderScreen;
