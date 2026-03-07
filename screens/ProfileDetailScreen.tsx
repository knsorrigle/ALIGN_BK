import React, { useRef, useState, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    Animated,
    Dimensions,
    StyleSheet,
    Modal,
    FlatList,
    NativeSyntheticEvent,
    NativeScrollEvent,
    Platform,
    Easing,
    Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Zap } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { BLACK, CREAM, ORANGE } from '../constants/colors';

const { width: W, height: H } = Dimensions.get('window');
const HERO_H = H * 0.58;

// ─── Mock data ────────────────────────────────────────────────────────────────
const PROFILE = {
    name: 'MAYA',
    age: 27,
    location: 'NEW YORK, NY',
    matchPct: 94,
    photos: [
        'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80',
        'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80',
        'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&q=80',
    ],
    aiReason:
        'Maya scores 94% because your core values — creative independence, intellectual depth, and a preference for authentic over performative — are near-perfectly aligned.',
    voicePrompt: 'The most underrated thing about me…',
    bio: 'UX researcher obsessed with human behaviour and clean systems. Morning runs, afternoon reads, late-night playlists. Here for a real connection, not a situationship.',
    identity: [
        { category: 'PRONOUNS', value: 'She / Her' },
        { category: 'SEXUALITY', value: 'Straight' },
        { category: 'INTENT', value: 'Long-Term' },
        { category: 'FAMILY', value: 'Open to kids' },
        { category: 'RELIGION', value: 'Agnostic' },
        { category: 'POLITICS', value: 'Progressive' },
    ],
    lifestyle: [
        { icon: 'wine-outline' as const, label: 'Drinks', value: 'Socially' },
        { icon: 'leaf-outline' as const, label: 'Smokes', value: 'Never' },
        { icon: 'barbell-outline' as const, label: 'Fitness', value: 'Daily' },
        { icon: 'moon-outline' as const, label: 'Sleep', value: 'Night owl' },
    ],
    background: [
        { label: 'EDUCATION', value: 'Columbia University' },
        { label: 'INDUSTRY', value: 'Product Design' },
        { label: 'LANGUAGE', value: 'English, Spanish' },
        { label: 'BASED IN', value: 'Brooklyn, NY' },
    ],
    tags: ['Design systems', 'Cognitive science', 'Jazz walks', 'Film photography', 'Architecture'],
    prompts: [
        {
            question: "I'm convinced that...",
            answer: "Most productivity apps actually exist just to make us feel busy instead of genuinely effective.",
        },
        {
            question: "My simple pleasure is...",
            answer: "Finding a perfectly formatted spreadsheet that someone else already built.",
        },
        {
            question: "Together we could...",
            answer: "Debate whether brutalism is beautiful or a crime against humanity while drinking overpriced coffee.",
        },
    ],
};

// ─── Photo Carousel Dots ────────────────────────────────────────────────────────
function CarouselDot({ active }: { active: boolean }) {
    const anim = useRef(new Animated.Value(active ? 1 : 0)).current;

    React.useEffect(() => {
        Animated.timing(anim, {
            toValue: active ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [active]);

    const width = anim.interpolate({ inputRange: [0, 1], outputRange: [4, 16] });
    const backgroundColor = anim.interpolate({ inputRange: [0, 1], outputRange: ['rgba(255,255,255,0.5)', ORANGE] });

    return (
        <Animated.View style={[styles.progressDot, { width, backgroundColor, borderRadius: 2, marginHorizontal: 2 }]} />
    );
}

// ─── Hero Photo Carousel ──────────────────────────────────────────────────────
function PhotoCarousel({ photos }: { photos: string[] }) {
    const [index, setIndex] = useState(0);
    const flatRef = useRef<FlatList>(null);

    const onScroll = (e: any) => {
        const i = Math.round(e.nativeEvent.contentOffset.x / W);
        if (i !== index) setIndex(i);
    };

    const goTo = (dir: 1 | -1) => {
        const next = Math.max(0, Math.min(photos.length - 1, index + dir));
        flatRef.current?.scrollToIndex({ index: next, animated: true });
    };

    return (
        <View style={{ height: HERO_H }}>
            <FlatList
                ref={flatRef}
                data={photos}
                horizontal
                pagingEnabled
                onScroll={onScroll}
                scrollEventThrottle={16}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, i) => String(i)}
                renderItem={({ item }) => (
                    <Image source={{ uri: item as string }} style={{ width: W, height: HERO_H }} resizeMode="cover" />
                )}
            />

            {/* Dark gradient overlay */}
            <View style={styles.heroGradient} pointerEvents="none" />

            {/* Photo counter pill */}
            <View style={styles.counterPill}>
                <Text style={styles.counterText}>{index + 1} / {photos.length}</Text>
            </View>

            {/* Chevron navigation */}
            {index > 0 && (
                <TouchableOpacity style={[styles.chevron, styles.chevronLeft]} onPress={() => goTo(-1)} activeOpacity={0.8}>
                    <Ionicons name="chevron-back" size={18} color="#FFFFFF" />
                </TouchableOpacity>
            )}
            {index < photos.length - 1 && (
                <TouchableOpacity style={[styles.chevron, styles.chevronRight]} onPress={() => goTo(1)} activeOpacity={0.8}>
                    <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
                </TouchableOpacity>
            )}

            {/* Name / Age / Location overlay */}
            <View style={styles.heroTextBlock}>
                <View style={styles.progressRow}>
                    {photos.map((_, i) => (
                        <CarouselDot key={i} active={i === index} />
                    ))}
                </View>
                <Text style={styles.heroName} allowFontScaling={false}>{PROFILE.name}, {PROFILE.age}</Text>
                <Text style={styles.heroLocation} allowFontScaling={false}>{PROFILE.location}</Text>
            </View>
        </View>
    );
}

// ─── Section Label ─────────────────────────────────────────────────────────────
function SectionLabel({ text }: { text: string }) {
    return <Text style={styles.sectionLabel}>{text}</Text>;
}

// ─── Light Card wrapper ────────────────────────────────────────────────────────
function LightCard({ children, style }: { children: React.ReactNode; style?: object }) {
    return <View style={[styles.lightCard, style]}>{children}</View>;
}

// ─── Toast Notification ────────────────────────────────────────────────────────
function ToastNotification({ msg, visible }: { msg: string; visible: boolean }) {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(20)).current;

    React.useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
                Animated.spring(translateY, { toValue: 0, damping: 15, stiffness: 200, useNativeDriver: true })
            ]).start();
        } else {
            Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start();
        }
    }, [visible]);

    return (
        <Animated.View style={[styles.toast, { opacity, transform: [{ translateY }] }]} pointerEvents="none">
            <Zap size={14} color={ORANGE} fill={ORANGE} />
            <Text style={styles.toastText}>{msg}</Text>
        </Animated.View>
    );
}

// ─── AP Send Bottom Sheet ──────────────────────────────────────────────────────
function ApSendSheet({ visible, onDismiss, onConfirm, profileName, profilePhoto }: { visible: boolean; onDismiss: () => void; onConfirm: (count: number) => void; profileName: string; profilePhoto: string }) {
    const overlayOpacity = useRef(new Animated.Value(0)).current;
    const sheetY = useRef(new Animated.Value(500)).current;
    const [apCount, setApCount] = useState(1);

    React.useEffect(() => {
        if (visible) {
            setApCount(1);
            Animated.timing(overlayOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
            Animated.spring(sheetY, { toValue: 0, damping: 25, stiffness: 120, useNativeDriver: true }).start();
        } else {
            overlayOpacity.setValue(0);
            sheetY.setValue(500);
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <Modal transparent animationType="none" visible={visible} onRequestClose={onDismiss}>
            <Animated.View style={[styles.sheetBackdrop, { opacity: overlayOpacity }]}>
                <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetY }], paddingBottom: 40 }]}>
                    <TouchableOpacity style={{ position: 'absolute', top: 24, right: 24, width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }} onPress={onDismiss} activeOpacity={0.8}>
                        <Ionicons name="close" size={20} color="rgba(13,13,13,0.4)" />
                    </TouchableOpacity>

                    {/* Header: Photo and Name */}
                    <Image source={{ uri: profilePhoto }} style={{ width: 64, height: 64, borderRadius: 32, marginBottom: 16 }} />
                    <Text style={{ fontSize: 24, fontWeight: '900', color: BLACK, textTransform: 'uppercase', marginBottom: 4, letterSpacing: -1 }}>{profileName}</Text>
                    <Text style={{ fontSize: 10, fontWeight: '800', color: 'rgba(13,13,13,0.4)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 32 }}>CURRENT BALANCE: 50 APS</Text>

                    {/* Stepper */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 32, marginBottom: 40 }}>
                        <TouchableOpacity style={styles.stepperBtn} onPress={() => setApCount(Math.max(1, apCount - 1))} activeOpacity={0.7}>
                            <Ionicons name="remove" size={24} color={BLACK} />
                        </TouchableOpacity>

                        <Text style={{ fontSize: 48, fontWeight: '900', color: BLACK, minWidth: 60, textAlign: 'center' }}>{apCount}</Text>

                        <TouchableOpacity style={styles.stepperBtn} onPress={() => setApCount(apCount + 1)} activeOpacity={0.7}>
                            <Ionicons name="add" size={24} color={BLACK} />
                        </TouchableOpacity>
                    </View>

                    {/* Action Button */}
                    <TouchableOpacity style={styles.sheetBtn} onPress={() => onConfirm(apCount)} activeOpacity={0.85}>
                        <Zap size={16} color={CREAM} fill={CREAM} />
                        <Text style={styles.sheetBtnText}>SEND APS</Text>
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
}

// ─── Success Bottom Sheet ──────────────────────────────────────────────────────
function SuccessSheet({ visible, onDismiss }: { visible: boolean; onDismiss: () => void }) {
    // Phase 1: Overlay fade
    const overlayOpacity = useRef(new Animated.Value(0)).current;
    // Phase 2: Sheet slide up
    const sheetY = useRef(new Animated.Value(400)).current;
    // Phase 3: Avatar scale/fade
    const avatarScale = useRef(new Animated.Value(0.8)).current;
    const avatarOpacity = useRef(new Animated.Value(0)).current;
    // Phase 4: Checkmark pop
    const checkScale = useRef(new Animated.Value(0)).current;
    const checkRotate = useRef(new Animated.Value(-20)).current;
    // Phase 5: Text & Buttons
    const textY = useRef(new Animated.Value(20)).current;
    const textOpacity = useRef(new Animated.Value(0)).current;
    const btnOpacity = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (visible) {
            // Phase 1: Overlay
            Animated.timing(overlayOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();

            // Phase 2: Sheet slide (spring: damping 25, stiffness 120)
            Animated.spring(sheetY, { toValue: 0, damping: 25, stiffness: 120, useNativeDriver: true }).start();

            // Phase 3: Avatar (delay 200ms)
            Animated.sequence([
                Animated.delay(200),
                Animated.parallel([
                    Animated.timing(avatarOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
                    Animated.spring(avatarScale, { toValue: 1, friction: 8, tension: 50, useNativeDriver: true })
                ])
            ]).start();

            // Phase 4: Checkmark snap (damping 12, delay 400ms)
            Animated.sequence([
                Animated.delay(400),
                Animated.parallel([
                    Animated.spring(checkScale, { toValue: 1, damping: 12, stiffness: 150, useNativeDriver: true }),
                    Animated.spring(checkRotate, { toValue: 0, damping: 12, stiffness: 150, useNativeDriver: true })
                ])
            ]).start();

            // Phase 5: Text & Buttons (delay 500ms)
            Animated.sequence([
                Animated.delay(500),
                Animated.parallel([
                    Animated.timing(textOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
                    Animated.timing(textY, { toValue: 0, duration: 300, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
                    Animated.timing(btnOpacity, { toValue: 1, duration: 300, useNativeDriver: true })
                ])
            ]).start();

        } else {
            // Reset state
            overlayOpacity.setValue(0);
            sheetY.setValue(400);
            avatarScale.setValue(0.8);
            avatarOpacity.setValue(0);
            checkScale.setValue(0);
            checkRotate.setValue(-20);
            textY.setValue(20);
            textOpacity.setValue(0);
            btnOpacity.setValue(0);
        }
    }, [visible]);

    if (!visible) return null;

    const checkRotation = checkRotate.interpolate({
        inputRange: [-20, 0],
        outputRange: ['-20deg', '0deg']
    });

    return (
        <Modal transparent animationType="none" visible={visible} onRequestClose={onDismiss}>
            <Animated.View style={[styles.sheetBackdrop, { opacity: overlayOpacity }]}>
                <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetY }] }]}>

                    {/* Phase 3: Avatar */}
                    <Animated.View style={[styles.sheetAvatarRing, { opacity: avatarOpacity, transform: [{ scale: avatarScale }] }]}>
                        <Image source={{ uri: PROFILE.photos[0] }} style={styles.sheetAvatar} />

                        {/* Phase 4: Checkmark */}
                        <Animated.View style={[styles.sheetCheck, { transform: [{ scale: checkScale }, { rotate: checkRotation }] }]}>
                            <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                        </Animated.View>
                    </Animated.View>

                    {/* Phase 5: Text block */}
                    <Animated.View style={{ alignItems: 'center', opacity: textOpacity, transform: [{ translateY: textY }] }}>
                        <Text style={styles.sheetTitle}>REQUEST{'\n'}SENT.</Text>
                        <View style={styles.sheetTagRow}>
                            {['INTENTIONAL', 'ALIGNED'].map((t) => (
                                <View key={t} style={styles.sheetTag}>
                                    <Text style={styles.sheetTagText}>{t}</Text>
                                </View>
                            ))}
                        </View>
                        <Text style={styles.sheetSub}>
                            Your request is on its way. If {PROFILE.name} accepts, you'll both be notified instantly.
                        </Text>
                    </Animated.View>

                    {/* Phase 5: Button */}
                    <Animated.View style={{ width: '100%', opacity: btnOpacity, marginTop: 12 }}>
                        <TouchableOpacity style={styles.sheetBtn} onPress={onDismiss} activeOpacity={0.85}>
                            <Text style={styles.sheetBtnText}>CONTINUE BROWSING</Text>
                            <Ionicons name="arrow-forward" size={16} color={CREAM} />
                        </TouchableOpacity>
                    </Animated.View>

                </Animated.View>
            </Animated.View>
        </Modal>
    );
}

// ─── Main Screen ───────────────────────────────────────────────────────────────
export default function ProfileDetailScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const [success, setSuccess] = useState(false);

    // AP Modal state
    const [apSheetVisible, setApSheetVisible] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMsg, setToastMsg] = useState('');

    // Send Request button hover anim
    const sendAnim = useRef(new Animated.Value(0)).current;
    const sendBg = sendAnim.interpolate({ inputRange: [0, 1], outputRange: [BLACK, ORANGE] });

    // Custom Screen Modal entry physics (damping 25, stiffness 120)
    const [rendered, setRendered] = useState(false);
    const translateY = useRef(new Animated.Value(H)).current;
    const bgOpacity = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        setRendered(true);
        Animated.parallel([
            Animated.timing(bgOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.spring(translateY, {
                toValue: 0,
                damping: 25,
                stiffness: 120,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const handleClose = () => {
        Animated.parallel([
            Animated.timing(bgOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
            Animated.timing(translateY, { toValue: H, duration: 250, easing: Easing.in(Easing.ease), useNativeDriver: true })
        ]).start(() => {
            navigation.goBack();
        });
    };

    const handleSendApsConfirm = (count: number) => {
        Alert.alert(
            "Send APs",
            `Are you sure you want to send ${count} APs to ${PROFILE.name}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Send",
                    onPress: () => {
                        setApSheetVisible(false);
                        setToastMsg(`APS SENT TO ${PROFILE.name}`);
                        setToastVisible(true);
                        setTimeout(() => setToastVisible(false), 3000);
                    }
                }
            ]
        );
    };

    if (!rendered) return null;

    return (
        <View style={styles.root}>
            <Animated.View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#000000', opacity: bgOpacity }]} />
            <Animated.View style={[styles.root, { backgroundColor: CREAM, transform: [{ translateY }] }]}>
                <StatusBar style="light" />

                {/* Back + Report overlay buttons */}
                <View style={[styles.topBar, { top: insets.top + 8 }]}>
                    <TouchableOpacity style={styles.iconCircle} onPress={handleClose} activeOpacity={0.8}>
                        <Ionicons name="chevron-down" size={24} color={BLACK} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.navigate('Report')} activeOpacity={0.8}>
                        <Ionicons name="flag-outline" size={18} color={BLACK} />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingBottom: 120 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* ── Hero ──────────────────────────────────────────────── */}
                    <PhotoCarousel photos={PROFILE.photos} />

                    <View style={styles.content}>
                        {/* ── AI Alignment Card ─────────────────────────────── */}
                        <View style={styles.aiCard}>
                            <View style={styles.aiTopRow}>
                                <View style={styles.greenDot} />
                                <Text style={styles.aiLabel}>AI ALIGNMENT SCORE</Text>
                            </View>
                            <Text style={styles.aiPct}>{PROFILE.matchPct}%</Text>
                            <Text style={styles.aiReason}>{PROFILE.aiReason}</Text>
                        </View>

                        {/* ── Voice Prompt ──────────────────────────────────── */}
                        <SectionLabel text="VOICE PROMPT" />
                        <LightCard>
                            <View style={styles.voiceRow}>
                                <TouchableOpacity style={styles.playBtn} activeOpacity={0.8}>
                                    <Ionicons name="play" size={18} color={CREAM} />
                                </TouchableOpacity>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.voiceQ}>"{PROFILE.voicePrompt}"</Text>
                                    <View style={styles.waveform}>
                                        {Array.from({ length: 28 }).map((_, i) => (
                                            <View
                                                key={i}
                                                style={[
                                                    styles.waveBar,
                                                    {
                                                        height: 4 + Math.sin(i * 0.7) * 10 + Math.random() * 6,
                                                        backgroundColor: i < 10 ? ORANGE : 'rgba(13,13,13,0.18)',
                                                    },
                                                ]}
                                            />
                                        ))}
                                    </View>
                                </View>
                            </View>
                        </LightCard>

                        {/* ── Bio ───────────────────────────────────────────── */}
                        <SectionLabel text="ABOUT" />
                        <LightCard>
                            <Text style={styles.bioText}>{PROFILE.bio}</Text>
                        </LightCard>

                        {/* ── Written Prompts ───────────────────────────────── */}
                        <SectionLabel text="PROMPTS" />
                        <LightCard>
                            {PROFILE.prompts.map((prompt, index) => (
                                <View
                                    key={index}
                                    style={index < PROFILE.prompts.length - 1 ? styles.promptBorder : undefined}
                                >
                                    <Text style={styles.promptQ}>{prompt.question}</Text>
                                    <Text style={styles.promptA}>{prompt.answer}</Text>
                                </View>
                            ))}
                        </LightCard>

                        {/* ── Tags ──────────────────────────────────────────── */}
                        <SectionLabel text="INTERESTS" />
                        <View style={styles.tagWrap}>
                            {PROFILE.tags.map((t) => (
                                <View key={t} style={styles.tag}>
                                    <Text style={styles.tagText}>{t}</Text>
                                </View>
                            ))}
                        </View>

                        {/* ── Identity Pills ────────────────────────────────── */}
                        <SectionLabel text="IDENTITY" />
                        <View style={styles.tagWrap}>
                            {PROFILE.identity.map((item) => (
                                <View key={item.category} style={styles.identityPill}>
                                    <Text style={styles.pillCategory}>{item.category}</Text>
                                    <Text style={styles.pillValue}>{item.value}</Text>
                                </View>
                            ))}
                        </View>

                        {/* ── Lifestyle Grid ────────────────────────────────── */}
                        <SectionLabel text="LIFESTYLE" />
                        <View style={styles.lifestyleGrid}>
                            {PROFILE.lifestyle.map((item) => (
                                <LightCard key={item.label} style={styles.lifestyleCell}>
                                    <Ionicons name={item.icon} size={20} color="rgba(13,13,13,0.4)" />
                                    <Text style={styles.lifestyleLabel}>{item.label}</Text>
                                    <Text style={styles.lifestyleValue}>{item.value}</Text>
                                </LightCard>
                            ))}
                        </View>

                        {/* ── Background Rows ───────────────────────────────── */}
                        <SectionLabel text="BACKGROUND" />
                        <LightCard>
                            {PROFILE.background.map((item, i) => (
                                <View
                                    key={item.label}
                                    style={[
                                        styles.bgRow,
                                        i < PROFILE.background.length - 1 && styles.bgRowBorder,
                                    ]}
                                >
                                    <Text style={styles.bgLabel}>{item.label}</Text>
                                    <Text style={styles.bgValue}>{item.value}</Text>
                                </View>
                            ))}
                        </LightCard>
                    </View>
                </ScrollView>

                {/* ── Floating Action Bar ──────────────────────────────────── */}
                <View style={[styles.actionBar, { paddingBottom: insets.bottom + 16 }]}>
                    {/* Pass button */}
                    <TouchableOpacity style={styles.passBtn} activeOpacity={0.8} onPress={handleClose}>
                        <Ionicons name="close" size={24} color={BLACK} />
                    </TouchableOpacity>

                    {/* Send APs */}
                    <TouchableOpacity
                        style={styles.apBtn}
                        activeOpacity={0.8}
                        onPress={() => setApSheetVisible(true)}
                    >
                        <Zap size={14} color={CREAM} fill={CREAM} />
                        <Text style={styles.apBtnText}>SEND APS</Text>
                    </TouchableOpacity>

                    {/* Send Request */}
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        activeOpacity={1}
                        onPressIn={() => Animated.timing(sendAnim, { toValue: 1, duration: 180, useNativeDriver: false }).start()}
                        onPressOut={() => Animated.timing(sendAnim, { toValue: 0, duration: 220, useNativeDriver: false }).start()}
                        onPress={() => setSuccess(true)}
                    >
                        <Animated.View style={[styles.sendBtn, { backgroundColor: sendBg }]}>
                            <Text style={styles.sendBtnText}>SEND REQUEST</Text>
                            <Ionicons name="arrow-forward" size={16} color={CREAM} />
                        </Animated.View>
                    </TouchableOpacity>
                </View>

                {/* ── Success Sheet ────────────────────────────────────────── */}
                <SuccessSheet visible={success} onDismiss={() => { setSuccess(false); handleClose(); }} />

                {/* ── AP Send Sheet ────────────────────────────────────────── */}
                <ApSendSheet
                    visible={apSheetVisible}
                    onDismiss={() => setApSheetVisible(false)}
                    onConfirm={handleSendApsConfirm}
                    profileName={PROFILE.name}
                    profilePhoto={PROFILE.photos[0]}
                />
            </Animated.View>

            {/* Context-level Toast */}
            <ToastNotification msg={toastMsg} visible={toastVisible} />
        </View>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    root: { flex: 1 },

    // Top back/report bar
    topBar: {
        position: 'absolute',
        left: 16,
        right: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        zIndex: 50,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(245,240,235,0.9)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Hero carousel
    heroGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: HERO_H * 0.55,
        backgroundColor: 'transparent',
    },
    counterPill: {
        position: 'absolute',
        top: 16,
        alignSelf: 'center',
        backgroundColor: 'rgba(13,13,13,0.45)',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 100,
    },
    counterText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 1,
    },
    chevron: {
        position: 'absolute',
        top: '50%',
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(13,13,13,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -18,
    },
    chevronLeft: { left: 12 },
    chevronRight: { right: 12 },
    heroTextBlock: {
        position: 'absolute',
        bottom: 20,
        left: 24,
        right: 24,
    },
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 12,
    },
    progressDot: {
        height: 4,
    },
    heroName: {
        fontSize: Math.round(W * 0.16),
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: -2,
        lineHeight: Math.round(W * 0.155),
    },
    heroLocation: {
        fontSize: 10,
        fontWeight: '800',
        color: 'rgba(255,255,255,0.7)',
        textTransform: 'uppercase',
        letterSpacing: 2.5,
        marginTop: 6,
    },

    // Content area
    content: {
        paddingHorizontal: 24,
        paddingTop: 24,
    },

    // Section label
    sectionLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: 'rgba(13,13,13,0.38)',
        textTransform: 'uppercase',
        letterSpacing: 3,
        marginBottom: 10,
        marginTop: 24,
    },

    // Light card
    lightCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(13,13,13,0.07)',
        padding: 20,
    },

    // AI card
    aiCard: {
        backgroundColor: BLACK,
        borderRadius: 32,
        padding: 28,
        marginBottom: 4,
    },
    aiTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    greenDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00FF88',
        shadowColor: '#00FF88',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 6,
    },
    aiLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: 'rgba(245,240,235,0.5)',
        textTransform: 'uppercase',
        letterSpacing: 2.5,
    },
    aiPct: {
        fontSize: 80,
        fontWeight: '900',
        color: CREAM,
        letterSpacing: -3,
        lineHeight: 80,
        marginBottom: 12,
    },
    aiReason: {
        fontSize: 13,
        fontWeight: '500',
        color: 'rgba(245,240,235,0.7)',
        lineHeight: 20,
    },

    // Voice prompt
    voiceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    playBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: BLACK,
        alignItems: 'center',
        justifyContent: 'center',
    },
    voiceQ: {
        fontSize: 13,
        fontWeight: '700',
        color: BLACK,
        marginBottom: 10,
        fontStyle: 'italic',
    },
    waveform: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        height: 24,
    },
    waveBar: {
        width: 3,
        borderRadius: 2,
    },

    // Bio
    bioText: {
        fontSize: 14,
        fontWeight: '500',
        color: BLACK,
        lineHeight: 22,
    },

    // Prompts
    promptQ: {
        fontSize: 11,
        fontWeight: '800',
        color: 'rgba(13,13,13,0.4)',
        letterSpacing: 1.5,
        marginBottom: 8,
    },
    promptA: {
        fontSize: 16,
        fontWeight: '500',
        color: BLACK,
        lineHeight: 24,
    },
    promptBorder: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(13,13,13,0.06)',
        marginBottom: 16,
        paddingBottom: 16,
    },

    // Tags
    tagWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tag: {
        backgroundColor: '#FFFFFF',
        borderRadius: 100,
        borderWidth: 1,
        borderColor: 'rgba(13,13,13,0.1)',
        paddingHorizontal: 14,
        paddingVertical: 8,
    },
    tagText: {
        fontSize: 12,
        fontWeight: '600',
        color: BLACK,
    },

    // Identity pills
    identityPill: {
        backgroundColor: '#FFFFFF',
        borderRadius: 100,
        borderWidth: 1,
        borderColor: 'rgba(13,13,13,0.08)',
        paddingHorizontal: 14,
        paddingVertical: 8,
        alignItems: 'center',
    },
    pillCategory: {
        fontSize: 9,
        fontWeight: '800',
        color: 'rgba(13,13,13,0.38)',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 2,
    },
    pillValue: {
        fontSize: 12,
        fontWeight: '700',
        color: BLACK,
    },

    // Lifestyle grid
    lifestyleGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    lifestyleCell: {
        width: (W - 48 - 10) / 2,
        alignItems: 'flex-start',
        gap: 6,
    },
    lifestyleLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: 'rgba(13,13,13,0.38)',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    lifestyleValue: {
        fontSize: 15,
        fontWeight: '700',
        color: BLACK,
    },

    // Background rows
    bgRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    bgRowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(13,13,13,0.07)',
    },
    bgLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: 'rgba(13,13,13,0.38)',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    bgValue: {
        fontSize: 13,
        fontWeight: '600',
        color: BLACK,
    },

    // Floating action bar
    actionBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 24,
        paddingTop: 16,
        backgroundColor: 'rgba(245,240,235,0.95)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -8 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
        elevation: 20,
    },
    passBtn: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderWidth: 1,
        borderColor: 'rgba(13,13,13,0.12)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendBtn: {
        height: 60,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    sendBtnText: {
        fontSize: 11,
        fontWeight: '800',
        color: CREAM,
        textTransform: 'uppercase',
        letterSpacing: 3,
    },
    apBtn: {
        height: 60,
        backgroundColor: BLACK,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        gap: 8,
    },
    apBtnText: {
        fontSize: 10,
        fontWeight: '800',
        color: CREAM,
        letterSpacing: 1.5,
    },

    // Success sheet
    sheetBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(13,13,13,0.6)',
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: CREAM,
        borderTopLeftRadius: 48,
        borderTopRightRadius: 48,
        paddingTop: 40,
        paddingHorizontal: 32,
        paddingBottom: 52,
        alignItems: 'center',
    },
    sheetAvatarRing: {
        width: 96,
        height: 96,
        borderRadius: 48,
        borderWidth: 3,
        borderColor: ORANGE,
        padding: 4,
        marginBottom: 28,
        position: 'relative',
    },
    sheetAvatar: {
        flex: 1,
        borderRadius: 44,
        opacity: 0.7,
    },
    sheetCheck: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: ORANGE,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: CREAM,
    },
    sheetTitle: {
        fontSize: 64,
        fontWeight: '900',
        color: BLACK,
        letterSpacing: -2,
        lineHeight: 60,
        textAlign: 'center',
        marginBottom: 20,
    },
    sheetTagRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
    },
    sheetTag: {
        borderWidth: 1,
        borderColor: 'rgba(13,13,13,0.2)',
        borderRadius: 100,
        paddingHorizontal: 14,
        paddingVertical: 6,
    },
    sheetTagText: {
        fontSize: 10,
        fontWeight: '800',
        color: BLACK,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    sheetSub: {
        fontSize: 13,
        fontWeight: '500',
        color: 'rgba(13,13,13,0.55)',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 32,
    },
    sheetBtn: {
        height: 56,
        backgroundColor: BLACK,
        borderRadius: 100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingHorizontal: 32,
        alignSelf: 'stretch',
    },
    sheetBtnText: {
        fontSize: 11,
        fontWeight: '800',
        color: CREAM,
        textTransform: 'uppercase',
        letterSpacing: 3,
    },
    stepperBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(13,13,13,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    toast: {
        position: 'absolute',
        bottom: 110,
        alignSelf: 'center',
        backgroundColor: BLACK,
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 10,
        zIndex: 1000,
    },
    toastText: {
        fontSize: 11,
        fontWeight: '800',
        color: CREAM,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
});
