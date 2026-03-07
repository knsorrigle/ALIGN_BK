import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BLACK, CREAM, ORANGE } from '../../constants/colors';

type IconName = React.ComponentProps<typeof MaterialIcons>['name'];

const SECTIONS = [
    {
        title: 'Account',
        items: [
            { label: 'Profile Information', icon: 'person' as IconName, sub: 'Name, bio, photos' },
            { label: 'Email Preferences', icon: 'mail-outline' as IconName, sub: 'Notifications & updates' },
        ],
    },
    {
        title: 'Privacy',
        items: [
            { label: 'Visibility Settings', icon: 'visibility' as IconName, sub: 'Who can see your profile' },
            { label: 'Blocked Users', icon: 'block' as IconName, sub: 'Manage blocked accounts' },
        ],
    },
    {
        title: 'Support',
        items: [
            { label: 'Help Center', icon: 'help-outline' as IconName, sub: 'FAQs & guides' },
            { label: 'Contact Us', icon: 'chat-bubble-outline' as IconName, sub: 'Reach our team' },
            { label: 'About', icon: 'info-outline' as IconName, sub: 'Version, legal & licenses' },
        ],
    },
];

export default function SettingsScreen() {
    const navigation = useNavigation<any>();

    const titleY = useRef(new Animated.Value(30)).current;
    const titleOpacity = useRef(new Animated.Value(0)).current;
    const contentOpacity = useRef(new Animated.Value(0)).current;
    const contentY = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(titleY, { toValue: 0, duration: 500, easing: Easing.bezier(0.22, 1, 0.36, 1), useNativeDriver: true }),
            Animated.timing(titleOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.sequence([
                Animated.delay(180),
                Animated.parallel([
                    Animated.timing(contentOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
                    Animated.timing(contentY, { toValue: 0, duration: 500, easing: Easing.bezier(0.22, 1, 0.36, 1), useNativeDriver: true }),
                ]),
            ]),
        ]).start();
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: CREAM, overflow: 'hidden' }}>
            {/* Watermark */}
            <View style={{ position: 'absolute', top: 30, left: -16, opacity: 0.035, pointerEvents: 'none' }}>
                <Text style={{ fontSize: 120, fontWeight: '900', color: BLACK, letterSpacing: -4 }}>
                    SETTINGS
                </Text>
            </View>
            {/* Orange accent */}
            <View style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: 70, backgroundColor: ORANGE, opacity: 0.12 }} />

            <SafeAreaView style={{ flex: 1 }}>
                {/* Header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16 }}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.06)', alignItems: 'center', justifyContent: 'center' }}
                        activeOpacity={0.8}
                    >
                        <MaterialIcons name="arrow-back" size={22} color={BLACK} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 9, fontWeight: '800', color: 'rgba(0,0,0,0.4)', letterSpacing: 2, textTransform: 'uppercase' }}>
                        YOUR ACCOUNT
                    </Text>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 60 }}
                >
                    {/* Title */}
                    <Animated.View style={{ opacity: titleOpacity, transform: [{ translateY: titleY }], marginBottom: 32, marginTop: 8 }}>
                        <Text style={{ fontSize: 64, fontWeight: '900', color: BLACK, letterSpacing: -2, lineHeight: 60, textTransform: 'uppercase' }}>
                            SETTINGS.
                        </Text>
                        <Text style={{ fontSize: 13, fontWeight: '500', color: 'rgba(0,0,0,0.45)', marginTop: 12 }}>
                            Your account. Your rules.
                        </Text>
                    </Animated.View>

                    <Animated.View style={{ opacity: contentOpacity, transform: [{ translateY: contentY }] }}>

                        {/* Premium Banner */}
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Subscription')}
                            activeOpacity={0.88}
                            style={{
                                backgroundColor: BLACK,
                                borderRadius: 22,
                                padding: 20,
                                marginBottom: 28,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 10, fontWeight: '800', color: ORANGE, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>
                                    Align Premium
                                </Text>
                                <Text style={{ fontSize: 16, fontWeight: '900', color: CREAM, letterSpacing: -0.5, textTransform: 'uppercase' }}>
                                    Upgrade Your Plan
                                </Text>
                                <Text style={{ fontSize: 11, fontWeight: '500', color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>
                                    Unlimited AI, extended radius & more
                                </Text>
                            </View>
                            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: ORANGE, alignItems: 'center', justifyContent: 'center' }}>
                                <MaterialIcons name="arrow-forward" size={20} color={CREAM} />
                            </View>
                        </TouchableOpacity>

                        {/* Settings Sections */}
                        {SECTIONS.map((section) => (
                            <View key={section.title} style={{ marginBottom: 24 }}>
                                <Text style={{ fontSize: 10, fontWeight: '800', color: 'rgba(0,0,0,0.35)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>
                                    {section.title}
                                </Text>
                                <View style={{ borderRadius: 22, overflow: 'hidden', backgroundColor: '#FFFFFF' }}>
                                    {section.items.map((item, idx) => (
                                        <TouchableOpacity
                                            key={item.label}
                                            activeOpacity={0.75}
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                paddingVertical: 16,
                                                paddingHorizontal: 18,
                                                borderBottomWidth: idx < section.items.length - 1 ? 1 : 0,
                                                borderBottomColor: 'rgba(0,0,0,0.06)',
                                            }}
                                        >
                                            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.05)', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                                                <MaterialIcons name={item.icon} size={18} color={BLACK} />
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ fontSize: 14, fontWeight: '700', color: BLACK, letterSpacing: 0.2 }}>{item.label}</Text>
                                                <Text style={{ fontSize: 11, fontWeight: '500', color: 'rgba(0,0,0,0.4)', marginTop: 1 }}>{item.sub}</Text>
                                            </View>
                                            <MaterialIcons name="chevron-right" size={20} color="rgba(0,0,0,0.25)" />
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        ))}

                        {/* Danger Zone */}
                        <View style={{ marginBottom: 32 }}>
                            <Text style={{ fontSize: 10, fontWeight: '800', color: 'rgba(0,0,0,0.35)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>
                                Danger Zone
                            </Text>
                            <View style={{ borderRadius: 22, overflow: 'hidden', backgroundColor: '#FFFFFF' }}>
                                <TouchableOpacity
                                    activeOpacity={0.75}
                                    style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 18 }}
                                >
                                    <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(224,58,47,0.08)', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                                        <MaterialIcons name="delete-outline" size={18} color="#E03A2F" />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 14, fontWeight: '700', color: '#E03A2F', letterSpacing: 0.2 }}>Delete Account</Text>
                                        <Text style={{ fontSize: 11, fontWeight: '500', color: 'rgba(224,58,47,0.5)', marginTop: 1 }}>This cannot be undone</Text>
                                    </View>
                                    <MaterialIcons name="chevron-right" size={20} color="rgba(224,58,47,0.3)" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Sign Out */}
                        <TouchableOpacity
                            activeOpacity={0.85}
                            style={{
                                backgroundColor: BLACK,
                                borderRadius: 32,
                                paddingVertical: 18,
                                alignItems: 'center',
                                marginBottom: 20,
                            }}
                        >
                            <Text style={{ fontSize: 14, fontWeight: '900', color: CREAM, letterSpacing: 2, textTransform: 'uppercase' }}>
                                Sign Out
                            </Text>
                        </TouchableOpacity>

                        {/* Version */}
                        <Text style={{ textAlign: 'center', fontSize: 10, fontWeight: '600', color: 'rgba(0,0,0,0.25)', letterSpacing: 1, textTransform: 'uppercase' }}>
                            Align v1.0.4 · 2024
                        </Text>

                    </Animated.View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
