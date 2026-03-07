import React from 'react';
import { View, Text, ImageBackground, FlatList, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { Zap } from 'lucide-react-native';
import { BLACK, CREAM, ORANGE } from '../constants/colors';

// ─── Dummy Data ─────────────────────────────────────────────────────────────
// ─── Dummy Data ─────────────────────────────────────────────────────────────
const LIKES_DATA = [
    {
        id: '1',
        name: 'MAYA',
        apCount: 4,
        tier: 'Free',
        timestamp: Date.now() - 1000 * 60 * 5, // 5 mins ago
        photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&q=80',
    },
    {
        id: '2',
        name: 'JORDAN',
        apCount: 20,
        tier: 'Max',
        timestamp: Date.now() - 1000 * 60 * 60, // 1 hour ago
        photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80',
    },
    {
        id: '3',
        name: 'ALEX',
        apCount: 12,
        tier: 'Mini',
        timestamp: Date.now() - 1000 * 60 * 30, // 30 mins ago
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    },
    {
        id: '4',
        name: 'RILEY',
        apCount: 5,
        tier: 'Mini',
        timestamp: Date.now() - 1000 * 60 * 15, // 15 mins ago
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    },
    {
        id: '5',
        name: 'SAGE',
        apCount: 10,
        tier: 'Max',
        timestamp: Date.now() - 1000 * 60 * 120, // 2 hours ago
        photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80',
    },
    {
        id: '6',
        name: 'QUINN',
        apCount: 0,
        tier: 'Free',
        timestamp: Date.now() - 1000 * 60 * 10, // 10 mins ago
        photo: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=400&q=80',
    },
];

const { width } = Dimensions.get('window');

const LikeCard = ({ item, onViewProfile }: { item: typeof LIKES_DATA[0], onViewProfile: (user: typeof LIKES_DATA[0]) => void }) => {
    const hoverAnim = React.useRef(new Animated.Value(0)).current;

    const handlePressIn = () => {
        Animated.timing(hoverAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.timing(hoverAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    // Fades out the "grayscale" simulation
    const grayscaleOpacity = hoverAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
    });

    // Fades in the dark gradient overlay for text legibility
    const darkOverlayOpacity = hoverAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    return (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={1} // Disable default fade
            onPress={() => onViewProfile(item)}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
        >
            <ImageBackground
                source={{ uri: item.photo }}
                style={styles.image}
                imageStyle={{ borderRadius: 32 }}
                resizeMode="cover"
            >
                {/* Dark overlay for text legibility that fades in */}
                <Animated.View
                    style={[
                        StyleSheet.absoluteFillObject,
                        { backgroundColor: 'rgba(13, 13, 13, 0.2)', opacity: darkOverlayOpacity }
                    ]}
                />

                <View style={styles.overlay}>
                    {/* Top Badges area */}
                    <View style={{ position: 'absolute', bottom: 32, left: 0, flexDirection: 'row', gap: 6 }}>
                        {/* Premium Badge */}
                        {item.tier !== 'Free' && (
                            <View style={[styles.badge, styles.tierBadge]}>
                                <Text style={styles.tierText}>{item.tier}</Text>
                            </View>
                        )}

                        {/* AP Badge */}
                        {item.apCount > 0 && (
                            <View style={styles.badge}>
                                <Zap size={10} color={ORANGE} fill={ORANGE} />
                                <Text style={styles.apText}>{item.apCount} APs</Text>
                            </View>
                        )}
                    </View>

                    <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );
};

export default function LikesScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();

    const onViewProfile = (user: typeof LIKES_DATA[0]) => {
        navigation.navigate('ProfileDetail', { userId: user.id });
    };

    const sortedLikes = React.useMemo(() => {
        const tierWeights: Record<string, number> = { 'Max': 3, 'Mini': 2, 'Free': 1 };
        return [...LIKES_DATA].sort((a, b) => {
            // 1. Tier mapping Max -> Mini -> Free
            if (tierWeights[a.tier] !== tierWeights[b.tier]) {
                return tierWeights[b.tier] - tierWeights[a.tier];
            }
            // 2. AP count descending
            if (a.apCount !== b.apCount) {
                return b.apCount - a.apCount;
            }
            // 3. Most recent first
            return b.timestamp - a.timestamp;
        });
    }, []);

    const renderItem = ({ item }: { item: typeof LIKES_DATA[0] }) => (
        <LikeCard item={item} onViewProfile={onViewProfile} />
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top + 48 }]}>
            <StatusBar style="dark" />

            <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 36 }}>
                <Text style={styles.headline}>LIKES</Text>
            </View>

            <Text style={styles.sortLabel}>SORTED BY INTEREST</Text>
            <FlatList
                data={sortedLikes}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.row}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: CREAM,
        paddingHorizontal: 32,
    },
    headline: {
        fontFamily: 'ArchivoBlack_400Regular', // Adapted from FONTS.display
        fontSize: 64, // Adapted from the prompt
        fontWeight: '900',
        color: BLACK, // COLORS.ink
        letterSpacing: -2,
    },
    sortLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: 'rgba(13,13,13,0.4)',
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginBottom: 16,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    card: {
        width: (width - 64 - 16) / 2, // 47% equivalent with exact math (width - padding - gap)
        aspectRatio: 3 / 4,
        borderRadius: 32,
        backgroundColor: '#FFFFFF',
        borderColor: 'rgba(13, 13, 13, 0.07)',
        borderWidth: 1,
        marginBottom: 16, // Ensure gap between rows
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end', // Align overlay to bottom
    },
    overlay: {
        position: 'absolute',
        bottom: 24,
        left: 24,
        right: 16, // prevent name clipping
    },
    name: {
        fontFamily: 'ArchivoBlack_400Regular',
        fontSize: 24,
        color: '#FFFFFF',
        textTransform: 'uppercase',
        fontWeight: '900',
    },
    badge: {
        backgroundColor: '#1A1A1A',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    tierBadge: {
        backgroundColor: '#FFFFFF',
    },
    tierText: {
        fontSize: 9,
        fontWeight: '900',
        color: '#000000',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        paddingBottom: 1,
    },
    apText: {
        fontSize: 9,
        fontWeight: '800',
        color: CREAM,
        letterSpacing: 1,
        paddingBottom: 1,
    },
});
