import React, { useRef } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ImageBackground,
    Animated,
    StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { Star } from 'lucide-react-native';
import { BLACK, CREAM, ORANGE } from '../constants/colors';

// ─── Dummy Data ─────────────────────────────────────────────────────────────
const CONVERSATIONS = [
    {
        id: '1',
        name: 'MAYA',
        time: '2M',
        preview: "I think we both know that's not true...",
        photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&q=80',
        isFavorited: true,
    },
    {
        id: '2',
        name: 'JORDAN',
        time: '2H',
        preview: "Are you free this weekend for coffee?",
        photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80',
        isFavorited: false,
    },
    {
        id: '3',
        name: 'ALEX',
        time: '1D',
        preview: 'Haha exactly. Let me check my calendar.',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
        isFavorited: true,
    },
];

// ─── Conversation Card ──────────────────────────────────────────────────────
const ChatCard = ({ item }: { item: typeof CONVERSATIONS[0] }) => {
    const navigation = useNavigation<any>();
    const hoverAnim = useRef(new Animated.Value(0)).current;

    const handlePressIn = () => {
        Animated.timing(hoverAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: false, // Animating colors safely
        }).start();
    };

    const handlePressOut = () => {
        Animated.timing(hoverAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    const handlePress = () => {
        // Navigate to the Active Chat Modal
        navigation.navigate('ActiveChat', { matchName: item.name, photo: item.photo });
    };

    // Interpolations for inversion effect
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

    // Grayscale overlay opacity logic (1 = uncolored/grayscale, 0 = colored)
    const grayscaleOpacity = hoverAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
    });

    return (
        <TouchableOpacity
            activeOpacity={1}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePress}
            style={styles.cardWrapper}
        >
            <Animated.View style={[
                styles.card,
                { backgroundColor },
                item.isFavorited && { borderLeftWidth: 4, borderLeftColor: ORANGE, paddingLeft: 20 }
            ]}>
                {/* Avatar */}
                <View style={styles.avatarContainer}>
                    <ImageBackground
                        source={{ uri: item.photo }}
                        style={StyleSheet.absoluteFillObject}
                        imageStyle={{ borderRadius: 32 }}
                    />
                </View>

                {/* Content Right */}
                <View style={styles.contentContainer}>
                    <View style={styles.topRow}>
                        <Animated.Text style={[styles.nameText, { color: textColor }]}>
                            {item.name}
                        </Animated.Text>
                        <Animated.Text style={[styles.timeText, { color: subTextColor }]}>
                            {item.time}
                        </Animated.Text>
                    </View>
                    <Animated.Text
                        style={[styles.previewText, { color: subTextColor }]}
                        numberOfLines={1}
                    >
                        {item.preview}
                    </Animated.Text>
                </View>
            </Animated.View>
        </TouchableOpacity>
    );
};

// ─── Main Screen ────────────────────────────────────────────────────────────
import { SectionList } from 'react-native';

export default function ChatListScreen() {
    const insets = useSafeAreaInsets();

    const renderItem = ({ item }: { item: typeof CONVERSATIONS[0] }) => (
        <ChatCard item={item} />
    );

    const favorites = CONVERSATIONS.filter(c => c.isFavorited);
    const recent = CONVERSATIONS.filter(c => !c.isFavorited);

    const sections = [];
    if (favorites.length > 0) sections.push({ type: 'favorites', data: favorites });
    if (recent.length > 0) sections.push({ type: 'recent', data: recent });

    return (
        <View style={[styles.root, { backgroundColor: CREAM, paddingTop: insets.top + 48 }]}>
            <StatusBar style="dark" />
            <Text style={styles.headline}>MESSAGES</Text>

            <SectionList
                sections={sections}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
                style={{ flex: 1 }}
                renderSectionHeader={({ section }) => {
                    if (section.type === 'favorites') {
                        return (
                            <View style={styles.favHeader}>
                                <Star size={12} color={ORANGE} fill={ORANGE} />
                                <Text style={styles.favHeaderText}>FAVOURITES</Text>
                            </View>
                        );
                    }
                    return <View style={{ height: 16 }} />;
                }}
            />
        </View>
    );
}

// ─── Styles ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    root: {
        flex: 1,
        paddingHorizontal: 32, // px-8
    },
    headline: {
        fontFamily: 'ArchivoBlack_400Regular',
        fontSize: 64, // From user snippet
        color: BLACK,
        fontWeight: '900',
        marginBottom: 32,
        letterSpacing: -2,
    },
    favHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 16,
    },
    favHeaderText: {
        fontSize: 10,
        fontWeight: '800',
        color: 'rgba(13,13,13,0.4)',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    // Card Styles
    cardWrapper: {
        width: '100%',
        marginBottom: 16,
    },
    card: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 24, // p-6
        borderRadius: 32,
        borderWidth: 1,
        borderColor: 'rgba(13,13,13,0.07)', // border-ink/7
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
        alignItems: 'baseline',
        marginBottom: 4,
    },
    nameText: {
        fontFamily: 'ArchivoBlack_400Regular',
        fontSize: 24, // text-2xl
        flex: 1,
        textTransform: 'uppercase',
    },
    timeText: {
        fontSize: 10,
        fontWeight: '800', // bold
        textTransform: 'uppercase',
        letterSpacing: 2, // highly tracked out
        marginLeft: 8,
    },
    previewText: {
        fontSize: 14, // text-sm
        fontWeight: '500', // medium weight
    },
});
