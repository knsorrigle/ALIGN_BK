import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BLACK, CREAM, ORANGE } from '../../constants/colors';

const VoicePromptScreen = () => {
    const navigation = useNavigation<any>();
    const [isRecording, setIsRecording] = useState(false);
    const titleTranslateX = useRef(new Animated.Value(-100)).current;
    const centerOpacity = useRef(new Animated.Value(0)).current;
    const waveAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(titleTranslateX, { toValue: 0, duration: 800, useNativeDriver: true }),
            Animated.timing(centerOpacity, { toValue: 1, duration: 800, delay: 200, useNativeDriver: true }),
        ]).start();
    }, []);

    useEffect(() => {
        if (isRecording) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(waveAnim, { toValue: 1, duration: 500, easing: Easing.linear, useNativeDriver: false }),
                    Animated.timing(waveAnim, { toValue: 0, duration: 500, easing: Easing.linear, useNativeDriver: false })
                ])
            ).start();
        } else {
            waveAnim.setValue(0);
        }
    }, [isRecording]);

    const handleRecord = () => {
        setIsRecording(!isRecording);
        if (isRecording) {
            setTimeout(() => navigation.navigate('SafetyNotice'), 500);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: CREAM }}>
            <SafeAreaView style={{ flex: 1 }}>
                {/* Top Nav */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16 }}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{ padding: 8, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.06)' }}
                    >
                        <MaterialIcons name="close" size={28} color={BLACK} />
                    </TouchableOpacity>
                    <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#FFD600' }} />
                </View>

                <View style={{ flex: 1, position: 'relative' }}>
                    {/* Vertical Title Watermark */}
                    <Animated.View style={{ transform: [{ translateX: titleTranslateX }], position: 'absolute', left: 0, top: 0, bottom: 0, justifyContent: 'center', marginLeft: 16, opacity: 0.06 }}>
                        <View style={{ transform: [{ rotate: '-90deg' }], width: 500, marginLeft: -200 }}>
                            <Text style={{ fontSize: 100, fontWeight: '900', color: BLACK, textAlign: 'center', textTransform: 'uppercase' }}>VOICE</Text>
                        </View>
                    </Animated.View>

                    {/* Central Content */}
                    <Animated.View style={{ opacity: centerOpacity, flex: 1, alignItems: 'center', justifyContent: 'center', paddingLeft: 60 }}>
                        {/* Circle */}
                        <View style={{
                            width: 220, height: 220, borderWidth: 2, borderColor: BLACK, borderRadius: 110,
                            alignItems: 'center', justifyContent: 'center', marginBottom: 48,
                        }}>
                            {/* Top dot */}
                            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: BLACK, position: 'absolute', top: 24 }} />

                            {/* Voice Wave Bars */}
                            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: 48 }}>
                                {[16, 32, 48, 24, 40].map((h, i) => (
                                    <Animated.View
                                        key={i}
                                        style={{
                                            width: 3,
                                            backgroundColor: BLACK,
                                            borderRadius: 2,
                                            height: isRecording
                                                ? waveAnim.interpolate({ inputRange: [0, 1], outputRange: [h, h + 16] })
                                                : h,
                                        }}
                                    />
                                ))}
                            </View>
                        </View>

                        <Text style={{ color: '#999', fontSize: 12, fontWeight: '500', letterSpacing: 1, textTransform: 'uppercase', textAlign: 'center', maxWidth: 200 }}>
                            Add a voice prompt to your profile
                        </Text>
                    </Animated.View>
                </View>

                {/* Bottom Action */}
                <View style={{ paddingHorizontal: 32, paddingBottom: 32, alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={handleRecord}
                        style={{
                            width: '100%', maxWidth: 340, backgroundColor: BLACK, paddingVertical: 20, borderRadius: 12,
                            alignItems: 'center', marginBottom: 24,
                            borderWidth: isRecording ? 2 : 0, borderColor: '#E03A2F',
                        }}
                    >
                        <Text style={{ fontWeight: '700', fontSize: 13, color: isRecording ? '#E03A2F' : '#FFFFFF', letterSpacing: 3, textTransform: 'uppercase' }}>
                            {isRecording ? 'STOP' : 'RECORD'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('SafetyNotice')} style={{ marginBottom: 16 }}>
                        <Text style={{ color: '#999', fontWeight: '500', fontSize: 12, textDecorationLine: 'underline' }}>Skip for now</Text>
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: ORANGE }} />
                        <Text style={{ color: '#BBB', fontSize: 10, fontWeight: '700', letterSpacing: 4, textTransform: 'uppercase' }}>Align OS v1.0</Text>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default VoicePromptScreen;
