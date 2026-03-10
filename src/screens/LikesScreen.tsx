import React from 'react';
import { View, Text, ImageBackground, FlatList, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { BLACK, CREAM, ORANGE } from '../constants/colors';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

const { width } = Dimensions.get('window');

type LikeItem = {
    _id: any;
    clerkId: string;
    name: string;
    photos: string[];
    swipedAt: number;
};

const LikeCard = ({ item, onViewProfile }: { item: LikeItem; onViewProfile: (item: LikeItem) => void }) => {
    const hoverAnim = React.useRef(new Animated.Value(0)).current;

    const handlePressIn = () => {
        Animated.timing(hoverAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    };

    const handlePressOut = () => {
        Animated.timing(hoverAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
    };

    const darkOverlayOpacity = hoverAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const photoUri = item.photos[0];

    return (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={1}
            onPress={() => onViewProfile(item)}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
        >
            <ImageBackground
                source={photoUri ? { uri: photoUri } : undefined}
                style={styles.image}
                imageStyle={{ borderRadius: 32 }}
                resizeMode="cover"
            >
                <Animated.View
                    style={[
                        StyleSheet.absoluteFillObject,
                        { backgroundColor: 'rgba(13, 13, 13, 0.2)', opacity: darkOverlayOpacity }
                    ]}
                />
                <View style={styles.overlay}>
                    <Text style={styles.name} numberOfLines={1}>{item.name?.toUpperCase()}</Text>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );
};

export default function LikesScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const pendingLikes = useQuery(api.swipes.getPendingLikes);

    const onViewProfile = (user: LikeItem) => {
        navigation.navigate('ProfileDetail', { userId: user._id });
    };

    const renderItem = ({ item }: { item: LikeItem }) => (
        <LikeCard item={item} onViewProfile={onViewProfile} />
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top + 48 }]}>
            <StatusBar style="dark" />

            <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 36 }}>
                <Text style={styles.headline}>LIKES</Text>
                {pendingLikes !== undefined && (
                    <Text style={styles.countLabel}>{pendingLikes.length}</Text>
                )}
            </View>

            <Text style={styles.sortLabel}>MOST RECENT</Text>

            {pendingLikes === undefined ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, color: 'rgba(13,13,13,0.4)', fontWeight: '600' }}>Loading...</Text>
                </View>
            ) : pendingLikes.length === 0 ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 24 }}>
                    <Text style={{ fontSize: 16, color: 'rgba(13,13,13,0.4)', fontWeight: '600', textAlign: 'center' }}>
                        No likes yet.{'\n'}Keep using Align!
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
                <FlatList
                    data={pendingLikes}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.clerkId}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 120 }}
                />
            )}
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
        // fontFamily removed — ArchivoBlack not loaded
        fontSize: 64,
        fontWeight: '900',
        color: BLACK,
        letterSpacing: -2,
    },
    countLabel: {
        fontSize: 24,
        fontWeight: '900',
        color: ORANGE,
        letterSpacing: -1,
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
        width: (width - 64 - 16) / 2,
        aspectRatio: 3 / 4,
        borderRadius: 32,
        backgroundColor: '#FFFFFF',
        borderColor: 'rgba(13, 13, 13, 0.07)',
        borderWidth: 1,
        marginBottom: 16,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
    },
    overlay: {
        position: 'absolute',
        bottom: 24,
        left: 24,
        right: 16,
    },
    name: {
        // fontFamily removed — ArchivoBlack not loaded
        fontSize: 24,
        color: '#FFFFFF',
        textTransform: 'uppercase',
        fontWeight: '900',
    },
});
