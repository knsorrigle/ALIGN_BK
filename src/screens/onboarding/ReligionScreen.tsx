import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { CREAM, ORANGE } from '../../constants/colors';
import { useUpdateOnboarding } from '../../hooks/useUpdateOnboarding';

const RELIGION_OPTIONS = [
    'AGNOSTIC',
    'ATHEIST',
    'CHRISTIANITY',
    'JUDAISM',
    'ISLAM',
    'HINDUISM',
    'BUDDHISM',
    'SIKHISM',
    'SPIRITUAL',
    'OTHER'
];

const ReligionScreen = () => {
    const navigation = useNavigation<any>();
    const saveField = useUpdateOnboarding();
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const titleTranslateX = useRef(new Animated.Value(-60)).current;
    const titleOpacity = useRef(new Animated.Value(0)).current;
    const contentOpacity = useRef(new Animated.Value(0)).current;
    const bgDriftY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(bgDriftY, { toValue: -15, duration: 10000, easing: Easing.linear, useNativeDriver: true }),
                Animated.timing(bgDriftY, { toValue: 0, duration: 10000, easing: Easing.linear, useNativeDriver: true }),
            ])
        ).start();

        Animated.parallel([
            Animated.timing(titleTranslateX, { toValue: 0, duration: 350, easing: Easing.bezier(0.16, 1, 0.3, 1), useNativeDriver: true }),
            Animated.timing(titleOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
            Animated.timing(contentOpacity, { toValue: 1, duration: 600, delay: 200, useNativeDriver: true }),
        ]).start();
    }, []);

    return (
        <View className="flex-1 bg-cream relative overflow-hidden">

            {/* Background Text Layer */}
            <View className="absolute inset-0 pointer-events-none z-0">
                <Animated.Text style={{ position: 'absolute', top: 70, left: -25, fontSize: 110, fontWeight: '300', color: '#000', opacity: 0.03, transform: [{ rotate: '-7deg' }, { translateY: bgDriftY }] }}>
                    BELIEFS
                </Animated.Text>
                <Animated.Text style={{ position: 'absolute', bottom: 250, right: -20, fontSize: 90, fontWeight: '300', color: '#000', opacity: 0.03, transform: [{ rotate: '5deg' }, { translateY: bgDriftY }] }}>
                    FAITH
                </Animated.Text>
            </View>

            {/* Accent Dot */}
            <View className="absolute top-36 right-6 w-3 h-3 bg-[#FFD600] rounded-full z-0" />

            <SafeAreaView className="flex-1 z-10">
                {/* Header */}
                <View className="flex-row items-center justify-between px-6 py-4">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 items-center justify-center rounded-full">
                        <MaterialIcons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text className="text-xs font-black uppercase text-black/40" style={{ letterSpacing: 2 }}>VALUES</Text>
                    <View className="w-10" />
                </View>

                {/* Progress Bar */}
                <View className="mx-6 h-1 bg-black/10 rounded-full overflow-hidden mb-2">
                    <View style={{ height: '100%', backgroundColor: ORANGE, width: '75%', borderRadius: 4 }} />
                </View>

                <View className="flex-1 px-8 pt-6">
                    <Animated.View style={{ opacity: contentOpacity }} className="flex-1">
                        <Animated.Text
                            className="text-black text-[44px] font-black uppercase leading-[0.9] mb-3"
                            style={{ letterSpacing: -1, transform: [{ translateX: titleTranslateX }], opacity: titleOpacity }}
                        >
                            RELIGIOUS{'\n'}BELIEFS?
                        </Animated.Text>
                        <Text className="text-black/40 text-sm font-medium uppercase mb-8" style={{ letterSpacing: 1 }}>
                            Share your spiritual background.
                        </Text>

                        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                            <View className="gap-3 pb-12">
                                {RELIGION_OPTIONS.map((option, index) => {
                                    const isSelected = selectedOption === option;
                                    return (
                                        <Animated.View
                                            key={option}
                                            style={{ opacity: contentOpacity, transform: [{ translateY: contentOpacity.interpolate({ inputRange: [0, 1], outputRange: [15 + index * 3, 0] }) }] }}
                                        >
                                            <TouchableOpacity
                                                onPress={() => setSelectedOption(option)}
                                                className={`w-full py-4 px-6 rounded-2xl border-2 flex-row justify-between items-center ${isSelected ? 'bg-black border-black' : 'bg-white border-black/10'}`}
                                                activeOpacity={0.85}
                                            >
                                                <Text className={`font-black text-sm uppercase ${isSelected ? 'text-cream' : 'text-black'}`} style={{ letterSpacing: 1 }}>
                                                    {option}
                                                </Text>
                                                <View className={`w-5 h-5 rounded-full border-2 items-center justify-center ${isSelected ? 'border-cream' : 'border-black/20'}`}>
                                                    {isSelected && <MaterialIcons name="check" size={13} color={CREAM} />}
                                                </View>
                                            </TouchableOpacity>
                                        </Animated.View>
                                    );
                                })}
                            </View>
                        </ScrollView>
                    </Animated.View>
                </View>

                {/* Continue Button */}
                <View className="px-8 pb-4 pt-2">
                    <TouchableOpacity
                        className={`w-full py-4 rounded-full items-center active:scale-95 ${selectedOption ? 'bg-black' : 'bg-black/20'}`}
                        onPress={async () => {
                            if (selectedOption) await saveField({ religion: selectedOption });
                            navigation.navigate('Bio');
                        }}
                        disabled={!selectedOption}
                    >
                        <Text className={`text-base font-black uppercase ${selectedOption ? 'text-cream' : 'text-black/30'}`} style={{ letterSpacing: 2 }}>CONTINUE</Text>
                    </TouchableOpacity>
                </View>

                {/* Skip */}
                <View className="items-center pb-10">
                    <TouchableOpacity onPress={() => navigation.navigate('Bio')}>
                        <Text className="text-black/25 font-black uppercase text-[10px]" style={{ letterSpacing: 2 }}>SKIP THIS QUESTION</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default ReligionScreen;
