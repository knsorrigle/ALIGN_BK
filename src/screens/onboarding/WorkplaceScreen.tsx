import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Animated, Easing, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUpdateOnboarding } from '../../hooks/useUpdateOnboarding';

const WorkplaceScreen = () => {
    const navigation = useNavigation<any>();
    const saveField = useUpdateOnboarding();
    const [jobTitle, setJobTitle] = useState('');
    const [company, setCompany] = useState('');

    // Animations
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

    const handleContinue = async () => {
        const workplace = jobTitle && company
            ? `${jobTitle.trim()} at ${company.trim()}`
            : (company.trim() || jobTitle.trim() || null);
        if (workplace) await saveField({ workplace });
        navigation.navigate('ProfilePrompts');
    };

    return (
        <View className="flex-1 bg-cream relative overflow-hidden">

            {/* Background Text Layer */}
            <View className="absolute inset-0 pointer-events-none z-0">
                <Animated.Text style={{ position: 'absolute', top: 70, left: -20, fontSize: 110, fontWeight: '300', color: '#000', opacity: 0.03, transform: [{ rotate: '-6deg' }, { translateY: bgDriftY }] }}>
                    CAREER
                </Animated.Text>
                <Animated.Text style={{ position: 'absolute', bottom: 200, right: -30, fontSize: 90, fontWeight: '300', color: '#000', opacity: 0.03, transform: [{ rotate: '4deg' }, { translateY: bgDriftY }] }}>
                    WORK
                </Animated.Text>
            </View>

            {/* Accent Dot */}
            <View className="absolute top-28 right-12 w-4 h-4 bg-primary rounded-full z-0" />

            <SafeAreaView className="flex-1 z-10">
                {/* Header */}
                <View className="flex-row items-center justify-between px-6 py-4">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 items-center justify-center">
                        <MaterialIcons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text className="text-xs font-black uppercase text-black/40" style={{ letterSpacing: 2 }}>CAREER</Text>
                    <View className="w-10" />
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1 justify-center px-8"
                >
                    <Animated.View style={{ opacity: contentOpacity }}>
                        <Animated.Text
                            className="text-black text-[44px] font-black uppercase leading-[0.9] mb-4"
                            style={{ letterSpacing: -1, transform: [{ translateX: titleTranslateX }], opacity: titleOpacity }}
                        >
                            WHAT DO{'\n'}YOU DO?
                        </Animated.Text>
                        <Text className="text-black/50 text-sm font-medium uppercase mb-12" style={{ letterSpacing: 1 }}>
                            Share your profession. (Optional)
                        </Text>

                        <View className="gap-10">
                            {/* Job Title */}
                            <View>
                                <Text className="text-black/30 text-[10px] font-black uppercase mb-3" style={{ letterSpacing: 2 }}>JOB TITLE</Text>
                                <TextInput
                                    className="w-full text-xl font-black text-black py-3 border-b-2 border-black/15 uppercase"
                                    placeholder="e.g. DESIGNER, ENGINEER..."
                                    placeholderTextColor="rgba(0,0,0,0.15)"
                                    value={jobTitle}
                                    onChangeText={setJobTitle}
                                    style={{ letterSpacing: 1 }}
                                />
                            </View>

                            {/* Company */}
                            <View>
                                <Text className="text-black/30 text-[10px] font-black uppercase mb-3" style={{ letterSpacing: 2 }}>COMPANY / WORKPLACE</Text>
                                <TextInput
                                    className="w-full text-xl font-black text-black py-3 border-b-2 border-black/15 uppercase"
                                    placeholder="e.g. ALIGN, FREELANCE..."
                                    placeholderTextColor="rgba(0,0,0,0.15)"
                                    value={company}
                                    onChangeText={setCompany}
                                    style={{ letterSpacing: 1 }}
                                />
                            </View>
                        </View>
                    </Animated.View>
                </KeyboardAvoidingView>

                {/* Continue Button */}
                <View className="px-8 pb-8">
                    <TouchableOpacity
                        className="w-full bg-black py-4 rounded-full items-center active:scale-95"
                        onPress={handleContinue}
                    >
                        <Text className="text-cream text-base font-black uppercase" style={{ letterSpacing: 2 }}>
                            {jobTitle || company ? 'CONTINUE' : 'SKIP'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default WorkplaceScreen;
