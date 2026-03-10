import React, { useRef, useState } from 'react';
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
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Easing,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Zap } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BLACK, CREAM, ORANGE } from '../constants/colors';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

const { width: W, height: H } = Dimensions.get('window');
const HERO_H = H * 0.58;

// ─── Photo Carousel Dots ──────────────────────────────────────────────────────
function CarouselDot({ active }: { active: boolean }) {
    const anim = useRef(new Animated.Value(active ? 1 : 0)).current;
    React.useEffect(() => {
        Animated.timing(anim, { toValue: active ? 1 : 0, duration: 200, useNativeDriver: false }).start();
    }, [active]);
    const width = anim.interpolate({ inputRange: [0, 1], outputRange: [4, 16] });
    const backgroundColor = anim.interpolate({ inputRange: [0, 1], outputRange: ['rgba(255,255,255,0.5)', ORANGE] });
    return <Animated.View style={[styles.progressDot, { width, backgroundColor, borderRadius: 2, marginHorizontal: 2 }]} />;
}

// ─── Hero Photo Carousel ──────────────────────────────────────────────────────
function PhotoCarousel({ photos, name, age, location }: { photos: string[]; name: string; age: number | null; location: string | null }) {
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
    if (photos.length === 0) {
        return (
            <View style={{ height: HERO_H, backgroundColor: '#E0DDD8', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="person-outline" size={64} color="rgba(0,0,0,0.2)" />
                <View style={styles.heroTextBlock}>
                    <Text style={styles.heroName}>{name}{age ? `, ${age}` : ''}</Text>
                    {location && <Text style={styles.heroLocation}>{location}</Text>}
                </View>
            </View>
        );
    }
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
            <View style={styles.heroGradient} pointerEvents="none" />
            <View style={styles.counterPill}>
                <Text style={styles.counterText}>{index + 1} / {photos.length}</Text>
            </View>
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
            <View style={styles.heroTextBlock}>
                <View style={styles.progressRow}>
                    {photos.map((_, i) => <CarouselDot key={i} active={i === index} />)}
                </View>
                <Text style={styles.heroName}>{name}{age ? `, ${age}` : ''}</Text>
                {location && <Text style={styles.heroLocation}>{location}</Text>}
            </View>
        </View>
    );
}

function SectionLabel({ text }: { text: string }) {
    return <Text style={styles.sectionLabel}>{text}</Text>;
}

function LightCard({ children, style }: { children: React.ReactNode; style?: object }) {
    return <View style={[styles.lightCard, style]}>{children}</View>;
}

// ─── Toast ────────────────────────────────────────────────────────────────────
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

// ─── Success Sheet ────────────────────────────────────────────────────────────
function SuccessSheet({ visible, onDismiss, profileName, profilePhoto }: { visible: boolean; onDismiss: () => void; profileName: string; profilePhoto: string | undefined }) {
    const overlayOpacity = useRef(new Animated.Value(0)).current;
    const sheetY = useRef(new Animated.Value(400)).current;
    const avatarScale = useRef(new Animated.Value(0.8)).current;
    const avatarOpacity = useRef(new Animated.Value(0)).current;
    const checkScale = useRef(new Animated.Value(0)).current;
    const checkRotate = useRef(new Animated.Value(-20)).current;
    const textY = useRef(new Animated.Value(20)).current;
    const textOpacity = useRef(new Animated.Value(0)).current;
    const btnOpacity = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (visible) {
            Animated.timing(overlayOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
            Animated.spring(sheetY, { toValue: 0, damping: 25, stiffness: 120, useNativeDriver: true }).start();
            Animated.sequence([Animated.delay(200), Animated.parallel([
                Animated.timing(avatarOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
                Animated.spring(avatarScale, { toValue: 1, friction: 8, tension: 50, useNativeDriver: true })
            ])]).start();
            Animated.sequence([Animated.delay(400), Animated.parallel([
                Animated.spring(checkScale, { toValue: 1, damping: 12, stiffness: 150, useNativeDriver: true }),
                Animated.spring(checkRotate, { toValue: 0, damping: 12, stiffness: 150, useNativeDriver: true })
            ])]).start();
            Animated.sequence([Animated.delay(500), Animated.parallel([
                Animated.timing(textOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
                Animated.timing(textY, { toValue: 0, duration: 300, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
                Animated.timing(btnOpacity, { toValue: 1, duration: 300, useNativeDriver: true })
            ])]).start();
        } else {
            overlayOpacity.setValue(0); sheetY.setValue(400);
            avatarScale.setValue(0.8); avatarOpacity.setValue(0);
            checkScale.setValue(0); checkRotate.setValue(-20);
            textY.setValue(20); textOpacity.setValue(0); btnOpacity.setValue(0);
        }
    }, [visible]);

    if (!visible) return null;
    const checkRotation = checkRotate.interpolate({ inputRange: [-20, 0], outputRange: ['-20deg', '0deg'] });

    return (
        <Modal transparent animationType="none" visible={visible} onRequestClose={onDismiss}>
            <Animated.View style={[styles.sheetBackdrop, { opacity: overlayOpacity }]}>
                <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetY }] }]}>
                    <Animated.View style={[styles.sheetAvatarRing, { opacity: avatarOpacity, transform: [{ scale: avatarScale }] }]}>
                        {profilePhoto
                            ? <Image source={{ uri: profilePhoto }} style={styles.sheetAvatar} />
                            : <View style={[styles.sheetAvatar, { backgroundColor: '#E0DDD8' }]} />
                        }
                        <Animated.View style={[styles.sheetCheck, { transform: [{ scale: checkScale }, { rotate: checkRotation }] }]}>
                            <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                        </Animated.View>
                    </Animated.View>
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
                            Your request is on its way. If {profileName} accepts, you'll both be notified instantly.
                        </Text>
                    </Animated.View>
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

// ─── Intro Message Sheet ──────────────────────────────────────────────────────
function IntroMessageSheet({ visible, onDismiss, onSend, profileName, profilePhoto }: {
    visible: boolean;
    onDismiss: () => void;
    onSend: (message: string) => void;
    profileName: string;
    profilePhoto: string | undefined;
}) {
    const insets = useSafeAreaInsets();
    const overlayOpacity = useRef(new Animated.Value(0)).current;
    const sheetY = useRef(new Animated.Value(600)).current;
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const MAX = 200;

    React.useEffect(() => {
        if (visible) {
            setMessage('');
            setSending(false);
            Animated.timing(overlayOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
            Animated.spring(sheetY, { toValue: 0, damping: 25, stiffness: 120, useNativeDriver: true }).start();
        } else {
            overlayOpacity.setValue(0);
            sheetY.setValue(600);
        }
    }, [visible]);

    const dismiss = () => {
        Animated.parallel([
            Animated.timing(overlayOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
            Animated.timing(sheetY, { toValue: 600, duration: 250, useNativeDriver: true }),
        ]).start(() => onDismiss());
    };

    const handleSend = async () => {
        if (!message.trim() || sending) return;
        setSending(true);
        await onSend(message.trim());
    };

    if (!visible) return null;

    return (
        <Modal transparent animationType="none" visible={visible} onRequestClose={dismiss}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <Animated.View style={[styles.sheetBackdrop, { opacity: overlayOpacity }]}>
                    <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={dismiss} activeOpacity={1} />
                    <Animated.View style={[styles.introSheet, { paddingBottom: insets.bottom + 24, transform: [{ translateY: sheetY }] }]}>
                        {/* Profile header */}
                        <View style={{ alignItems: 'center', marginBottom: 24 }}>
                            {profilePhoto && profilePhoto.startsWith('https://') ? (
                                <Image source={{ uri: profilePhoto }} style={styles.introAvatar} />
                            ) : (
                                <View style={[styles.introAvatar, { backgroundColor: ORANGE, alignItems: 'center', justifyContent: 'center' }]}>
                                    <Text style={{ fontSize: 24, fontWeight: '900', color: CREAM }}>{(profileName || '?')[0]}</Text>
                                </View>
                            )}
                            <Text style={{ fontSize: 10, fontWeight: '800', color: 'rgba(13,13,13,0.4)', letterSpacing: 2, textTransform: 'uppercase', marginTop: 12, marginBottom: 4 }}>
                                SENDING REQUEST TO
                            </Text>
                            <Text style={{ fontSize: 28, fontWeight: '900', color: BLACK, letterSpacing: -1, textTransform: 'uppercase' }}>
                                {profileName}
                            </Text>
                        </View>

                        {/* Message input */}
                        <View style={styles.introInputWrapper}>
                            <TextInput
                                style={styles.introInput}
                                placeholder="Write an intro message..."
                                placeholderTextColor="rgba(13,13,13,0.35)"
                                value={message}
                                onChangeText={(t) => setMessage(t.slice(0, MAX))}
                                multiline
                                autoFocus
                                selectionColor={ORANGE}
                            />
                            <Text style={styles.introCounter}>
                                {message.length}/{MAX}
                            </Text>
                        </View>

                        {/* Send button */}
                        <TouchableOpacity
                            onPress={handleSend}
                            disabled={message.trim().length === 0 || sending}
                            activeOpacity={0.85}
                            style={[
                                styles.introSendBtn,
                                (message.trim().length === 0 || sending) && { opacity: 0.35 }
                            ]}
                        >
                            <Text style={styles.introSendBtnText}>
                                {sending ? 'SENDING...' : 'SEND REQUEST →'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={dismiss} style={{ marginTop: 16, alignItems: 'center' }}>
                            <Text style={{ fontSize: 11, fontWeight: '700', color: 'rgba(13,13,13,0.4)', letterSpacing: 1, textTransform: 'uppercase' }}>
                                CANCEL
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                </Animated.View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

// ─── AP Sheet ─────────────────────────────────────────────────────────────────
function APSheet({ visible, onDismiss, onConfirm, profileName }: {
    visible: boolean; onDismiss: () => void; onConfirm: (amount: number) => void; profileName: string;
}) {
    const [amount, setAmount] = useState(1);
    const overlayOpacity = useRef(new Animated.Value(0)).current;
    const sheetY = useRef(new Animated.Value(400)).current;

    React.useEffect(() => {
        if (visible) {
            setAmount(1);
            Animated.timing(overlayOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
            Animated.spring(sheetY, { toValue: 0, damping: 25, stiffness: 120, useNativeDriver: true }).start();
        }
    }, [visible]);

    if (!visible) return null;

    const dismiss = () => {
        Animated.parallel([
            Animated.timing(overlayOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
            Animated.timing(sheetY, { toValue: 400, duration: 250, useNativeDriver: true }),
        ]).start(() => onDismiss());
    };

    return (
        <Modal transparent animationType="none" visible={visible} onRequestClose={dismiss}>
            <Animated.View style={[styles.sheetBackdrop, { opacity: overlayOpacity }]}>
                <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={dismiss} activeOpacity={1} />
                <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetY }] }]}>
                    <View style={{ alignItems: 'center', width: '100%', marginBottom: 28 }}>
                        <Text style={{ fontSize: 10, fontWeight: '800', color: 'rgba(13,13,13,0.4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>
                            SENDING TO
                        </Text>
                        <Text style={{ fontSize: 28, fontWeight: '900', color: BLACK, letterSpacing: -1, textTransform: 'uppercase' }}>
                            {profileName}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 32, marginBottom: 36 }}>
                        <TouchableOpacity
                            onPress={() => setAmount(a => Math.max(1, a - 1))}
                            disabled={amount <= 1}
                            activeOpacity={0.8}
                            style={{
                                width: 52, height: 52, borderRadius: 26,
                                backgroundColor: amount <= 1 ? 'rgba(13,13,13,0.04)' : '#FFFFFF',
                                borderWidth: 1, borderColor: 'rgba(13,13,13,0.12)',
                                alignItems: 'center', justifyContent: 'center',
                            }}
                        >
                            <Text style={{ fontSize: 28, fontWeight: '300', color: amount <= 1 ? 'rgba(13,13,13,0.2)' : BLACK, lineHeight: 32 }}>−</Text>
                        </TouchableOpacity>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontSize: 72, fontWeight: '900', color: ORANGE, letterSpacing: -3, lineHeight: 72 }}>{amount}</Text>
                            <Text style={{ fontSize: 9, fontWeight: '800', color: 'rgba(13,13,13,0.38)', letterSpacing: 2.5, textTransform: 'uppercase', marginTop: 6 }}>
                                ALIGN POINTS
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => setAmount(a => a + 1)}
                            activeOpacity={0.8}
                            style={{
                                width: 52, height: 52, borderRadius: 26,
                                backgroundColor: '#FFFFFF',
                                borderWidth: 1, borderColor: 'rgba(13,13,13,0.12)',
                                alignItems: 'center', justifyContent: 'center',
                            }}
                        >
                            <Text style={{ fontSize: 28, fontWeight: '300', color: BLACK, lineHeight: 32 }}>+</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        onPress={() => { onConfirm(amount); dismiss(); }}
                        activeOpacity={0.85}
                        style={{ height: 56, backgroundColor: ORANGE, borderRadius: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%' }}
                    >
                        <Zap size={18} color={CREAM} fill={CREAM} />
                        <Text style={{ fontSize: 12, fontWeight: '900', color: CREAM, letterSpacing: 2, textTransform: 'uppercase' }}>
                            SEND {amount} AP
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
}

function getAge(birthday: string | null): number | null {
    if (!birthday) return null;
    const birth = new Date(birthday);
    if (isNaN(birth.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ProfileDetailScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const route = useRoute<any>();

    const userId = route.params?.userId;
    const passedPhotos: string[] = route.params?.photos ?? [];
    const passedScore: number | undefined = route.params?.compatibilityScore;

    const profile = useQuery(api.users.getProfileById, userId ? { userId } : 'skip');
    const mySwipe = useQuery(
        api.swipes.getMySwipeForUser,
        profile?.clerk_id ? { toClerkId: profile.clerk_id } : 'skip'
    );
    const match = useQuery(
        api.swipes.getMatchWithUser,
        profile?.clerk_id ? { otherClerkId: profile.clerk_id } : 'skip'
    );
    const recordSwipeMutation = useMutation(api.swipes.recordSwipe);

    const [success, setSuccess] = useState(false);
    const [showAPSheet, setShowAPSheet] = useState(false);
    const [showIntroSheet, setShowIntroSheet] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMsg, setToastMsg] = useState('');

    const sendAnim = useRef(new Animated.Value(0)).current;
    const sendBg = sendAnim.interpolate({ inputRange: [0, 1], outputRange: [BLACK, ORANGE] });

    const [rendered, setRendered] = useState(false);
    const translateY = useRef(new Animated.Value(H)).current;
    const bgOpacity = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        setRendered(true);
        Animated.parallel([
            Animated.timing(bgOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.spring(translateY, { toValue: 0, damping: 25, stiffness: 120, useNativeDriver: true })
        ]).start();
    }, []);

    const handleClose = () => {
        Animated.parallel([
            Animated.timing(bgOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
            Animated.timing(translateY, { toValue: H, duration: 250, easing: Easing.in(Easing.ease), useNativeDriver: true })
        ]).start(() => navigation.goBack());
    };

    const showToast = (msg: string) => {
        setToastMsg(msg);
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 2500);
    };

    if (!rendered) return null;

    const name = (profile?.name || '').toUpperCase() || 'LOADING...';
    const age = profile ? getAge(profile.birthday) : null;
    const photos: string[] = (profile?.photos?.length ? profile.photos : passedPhotos) as string[];
    const compatibilityScore = passedScore ?? 0;

    const identityItems: { category: string; value: string }[] = [
        profile?.pronouns ? { category: 'PRONOUNS', value: Array.isArray(profile.pronouns) ? profile.pronouns.join(' / ') : profile.pronouns } : null,
        profile?.sexuality ? { category: 'SEXUALITY', value: profile.sexuality } : null,
        profile?.dating_intention ? { category: 'INTENT', value: profile.dating_intention } : null,
        profile?.children ? { category: 'FAMILY', value: profile.children } : null,
        profile?.religion ? { category: 'RELIGION', value: profile.religion } : null,
        profile?.politics ? { category: 'POLITICS', value: profile.politics } : null,
    ].filter(Boolean) as { category: string; value: string }[];

    const lifestyleItems: { icon: React.ComponentProps<typeof Ionicons>['name']; label: string; value: string }[] = [
        profile?.drinking ? { icon: 'wine-outline' as const, label: 'Drinks', value: profile.drinking } : null,
        profile?.tobacco ? { icon: 'leaf-outline' as const, label: 'Smokes', value: profile.tobacco } : null,
    ].filter(Boolean) as any;

    const backgroundItems: { label: string; value: string }[] = [
        profile?.workplace ? { label: 'WORKPLACE', value: profile.workplace } : null,
        profile?.education ? { label: 'EDUCATION', value: profile.education } : null,
        profile?.location ? { label: 'BASED IN', value: profile.location } : null,
    ].filter(Boolean) as { label: string; value: string }[];

    const prompts = profile?.prompts ?? [];
    const bio = profile?.bio ?? '';
    const firstPhoto = photos[0];

    // Button state
    const alreadySentRequest = mySwipe?.direction === 'right';
    const isMatched = !!match;
    const showMessageButton = alreadySentRequest || isMatched;

    const handleSendRequest = async (introMessage: string) => {
        if (!profile?.clerk_id) return;
        try {
            await recordSwipeMutation({
                toClerkId: profile.clerk_id,
                direction: 'right',
                introMessage,
            });
            setShowIntroSheet(false);
            setSuccess(true);
        } catch {
            setShowIntroSheet(false);
        }
    };

    const handleMessagePress = () => {
        navigation.navigate('TabChat', {
            screen: 'ActiveChat',
            params: {
                matchName: name,
                photo: firstPhoto,
                pending: !isMatched,
                introMessage: mySwipe?.introMessage ?? '',
                otherClerkId: profile?.clerk_id,
            },
        });
    };

    return (
        <View style={styles.root}>
            <Animated.View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#000000', opacity: bgOpacity }]} />
            <Animated.View style={[styles.root, { backgroundColor: CREAM, transform: [{ translateY }] }]}>
                <StatusBar style="light" />

                <View style={[styles.topBar, { top: insets.top + 8 }]}>
                    <TouchableOpacity style={styles.iconCircle} onPress={handleClose} activeOpacity={0.8}>
                        <Ionicons name="chevron-down" size={24} color={BLACK} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.iconCircle}
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('Report', { clerkId: profile?.clerk_id, name })}
                    >
                        <Ionicons name="flag-outline" size={18} color={BLACK} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
                    <PhotoCarousel photos={photos} name={name} age={age} location={profile?.location ?? null} />

                    <View style={styles.content}>
                        {compatibilityScore > 0 && (
                            <View style={styles.aiCard}>
                                <View style={styles.aiTopRow}>
                                    <View style={styles.greenDot} />
                                    <Text style={styles.aiLabel}>AI ALIGNMENT SCORE</Text>
                                </View>
                                <Text style={styles.aiPct}>{compatibilityScore}%</Text>
                                {profile?.personality && (
                                    <Text style={styles.aiReason}>
                                        Your values and communication styles are highly compatible based on your profiles.
                                    </Text>
                                )}
                            </View>
                        )}

                        {bio ? (
                            <>
                                <SectionLabel text="ABOUT" />
                                <LightCard><Text style={styles.bioText}>{bio}</Text></LightCard>
                            </>
                        ) : null}

                        {prompts.length > 0 && (
                            <>
                                <SectionLabel text="PROMPTS" />
                                <LightCard>
                                    {prompts.map((prompt, index) => (
                                        <View key={prompt.id} style={index < prompts.length - 1 ? styles.promptBorder : undefined}>
                                            <Text style={styles.promptQ}>{prompt.prompt_question}</Text>
                                            <Text style={styles.promptA}>{prompt.prompt_answer}</Text>
                                        </View>
                                    ))}
                                </LightCard>
                            </>
                        )}

                        {identityItems.length > 0 && (
                            <>
                                <SectionLabel text="IDENTITY" />
                                <View style={styles.tagWrap}>
                                    {identityItems.map((item) => (
                                        <View key={item.category} style={styles.identityPill}>
                                            <Text style={styles.pillCategory}>{item.category}</Text>
                                            <Text style={styles.pillValue}>{item.value}</Text>
                                        </View>
                                    ))}
                                </View>
                            </>
                        )}

                        {lifestyleItems.length > 0 && (
                            <>
                                <SectionLabel text="LIFESTYLE" />
                                <View style={styles.lifestyleGrid}>
                                    {lifestyleItems.map((item) => (
                                        <LightCard key={item.label} style={styles.lifestyleCell}>
                                            <Ionicons name={item.icon} size={20} color="rgba(13,13,13,0.4)" />
                                            <Text style={styles.lifestyleLabel}>{item.label}</Text>
                                            <Text style={styles.lifestyleValue}>{item.value}</Text>
                                        </LightCard>
                                    ))}
                                </View>
                            </>
                        )}

                        {backgroundItems.length > 0 && (
                            <>
                                <SectionLabel text="BACKGROUND" />
                                <LightCard>
                                    {backgroundItems.map((item, i) => (
                                        <View key={item.label} style={[styles.bgRow, i < backgroundItems.length - 1 && styles.bgRowBorder]}>
                                            <Text style={styles.bgLabel}>{item.label}</Text>
                                            <Text style={styles.bgValue}>{item.value}</Text>
                                        </View>
                                    ))}
                                </LightCard>
                            </>
                        )}
                    </View>
                </ScrollView>

                {/* Floating Action Bar */}
                <View style={[styles.actionBar, { paddingBottom: insets.bottom + 16 }]}>
                    <TouchableOpacity style={styles.passBtn} activeOpacity={0.8} onPress={handleClose}>
                        <Ionicons name="close" size={24} color={BLACK} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.apBtn} activeOpacity={0.8} onPress={() => setShowAPSheet(true)}>
                        <Zap size={20} color={ORANGE} fill={ORANGE} />
                    </TouchableOpacity>

                    {showMessageButton ? (
                        <TouchableOpacity
                            style={{ flex: 1, height: 60, backgroundColor: ORANGE, borderRadius: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}
                            activeOpacity={0.85}
                            onPress={handleMessagePress}
                        >
                            <Text style={styles.sendBtnText}>MESSAGE →</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={{ flex: 1 }}
                            activeOpacity={1}
                            onPressIn={() => Animated.timing(sendAnim, { toValue: 1, duration: 180, useNativeDriver: false }).start()}
                            onPressOut={() => Animated.timing(sendAnim, { toValue: 0, duration: 220, useNativeDriver: false }).start()}
                            onPress={() => setShowIntroSheet(true)}
                        >
                            <Animated.View style={[styles.sendBtn, { backgroundColor: sendBg }]}>
                                <Text style={styles.sendBtnText}>SEND REQUEST</Text>
                                <Ionicons name="arrow-forward" size={16} color={CREAM} />
                            </Animated.View>
                        </TouchableOpacity>
                    )}
                </View>

                <APSheet
                    visible={showAPSheet}
                    onDismiss={() => setShowAPSheet(false)}
                    onConfirm={(amount) => showToast(`${amount} AP sent!`)}
                    profileName={name}
                />

                <IntroMessageSheet
                    visible={showIntroSheet}
                    onDismiss={() => setShowIntroSheet(false)}
                    onSend={handleSendRequest}
                    profileName={name}
                    profilePhoto={firstPhoto}
                />

                <SuccessSheet
                    visible={success}
                    onDismiss={() => { setSuccess(false); handleClose(); }}
                    profileName={name}
                    profilePhoto={firstPhoto}
                />
            </Animated.View>

            <ToastNotification msg={toastMsg} visible={toastVisible} />
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    topBar: { position: 'absolute', left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between', zIndex: 50 },
    iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(245,240,235,0.9)', alignItems: 'center', justifyContent: 'center' },
    heroGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: HERO_H * 0.55, backgroundColor: 'transparent' },
    counterPill: { position: 'absolute', top: 16, alignSelf: 'center', backgroundColor: 'rgba(13,13,13,0.45)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 100 },
    counterText: { fontSize: 11, fontWeight: '700', color: '#FFFFFF', letterSpacing: 1 },
    chevron: { position: 'absolute', top: '50%', width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(13,13,13,0.4)', alignItems: 'center', justifyContent: 'center', marginTop: -18 },
    chevronLeft: { left: 12 },
    chevronRight: { right: 12 },
    heroTextBlock: { position: 'absolute', bottom: 20, left: 24, right: 24 },
    progressRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
    progressDot: { height: 4 },
    heroName: { fontSize: Math.round(W * 0.16), fontWeight: '900', color: '#FFFFFF', letterSpacing: -2, lineHeight: Math.round(W * 0.155) },
    heroLocation: { fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 2.5, marginTop: 6 },
    content: { paddingHorizontal: 24, paddingTop: 24 },
    sectionLabel: { fontSize: 10, fontWeight: '800', color: 'rgba(13,13,13,0.38)', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 10, marginTop: 24 },
    lightCard: { backgroundColor: '#FFFFFF', borderRadius: 24, borderWidth: 1, borderColor: 'rgba(13,13,13,0.07)', padding: 20 },
    aiCard: { backgroundColor: BLACK, borderRadius: 32, padding: 28, marginBottom: 4 },
    aiTopRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
    greenDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#00FF88', shadowColor: '#00FF88', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.9, shadowRadius: 6 },
    aiLabel: { fontSize: 10, fontWeight: '800', color: 'rgba(245,240,235,0.5)', textTransform: 'uppercase', letterSpacing: 2.5 },
    aiPct: { fontSize: 80, fontWeight: '900', color: CREAM, letterSpacing: -3, lineHeight: 80, marginBottom: 12 },
    aiReason: { fontSize: 13, fontWeight: '500', color: 'rgba(245,240,235,0.7)', lineHeight: 20 },
    bioText: { fontSize: 14, fontWeight: '500', color: BLACK, lineHeight: 22 },
    promptQ: { fontSize: 11, fontWeight: '800', color: 'rgba(13,13,13,0.4)', letterSpacing: 1.5, marginBottom: 8 },
    promptA: { fontSize: 16, fontWeight: '500', color: BLACK, lineHeight: 24 },
    promptBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(13,13,13,0.06)', marginBottom: 16, paddingBottom: 16 },
    tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    identityPill: { backgroundColor: '#FFFFFF', borderRadius: 100, borderWidth: 1, borderColor: 'rgba(13,13,13,0.08)', paddingHorizontal: 14, paddingVertical: 8, alignItems: 'center' },
    pillCategory: { fontSize: 9, fontWeight: '800', color: 'rgba(13,13,13,0.38)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 2 },
    pillValue: { fontSize: 12, fontWeight: '700', color: BLACK },
    lifestyleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    lifestyleCell: { width: (W - 48 - 10) / 2, alignItems: 'flex-start', gap: 6 },
    lifestyleLabel: { fontSize: 10, fontWeight: '800', color: 'rgba(13,13,13,0.38)', textTransform: 'uppercase', letterSpacing: 2 },
    lifestyleValue: { fontSize: 15, fontWeight: '700', color: BLACK },
    bgRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
    bgRowBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(13,13,13,0.07)' },
    bgLabel: { fontSize: 10, fontWeight: '800', color: 'rgba(13,13,13,0.38)', textTransform: 'uppercase', letterSpacing: 2 },
    bgValue: { fontSize: 13, fontWeight: '600', color: BLACK },
    actionBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 24, paddingTop: 16, backgroundColor: 'rgba(245,240,235,0.95)', shadowColor: '#000', shadowOffset: { width: 0, height: -8 }, shadowOpacity: 0.12, shadowRadius: 24, elevation: 20 },
    passBtn: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.9)', borderWidth: 1, borderColor: 'rgba(13,13,13,0.12)', alignItems: 'center', justifyContent: 'center' },
    apBtn: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.9)', borderWidth: 1, borderColor: 'rgba(13,13,13,0.12)', alignItems: 'center', justifyContent: 'center' },
    sendBtn: { height: 60, borderRadius: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
    sendBtnText: { fontSize: 11, fontWeight: '800', color: CREAM, textTransform: 'uppercase', letterSpacing: 3 },
    sheetBackdrop: { flex: 1, backgroundColor: 'rgba(13,13,13,0.6)', justifyContent: 'flex-end' },
    sheet: { backgroundColor: CREAM, borderTopLeftRadius: 48, borderTopRightRadius: 48, paddingTop: 40, paddingHorizontal: 32, paddingBottom: 52, alignItems: 'center' },
    sheetAvatarRing: { width: 96, height: 96, borderRadius: 48, borderWidth: 3, borderColor: ORANGE, padding: 4, marginBottom: 28, position: 'relative' },
    sheetAvatar: { flex: 1, borderRadius: 44, opacity: 0.7 },
    sheetCheck: { position: 'absolute', bottom: -4, right: -4, width: 28, height: 28, borderRadius: 14, backgroundColor: ORANGE, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: CREAM },
    sheetTitle: { fontSize: 64, fontWeight: '900', color: BLACK, letterSpacing: -2, lineHeight: 60, textAlign: 'center', marginBottom: 20 },
    sheetTagRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
    sheetTag: { borderWidth: 1, borderColor: 'rgba(13,13,13,0.2)', borderRadius: 100, paddingHorizontal: 14, paddingVertical: 6 },
    sheetTagText: { fontSize: 10, fontWeight: '800', color: BLACK, textTransform: 'uppercase', letterSpacing: 2 },
    sheetSub: { fontSize: 13, fontWeight: '500', color: 'rgba(13,13,13,0.55)', textAlign: 'center', lineHeight: 20, marginBottom: 32 },
    sheetBtn: { height: 56, backgroundColor: BLACK, borderRadius: 100, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingHorizontal: 32, alignSelf: 'stretch' },
    sheetBtnText: { fontSize: 11, fontWeight: '800', color: CREAM, textTransform: 'uppercase', letterSpacing: 3 },
    // IntroSheet
    introSheet: { backgroundColor: CREAM, borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingTop: 32, paddingHorizontal: 28 },
    introAvatar: { width: 72, height: 72, borderRadius: 36 },
    introInputWrapper: { borderWidth: 1.5, borderColor: 'rgba(13,13,13,0.15)', borderRadius: 20, padding: 16, minHeight: 120, marginBottom: 8, backgroundColor: '#FFFFFF' },
    introInput: { fontSize: 15, fontWeight: '500', color: BLACK, lineHeight: 22, minHeight: 80 },
    introCounter: { fontSize: 10, fontWeight: '700', color: 'rgba(13,13,13,0.3)', textAlign: 'right', letterSpacing: 1, marginTop: 4 },
    introSendBtn: { height: 56, backgroundColor: BLACK, borderRadius: 100, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
    introSendBtnText: { fontSize: 11, fontWeight: '900', color: CREAM, letterSpacing: 3, textTransform: 'uppercase' },
    // Toast
    toast: { position: 'absolute', bottom: 110, alignSelf: 'center', backgroundColor: BLACK, paddingHorizontal: 20, paddingVertical: 14, borderRadius: 30, flexDirection: 'row', alignItems: 'center', gap: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 10, zIndex: 1000 },
    toastText: { fontSize: 11, fontWeight: '800', color: CREAM, letterSpacing: 1.5, textTransform: 'uppercase' },
    // Unused (kept for compatibility)
    tag: { backgroundColor: '#FFFFFF', borderRadius: 100, borderWidth: 1, borderColor: 'rgba(13,13,13,0.1)', paddingHorizontal: 14, paddingVertical: 8 },
    tagText: { fontSize: 12, fontWeight: '600', color: BLACK },
});
