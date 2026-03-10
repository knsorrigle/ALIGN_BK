import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Animated, Easing, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ORANGE } from '../../constants/colors';
import { useUpdateOnboarding } from '../../hooks/useUpdateOnboarding';

const PRONOUN_OPTIONS = [
    'HE / HIM',
    'SHE / HER',
    'THEY / THEM',
    'HE / THEY',
    'SHE / THEY',
    'PREFER NOT TO SAY'
];

const PronounsScreen = () => {
    const navigation = useNavigation<any>();
    const saveField = useUpdateOnboarding();
    const [selectedPronouns, setSelectedPronouns] = useState<string[]>([]);
    const [customPronoun, setCustomPronoun] = useState('');

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

    const togglePronoun = (pronoun: string) => {
        if (selectedPronouns.includes(pronoun)) {
            setSelectedPronouns(selectedPronouns.filter(p => p !== pronoun));
        } else {
            if (pronoun === 'PREFER NOT TO SAY') {
                setSelectedPronouns(['PREFER NOT TO SAY']);
            } else {
                const newSelection = selectedPronouns.filter(p => p !== 'PREFER NOT TO SAY');
                newSelection.push(pronoun);
                setSelectedPronouns(newSelection);
            }
        }
    };

    const isReady = selectedPronouns.length > 0 || customPronoun.length > 0;

    return (
        <View className="flex-1 bg-cream relative overflow-hidden">

            {/* Background Text Layer */}
            <View className="absolute inset-0 pointer-events-none z-0">
                <Animated.Text style={{ position: 'absolute', top: 60, left: -30, fontSize: 120, fontWeight: '300', color: '#000', opacity: 0.03, transform: [{ rotate: '-8deg' }, { translateY: bgDriftY }] }}>
                    IDENTITY
                </Animated.Text>
                <Animated.Text style={{ position: 'absolute', top: 250, right: -40, fontSize: 100, fontWeight: '300', color: '#000', opacity: 0.03, transform: [{ rotate: '5deg' }, { translateY: bgDriftY }] }}>
                    PRONOUNS
                </Animated.Text>
                <Animated.Text style={{ position: 'absolute', bottom: 200, left: -20, fontSize: 90, fontWeight: '300', color: '#000', opacity: 0.03, transform: [{ rotate: '-4deg' }, { translateY: bgDriftY }] }}>
                    EXPRESS
                </Animated.Text>
            </View>

            {/* Accent Dot */}
            <View className="absolute top-28 right-8 w-3 h-3 bg-[#1A1AFF] rounded-full z-0" />

            <SafeAreaView className="flex-1 z-10">
                {/* Header */}
                <View className="flex-row items-center justify-between px-6 py-4">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="w-10 h-10 items-center justify-center rounded-full"
                    >
                        <MaterialIcons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text className="text-xs font-black uppercase text-black/40" style={{ letterSpacing: 2 }}>IDENTIFY</Text>
                    <View className="w-10" />
                </View>

                {/* Progress Bar */}
                <View className="mx-6 h-1 bg-black/10 rounded-full overflow-hidden mb-2">
                    <View style={{ height: '100%', backgroundColor: ORANGE, width: '35%', borderRadius: 4 }} />
                </View>

                <ScrollView className="flex-1 px-8 pt-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                    <Animated.View style={{ opacity: contentOpacity }}>

                        <Animated.Text
                            className="text-black text-[44px] font-black uppercase leading-[0.9] mb-3"
                            style={{ letterSpacing: -1, transform: [{ translateX: titleTranslateX }], opacity: titleOpacity }}
                        >
                            HOW DO{'\n'}YOU{'\n'}IDENTIFY?
                        </Animated.Text>

                        <Text className="text-black/40 text-sm font-medium uppercase mb-10" style={{ letterSpacing: 1 }}>
                            Select your pronouns to help matches address you correctly.
                        </Text>

                        {/* Pronoun Options — pill chips */}
                        <View className="flex-row flex-wrap gap-3">
                            {PRONOUN_OPTIONS.map((pronoun, index) => {
                                const isSelected = selectedPronouns.includes(pronoun);
                                return (
                                    <Animated.View
                                        key={pronoun}
                                        style={{ opacity: contentOpacity, transform: [{ translateY: contentOpacity.interpolate({ inputRange: [0, 1], outputRange: [20 + index * 5, 0] }) }], alignSelf: 'flex-start' }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => togglePronoun(pronoun)}
                                            className={`px-5 py-3 rounded-full border-2 ${isSelected ? 'bg-black border-black' : 'bg-transparent border-black/15'}`}
                                            activeOpacity={0.8}
                                        >
                                            <Text className={`font-black text-sm uppercase ${isSelected ? 'text-cream' : 'text-black'}`} style={{ letterSpacing: 1 }}>
                                                {pronoun}
                                            </Text>
                                        </TouchableOpacity>
                                    </Animated.View>
                                );
                            })}
                        </View>

                        {/* Custom Input */}
                        <View className="mt-10">
                            <Text className="text-black/30 font-black uppercase text-[10px] mb-3" style={{ letterSpacing: 2 }}>OR ENTER CUSTOM</Text>
                            <TextInput
                                className="w-full text-lg font-black text-black py-3 border-b-2 border-black/15 uppercase"
                                placeholder="Type your own..."
                                placeholderTextColor="rgba(0,0,0,0.15)"
                                value={customPronoun}
                                onChangeText={(text) => {
                                    setCustomPronoun(text);
                                    if (text.length > 0 && selectedPronouns.includes('PREFER NOT TO SAY')) {
                                        setSelectedPronouns([]);
                                    }
                                }}
                                style={{ letterSpacing: 1 }}
                            />
                        </View>

                    </Animated.View>
                </ScrollView>

                {/* Continue Button */}
                <View className="px-8 pb-10">
                    <TouchableOpacity
                        className={`w-full py-4 rounded-full items-center active:scale-95 ${isReady ? 'bg-black' : 'bg-black/20'}`}
                        onPress={async () => {
                            const pronounsList = customPronoun.trim()
                                ? [...selectedPronouns, customPronoun.trim()]
                                : selectedPronouns;
                            if (pronounsList.length > 0) await saveField({ pronouns: pronounsList });
                            navigation.navigate('Workplace');
                        }}
                        disabled={!isReady}
                    >
                        <Text className={`text-base font-black uppercase ${isReady ? 'text-cream' : 'text-black/30'}`} style={{ letterSpacing: 2 }}>CONTINUE</Text>
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
        </View>
    );
};

export default PronounsScreen;
