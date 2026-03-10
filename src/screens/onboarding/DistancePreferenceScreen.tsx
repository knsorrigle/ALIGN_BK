import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BLACK, CREAM, ORANGE } from '../../constants/colors';
import { useUpdateOnboarding } from '../../hooks/useUpdateOnboarding';

const DISTANCE_OPTIONS = [
    { id: 'open', label: 'Open To It', description: 'Match with people anywhere' },
    { id: 'local', label: 'Local Only', description: 'Stay close to home' },
];

const DistancePreferenceScreen = () => {
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
            Animated.timing(contentOpacity, { toValue: 1, duration: 800, delay: 200, useNativeDriver: true }),
        ]).start();
    }, []);

    return (
        <View className="flex-1 bg-cream relative overflow-hidden">

            {/* Background Text Layer */}
            <View className="absolute inset-0 pointer-events-none z-0">
                <Animated.Text style={{ position: 'absolute', top: 60, left: -20, fontSize: 110, fontWeight: '300', color: BLACK, opacity: 0.03, transform: [{ rotate: '-5deg' }, { translateY: bgDriftY }] }}>
                    DISTANCE
                </Animated.Text>
                <Animated.Text style={{ position: 'absolute', bottom: 200, right: -20, fontSize: 90, fontWeight: '300', color: BLACK, opacity: 0.03, transform: [{ rotate: '4deg' }, { translateY: bgDriftY }] }}>
                    LOCAL
                </Animated.Text>
            </View>

            {/* Accent Dot */}
            <View className="absolute top-32 right-10 w-3 h-3 rounded-full z-0" style={{ backgroundColor: ORANGE }} />

            <SafeAreaView className="flex-1 z-10">
                {/* Header */}
                <View className="flex-row items-center justify-between px-6 py-4">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="w-10 h-10 items-center justify-center rounded-full bg-black/6"
                    >
                        <MaterialIcons name="arrow-back" size={24} color={BLACK} />
                    </TouchableOpacity>
                    <Text className="text-xs font-black uppercase text-black/40" style={{ letterSpacing: 2 }}>DISTANCE</Text>
                    <View className="w-10" />
                </View>

                {/* Progress Bar */}
                <View className="mx-6 h-1 bg-black/10 rounded-full overflow-hidden mb-2">
                    <View style={{ height: '100%', backgroundColor: ORANGE, width: '53%', borderRadius: 4 }} />
                </View>

                <Animated.View style={{ opacity: contentOpacity }} className="flex-1 px-8 pt-10">
                    <View className="flex-row items-baseline mb-12">
                        <Animated.Text
                            className="text-[64px] font-black uppercase leading-[0.9]"
                            style={{ color: BLACK, letterSpacing: -2, transform: [{ translateX: titleTranslateX }], opacity: titleOpacity }}
                        >
                            DISTANCE?
                        </Animated.Text>
                        <View className="w-3 h-3 rounded-full ml-2 mb-2" style={{ backgroundColor: ORANGE }} />
                    </View>

                    <View className="gap-4">
                        {DISTANCE_OPTIONS.map((option, index) => {
                            const isSelected = selectedOption === option.id;
                            return (
                                <Animated.View
                                    key={option.id}
                                    style={{ opacity: contentOpacity, transform: [{ translateY: contentOpacity.interpolate({ inputRange: [0, 1], outputRange: [20 + index * 10, 0] }) }] }}
                                >
                                    <TouchableOpacity
                                        onPress={() => setSelectedOption(option.id)}
                                        className={`py-8 px-6 rounded-2xl border-2 ${isSelected ? 'bg-black border-black' : 'bg-white border-black/10'}`}
                                        activeOpacity={0.85}
                                    >
                                        <View className="flex-row justify-between items-start">
                                            <View className="flex-1">
                                                <Text className={`font-black text-xl uppercase mb-1 ${isSelected ? 'text-cream' : 'text-black'}`} style={{ letterSpacing: 1 }}>
                                                    {option.label}
                                                </Text>
                                                <Text className={`text-xs font-medium ${isSelected ? 'text-cream/60' : 'text-black/40'}`}>
                                                    {option.description}
                                                </Text>
                                            </View>
                                            <View className={`w-6 h-6 rounded-full border-2 items-center justify-center mt-0.5 ${isSelected ? 'border-cream bg-cream' : 'border-black/20'}`}>
                                                {isSelected && <View className="w-2.5 h-2.5 rounded-full bg-black" />}
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </Animated.View>
                            );
                        })}
                    </View>

                    <Text className="text-center mt-10 text-black/35 font-semibold text-sm">
                        We'll still prioritise people near you.
                    </Text>
                </Animated.View>

                {/* Footer */}
                <View className="px-6 pb-10 pt-4">
                    <TouchableOpacity
                        onPress={async () => {
                            if (selectedOption) await saveField({ distancePreference: selectedOption });
                            navigation.navigate('IdUpload');
                        }}
                        disabled={!selectedOption}
                        className={`py-4 rounded-full items-center ${selectedOption ? 'bg-black' : 'bg-black/10'}`}
                    >
                        <Text className={`text-sm font-black uppercase ${selectedOption ? 'text-cream' : 'text-black/30'}`} style={{ letterSpacing: 2 }}>CONTINUE</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default DistancePreferenceScreen;
