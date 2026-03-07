import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BLACK, CREAM, ORANGE } from '../../constants/colors';

const DRINKING_OPTIONS = ['Frequently', 'Socially', 'Rarely', 'Never', 'Sober'];

const DrinkingScreen = () => {
    const navigation = useNavigation<any>();
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const contentOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(contentOpacity, { toValue: 1, duration: 600, delay: 200, useNativeDriver: true }).start();
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: CREAM }}>
            {/* Watermark */}
            <View style={{ position: 'absolute', top: -10, left: -10, opacity: 0.04 }}>
                <Text style={{ fontSize: 120, fontWeight: '900', color: BLACK, lineHeight: 100 }}>DRINKS</Text>
            </View>

            <SafeAreaView style={{ flex: 1 }}>
                {/* Header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16 }}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.06)' }}
                    >
                        <MaterialIcons name="arrow-back" size={24} color={BLACK} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 11, fontWeight: '900', color: '#999', letterSpacing: 2, textTransform: 'uppercase' }}>Lifestyle</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView style={{ flex: 1, paddingHorizontal: 32 }} contentContainerStyle={{ paddingBottom: 20 }}>
                    <Animated.View style={{ opacity: contentOpacity }}>
                        <Text style={{ fontSize: 40, fontWeight: '900', color: BLACK, letterSpacing: -1, lineHeight: 44, marginBottom: 8, marginTop: 24 }}>
                            Do you drink?
                        </Text>
                        <Text style={{ fontSize: 15, color: '#999', fontWeight: '500', marginBottom: 32 }}>
                            Your lifestyle choices help us find compatible matches.
                        </Text>

                        <View style={{ gap: 12 }}>
                            {DRINKING_OPTIONS.map((option) => {
                                const isSelected = selectedOption === option;
                                return (
                                    <TouchableOpacity
                                        key={option}
                                        onPress={() => setSelectedOption(option)}
                                        style={{
                                            paddingVertical: 20,
                                            paddingHorizontal: 24,
                                            borderRadius: 16,
                                            borderWidth: 1.5,
                                            borderColor: isSelected ? BLACK : '#E0DDD8',
                                            backgroundColor: isSelected ? BLACK : '#FFFFFF',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text style={{ fontWeight: '700', fontSize: 16, color: isSelected ? '#FFFFFF' : BLACK, letterSpacing: 1, textTransform: 'uppercase' }}>
                                            {option}
                                        </Text>
                                        {isSelected && <MaterialIcons name="check" size={20} color="#FFFFFF" />}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </Animated.View>
                </ScrollView>

                {/* Continue */}
                <View style={{ paddingHorizontal: 32, paddingBottom: 8 }}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Smoking')}
                        disabled={!selectedOption}
                        style={{
                            paddingVertical: 16,
                            borderRadius: 999,
                            alignItems: 'center',
                            backgroundColor: ORANGE,
                            opacity: selectedOption ? 1 : 0.4,
                        }}
                    >
                        <Text style={{ fontSize: 14, fontWeight: '900', color: '#FFFFFF', letterSpacing: 1, textTransform: 'uppercase' }}>
                            CONTINUE
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Skip */}
                <View style={{ alignItems: 'center', paddingBottom: 24 }}>
                    <TouchableOpacity onPress={() => navigation.navigate('Smoking')}>
                        <Text style={{ fontSize: 11, fontWeight: '700', color: '#BBB', letterSpacing: 1, textTransform: 'uppercase' }}>Skip this question</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default DrinkingScreen;
