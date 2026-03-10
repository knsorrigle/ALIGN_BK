import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    Animated,
    StyleSheet,
    Dimensions,
} from 'react-native';

const W = Dimensions.get('window').width;
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BLACK, CREAM, ORANGE } from '../constants/colors';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuth } from '@clerk/expo';

// ─── UI Components ────────────────────────────────────────────────────────────
function SectionLabel({ text }: { text: string }) {
    return (
        <Text style={styles.sectionLabel} allowFontScaling={false}>
            {text}
        </Text>
    );
}

function LightCard({ children, style }: { children: React.ReactNode; style?: any }) {
    return <View style={[styles.lightCard, style]}>{children}</View>;
}

// ─── Menu items ───────────────────────────────────────────────────────────────
const MENU_ITEMS: {
    icon: React.ComponentProps<typeof Ionicons>['name'];
    label: string;
    route?: string;
}[] = [
        { icon: 'card-outline', label: 'SUBSCRIPTION & BILLING', route: 'Subscription' },
        { icon: 'settings-outline', label: 'ACCOUNT SETTINGS', route: 'Settings' },
        { icon: 'shield-outline', label: 'PRIVACY & SAFETY' },
        { icon: 'log-out-outline', label: 'SIGN OUT', route: 'SignOut' },
    ];

// ─── Animated menu row ────────────────────────────────────────────────────────
function MenuItem({
    icon,
    label,
    onPress,
}: {
    icon: React.ComponentProps<typeof Ionicons>['name'];
    label: string;
    onPress?: () => void;
}) {
    const anim = useRef(new Animated.Value(0)).current;

    const handleIn = () =>
        Animated.timing(anim, { toValue: 1, duration: 160, useNativeDriver: false }).start();
    const handleOut = () =>
        Animated.timing(anim, { toValue: 0, duration: 200, useNativeDriver: false }).start();

    const bgColor = anim.interpolate({
        inputRange: [0, 1],
        outputRange: ['#FFFFFF', BLACK],
    });
    const contentOpacity = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
    });
    const invertedOpacity = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    return (
        <TouchableOpacity
            activeOpacity={1}
            onPressIn={handleIn}
            onPressOut={handleOut}
            onPress={onPress}
        >
            <Animated.View style={[styles.menuItem, { backgroundColor: bgColor }]}>
                {/* Default state layer */}
                <Animated.View style={[StyleSheet.absoluteFillObject, styles.menuInner, { opacity: contentOpacity }]}>
                    <Ionicons name={icon} size={20} color={`rgba(13,13,13,0.4)`} />
                    <Text style={styles.menuLabel}>{label}</Text>
                    <Ionicons name="arrow-forward" size={16} color={ORANGE} />
                </Animated.View>

                {/* Inverted state layer */}
                <Animated.View style={[StyleSheet.absoluteFillObject, styles.menuInner, { opacity: invertedOpacity }]}>
                    <Ionicons name={icon} size={20} color={CREAM} />
                    <Text style={[styles.menuLabel, { color: CREAM }]}>{label}</Text>
                    <Ionicons name="arrow-forward" size={16} color={CREAM} />
                </Animated.View>
            </Animated.View>
        </TouchableOpacity>
    );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function MyProfileScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const { signOut } = useAuth();
    const currentUser = useQuery(api.users.getCurrentUser);
    const photos = useQuery(api.files.getUserPhotos);

    const handleMenu = (route?: string) => {
        if (route === 'SignOut') {
            signOut();
            return;
        }
        if (route) navigation.navigate(route as never);
    };

    const displayName = (currentUser?.firstName ?? currentUser?.name ?? '').toUpperCase();
    const avatarUri = photos?.[0]?.url ?? undefined;
    const prompts = currentUser?.prompts ?? [];

    return (
        <View style={[styles.root, { backgroundColor: CREAM }]}>
            <StatusBar style="dark" />
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 48 }]}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Header ─────────────────────────────────────────────── */}
                <View style={styles.header}>
                    <Text style={[styles.headline, { color: BLACK }]} adjustsFontSizeToFit numberOfLines={1} minimumFontScale={0.5}>
                        {displayName || '...'}
                    </Text>
                    {/* Circular avatar */}
                    <View style={styles.avatarRing}>
                        {avatarUri ? (
                            <Image source={{ uri: avatarUri }} style={styles.avatarImg} />
                        ) : (
                            <View style={[styles.avatarImg, { backgroundColor: '#E0E0E0' }]} />
                        )}
                    </View>
                </View>

                {/* ── AlignPoints card ───────────────────────────────────── */}
                <View style={[styles.apCard, { backgroundColor: BLACK }]}>
                    {/* Top row */}
                    <View style={styles.apTopRow}>
                        <View>
                            <Text style={styles.apLabel}>AlignPoints</Text>
                            <Text style={styles.apBalance}>0</Text>
                        </View>
                        <TouchableOpacity style={[styles.buyBtn, { backgroundColor: CREAM }]} activeOpacity={0.8} onPress={() => navigation.navigate('Subscription', { scrollToAP: true })}>
                            <Text style={[styles.buyBtnText, { color: BLACK }]}>BUY MORE</Text>
                        </TouchableOpacity>
                    </View>
                    {/* Bottom row */}
                    <Text style={styles.apFootnote}>
                        Points reset monthly. Upgrade to Premium for unlimited boosts and priority matching.
                    </Text>
                </View>

                {/* ── My Prompts ─────────────────────────────────────────── */}
                {prompts.length > 0 && (
                    <>
                        <SectionLabel text="MY PROMPTS" />
                        <LightCard style={{ marginBottom: 32 }}>
                            {prompts.map((prompt, index) => (
                                <View
                                    key={index}
                                    style={index < prompts.length - 1 ? styles.promptBorder : undefined}
                                >
                                    <Text style={styles.promptQ}>{prompt.question}</Text>
                                    <Text style={styles.promptA}>{prompt.answer}</Text>
                                </View>
                            ))}
                        </LightCard>
                    </>
                )}

                {/* ── Menu ───────────────────────────────────────────────── */}
                <View style={styles.menuList}>
                    {MENU_ITEMS.map((item) => (
                        <MenuItem
                            key={item.label}
                            icon={item.icon}
                            label={item.label}
                            onPress={() => handleMenu(item.route)}
                        />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    root: { flex: 1 },
    scrollContent: {
        paddingHorizontal: 32,
        paddingBottom: 48,
    },
    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 32,
    },
    headline: {
        fontSize: Math.round(W * 0.19),
        fontWeight: '900',
        letterSpacing: -3,
        lineHeight: Math.round(W * 0.185),
        textTransform: 'uppercase',
        flex: 1,
    },
    avatarRing: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: BLACK,
        padding: 3,
        overflow: 'hidden',
        marginLeft: 16,
        marginTop: 4,
    },
    avatarImg: {
        flex: 1,
        borderRadius: 40,
        // Greyscale approximation via opacity
        opacity: 0.85,
    },
    // AlignPoints card
    apCard: {
        borderRadius: 32,
        padding: 32,
        marginBottom: 24,
    },
    apTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    apLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: ORANGE,
        textTransform: 'uppercase',
        letterSpacing: 3,
        marginBottom: 6,
    },
    apBalance: {
        fontSize: 64,
        fontWeight: '900',
        color: CREAM,
        letterSpacing: -2,
        lineHeight: 64,
    },
    buyBtn: {
        borderRadius: 100,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    buyBtnText: {
        fontSize: 10,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    apFootnote: {
        fontSize: 12,
        fontWeight: '500',
        color: CREAM,
        opacity: 0.6,
        lineHeight: 18,
    },
    // Menu
    menuList: {
        gap: 12,
    },
    menuItem: {
        borderRadius: 32,
        borderWidth: 1,
        borderColor: 'rgba(13,13,13,0.07)',
        height: 76,
        overflow: 'hidden',
    },
    menuInner: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 28,
        gap: 16,
        borderRadius: 32,
    },
    menuLabel: {
        flex: 1,
        fontSize: 11,
        fontWeight: '800',
        color: BLACK,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    // Shared UI
    sectionLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: BLACK,
        letterSpacing: 2,
        marginBottom: 12,
    },
    lightCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(13,13,13,0.06)',
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
});
