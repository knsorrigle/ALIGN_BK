import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ORANGE } from '../../constants/colors';

const CHILDREN_OPTIONS = [
    'Want Them',
    "Don't Want",
    'Have & Want More',
    "Have & Don't Want More",
    'Open To It',
    'Prefer Not To Say'
];

const ChildrenScreen = () => {
    const navigation = useNavigation<any>();
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const titleTranslateY = useRef(new Animated.Value(50)).current;
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
            Animated.timing(titleTranslateY, { toValue: 0, duration: 800, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            Animated.timing(contentOpacity, { toValue: 1, duration: 800, delay: 200, useNativeDriver: true }),
        ]).start();
    }, []);

    return (
        <View className="flex-1 bg-cream relative overflow-hidden">

            {/* Background Text Layer */}
            <View className="absolute inset-0 pointer-events-none z-0">
                <Animated.Text style={{ position: 'absolute', top: 60, left: -20, fontSize: 110, fontWeight: '300', color: '#000', opacity: 0.03, transform: [{ rotate: '-6deg' }, { translateY: bgDriftY }] }}>
                    FAMILY
                </Animated.Text>
                <Animated.Text style={{ position: 'absolute', bottom: 200, right: -20, fontSize: 90, fontWeight: '300', color: '#000', opacity: 0.03, transform: [{ rotate: '4deg' }, { translateY: bgDriftY }] }}>
                    FUTURE
                </Animated.Text>
            </View>

            <SafeAreaView className="flex-1 z-10">
                {/* Header */}
                <View className="flex-row items-center justify-between px-6 py-4">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="w-10 h-10 items-center justify-center rounded-full bg-black/6"
                    >
                        <MaterialIcons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text className="text-xs font-black uppercase text-black/40" style={{ letterSpacing: 2 }}>CHILDREN</Text>
                    <View className="w-10" />
                </View>

                {/* Progress Bar */}
                <View className="mx-6 h-1 bg-black/10 rounded-full overflow-hidden mb-2">
                    <View style={{ height: '100%', backgroundColor: ORANGE, width: '63%', borderRadius: 4 }} />
                </View>

                <View className="flex-1 px-8 pt-6">
                    <Animated.View style={{ opacity: contentOpacity, transform: [{ translateY: titleTranslateY }] }}>
                        <Text className="text-[64px] font-black text-black leading-[0.85] uppercase mb-3" style={{ letterSpacing: -1 }}>
                            Children?
                        </Text>
                        <Text className="text-black/50 text-sm font-medium italic mb-8">
                            "A dealbreaker for many — be honest."
                        </Text>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View className="gap-3 pb-8">
                                {CHILDREN_OPTIONS.map((option, index) => {
                                    const isSelected = selectedOption === option;
                                    return (
                                        <Animated.View
                                            key={option}
                                            style={{ opacity: contentOpacity, transform: [{ translateY: contentOpacity.interpolate({ inputRange: [0, 1], outputRange: [15 + index * 5, 0] }) }] }}
                                        >
                                            <TouchableOpacity
                                                onPress={() => setSelectedOption(option)}
                                                className={`w-full py-5 px-6 rounded-2xl border-2 flex-row justify-between items-center ${isSelected ? 'bg-black border-black' : 'bg-white border-black/10'}`}
                                                activeOpacity={0.85}
                                            >
                                                <Text className={`font-black text-base ${isSelected ? 'text-cream' : 'text-black'}`} style={{ letterSpacing: 0.5 }}>
                                                    {option}
                                                </Text>
                                                <View className={`w-5 h-5 rounded-full border-2 ${isSelected ? 'border-cream bg-cream' : 'border-black/20'}`}>
                                                    {isSelected && <View className="flex-1 items-center justify-center"><View className="w-2 h-2 rounded-full bg-black" /></View>}
                                                </View>
                                            </TouchableOpacity>
                                        </Animated.View>
                                    );
                                })}
                            </View>
                        </ScrollView>

                    </Animated.View>
                </View>

                {/* Footer */}
                <View className="px-6 pb-4 pt-2">
                    <TouchableOpacity
                        onPress={() => navigation.navigate('DistancePreference')}
                        className="w-full items-center mb-4"
                    >
                        <Text className="text-primary text-xs font-black uppercase" style={{ letterSpacing: 2 }}>SKIP</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className={`w-full py-4 rounded-full items-center active:scale-95 ${selectedOption ? 'bg-black' : 'bg-black/20'}`}
                        onPress={() => navigation.navigate('DistancePreference')}
                        disabled={!selectedOption}
                    >
                        <Text className={`text-base font-black uppercase ${selectedOption ? 'text-cream' : 'text-black/30'}`} style={{ letterSpacing: 2 }}>CONTINUE</Text>
                    </TouchableOpacity>
                </View>

                <View className="h-6" />
            </SafeAreaView>
        </View>
    );
};

export default ChildrenScreen;
