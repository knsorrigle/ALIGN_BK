import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BLACK, CREAM, ORANGE } from '../../constants/colors';

const INTENT_OPTIONS = ['Long-Term', 'Casual', 'Exploring', 'Marriage'];

const DatingIntentScreen = () => {
    const navigation = useNavigation<any>();
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
                <Animated.Text style={{ position: 'absolute', top: 0, left: -10, fontSize: 120, fontWeight: '900', color: BLACK, opacity: 0.04, transform: [{ translateY: bgDriftY }] }}>
                    INTENT
                </Animated.Text>
                <Animated.Text style={{ position: 'absolute', bottom: 120, right: -20, fontSize: 120, fontWeight: '900', color: BLACK, opacity: 0.04, transform: [{ translateY: bgDriftY }] }}>
                    REAL
                </Animated.Text>
            </View>

            <SafeAreaView className="flex-1 z-10">
                {/* Header */}
                <View className="flex-row items-center justify-between px-6 py-4">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="w-10 h-10 items-center justify-center rounded-full bg-black/6"
                    >
                        <MaterialIcons name="arrow-back" size={24} color={BLACK} />
                    </TouchableOpacity>
                    <Text className="text-xs font-black uppercase text-black/40" style={{ letterSpacing: 2 }}>HERE FOR</Text>
                    <View className="w-10" />
                </View>

                {/* Progress Bar */}
                <View className="mx-6 h-1 bg-black/10 rounded-full overflow-hidden mb-2">
                    <View style={{ height: '100%', backgroundColor: ORANGE, width: '50%', borderRadius: 4 }} />
                </View>

                <ScrollView className="flex-1 px-8 pt-6" showsVerticalScrollIndicator={false}>
                    <Animated.View style={{ opacity: contentOpacity }}>
                        <View className="flex-row items-baseline mb-10">
                            <Animated.Text
                                className="text-[72px] font-black leading-[0.9] uppercase"
                                style={{ color: BLACK, letterSpacing: -2, transform: [{ translateX: titleTranslateX }], opacity: titleOpacity }}
                            >
                                HERE{'\n'}FOR—
                            </Animated.Text>
                            <View className="w-3 h-3 rounded-full bg-[#E03A2F] ml-2 mb-4" />
                        </View>

                        <View className="gap-3">
                            {INTENT_OPTIONS.map((option, index) => {
                                const isSelected = selectedOption === option;
                                return (
                                    <Animated.View
                                        key={option}
                                        style={{ opacity: contentOpacity, transform: [{ translateY: contentOpacity.interpolate({ inputRange: [0, 1], outputRange: [15 + index * 5, 0] }) }] }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => setSelectedOption(option)}
                                            className={`py-6 px-6 rounded-2xl border-2 flex-row justify-between items-center ${isSelected ? 'bg-black border-black' : 'bg-white border-black/10'}`}
                                            activeOpacity={0.85}
                                        >
                                            <Text className={`font-black text-lg uppercase ${isSelected ? 'text-cream' : 'text-black'}`} style={{ letterSpacing: -0.5 }}>
                                                {option}
                                            </Text>
                                            <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${isSelected ? 'border-cream bg-cream' : 'border-black/20'}`}>
                                                {isSelected && <View className="w-2.5 h-2.5 rounded-full bg-black" />}
                                            </View>
                                        </TouchableOpacity>
                                    </Animated.View>
                                );
                            })}
                        </View>

                        <Text className="text-center mt-8 text-black/40 font-bold text-xs uppercase" style={{ letterSpacing: 1 }}>
                            This is shown on your profile.
                        </Text>
                    </Animated.View>
                </ScrollView>

                {/* Footer */}
                <View className="px-6 pb-10 pt-2">
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Children')}
                        disabled={!selectedOption}
                        className={`py-4 rounded-full items-center ${selectedOption ? 'bg-black' : 'bg-black/10'}`}
                        style={{ opacity: selectedOption ? 1 : 0.5 }}
                    >
                        <Text className={`text-sm font-black uppercase ${selectedOption ? 'text-cream' : 'text-black/40'}`} style={{ letterSpacing: 2 }}>CONTINUE</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default DatingIntentScreen;
