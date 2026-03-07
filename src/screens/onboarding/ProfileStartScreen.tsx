import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BLACK, CREAM, ORANGE } from '../../constants/colors';

const ProfileStartScreen = () => {
    const navigation = useNavigation<any>();
    const titleOpacity = useRef(new Animated.Value(0)).current;
    const buttonTranslateY = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        Animated.stagger(200, [
            Animated.timing(titleOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
            Animated.timing(buttonTranslateY, { toValue: 0, duration: 800, useNativeDriver: true }),
        ]).start();
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: CREAM }}>
            {/* Subtle orange overlay */}
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: ORANGE, opacity: 0.03 }} />

            <SafeAreaView style={{ flex: 1, justifyContent: 'space-between', padding: 32 }}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Animated.View style={{ opacity: titleOpacity }}>
                        <Text style={{ fontSize: 72, fontWeight: '900', color: BLACK, lineHeight: 68, letterSpacing: -2, textTransform: 'uppercase', marginBottom: 24 }}>
                            Beyond{'\n'}Pictures
                        </Text>
                        <Text style={{ fontSize: 18, fontWeight: '500', color: '#999', lineHeight: 28 }}>
                            Align is about depth. {'\n'}Let's build your profile to reflect who you really are.
                        </Text>
                    </Animated.View>
                </View>

                <Animated.View style={{ transform: [{ translateY: buttonTranslateY }] }}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Pronouns')}
                        style={{ backgroundColor: BLACK, paddingVertical: 16, borderRadius: 32, alignItems: 'center' }}
                    >
                        <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' }}>Start Profile</Text>
                    </TouchableOpacity>
                </Animated.View>
            </SafeAreaView>
        </View>
    );
};

export default ProfileStartScreen;
