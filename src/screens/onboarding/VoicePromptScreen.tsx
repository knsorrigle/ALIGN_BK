import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { BLACK, CREAM, ORANGE } from '../../constants/colors';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';

const SENTENCES = [
    "Tell me something that made you smile recently.",
    "What's a place you'd love to explore someday?",
    "Describe your perfect Sunday morning.",
    "What's something most people don't know about you?",
    "If you could have dinner with anyone, who would it be?",
];

const RECORD_SECONDS = 5;

const VoicePromptScreen = () => {
    const navigation = useNavigation<any>();
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const saveVoiceProfile = useMutation(api.files.saveVoiceProfile);

    const [sentence] = useState(() => SENTENCES[Math.floor(Math.random() * SENTENCES.length)]);
    const [isRecording, setIsRecording] = useState(false);
    const [countdown, setCountdown] = useState(RECORD_SECONDS);
    const [isUploading, setIsUploading] = useState(false);

    const recordingRef = useRef<Audio.Recording | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const titleTranslateX = useRef(new Animated.Value(-100)).current;
    const centerOpacity = useRef(new Animated.Value(0)).current;
    const waveAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(titleTranslateX, { toValue: 0, duration: 800, useNativeDriver: true }),
            Animated.timing(centerOpacity, { toValue: 1, duration: 800, delay: 200, useNativeDriver: true }),
        ]).start();

        Audio.requestPermissionsAsync();

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (recordingRef.current) recordingRef.current.stopAndUnloadAsync();
        };
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
            waveAnim.stopAnimation();
            waveAnim.setValue(0);
        }
    }, [isRecording]);

    const handleRecord = async () => {
        if (isUploading) return;

        if (isRecording) return; // don't allow manual stop, auto-stops after 5s

        try {
            await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            recordingRef.current = recording;
            setIsRecording(true);
            setCountdown(RECORD_SECONDS);

            let remaining = RECORD_SECONDS;
            timerRef.current = setInterval(async () => {
                remaining -= 1;
                setCountdown(remaining);
                if (remaining <= 0) {
                    if (timerRef.current) clearInterval(timerRef.current);
                    await stopAndUpload();
                }
            }, 1000);
        } catch {
            setIsRecording(false);
        }
    };

    const stopAndUpload = async () => {
        setIsRecording(false);
        setIsUploading(true);
        try {
            const rec = recordingRef.current;
            if (!rec) return;
            await rec.stopAndUnloadAsync();
            const uri = rec.getURI();
            recordingRef.current = null;
            if (!uri) return;

            const uploadUrl = await generateUploadUrl();
            const response = await fetch(uri);
            const blob = await response.blob();
            const uploadResponse = await fetch(uploadUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'audio/m4a' },
                body: blob,
            });
            const { storageId } = await uploadResponse.json();
            await saveVoiceProfile({ storageId, durationSeconds: RECORD_SECONDS });
            navigation.navigate('SafetyNotice');
        } catch {
            setIsUploading(false);
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

                {/* Sentence prompt */}
                <View style={{ paddingHorizontal: 32, paddingBottom: 8 }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: 'rgba(0,0,0,0.4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>
                        READ ALOUD
                    </Text>
                    <Text style={{ fontSize: 18, fontWeight: '600', color: BLACK, lineHeight: 26 }}>
                        "{sentence}"
                    </Text>
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
                            width: 220, height: 220, borderWidth: 2, borderColor: isRecording ? ORANGE : BLACK, borderRadius: 110,
                            alignItems: 'center', justifyContent: 'center', marginBottom: 32,
                        }}>
                            {/* Top dot */}
                            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: isRecording ? ORANGE : BLACK, position: 'absolute', top: 24 }} />

                            {/* Countdown when recording */}
                            {isRecording ? (
                                <Text style={{ fontSize: 72, fontWeight: '900', color: ORANGE, letterSpacing: -4 }}>{countdown}</Text>
                            ) : (
                                /* Voice Wave Bars */
                                <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: 48 }}>
                                    {[16, 32, 48, 24, 40].map((h, i) => (
                                        <Animated.View
                                            key={i}
                                            style={{
                                                width: 3,
                                                backgroundColor: BLACK,
                                                borderRadius: 2,
                                                height: h,
                                            }}
                                        />
                                    ))}
                                </View>
                            )}
                        </View>

                        <Text style={{ color: '#999', fontSize: 12, fontWeight: '500', letterSpacing: 1, textTransform: 'uppercase', textAlign: 'center', maxWidth: 200 }}>
                            {isRecording ? `Recording... ${countdown}s` : isUploading ? 'Uploading...' : 'Tap to record 5 seconds'}
                        </Text>
                    </Animated.View>
                </View>

                {/* Bottom Action */}
                <View style={{ paddingHorizontal: 32, paddingBottom: 32, alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={handleRecord}
                        disabled={isRecording || isUploading}
                        style={{
                            width: '100%', maxWidth: 340, backgroundColor: isRecording ? ORANGE : BLACK, paddingVertical: 20, borderRadius: 12,
                            alignItems: 'center', marginBottom: 24, opacity: isRecording || isUploading ? 0.7 : 1,
                        }}
                    >
                        <Text style={{ fontWeight: '700', fontSize: 13, color: '#FFFFFF', letterSpacing: 3, textTransform: 'uppercase' }}>
                            {isRecording ? `RECORDING (${countdown}s)` : isUploading ? 'UPLOADING...' : 'RECORD'}
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
