import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Pressable, ScrollView, Image, Animated, Easing, TextInput, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Star, X } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { BLACK, CREAM, ORANGE } from '../constants/colors';
import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Audio } from 'expo-av';

// ─── Groq Whisper transcription ───────────────────────────────────────────────
const transcribeAudio = async (audioUri: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', { uri: audioUri, type: 'audio/m4a', name: 'recording.m4a' } as any);
    formData.append('model', 'whisper-large-v3');
    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${process.env.EXPO_PUBLIC_GROQ_API_KEY}` },
        body: formData,
    });
    if (!response.ok) throw new Error('Transcription failed');
    const data = await response.json();
    return data.text || '';
};

// ─── Photo thumbnail with initial fallback ────────────────────────────────────
function PhotoOrInitial({ photos, name, size = 40 }: { photos: string[]; name: string; size?: number }) {
    const photo = photos[0];
    const isReal = photo && photo.startsWith('https://');
    const initial = (name || '?')[0].toUpperCase();
    if (isReal) {
        return (
            <Image
                source={{ uri: photo }}
                style={{ width: size, height: size, borderRadius: size / 2 }}
                resizeMode="cover"
            />
        );
    }
    return (
        <View style={{
            width: size, height: size, borderRadius: size / 2,
            backgroundColor: ORANGE, alignItems: 'center', justifyContent: 'center',
        }}>
            <Text style={{ fontSize: size * 0.4, fontWeight: '900', color: CREAM }}>{initial}</Text>
        </View>
    );
}

export default function StitchHomeScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const aims = useQuery(api.ai.aims.getMyAIMs);
    const discoveryProfiles = useQuery(api.users.getDiscoveryProfiles, {});
    const recordSwipeMutation = useMutation(api.swipes.recordSwipe);
    const addFavoriteMutation = useMutation(api.users.addFavorite);
    const removeFavoriteMutation = useMutation(api.users.removeFavorite);
    const sendMessageAction = useAction(api.ai.chat.sendMessage);

    type QueueProfile = {
        id: string;
        targetClerkId: string;
        targetUserId: any;
        compatibilityScore: number;
        explanation?: string;
        firstName: string;
        photos: string[];
    };

    // Stable ref — only *append* new profiles so existing card indices never shift
    const allProfilesRef = useRef<QueueProfile[]>([]);
    const seenIdsRef = useRef<Set<string>>(new Set());
    const [, forceRender] = useState(0);

    useEffect(() => {
        const incoming: QueueProfile[] = [];
        for (const aim of aims ?? []) {
            const id = String(aim._id);
            if (!seenIdsRef.current.has(id)) {
                incoming.push({
                    id,
                    targetClerkId: aim.targetClerkId,
                    targetUserId: aim.targetUserId,
                    compatibilityScore: aim.compatibilityScore,
                    explanation: aim.explanation,
                    firstName: aim.target?.firstName ?? '',
                    photos: aim.target?.photos ?? [],
                });
                seenIdsRef.current.add(id);
            }
        }
        const aimClerkIds = new Set((aims ?? []).map((a: any) => a.targetClerkId));
        for (const p of discoveryProfiles ?? []) {
            const id = String(p._id);
            if (!seenIdsRef.current.has(id) && !aimClerkIds.has(p.clerkId)) {
                incoming.push({
                    id,
                    targetClerkId: p.clerkId,
                    targetUserId: p._id,
                    compatibilityScore: p.compatibility_score ?? 0,
                    explanation: undefined,
                    firstName: p.firstName ?? '',
                    photos: p.photos ?? [],
                });
                seenIdsRef.current.add(id);
            }
        }
        if (incoming.length > 0) {
            allProfilesRef.current = [...allProfilesRef.current, ...incoming];
            forceRender(n => n + 1);
        }
    }, [aims, discoveryProfiles]);

    const allProfiles = allProfilesRef.current;

    // Queue slots
    const nextIdxRef = useRef(2);
    const [slot0Idx, setSlot0Idx] = useState(0);
    const [slot1Idx, setSlot1Idx] = useState(1);
    const [slot0Visible, setSlot0Visible] = useState(true);
    const [slot1Visible, setSlot1Visible] = useState(true);

    const aim0: QueueProfile | null = slot0Visible ? (allProfiles[slot0Idx] ?? null) : null;
    const aim1: QueueProfile | null = slot1Visible ? (allProfiles[slot1Idx] ?? null) : null;

    // Animation Values
    const title1Y = useRef(new Animated.Value(60)).current;
    const title2Y = useRef(new Animated.Value(60)).current;
    const title3Y = useRef(new Animated.Value(60)).current;
    const title4Y = useRef(new Animated.Value(60)).current;
    const title1Opacity = useRef(new Animated.Value(0)).current;
    const title2Opacity = useRef(new Animated.Value(0)).current;
    const title3Opacity = useRef(new Animated.Value(0)).current;
    const title4Opacity = useRef(new Animated.Value(0)).current;

    const dotPulse1 = useRef(new Animated.Value(1)).current;
    const dotPulse2 = useRef(new Animated.Value(1)).current;
    const dotPulse3 = useRef(new Animated.Value(1)).current;

    const cardAlexOpacity = useRef(new Animated.Value(0)).current;
    const cardAlexY = useRef(new Animated.Value(20)).current;
    const cardAlexX = useRef(new Animated.Value(0)).current;
    const cardAlexScale = useRef(new Animated.Value(1)).current;
    const cardJordanOpacity = useRef(new Animated.Value(0)).current;
    const cardJordanY = useRef(new Animated.Value(20)).current;
    const cardJordanX = useRef(new Animated.Value(0)).current;
    const cardJordanScale = useRef(new Animated.Value(1)).current;

    const askBarOpacity = useRef(new Animated.Value(0)).current;
    const askBarY = useRef(new Animated.Value(30)).current;

    const cardAnimatedRef = useRef(false);

    // Animate cards in once data arrives
    useEffect(() => {
        if (allProfiles.length === 0 || cardAnimatedRef.current) return;
        cardAnimatedRef.current = true;
        Animated.parallel([
            Animated.timing(cardAlexOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.timing(cardAlexY, { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        ]).start();
        Animated.sequence([
            Animated.delay(100),
            Animated.parallel([
                Animated.timing(cardJordanOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
                Animated.timing(cardJordanY, { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            ]),
        ]).start();
    }, [allProfiles.length]);

    const [isAlexFavorited, setIsAlexFavorited] = useState(false);
    const [isJordanFavorited, setIsJordanFavorited] = useState(false);
    const alexStarScale = useRef(new Animated.Value(1)).current;
    const alexStarRotation = useRef(new Animated.Value(0)).current;
    const jordanStarScale = useRef(new Animated.Value(1)).current;
    const jordanStarRotation = useRef(new Animated.Value(0)).current;

    const animateStar = (scale: Animated.Value, rotation: Animated.Value, wasFavorited: boolean) => {
        Animated.sequence([
            Animated.spring(scale, { toValue: 1.5, friction: 3, tension: 400, useNativeDriver: true }),
            Animated.spring(scale, { toValue: 1, friction: 4, tension: 180, useNativeDriver: true }),
        ]).start();
        if (!wasFavorited) {
            Animated.sequence([
                Animated.timing(rotation, { toValue: -1, duration: 70, useNativeDriver: true }),
                Animated.timing(rotation, { toValue: 1, duration: 70, useNativeDriver: true }),
                Animated.spring(rotation, { toValue: 0, friction: 5, tension: 200, useNativeDriver: true }),
            ]).start();
        }
    };

    const handleDismissAlex = () => {
        if (aim0) recordSwipeMutation({ toClerkId: aim0.targetClerkId, direction: 'left' });
        Animated.parallel([
            Animated.timing(cardAlexX, { toValue: -420, duration: 220, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
            Animated.timing(cardAlexOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
        ]).start(() => {
            const nextIdx = nextIdxRef.current;
            if (nextIdx < allProfiles.length) {
                nextIdxRef.current = nextIdx + 1;
                cardAlexX.setValue(0);
                cardAlexOpacity.setValue(0);
                cardAlexY.setValue(20);
                setSlot0Idx(nextIdx);
                setIsAlexFavorited(false);
                Animated.parallel([
                    Animated.timing(cardAlexOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
                    Animated.timing(cardAlexY, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
                ]).start();
            } else {
                setSlot0Visible(false);
            }
        });
    };

    const handleDismissJordan = () => {
        if (aim1) recordSwipeMutation({ toClerkId: aim1.targetClerkId, direction: 'left' });
        Animated.parallel([
            Animated.timing(cardJordanX, { toValue: -420, duration: 220, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
            Animated.timing(cardJordanOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
        ]).start(() => {
            const nextIdx = nextIdxRef.current;
            if (nextIdx < allProfiles.length) {
                nextIdxRef.current = nextIdx + 1;
                cardJordanX.setValue(0);
                cardJordanOpacity.setValue(0);
                cardJordanY.setValue(20);
                setSlot1Idx(nextIdx);
                setIsJordanFavorited(false);
                Animated.parallel([
                    Animated.timing(cardJordanOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
                    Animated.timing(cardJordanY, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
                ]).start();
            } else {
                setSlot1Visible(false);
            }
        });
    };

    useEffect(() => {
        Animated.stagger(100, [
            Animated.parallel([
                Animated.timing(title1Y, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
                Animated.timing(title1Opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
            ]),
            Animated.parallel([
                Animated.timing(title2Y, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
                Animated.timing(title2Opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
            ]),
            Animated.parallel([
                Animated.timing(title3Y, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
                Animated.timing(title3Opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
            ]),
            Animated.parallel([
                Animated.timing(title4Y, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
                Animated.timing(title4Opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
            ]),
        ]).start();

        Animated.sequence([
            Animated.delay(1400),
            Animated.parallel([
                Animated.timing(askBarOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.timing(askBarY, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            ]),
        ]).start();

        const createPulse = (anim: Animated.Value, delay: number) =>
            Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(anim, { toValue: 1.4, duration: 500, useNativeDriver: true }),
                    Animated.timing(anim, { toValue: 1, duration: 500, useNativeDriver: true }),
                ])
            );
        createPulse(dotPulse1, 0).start();
        createPulse(dotPulse2, 150).start();
        createPulse(dotPulse3, 300).start();
    }, []);

    // ─── Ask Align bar state ───────────────────────────────────────────────────
    const [homeInputText, setHomeInputText] = useState('');
    const [homeIsRecording, setHomeIsRecording] = useState(false);
    const homeRecordingRef = useRef<Audio.Recording | null>(null);
    const homeRecordingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        return () => {
            if (homeRecordingRef.current) {
                homeRecordingRef.current.stopAndUnloadAsync().catch(() => { });
            }
            if (homeRecordingTimerRef.current) clearTimeout(homeRecordingTimerRef.current);
        };
    }, []);

    const stopHomeRecording = async () => {
        if (homeRecordingTimerRef.current) {
            clearTimeout(homeRecordingTimerRef.current);
            homeRecordingTimerRef.current = null;
        }
        setHomeIsRecording(false);
        if (!homeRecordingRef.current) return;
        let uri: string | null = null;
        try {
            await homeRecordingRef.current.stopAndUnloadAsync();
            uri = homeRecordingRef.current.getURI();
        } catch { /* already stopped */ }
        homeRecordingRef.current = null;
        if (!uri) return;
        try {
            const transcribed = await transcribeAudio(uri);
            if (transcribed.trim()) {
                setHomeInputText(transcribed.trim());
                inputRef.current?.focus();
            }
        } catch {
            Alert.alert('Error', 'Could not understand audio, please try typing instead.');
        }
    };

    const handleHomeMicPress = async () => {
        if (homeIsRecording) { await stopHomeRecording(); return; }
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Microphone Permission', 'Please allow microphone access to use voice input.');
            return;
        }
        await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
        const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
        homeRecordingRef.current = recording;
        setHomeIsRecording(true);
        homeRecordingTimerRef.current = setTimeout(() => stopHomeRecording(), 10000);
    };

    const handleHomeInputSend = async () => {
        const text = homeInputText.trim();
        if (!text) return;
        setHomeInputText('');
        navigation.navigate('TabMatchmaker');
        try { await sendMessageAction({ text }); } catch { /* ignore — message queued for AI screen */ }
    };

    return (
        <View style={{ flex: 1, backgroundColor: CREAM }}>
            <StatusBar style="dark" />
            <View style={{ flex: 1, paddingTop: insets.top }}>
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Orange Accent Dot */}
                    <View style={{ position: 'absolute', top: 16, right: 0, width: 32, height: 32, borderRadius: 16, backgroundColor: ORANGE }} />

                    {/* Hero Title */}
                    <View style={{ marginTop: 20, marginBottom: 24 }}>
                        {[
                            { text: 'WHO IS', opacity: title1Opacity, y: title1Y },
                            { text: 'MY BEST', opacity: title2Opacity, y: title2Y },
                            { text: 'MATCH', opacity: title3Opacity, y: title3Y },
                            { text: 'TODAY?', opacity: title4Opacity, y: title4Y },
                        ].map(({ text, opacity, y }) => (
                            <Animated.Text
                                key={text}
                                style={{
                                    fontSize: 64, fontWeight: '900', color: BLACK,
                                    lineHeight: 60, letterSpacing: -2, textTransform: 'uppercase',
                                    opacity, transform: [{ translateY: y }],
                                }}
                            >
                                {text}
                            </Animated.Text>
                        ))}
                    </View>

                    {/* Loading dots — only while discovery data is loading */}
                    {discoveryProfiles === undefined && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 28, gap: 6 }}>
                            <Animated.View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#FFD600', transform: [{ scale: dotPulse1 }] }} />
                            <Animated.View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#E03A2F', transform: [{ scale: dotPulse2 }] }} />
                            <Animated.View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#00C853', transform: [{ scale: dotPulse3 }] }} />
                            <Text style={{ fontSize: 11, fontWeight: '700', color: BLACK, letterSpacing: 2, textTransform: 'uppercase', marginLeft: 6 }}>
                                ALIGN IS FINDING...
                            </Text>
                        </View>
                    )}

                    {/* Empty state */}
                    {aims !== undefined && discoveryProfiles !== undefined && allProfiles.length === 0 && (
                        <View style={{ paddingVertical: 32 }}>
                            <Text style={{ fontSize: 18, fontWeight: '600', color: 'rgba(13,13,13,0.35)', textAlign: 'center', lineHeight: 28 }}>
                                Align is analyzing your profile.{'\n'}Check back soon.
                            </Text>
                        </View>
                    )}

                    {/* Top Match Card */}
                    {aim0 && (
                        <Pressable
                            onPressIn={() => Animated.spring(cardAlexScale, { toValue: 0.98, useNativeDriver: true }).start()}
                            onPressOut={() => Animated.spring(cardAlexScale, { toValue: 1, useNativeDriver: true }).start()}
                            onPress={() => navigation.navigate('ProfileDetail', { userId: aim0.targetUserId, photos: aim0.photos, compatibilityScore: aim0.compatibilityScore ?? 0 })}
                        >
                            <Animated.View
                                style={{
                                    backgroundColor: BLACK, borderRadius: 24, padding: 24, marginBottom: 16,
                                    opacity: cardAlexOpacity,
                                    transform: [{ translateY: cardAlexY }, { translateX: cardAlexX }, { scale: cardAlexScale }],
                                }}
                            >
                                {/* Top row: label + score + photo */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 10, fontWeight: '700', color: '#999', letterSpacing: 3, textTransform: 'uppercase' }}>
                                            TOP ALIGNMENT
                                        </Text>
                                        <Text style={{ fontSize: 36, fontWeight: '900', color: '#FFFFFF', letterSpacing: -1, lineHeight: 36, marginTop: 4 }}>
                                            {aim0.compatibilityScore}%
                                        </Text>
                                    </View>
                                    <PhotoOrInitial photos={aim0.photos} name={aim0.firstName} size={48} />
                                </View>

                                <Text style={{ fontSize: 52, fontWeight: '900', color: '#FFFFFF', letterSpacing: -2, lineHeight: 52, marginTop: 16 }}>
                                    {aim0.firstName.toUpperCase()}
                                </Text>

                                {aim0.explanation ? (
                                    <Text style={{ fontSize: 14, color: '#AAAAAA', marginTop: 12, lineHeight: 20 }}>
                                        {aim0.explanation}
                                    </Text>
                                ) : null}

                                {/* Action Buttons */}
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 16 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                        <View style={{ flexDirection: 'row', gap: 8 }}>
                                            <TouchableOpacity
                                                activeOpacity={0.8}
                                                onPress={(e) => { e.stopPropagation?.(); handleDismissAlex(); }}
                                                style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' }}
                                            >
                                                <X size={20} strokeWidth={1.5} color="rgba(245,240,235,0.4)" />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                activeOpacity={1}
                                                onPress={async () => {
                                                    if (!aim0) return;
                                                    const willFavorite = !isAlexFavorited;
                                                    if (willFavorite) {
                                                        const result = await addFavoriteMutation({ targetClerkId: aim0.targetClerkId });
                                                        if (!result.ok) {
                                                            Alert.alert('Favorites Full', 'You can only have 3 favorites. Remove one to add a new favorite.');
                                                            return;
                                                        }
                                                    } else {
                                                        await removeFavoriteMutation({ targetClerkId: aim0.targetClerkId });
                                                    }
                                                    animateStar(alexStarScale, alexStarRotation, isAlexFavorited);
                                                    setIsAlexFavorited(willFavorite);
                                                }}
                                            >
                                                <Animated.View style={{
                                                    width: 48, height: 48, borderRadius: 24,
                                                    backgroundColor: isAlexFavorited ? ORANGE : 'rgba(255,255,255,0.05)',
                                                    alignItems: 'center', justifyContent: 'center',
                                                    transform: [
                                                        { scale: alexStarScale },
                                                        { rotate: alexStarRotation.interpolate({ inputRange: [-1, 0, 1], outputRange: ['-20deg', '0deg', '20deg'] }) },
                                                    ],
                                                }}>
                                                    <Star size={20} strokeWidth={1.5}
                                                        color={isAlexFavorited ? '#F5F0EB' : 'rgba(245,240,235,0.4)'}
                                                        fill={isAlexFavorited ? '#F5F0EB' : 'transparent'}
                                                    />
                                                </Animated.View>
                                            </TouchableOpacity>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => navigation.navigate('ProfileDetail', { userId: aim0.targetUserId, photos: aim0.photos, compatibilityScore: aim0.compatibilityScore ?? 0 })}
                                            style={{ backgroundColor: CREAM, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 24 }}
                                        >
                                            <Text style={{ fontSize: 10, fontWeight: '800', color: BLACK, letterSpacing: 0.5, textTransform: 'uppercase', textAlign: 'center' }}>
                                                VIEW PROFILE
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Animated.View>
                        </Pressable>
                    )}

                    {/* Runner Up Card */}
                    {aim1 && (
                        <Pressable
                            onPressIn={() => Animated.spring(cardJordanScale, { toValue: 0.98, useNativeDriver: true }).start()}
                            onPressOut={() => Animated.spring(cardJordanScale, { toValue: 1, useNativeDriver: true }).start()}
                            onPress={() => navigation.navigate('ProfileDetail', { userId: aim1.targetUserId, photos: aim1.photos, compatibilityScore: aim1.compatibilityScore ?? 0 })}
                        >
                            <Animated.View
                                style={{
                                    backgroundColor: BLACK, borderRadius: 24, padding: 24, marginBottom: 16,
                                    opacity: cardJordanOpacity,
                                    transform: [{ translateY: cardJordanY }, { translateX: cardJordanX }, { scale: cardJordanScale }],
                                }}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 10, fontWeight: '700', color: '#666', letterSpacing: 3, textTransform: 'uppercase' }}>
                                            RUNNER UP
                                        </Text>
                                        <Text style={{ fontSize: 36, fontWeight: '900', color: '#FFFFFF', letterSpacing: -1, lineHeight: 36, marginTop: 4 }}>
                                            {aim1.compatibilityScore}%
                                        </Text>
                                    </View>
                                    <PhotoOrInitial photos={aim1.photos} name={aim1.firstName} size={48} />
                                </View>

                                <Text style={{ fontSize: 52, fontWeight: '900', color: '#FFFFFF', letterSpacing: -2, lineHeight: 52, marginTop: 16 }}>
                                    {aim1.firstName.toUpperCase()}
                                </Text>

                                {aim1.explanation ? (
                                    <Text style={{ fontSize: 14, color: '#AAAAAA', marginTop: 12, lineHeight: 20 }}>
                                        {aim1.explanation}
                                    </Text>
                                ) : null}

                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 16 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                        <View style={{ flexDirection: 'row', gap: 8 }}>
                                            <TouchableOpacity
                                                activeOpacity={0.8}
                                                onPress={() => handleDismissJordan()}
                                                style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' }}
                                            >
                                                <X size={20} strokeWidth={1.5} color="rgba(245,240,235,0.4)" />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                activeOpacity={1}
                                                onPress={async () => {
                                                    if (!aim1) return;
                                                    const willFavorite = !isJordanFavorited;
                                                    if (willFavorite) {
                                                        const result = await addFavoriteMutation({ targetClerkId: aim1.targetClerkId });
                                                        if (!result.ok) {
                                                            Alert.alert('Favorites Full', 'You can only have 3 favorites. Remove one to add a new favorite.');
                                                            return;
                                                        }
                                                    } else {
                                                        await removeFavoriteMutation({ targetClerkId: aim1.targetClerkId });
                                                    }
                                                    animateStar(jordanStarScale, jordanStarRotation, isJordanFavorited);
                                                    setIsJordanFavorited(willFavorite);
                                                }}
                                            >
                                                <Animated.View style={{
                                                    width: 48, height: 48, borderRadius: 24,
                                                    backgroundColor: isJordanFavorited ? ORANGE : 'rgba(255,255,255,0.05)',
                                                    alignItems: 'center', justifyContent: 'center',
                                                    transform: [
                                                        { scale: jordanStarScale },
                                                        { rotate: jordanStarRotation.interpolate({ inputRange: [-1, 0, 1], outputRange: ['-20deg', '0deg', '20deg'] }) },
                                                    ],
                                                }}>
                                                    <Star size={20} strokeWidth={1.5}
                                                        color={isJordanFavorited ? '#F5F0EB' : 'rgba(245,240,235,0.4)'}
                                                        fill={isJordanFavorited ? '#F5F0EB' : 'transparent'}
                                                    />
                                                </Animated.View>
                                            </TouchableOpacity>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => navigation.navigate('ProfileDetail', { userId: aim1.targetUserId, photos: aim1.photos, compatibilityScore: aim1.compatibilityScore ?? 0 })}
                                            style={{ backgroundColor: CREAM, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 24 }}
                                        >
                                            <Text style={{ fontSize: 10, fontWeight: '800', color: BLACK, letterSpacing: 0.5, textTransform: 'uppercase', textAlign: 'center' }}>
                                                VIEW PROFILE
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Animated.View>
                        </Pressable>
                    )}
                </ScrollView>

                {/* Floating Ask Align Bar — real TextInput with voice */}
                <Animated.View
                    style={{
                        position: 'absolute',
                        bottom: 12, left: 16, right: 16,
                        flexDirection: 'row', alignItems: 'center',
                        backgroundColor: '#FFFFFF', height: 80, borderRadius: 40, paddingHorizontal: 20,
                        opacity: askBarOpacity, transform: [{ translateY: askBarY }],
                        shadowColor: '#000', shadowOffset: { width: 0, height: 25 },
                        shadowOpacity: 0.25, shadowRadius: 50, elevation: 20,
                    }}
                >
                    <TouchableOpacity onPress={handleHomeMicPress} style={{ paddingHorizontal: 8 }}>
                        <Ionicons
                            name={homeIsRecording ? 'stop-circle' : 'mic'}
                            size={20}
                            color={homeIsRecording ? ORANGE : 'rgba(13,13,13,0.3)'}
                        />
                    </TouchableOpacity>
                    <TextInput
                        ref={inputRef}
                        style={{
                            flex: 1,
                            fontSize: 11, fontWeight: '800',
                            color: 'rgba(13,13,13,0.7)',
                            textTransform: 'uppercase',
                            letterSpacing: 2,
                            marginHorizontal: 4,
                        }}
                        placeholder={homeIsRecording ? 'RECORDING...' : 'ASK ALIGN ANYTHING...'}
                        placeholderTextColor="rgba(13,13,13,0.4)"
                        value={homeInputText}
                        onChangeText={setHomeInputText}
                        onSubmitEditing={handleHomeInputSend}
                        returnKeyType="send"
                        selectionColor={ORANGE}
                    />
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleHomeInputSend}
                        style={{
                            width: 48, height: 48, borderRadius: 24,
                            backgroundColor: homeInputText.trim() ? ORANGE : BLACK,
                            alignItems: 'center', justifyContent: 'center',
                        }}
                    >
                        <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </View>
    );
}
