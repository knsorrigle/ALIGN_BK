import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const SafetyNoticeScreen = () => {
    const navigation = useNavigation<any>();

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleAgree = () => {
        // Navigate to next step -> Verification or Profile Start
        // Flow: Verification -> Safety -> Start Profile
        navigation.navigate('ProfileStart');
    };

    return (
        <View className="flex-1 bg-cream relative">
            <SafeAreaView className="flex-1 p-8">

                <Animated.View style={{ opacity: fadeAnim }} className="flex-1">
                    <View className="w-16 h-16 bg-black rounded-full items-center justify-center mb-8">
                        <MaterialIcons name="security" size={32} color="white" />
                    </View>

                    <Text className="text-[48px] font-black leading-tight mb-6" style={{ letterSpacing: -0.5 }}>
                        Community{'\n'}First.
                    </Text>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View className="space-y-6">
                            <View>
                                <Text className="font-bold text-lg mb-1">BE KIND</Text>
                                <Text className="text-black/60 leading-relaxed">
                                    Align is a community of respect. Harassment, hate speech, and bullying are not tolerated.
                                </Text>
                            </View>

                            <View>
                                <Text className="font-bold text-lg mb-1">BE AUTHENTIC</Text>
                                <Text className="text-black/60 leading-relaxed">
                                    Upload only your own photos and represent yourself honestly.
                                </Text>
                            </View>

                            <View>
                                <Text className="font-bold text-lg mb-1">STAY SAFE</Text>
                                <Text className="text-black/60 leading-relaxed">
                                    Never share financial information. Report any suspicious activity immediately.
                                </Text>
                            </View>
                        </View>
                    </ScrollView>
                </Animated.View>

                {/* Footer Action */}
                <View className="pt-6 border-t border-black/5">
                    <TouchableOpacity
                        className="w-full bg-black py-4 rounded-full items-center justify-center shadow-lg active:scale-95"
                        onPress={handleAgree}
                    >
                        <Text className="text-white text-lg font-black uppercase" style={{ letterSpacing: 1 }}>I Agree</Text>
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
        </View>
    );
};

export default SafetyNoticeScreen;
