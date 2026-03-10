import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Animated,
    Dimensions,
    Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BLACK, CREAM, ORANGE } from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';
import { useQuery, useAction } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Audio } from 'expo-av';

const INITIAL_PROMPTS = [
    "How do I rizz them up?",
    "What's a good first date idea?",
    "How should I reply to their last message?",
];

type Message = {
    id: string;
    text: string;
    isAi: boolean;
};

// --- Animations Components ---

const PromptPill = ({ text, onPress, delay }: { text: string; onPress: () => void; delay: number }) => {
    const animY = useRef(new Animated.Value(10)).current;
    const animOpacity = useRef(new Animated.Value(0)).current;
    const colorAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.delay(delay),
            Animated.parallel([
                Animated.timing(animY, { toValue: 0, duration: 400, useNativeDriver: true }),
                Animated.timing(animOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
            ]),
        ]).start();
    }, []);

    const handlePressIn = () => {
        Animated.timing(colorAnim, { toValue: 1, duration: 150, useNativeDriver: false }).start();
    };

    const handlePressOut = () => {
        Animated.timing(colorAnim, { toValue: 0, duration: 200, useNativeDriver: false }).start();
    };

    const backgroundColor = colorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['#FFFFFF', '#0D0D0D'],
    });
    const textColor = colorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['#0D0D0D', CREAM],
    });

    return (
        <Animated.View style={{ opacity: animOpacity, transform: [{ translateY: animY }], width: '100%', marginBottom: 12 }}>
            <TouchableOpacity
                activeOpacity={1}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={onPress}
            >
                <Animated.View style={[styles.promptPill, { backgroundColor }]}>
                    <Animated.Text style={[styles.promptText, { color: textColor }]}>
                        {text}
                    </Animated.Text>
                </Animated.View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const BouncingDots = () => {
    const dot1 = useRef(new Animated.Value(0)).current;
    const dot2 = useRef(new Animated.Value(0)).current;
    const dot3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const bounce = (anim: Animated.Value, delay: number) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(anim, { toValue: -6, duration: 300, useNativeDriver: true }),
                    Animated.timing(anim, { toValue: 0, duration: 300, useNativeDriver: true }),
                    Animated.delay(200),
                ])
            );
        };

        bounce(dot1, 0).start();
        bounce(dot2, 100).start();
        bounce(dot3, 200).start();
    }, []);

    return (
        <View style={styles.dotsContainer}>
            <Animated.View style={[styles.dot, { transform: [{ translateY: dot1 }] }]} />
            <Animated.View style={[styles.dot, { transform: [{ translateY: dot2 }] }]} />
            <Animated.View style={[styles.dot, { transform: [{ translateY: dot3 }] }]} />
        </View>
    );
};

const ChatBubble = ({ message, isLast }: { message: Message; isLast: boolean }) => {
    const scale = useRef(new Animated.Value(0.95)).current;
    const translateY = useRef(new Animated.Value(10)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scale, { toValue: 1, damping: 25, stiffness: 200, useNativeDriver: true }),
            Animated.spring(translateY, { toValue: 0, damping: 25, stiffness: 200, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        ]).start();
    }, []);

    const isAi = message.isAi;

    return (
        <Animated.View
            style={[
                styles.bubbleWrapper,
                isAi ? styles.bubbleLeft : styles.bubbleRight,
                { opacity, transform: [{ scale }, { translateY }] },
                isLast && { marginBottom: 24 }
            ]}
        >
            <View style={[styles.bubble, isAi ? styles.bubbleAi : styles.bubbleUser]}>
                <Text style={[styles.bubbleText, { color: isAi ? BLACK : CREAM }]}>
                    {message.text}
                </Text>
            </View>
        </Animated.View>
    );
};

export default function AlignAIScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const canGoBack = navigation.canGoBack();
    const history = useQuery(api.ai.chat.getMyAIChatHistory);
    const sendMessageAction = useAction(api.ai.chat.sendMessage);

    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const recordingRef = useRef<Audio.Recording | null>(null);
    const recordingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const stopRecording = async () => {
        if (recordingTimerRef.current) {
            clearTimeout(recordingTimerRef.current);
            recordingTimerRef.current = null;
        }
        setIsRecording(false);
        if (!recordingRef.current) return;
        let uri: string | null = null;
        try {
            uri = recordingRef.current.getURI();
            await recordingRef.current.stopAndUnloadAsync();
        } catch { /* already stopped */ }
        recordingRef.current = null;
        if (!uri) return;
        try {
            const formData = new FormData();
            formData.append('file', { uri, type: 'audio/m4a', name: 'recording.m4a' } as any);
            formData.append('model', 'whisper-large-v3');
            const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
                method: 'POST',
                headers: { Authorization: `Bearer ${process.env.EXPO_PUBLIC_GROQ_API_KEY}` },
                body: formData,
            });
            if (!response.ok) throw new Error('Transcription failed');
            const data = await response.json();
            const transcribed = (data.text || '').trim();
            if (!transcribed || isTyping) return;
            // Auto-send transcribed text
            setIsTyping(true);
            setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
            try {
                await sendMessageAction({ text: transcribed });
            } finally {
                setIsTyping(false);
                setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
            }
        } catch {
            Alert.alert('Voice input failed', 'Could not transcribe audio. Please type your message instead.');
        }
    };

    const handleMicPress = async () => {
        if (isRecording) {
            await stopRecording();
            return;
        }
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Microphone Permission', 'Please allow microphone access to use voice input.');
            return;
        }
        await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
        const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
        recordingRef.current = recording;
        setIsRecording(true);
        recordingTimerRef.current = setTimeout(() => stopRecording(), 10000);
    };

    useEffect(() => {
        return () => {
            if (recordingRef.current) {
                recordingRef.current.stopAndUnloadAsync().catch(() => { });
            }
            if (recordingTimerRef.current) clearTimeout(recordingTimerRef.current);
        };
    }, []);

    const messages: Message[] = (history ?? []).map(m => ({
        id: String(m._id),
        text: m.text,
        isAi: m.isAi,
    }));

    const scrollViewRef = useRef<ScrollView>(null);
    const screenOpacity = useRef(new Animated.Value(0)).current;
    const screenTranslateY = useRef(new Animated.Value(10)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(screenOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
            Animated.timing(screenTranslateY, { toValue: 0, duration: 400, useNativeDriver: true }),
        ]).start();
    }, []);

    const handleSend = async (text: string) => {
        if (!text.trim() || isTyping) return;
        setInputText('');
        setIsTyping(true);
        setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
        try {
            await sendMessageAction({ text: text.trim() });
        } finally {
            setIsTyping(false);
            setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
        }
    };

    return (
        <Animated.View style={[styles.root, { opacity: screenOpacity, transform: [{ translateY: screenTranslateY }] }]}>
            <StatusBar style="dark" />
            <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
                {/* Back Button for Stack (only when pushed, not tab root) */}
                {canGoBack && (
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color={BLACK} />
                    </TouchableOpacity>
                )}

                <View style={styles.titleRow}>
                    <MaterialCommunityIcons name="star-four-points-outline" size={24} color={ORANGE} />
                    <Text style={styles.headline}>ALIGN AI</Text>
                </View>
                <Text style={styles.subtitle}>YOUR PERSONAL DATING STRATEGIST</Text>
            </View>

            <KeyboardAvoidingView style={styles.keyboardAvoid} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView
                    ref={scrollViewRef}
                    style={styles.chatArea}
                    contentContainerStyle={[
                        styles.chatContent,
                        messages.length === 0 && { flexGrow: 1, justifyContent: 'flex-end' }
                    ]}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                >
                    {messages.length === 0 ? (
                        <View style={styles.emptyState}>
                            {INITIAL_PROMPTS.map((prompt, i) => (
                                <PromptPill
                                    key={i}
                                    text={prompt}
                                    onPress={() => handleSend(prompt)}
                                    delay={i * 100}
                                />
                            ))}
                        </View>
                    ) : (
                        <View>
                            {messages.map((msg, i) => (
                                <ChatBubble key={msg.id} message={msg} isLast={i === messages.length - 1 && !isTyping} />
                            ))}
                            {isTyping && (
                                <View style={[styles.bubbleWrapper, styles.bubbleLeft, { marginBottom: 24 }]}>
                                    <View style={[styles.bubble, styles.bubbleAi, { paddingHorizontal: 16, paddingVertical: 18 }]}>
                                        <BouncingDots />
                                    </View>
                                </View>
                            )}
                        </View>
                    )}
                </ScrollView>

                <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
                    <View style={styles.inputPill}>
                        <TouchableOpacity onPress={handleMicPress} style={styles.inputIcon}>
                            <Ionicons name={isRecording ? 'stop-circle' : 'mic'} size={20} color={isRecording ? ORANGE : 'rgba(13,13,13,0.4)'} />
                        </TouchableOpacity>
                        <TextInput
                            style={styles.inputField}
                            placeholder="ASK ALIGN ANYTHING..."
                            placeholderTextColor="rgba(13,13,13,0.4)"
                            value={inputText}
                            onChangeText={setInputText}
                            selectionColor={ORANGE}
                            multiline
                        />
                        <TouchableOpacity
                            onPress={() => handleSend(inputText)}
                            disabled={!inputText.trim()}
                            style={[
                                styles.sendButton,
                                inputText.trim().length > 0 ? { backgroundColor: ORANGE } : { backgroundColor: 'rgba(13,13,13,0.05)' }
                            ]}
                        >
                            <Ionicons
                                name="arrow-up"
                                size={18}
                                color={inputText.trim().length > 0 ? CREAM : 'rgba(13,13,13,0.4)'}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: CREAM,
    },
    header: {
        paddingHorizontal: 32,
        paddingBottom: 24,
        backgroundColor: CREAM,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(13,13,13,0.05)',
        zIndex: 10,
    },
    backButton: {
        marginBottom: 16,
        marginLeft: -8,
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 4,
    },
    headline: {
        // fontFamily removed — ArchivoBlack not loaded
        fontSize: 48, // text-5xl equivalent roughly
        fontWeight: '900',
        color: BLACK,
        textTransform: 'uppercase',
        letterSpacing: -2,
    },
    subtitle: {
        fontSize: 10,
        fontWeight: '800',
        color: 'rgba(13,13,13,0.5)',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    keyboardAvoid: {
        flex: 1,
    },
    chatArea: {
        flex: 1,
    },
    chatContent: {
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 16,
    },
    emptyState: {
        width: '100%',
    },
    promptPill: {
        width: '100%',
        paddingVertical: 20,
        paddingHorizontal: 24,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(13,13,13,0.07)',
    },
    promptText: {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 24,
    },
    bubbleWrapper: {
        marginBottom: 24,
        maxWidth: '85%',
    },
    bubbleLeft: {
        alignSelf: 'flex-start',
    },
    bubbleRight: {
        alignSelf: 'flex-end',
    },
    bubble: {
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 24, // rounded-3xl
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1, // subtle shadow
    },
    bubbleAi: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: 'rgba(13,13,13,0.07)',
        borderTopLeftRadius: 4, // sharp top-left
    },
    bubbleUser: {
        backgroundColor: '#0D0D0D', // bg-ink
        borderTopRightRadius: 4, // sharp top-right
    },
    bubbleText: {
        fontSize: 15, // slightly larger for readability
        fontWeight: '500',
        lineHeight: 22,
    },
    dotsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        height: 12,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(13,13,13,0.4)',
    },
    inputContainer: {
        backgroundColor: CREAM,
        paddingTop: 16,
        paddingHorizontal: 32, // p-8 pt-4 roughly inside SafeArea
    },
    inputPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        padding: 10,
        borderWidth: 1,
        borderColor: 'rgba(13,13,13,0.05)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
        elevation: 10,
    },
    inputIcon: {
        marginLeft: 12,
        marginRight: 8,
    },
    inputField: {
        flex: 1,
        minHeight: 20,
        maxHeight: 120,
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 2,
        color: BLACK,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
});
