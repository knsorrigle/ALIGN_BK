import React, { useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ImageBackground,
    Animated,
    Dimensions,
    StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BLACK, CREAM, ORANGE } from '../../constants/colors';

const { width } = Dimensions.get('window');
const HORIZONTAL_PADDING = 32;
const CARD_GAP = 12;
const CARD_WIDTH = (width - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;
const CARD_HEIGHT = CARD_WIDTH * (4 / 3);

// ─── Nav items ────────────────────────────────────────────────────────────────
const NAV_ITEMS: {
    icon: React.ComponentProps<typeof Ionicons>['name'];
    label: string;
    active?: boolean;
}[] = [
        { icon: 'home-outline', label: 'Home' },
        { icon: 'heart-outline', label: 'Likes', active: true },
        { icon: 'chatbubble-outline', label: 'Chats' },
        { icon: 'person-outline', label: 'Profile' },
        { icon: 'settings-outline', label: 'Settings' },
    ];

// ─── Sample data ──────────────────────────────────────────────────────────────
const LIKES_DATA = [
    {
        id: '1',
        name: 'MAYA',
        alignPoints: 4,
        photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&q=80',
    },
    {
        id: '2',
        name: 'JORDAN',
        alignPoints: 2,
        photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80',
    },
    {
        id: '3',
        name: 'ALEX',
        alignPoints: 7,
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    },
    {
        id: '4',
        name: 'RILEY',
        alignPoints: 3,
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    },
    {
        id: '5',
        name: 'SAGE',
        alignPoints: 5,
        photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80',
    },
    {
        id: '6',
        name: 'QUINN',
        alignPoints: 1,
        photo: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=400&q=80',
    },
];

// ─── Single Card ──────────────────────────────────────────────────────────────
function LikeCard({ item }: { item: (typeof LIKES_DATA)[0] }) {
    // 0 = "default" (greyscale overlay visible), 1 = "hover" (overlay gone, full color)
    const colorAnim = useRef(new Animated.Value(0)).current;

    const handlePressIn = () => {
        Animated.timing(colorAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: false,
        }).start();
    };

    const handlePressOut = () => {
        Animated.timing(colorAnim, {
            toValue: 0,
            duration: 100,
            useNativeDriver: false,
        }).start();
    };

    // Greyscale simulation: a cream-tinted overlay that fades away on press
    const greyOverlayOpacity = colorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.65, 0], // 0.65 = washes out colour, 0 = full colour revealed
    });

    // Subtle dark overlay appears on press for text legibility
    const hoverDimOpacity = colorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.02],
    });

    return (
        <TouchableOpacity
            activeOpacity={0.5}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={styles.card}
        >
            <ImageBackground
                source={{ uri: item.photo }}
                style={StyleSheet.absoluteFillObject}
                imageStyle={{ borderRadius: 32 }}
                resizeMode="cover"
            >

                {/* Hover dim for text legibility */}
                <Animated.View
                    style={[
                        StyleSheet.absoluteFillObject,
                        styles.hoverDim,
                        { opacity: hoverDimOpacity },
                    ]}
                />

                {/* Persistent bottom gradient scrim */}
                <View style={styles.scrim} />

                {/* Card content — bottom-left */}
                <View style={styles.cardContent}>
                    <Text style={styles.cardName} numberOfLines={1}>
                        {item.name}
                    </Text>
                    <View style={styles.apRow}>
                        <Ionicons name="flash" size={10} color={ORANGE} />
                        <Text style={styles.apText}>{item.alignPoints} APS</Text>
                    </View>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );
}

// ─── Bottom Nav ───────────────────────────────────────────────────────────────
function BottomNav() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();

    const handlePress = (label: string) => {
        const routes: Record<string, string> = {
            Home: 'Matchmaker',
            Chats: 'Chat',
            Profile: 'EditProfile',
            Settings: 'Settings',
        };
        const route = routes[label];
        if (route) navigation.navigate(route);
    };

    return (
        <View style={[styles.navBar, { paddingBottom: insets.bottom + 10 }]}>
            {NAV_ITEMS.map((item) => (
                <TouchableOpacity
                    key={item.label}
                    onPress={() => handlePress(item.label)}
                    style={styles.navItem}
                    activeOpacity={0.7}
                >
                    <View style={{ position: 'relative' }}>
                        <Ionicons
                            name={item.icon}
                            size={22}
                            color={item.active ? BLACK : 'rgba(13,13,13,0.32)'}
                        />
                        {item.active && <View style={styles.activeDot} />}
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function LikesScreen() {
    const insets = useSafeAreaInsets();

    // Split into rows of 2
    const rows: (typeof LIKES_DATA)[] = [];
    for (let i = 0; i < LIKES_DATA.length; i += 2) {
        rows.push(LIKES_DATA.slice(i, i + 2));
    }

    return (
        <View style={[styles.root, { backgroundColor: CREAM }]}>
            <StatusBar style="dark" />
            <View style={[styles.inner, { paddingTop: insets.top }]}>
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Massive display headline */}
                    <Text style={[styles.headline, { color: BLACK }]}>LIKES</Text>

                    {/* Sub-label */}
                    <Text style={[styles.subLabel, { color: 'rgba(13,13,13,0.38)' }]}>
                        {LIKES_DATA.length} PEOPLE WANT TO CONNECT
                    </Text>

                    {/* 2-col grid */}
                    {rows.map((row, rowIdx) => (
                        <View key={rowIdx} style={styles.row}>
                            {row.map((item) => (
                                <LikeCard key={item.id} item={item} />
                            ))}
                            {/* Pad last row if odd count */}
                            {row.length === 1 && <View style={{ width: CARD_WIDTH }} />}
                        </View>
                    ))}
                </ScrollView>

                <BottomNav />
            </View>
        </View>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    root: { flex: 1 },
    inner: { flex: 1 },
    scrollContent: {
        paddingHorizontal: HORIZONTAL_PADDING,
        paddingTop: 48,
        paddingBottom: 32,
    },
    headline: {
        fontFamily: 'ArchivoBlack_400Regular',
        fontSize: 96,
        fontWeight: '900',
        letterSpacing: -4,
        lineHeight: 88,
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    subLabel: {
        fontSize: 10,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 2.5,
        marginBottom: 28,
    },
    row: {
        flexDirection: 'row',
        gap: CARD_GAP,
        marginBottom: CARD_GAP,
    },
    // Card
    card: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 32,
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: 'rgba(13,13,13,0.07)',
    },
    greyOverlay: {
        // A cream-tinted wash that drains colour — mimics greyscale
        backgroundColor: '#C8C0B0',
    },
    hoverDim: {
        backgroundColor: '#0D0D0D',
    },
    scrim: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: CARD_HEIGHT * 0.5,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        backgroundColor: 'rgba(13,13,13,0.58)',
    },
    cardContent: {
        position: 'absolute',
        bottom: 14,
        left: 14,
        right: 14,
    },
    cardName: {
        fontSize: 22,
        fontWeight: '900',
        color: '#FFFFFF',
        textTransform: 'uppercase',
        letterSpacing: -0.5,
        lineHeight: 24,
    },
    apRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        gap: 4,
    },
    apText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#FFFFFF',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    // Nav
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: CREAM,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(13,13,13,0.08)',
    },
    navItem: {
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    activeDot: {
        position: 'absolute',
        bottom: -5,
        alignSelf: 'center',
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: ORANGE,
        left: '50%',
        transform: [{ translateX: -2.5 }],
    },
});
