import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { BLACK, CREAM } from '../../constants/colors';

const { width } = Dimensions.get('window');

const LivenessCheckScreen = () => {
    const navigation = useNavigation<any>();
    const [permission, requestPermission] = useCameraPermissions();
    const [cameraType, setCameraType] = useState<CameraType>('front');
    const marqueeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(marqueeAnim, { toValue: -width, duration: 10000, easing: Easing.linear, useNativeDriver: true })
        ).start();
    }, []);

    useEffect(() => {
        if (!permission?.granted) requestPermission();
    }, [permission]);

    if (!permission) return <View />;

    if (!permission.granted) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: CREAM, padding: 24 }}>
                <Text style={{ textAlign: 'center', fontWeight: '700', fontSize: 16, marginBottom: 16, color: BLACK }}>
                    We need your permission to show the camera
                </Text>
                <TouchableOpacity onPress={requestPermission} style={{ backgroundColor: BLACK, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 32 }}>
                    <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: CREAM }}>
            {/* Background Marquee */}
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', opacity: 0.04 }}>
                <Animated.View style={{ transform: [{ translateX: marqueeAnim }], flexDirection: 'row', width: width * 4 }}>
                    <Text style={{ fontSize: 90, fontWeight: '900', color: BLACK, textTransform: 'uppercase' }}>
                        BLINK · REAL · LIVE · VERIFIED · HUMAN · BLINK · REAL · LIVE · VERIFIED · HUMAN ·
                    </Text>
                    <Text style={{ fontSize: 90, fontWeight: '900', color: BLACK, textTransform: 'uppercase' }}>
                        BLINK · REAL · LIVE · VERIFIED · HUMAN · BLINK · REAL · LIVE · VERIFIED · HUMAN ·
                    </Text>
                </Animated.View>
            </View>

            <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 24 }}>
                {/* Header */}
                <View style={{ alignItems: 'center', marginBottom: 32 }}>
                    <Text style={{ fontSize: 72, fontWeight: '900', color: BLACK, letterSpacing: -2, textTransform: 'uppercase' }}>BLINK.</Text>
                    <Text style={{ fontSize: 16, fontWeight: '500', color: '#999', marginTop: 8, textAlign: 'center', maxWidth: 250 }}>
                        Look at the camera. Follow the prompts.
                    </Text>
                </View>

                {/* Camera Frame */}
                <View style={{
                    width: 260, height: 260, borderRadius: 130, borderWidth: 3, borderColor: BLACK,
                    overflow: 'hidden', alignItems: 'center', justifyContent: 'center',
                }}>
                    <CameraView style={{ width: '100%', height: '100%' }} facing={cameraType} />
                    <View style={{ position: 'absolute', bottom: 20, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 14, paddingVertical: 4, borderRadius: 16 }}>
                        <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' }}>LOOK FORWARD</Text>
                    </View>
                </View>

                {/* Footer */}
                <View style={{ width: '100%', paddingHorizontal: 32, alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('VerificationWait')}
                        style={{ backgroundColor: BLACK, width: '100%', paddingVertical: 16, borderRadius: 32, alignItems: 'center' }}
                    >
                        <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: 14, letterSpacing: 2, textTransform: 'uppercase' }}>VERIFY</Text>
                    </TouchableOpacity>

                    <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#FFD600', marginTop: 24 }} />
                </View>
            </SafeAreaView>
        </View>
    );
};

export default LivenessCheckScreen;
