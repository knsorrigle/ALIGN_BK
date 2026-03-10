import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Animated, Easing, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@clerk/expo';
import { ORANGE } from '../../constants/colors';
import { useUpdateOnboarding } from '../../hooks/useUpdateOnboarding';

const NameScreen = () => {
    const navigation = useNavigation<any>();
    const { signOut } = useAuth();
    const saveField = useUpdateOnboarding();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const titleTranslateX = useRef(new Animated.Value(-100)).current;
    const contentOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(titleTranslateX, {
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

    return (
        <View className="flex-1 bg-cream relative overflow-hidden">

            {/* Bleeding Background Text */}
            <View className="absolute -top-4 -left-4 z-0 pointer-events-none select-none opacity-5">
                <Animated.Text
                    style={{ transform: [{ translateX: titleTranslateX }] }}
                    className="text-[160px] leading-[0.8] font-black text-black"
                >
                    NAME
                </Animated.Text>
            </View>

            {/* Graphic Circle (Red) */}
            <View className="absolute -bottom-[50px] -left-[100px] w-[300px] h-[300px] bg-[#E63946] rounded-full z-0 opacity-20" />

            {/* Background Decorative Elements */}
            <View className="absolute top-[50%] -right-[50px] w-64 h-64 border-[40px] border-black/5 rounded-full pointer-events-none" />

            <SafeAreaView className="flex-1 z-10">
                {/* Header */}
                <View className="flex-row items-center justify-between px-6 py-4">
                    <TouchableOpacity
                        onPress={() => signOut()}
                        className="w-10 h-10 items-center justify-center rounded-full"
                    >
                        <MaterialIcons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text className="text-xs font-black uppercase text-black/40" style={{ letterSpacing: 2 }}>Step 01 / 05</Text>
                    <View className="w-10" />
                </View>

                {/* Progress Bar */}
                <View className="mx-6 h-1 bg-black/10 rounded-full overflow-hidden mb-2">
                    <View style={{ height: '100%', backgroundColor: ORANGE, width: '20%', borderRadius: 4 }} />
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1 justify-center px-8"
                >
                    <Animated.View style={{ opacity: contentOpacity }}>
                        <Text className="text-black text-[42px] font-black leading-tight mb-12" style={{ letterSpacing: -1 }}>
                            What's your {'\n'}name?
                        </Text>

                        <View className="space-y-12">
                            {/* First Name */}
                            <View>
                                <Text className="text-black/50 text-xs font-black uppercase mb-2" style={{ letterSpacing: 2 }}>First Name</Text>
                                <TextInput
                                    className="w-full text-3xl font-bold text-black border-b-2 border-black pb-2"
                                    placeholder="Type here..."
                                    placeholderTextColor="rgba(0,0,0,0.2)"
                                    value={firstName}
                                    onChangeText={setFirstName}
                                />
                            </View>

                            {/* Last Name */}
                            <View>
                                <Text className="text-black/50 text-xs font-black uppercase mb-2" style={{ letterSpacing: 2 }}>Last Name</Text>
                                <TextInput
                                    className="w-full text-2xl font-bold text-black border-b-2 border-black pb-2"
                                    placeholder="Type here..."
                                    placeholderTextColor="rgba(0,0,0,0.1)"
                                    value={lastName}
                                    onChangeText={setLastName}
                                />
                            </View>
                        </View>
                    </Animated.View>
                </KeyboardAvoidingView>

                {/* Continue Button */}
                <View className="px-8 pb-10">
                    <TouchableOpacity
                        className={`w-full py-4 rounded-full items-center active:scale-95 ${firstName.trim() ? 'bg-black' : 'bg-black/20'}`}
                        disabled={!firstName.trim()}
                        onPress={async () => {
                            await saveField({ firstName: firstName.trim() });
                            navigation.navigate('Birthday');
                        }}
                    >
                        <Text className={`text-base font-black uppercase ${firstName.trim() ? 'text-cream' : 'text-black/30'}`} style={{ letterSpacing: 2 }}>CONTINUE</Text>
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
        </View>
    );
};

export default NameScreen;
