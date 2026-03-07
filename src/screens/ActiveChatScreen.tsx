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
    Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { BLACK, CREAM, ORANGE } from '../constants/colors';

// ─── Dummy Data ─────────────────────────────────────────────────────────────
const MOCK_MESSAGES = [
    { id: '1', text: "Hey! I saw you're into photography. I just got a new film camera.", time: '2:12 PM', isSent: false },
    { id: '2', text: "No way! Which one did you get? I'm obsessed with my Olympus MJU II.", time: '2:14 PM', isSent: true },
    { id: '3', text: "I picked up a Canon AE-1! Still figuring it out though haha. Any tips for a beginner?", time: '2:18 PM', isSent: false },
];

export default function ActiveChatScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute<any>();
    const { matchName = 'MATCH', photo = 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&q=80' } = route.params || {};

    const [inputText, setInputText] = useState('');

    const { width: W } = Dimensions.get('window');
    const [rendered, setRendered] = useState(false);
    const translateX = useRef(new Animated.Value(W)).current;

    useEffect(() => {
        setRendered(true);
        Animated.spring(translateX, {
            toValue: 0,
            damping: 30,
            stiffness: 200,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleClose = () => {
        Animated.spring(translateX, {
            toValue: W,
            damping: 30,
            stiffness: 200,
            useNativeDriver: true,
        }).start(() => {
            navigation.goBack();
        });
    };

    if (!rendered) return null;

    return (
        <Animated.View style={[StyleSheet.absoluteFillObject, { backgroundColor: CREAM, transform: [{ translateX }] }]}>
            <KeyboardAvoidingView
                style={[styles.root]}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <StatusBar style="dark" />

                {/* Sticky Header */}
                <View style={[styles.header, { paddingTop: insets.top }]}>
                    {/* Back Button */}
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={handleClose}
                    >
                        <Ionicons name="chevron-back" size={20} color={BLACK} />
                    </TouchableOpacity>

                    {/* Center Title */}
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerName}>{matchName}</Text>
                        <Text style={styles.headerStatus}>MATCHED 2D AGO</Text>
                    </View>

                    {/* More Options Button */}
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="ellipsis-horizontal" size={20} color={BLACK} />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Chat Context (Top of View) */}
                    <View style={styles.contextContainer}>
                        <View style={styles.avatarWrapper}>
                            <Image
                                source={{ uri: photo }}
                                style={styles.avatar}
                                resizeMode="cover"
                            />
                        </View>
                        <Text style={styles.contextTitle}>YOU & {matchName}</Text>
                        <Text style={styles.contextSubtext}>
                            ALIGNED ON PHOTOGRAPHY AND INDIE MUSIC
                        </Text>
                    </View>

                    {/* Messages */}
                    <View style={styles.messagesContainer}>
                        {MOCK_MESSAGES.map((msg) => (
                            <View
                                key={msg.id}
                                style={[
                                    styles.bubbleWrapper,
                                    msg.isSent ? styles.bubbleRight : styles.bubbleLeft,
                                ]}
                            >
                                <View
                                    style={[
                                        styles.bubble,
                                        msg.isSent
                                            ? styles.bubbleSent
                                            : styles.bubbleReceived,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.bubbleText,
                                            { color: msg.isSent ? CREAM : BLACK },
                                        ]}
                                    >
                                        {msg.text}
                                    </Text>
                                </View>
                                <Text
                                    style={[
                                        styles.timestamp,
                                        { textAlign: msg.isSent ? 'right' : 'left' },
                                    ]}
                                >
                                    {msg.time}
                                </Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>

                {/* Sticky Input Area */}
                <View style={[styles.inputContainer, { paddingBottom: insets.bottom > 0 ? insets.bottom : 24 }]}>
                    <View style={styles.inputPill}>
                        <TextInput
                            style={styles.inputField}
                            placeholder="TYPE A MESSAGE..."
                            placeholderTextColor="rgba(13,13,13,0.4)"
                            value={inputText}
                            onChangeText={setInputText}
                            selectionColor={ORANGE}
                            multiline
                        />
                        <TouchableOpacity
                            style={[
                                styles.sendButton,
                                inputText.trim().length > 0
                                    ? { backgroundColor: ORANGE }
                                    : { backgroundColor: 'rgba(13,13,13,0.05)' },
                            ]}
                        >
                            <Ionicons
                                name="paper-plane"
                                size={16}
                                color={inputText.trim().length > 0 ? CREAM : 'rgba(13,13,13,0.4)'}
                                style={inputText.trim().length > 0 ? { marginLeft: -2, marginTop: 2 } : {}} // Optically center the paper plane
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Animated.View>
    );
}

// ─── Styles ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    header: {
        height: 104, // Roughly 96px + variable inset, but strictly it requested h-24
        backgroundColor: 'rgba(245, 240, 235, 0.8)', // bg-cream/80 backdrop-blur-md (blur difficult in pure RN without externals, we use opacity)
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(13, 13, 13, 0.05)', // border-ink/5
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        zIndex: 10,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: 'rgba(13, 13, 13, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
    },
    headerTitleContainer: {
        alignItems: 'center',
        marginTop: 12, // Offset for the top padding
    },
    headerName: {
        fontSize: 24, // text-2xl
        fontFamily: 'ArchivoBlack_400Regular', // Try to use custom or system weight
        fontWeight: '900',
        color: BLACK,
        textTransform: 'uppercase',
    },
    headerStatus: {
        fontSize: 10,
        fontWeight: '800', // bold
        color: ORANGE,
        letterSpacing: 2, // tracking-[0.2em]
        marginTop: 2,
    },
    scrollContent: {
        paddingTop: 32,
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    contextContainer: {
        alignItems: 'center',
        marginBottom: 48,
    },
    avatarWrapper: {
        padding: 4,
        borderRadius: 56, // For the slight inner padding effect
        borderWidth: 1,
        borderColor: 'rgba(13,13,13,0.2)', // Thin near-black border
        marginBottom: 16,
    },
    avatar: {
        width: 96,
        height: 96,
        borderRadius: 48,
        // Since we don't have the image node ready synchronously, we mock it via background
    },
    contextTitle: {
        fontSize: 36, // text-4xl
        fontWeight: '900',
        color: BLACK,
        textTransform: 'uppercase',
        letterSpacing: -1,
        marginBottom: 8,
    },
    contextSubtext: {
        fontSize: 10,
        fontWeight: '800',
        color: 'rgba(13,13,13,0.5)',
        letterSpacing: 2,
        textAlign: 'center',
    },
    messagesContainer: {
        flexDirection: 'column',
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
    },
    bubbleReceived: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: 'rgba(13,13,13,0.07)',
        borderTopLeftRadius: 4, // Sharp top-left
    },
    bubbleSent: {
        backgroundColor: '#0D0D0D', // bg-ink
        borderTopRightRadius: 4, // Sharp top-right
    },
    bubbleText: {
        fontSize: 14, // text-sm
        fontWeight: '500',
        lineHeight: 20,
    },
    timestamp: {
        fontSize: 10,
        fontWeight: '800',
        color: 'rgba(13,13,13,0.4)',
        letterSpacing: 1.5, // tracked out grey caps
        textTransform: 'uppercase',
        marginTop: 6,
    },
    inputContainer: {
        backgroundColor: CREAM,
        borderTopWidth: 1,
        borderTopColor: 'rgba(13,13,13,0.05)',
        paddingTop: 24,
        paddingHorizontal: 24,
    },
    inputPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 32, // rounded-full
        padding: 8, // p-2
        borderWidth: 1,
        borderColor: 'rgba(13,13,13,0.05)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 1,
    },
    inputField: {
        flex: 1,
        minHeight: 40,
        maxHeight: 120,
        paddingHorizontal: 16,
        fontSize: 11, // tiny
        fontWeight: '800', // bold
        letterSpacing: 2, // highly tracked-out
        color: BLACK,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
});
