import React, { useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
    Image,
    Animated,
    StyleSheet,
    ScrollView,
    Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { BLACK, CREAM, ORANGE } from '../constants/colors';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

type MatchItem = {
    _id: any;
    matchedAt: number;
    icebreakersGenerated: boolean;
    otherUser: {
        clerkId: string;
        firstName: string;
        photos: string[];
    } | null;
};

type PendingItem = {
    swipeId: any;
    toClerkId: string;
    introMessage: string;
    sentAt: number;
    otherUser: {
        clerkId: string;
        firstName: string;
        photos: string[];
    };
};

function getRelativeTime(ts: number): string {
    const diffMs = Date.now() - ts;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins}M`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}H`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}D`;
}

const PhotoAvatar = ({ photos, name }: { photos: string[]; name: string }) => {
    const photo = photos?.[0];
    if (photo && photo.startsWith('https://')) {
        return (
            <ImageBackground
                source={{ uri: photo }}
                style={StyleSheet.absoluteFillObject}
                imageStyle={{ borderRadius: 32 }}
            />
        );
    }
    return (
        <View style={[StyleSheet.absoluteFillObject, {
            backgroundColor: ORANGE, borderRadius: 32,
            justifyContent: 'center', alignItems: 'center',
        }]}>
            <Text style={{ fontSize: 24, fontWeight: '900', color: CREAM }}>
                {(name || '?')[0].toUpperCase()}
            </Text>
        </View>
    );
};

// ─── Pending Request Card ────────────────────────────────────────────────────
const PendingCard = ({ item }: { item: PendingItem }) => {
    const navigation = useNavigation<any>();
    const hoverAnim = useRef(new Animated.Value(0)).current;

    const handlePressIn = () =>
        Animated.timing(hoverAnim, { toValue: 1, duration: 150, useNativeDriver: false }).start();
    const handlePressOut = () =>
        Animated.timing(hoverAnim, { toValue: 0, duration: 200, useNativeDriver: false }).start();

    const handlePress = () => {
        navigation.navigate('ActiveChat', {
            matchName: item.otherUser.firstName?.toUpperCase() ?? 'PENDING',
            photo: item.otherUser.photos?.[0] ?? '',
            pending: true,
            introMessage: item.introMessage,
            otherClerkId: item.toClerkId,
        });
    };

    const backgroundColor = hoverAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['#FFFFFF', '#0D0D0D'],
    });
    const textColor = hoverAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['#0D0D0D', CREAM],
    });
    const subTextColor = hoverAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(13,13,13,0.6)', 'rgba(245,240,235,0.7)'],
    });

    const name = item.otherUser.firstName?.toUpperCase() ?? 'PENDING';

    return (
        <TouchableOpacity
            activeOpacity={1}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePress}
            style={styles.cardWrapper}
        >
            <Animated.View style={[styles.card, { backgroundColor }]}>
                <View style={styles.avatarContainer}>
                    <PhotoAvatar photos={item.otherUser.photos} name={name} />
                </View>
                <View style={styles.contentContainer}>
                    <View style={styles.topRow}>
                        <Animated.Text style={[styles.nameText, { color: textColor }]} numberOfLines={1}>
                            {name}
                        </Animated.Text>
                        <View style={styles.pendingBadge}>
                            <Text style={styles.pendingBadgeText}>PENDING</Text>
                        </View>
                    </View>
                    <Animated.Text style={[styles.previewText, { color: subTextColor }]} numberOfLines={1}>
                        {item.introMessage || 'Connection request sent'}
                    </Animated.Text>
                </View>
            </Animated.View>
        </TouchableOpacity>
    );
};

// ─── Conversation Card ──────────────────────────────────────────────────────
const ChatCard = ({ item }: { item: MatchItem }) => {
    const navigation = useNavigation<any>();
    const hoverAnim = useRef(new Animated.Value(0)).current;

    const handlePressIn = () =>
        Animated.timing(hoverAnim, { toValue: 1, duration: 150, useNativeDriver: false }).start();
    const handlePressOut = () =>
        Animated.timing(hoverAnim, { toValue: 0, duration: 200, useNativeDriver: false }).start();

    const handlePress = () => {
        navigation.navigate('ActiveChat', {
            matchName: item.otherUser?.firstName?.toUpperCase() ?? 'MATCH',
            photo: item.otherUser?.photos?.[0] ?? '',
        });
    };

    const backgroundColor = hoverAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['#FFFFFF', '#0D0D0D'],
    });
    const textColor = hoverAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['#0D0D0D', CREAM],
    });
    const subTextColor = hoverAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(13,13,13,0.6)', 'rgba(245,240,235,0.7)'],
    });

    const name = item.otherUser?.firstName?.toUpperCase() ?? 'MATCH';

    return (
        <TouchableOpacity
            activeOpacity={1}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePress}
            style={styles.cardWrapper}
        >
            <Animated.View style={[styles.card, { backgroundColor }]}>
                <View style={styles.avatarContainer}>
                    <PhotoAvatar photos={item.otherUser?.photos ?? []} name={name} />
                </View>
                <View style={styles.contentContainer}>
                    <View style={styles.topRow}>
                        <Animated.Text style={[styles.nameText, { color: textColor }]}>
                            {name}
                        </Animated.Text>
                        <Animated.Text style={[styles.timeText, { color: subTextColor }]}>
                            {getRelativeTime(item.matchedAt)}
                        </Animated.Text>
                    </View>
                    <Animated.Text style={[styles.previewText, { color: subTextColor }]} numberOfLines={1}>
                        New match! Say hello 👋
                    </Animated.Text>
                </View>
            </Animated.View>
        </TouchableOpacity>
    );
};

// ─── Favorite Avatar (horizontal row item) ─────────────────────────────────
const FavoriteAvatar = ({ item, onPress, onLongPress }: {
    item: { clerkId: string; firstName: string; photos: string[] };
    onPress: () => void;
    onLongPress: () => void;
}) => {
    const photo = item.photos?.[0];
    const isReal = photo && photo.startsWith('https://');
    const initial = (item.firstName || '?')[0].toUpperCase();
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ alignItems: 'center', marginRight: 20 }}
        >
            {isReal ? (
                <Image
                    source={{ uri: photo }}
                    style={{ width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: ORANGE }}
                />
            ) : (
                <View style={{
                    width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: ORANGE,
                    backgroundColor: ORANGE, alignItems: 'center', justifyContent: 'center',
                }}>
                    <Text style={{ fontSize: 24, fontWeight: '900', color: CREAM }}>{initial}</Text>
                </View>
            )}
            <Text style={{
                fontSize: 10, fontWeight: '800', color: BLACK,
                letterSpacing: 1, textTransform: 'uppercase', marginTop: 6,
            }} numberOfLines={1}>{item.firstName}</Text>
        </TouchableOpacity>
    );
};

// ─── Main Screen ────────────────────────────────────────────────────────────
export default function ChatListScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const matches = useQuery(api.swipes.getMatches);
    const pendingRequests = useQuery(api.swipes.getMySentRequests);
    const favorites = useQuery(api.users.getMyFavorites);
    const removeFavoriteMut = useMutation(api.users.removeFavorite);

    const isLoading = matches === undefined || pendingRequests === undefined;
    const hasPending = (pendingRequests?.length ?? 0) > 0;
    const hasMatches = (matches?.length ?? 0) > 0;
    const hasFavorites = (favorites?.length ?? 0) > 0;
    const hasAny = hasPending || hasMatches;

    const handleRemoveFavorite = (clerkId: string, name: string) => {
        Alert.alert(
            'Remove Favorite',
            `Remove ${name} from your favorites?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => removeFavoriteMut({ targetClerkId: clerkId }),
                },
            ]
        );
    };

    const handleFavoriteTap = (fav: { clerkId: string; firstName: string; photos: string[] }) => {
        navigation.navigate('ActiveChat', {
            matchName: fav.firstName.toUpperCase(),
            photo: fav.photos?.[0] ?? '',
            otherClerkId: fav.clerkId,
        });
    };

    return (
        <View style={[styles.root, { backgroundColor: CREAM, paddingTop: insets.top + 48 }]}>
            <StatusBar style="dark" />
            <Text style={styles.headline}>MESSAGES</Text>

            {isLoading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, color: 'rgba(13,13,13,0.4)', fontWeight: '600' }}>Loading...</Text>
                </View>
            ) : !hasAny && !hasFavorites ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 24 }}>
                    <Text style={{ fontSize: 16, color: 'rgba(13,13,13,0.4)', fontWeight: '600', textAlign: 'center', lineHeight: 26 }}>
                        No messages yet.{'\n'}Send a connection request to start a conversation.
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('TabHome')}
                        activeOpacity={0.85}
                        style={{ backgroundColor: BLACK, borderRadius: 32, paddingVertical: 14, paddingHorizontal: 28 }}
                    >
                        <Text style={{ fontSize: 11, fontWeight: '900', color: CREAM, letterSpacing: 2, textTransform: 'uppercase' }}>
                            GO TO HOME
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 120 }}
                    style={{ flex: 1 }}
                >
                    {/* ── Favorites Row ─────────────────────────────────────── */}
                    {hasFavorites && (
                        <>
                            <Text style={styles.sectionLabel}>FAVORITES</Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={{ marginBottom: 24 }}
                                contentContainerStyle={{ paddingRight: 16 }}
                            >
                                {favorites!.map(fav => (
                                    <FavoriteAvatar
                                        key={fav.clerkId}
                                        item={fav}
                                        onPress={() => handleFavoriteTap(fav)}
                                        onLongPress={() => handleRemoveFavorite(fav.clerkId, fav.firstName)}
                                    />
                                ))}
                            </ScrollView>
                        </>
                    )}

                    {hasPending && (
                        <>
                            <Text style={styles.sectionLabel}>PENDING REQUESTS</Text>
                            {pendingRequests!.map(item => (
                                <PendingCard key={String(item.swipeId)} item={item as PendingItem} />
                            ))}
                        </>
                    )}

                    {hasMatches && (
                        <>
                            {(hasPending || hasFavorites) && <Text style={[styles.sectionLabel, { marginTop: 24 }]}>MATCHES</Text>}
                            {matches!.map(item => (
                                <ChatCard key={String(item._id)} item={item as MatchItem} />
                            ))}
                        </>
                    )}
                </ScrollView>
            )}
        </View>
    );
}

// ─── Styles ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    root: {
        flex: 1,
        paddingHorizontal: 32,
    },
    headline: {
        // fontFamily removed — ArchivoBlack not loaded; fontWeight 900 provides the same effect
        fontSize: 64,
        color: BLACK,
        fontWeight: '900',
        marginBottom: 32,
        letterSpacing: -2,
    },
    sectionLabel: {
        fontSize: 10,
        fontWeight: '900',
        color: 'rgba(13,13,13,0.4)',
        letterSpacing: 3,
        textTransform: 'uppercase',
        marginBottom: 16,
    },
    cardWrapper: {
        width: '100%',
        marginBottom: 16,
    },
    card: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 24,
        borderRadius: 32,
        borderWidth: 1,
        borderColor: 'rgba(13,13,13,0.07)',
    },
    avatarContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        marginRight: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(13, 13, 13, 0.1)',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    nameText: {
        // fontFamily removed — ArchivoBlack not loaded; fontWeight 900 provides the same effect
        fontSize: 20,
        flex: 1,
        textTransform: 'uppercase',
    },
    timeText: {
        fontSize: 10,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginLeft: 8,
    },
    previewText: {
        fontSize: 14,
        fontWeight: '500',
    },
    pendingBadge: {
        backgroundColor: ORANGE,
        borderRadius: 12,
        paddingVertical: 3,
        paddingHorizontal: 10,
        marginLeft: 8,
    },
    pendingBadgeText: {
        fontSize: 9,
        fontWeight: '900',
        color: CREAM,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
});
