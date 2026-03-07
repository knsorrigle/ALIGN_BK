import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated, Easing, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { X } from 'lucide-react-native';
import { BLACK, CREAM, ORANGE } from '../constants/colors';

const REASONS = [
    { id: 'fake', label: 'Fake Profile', icon: 'person-off' },
    { id: 'harassment', label: 'Harassment', icon: 'warning' },
    { id: 'inappropriate', label: 'Inappropriate Content', icon: 'block' },
    { id: 'spam', label: 'Spam', icon: 'mark-email-unread' },
    { id: 'other', label: 'Other', icon: 'more-horiz' },
];

const ReportScreen = () => {
    const navigation = useNavigation<any>();
    const [selectedReason, setSelectedReason] = useState<string | null>(null);
    const [note, setNote] = useState('');

    const titleY = useRef(new Animated.Value(30)).current;
    const titleOpacity = useRef(new Animated.Value(0)).current;
    const contentOpacity = useRef(new Animated.Value(0)).current;
    const contentY = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(titleY, { toValue: 0, duration: 500, easing: Easing.bezier(0.22, 1, 0.36, 1), useNativeDriver: true }),
            Animated.timing(titleOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.sequence([
                Animated.delay(200),
                Animated.parallel([
                    Animated.timing(contentOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
                    Animated.timing(contentY, { toValue: 0, duration: 500, easing: Easing.bezier(0.22, 1, 0.36, 1), useNativeDriver: true }),
                ]),
            ]),
        ]).start();
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: CREAM }}>
            {/* Watermark */}
            <View style={{ position: 'absolute', top: 40, left: -16, opacity: 0.04, pointerEvents: 'none' }}>
                <Text style={{ fontSize: 130, fontWeight: '900', color: BLACK, letterSpacing: -4 }}>
                    REPORT
                </Text>
            </View>
            {/* Red accent dot */}
            <View style={{ position: 'absolute', top: 80, right: 24, width: 12, height: 12, borderRadius: 6, backgroundColor: '#E03A2F' }} />

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
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 9, fontWeight: '800', color: 'rgba(0,0,0,0.4)', letterSpacing: 2, textTransform: 'uppercase' }}>Reporting</Text>
                        <Text style={{ fontSize: 11, fontWeight: '900', color: BLACK, letterSpacing: 1, textTransform: 'uppercase' }}>@ALEX_VANCE_92</Text>
                    </View>
                </View>

                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

                    {/* Title */}
                    <Animated.View style={{ opacity: titleOpacity, transform: [{ translateY: titleY }], marginBottom: 32, marginTop: 8 }}>
                        <Text style={{ fontSize: 64, fontWeight: '900', color: BLACK, letterSpacing: -2, lineHeight: 60, textTransform: 'uppercase' }}>
                            REPORT{'\n'}USER.
                        </Text>
                        <Text style={{ fontSize: 13, fontWeight: '500', color: 'rgba(0,0,0,0.45)', marginTop: 12, lineHeight: 20 }}>
                            Help us keep Align safe. Select the reason that best describes the issue.
                        </Text>
                    </Animated.View>

                    {/* Reason Cards */}
                    <Animated.View style={{ opacity: contentOpacity, transform: [{ translateY: contentY }], gap: 10 }}>
                        {REASONS.map((reason) => {
                            const isSelected = selectedReason === reason.id;
                            return (
                                <TouchableOpacity
                                    key={reason.id}
                                    onPress={() => setSelectedReason(reason.id)}
                                    activeOpacity={0.85}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: 20,
                                        borderRadius: 20,
                                        borderWidth: 2,
                                        borderColor: isSelected ? '#E03A2F' : 'rgba(0,0,0,0.08)',
                                        backgroundColor: isSelected ? '#E03A2F' : '#FFFFFF',
                                    }}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                                        <View style={{
                                            width: 36, height: 36, borderRadius: 18,
                                            backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)',
                                            alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <MaterialIcons name={reason.icon as any} size={18} color={isSelected ? CREAM : 'rgba(0,0,0,0.5)'} />
                                        </View>
                                        <Text style={{ fontSize: 15, fontWeight: '700', color: isSelected ? CREAM : BLACK, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                            {reason.label}
                                        </Text>
                                    </View>
                                    <View style={{
                                        width: 22, height: 22, borderRadius: 11,
                                        borderWidth: 2,
                                        borderColor: isSelected ? CREAM : 'rgba(0,0,0,0.2)',
                                        backgroundColor: isSelected ? CREAM : 'transparent',
                                        alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        {isSelected && <MaterialIcons name="check" size={13} color="#E03A2F" />}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}

                        {/* Optional Note */}
                        <View style={{ marginTop: 8 }}>
                            <Text style={{ fontSize: 10, fontWeight: '800', color: 'rgba(0,0,0,0.35)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>
                                ADDITIONAL NOTES (OPTIONAL)
                            </Text>
                            <TextInput
                                value={note}
                                onChangeText={setNote}
                                placeholder="Describe what happened..."
                                placeholderTextColor="rgba(0,0,0,0.25)"
                                multiline
                                maxLength={300}
                                style={{
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: 20,
                                    borderWidth: 2,
                                    borderColor: 'rgba(0,0,0,0.08)',
                                    padding: 18,
                                    fontSize: 14,
                                    fontWeight: '500',
                                    color: BLACK,
                                    minHeight: 100,
                                    textAlignVertical: 'top',
                                }}
                            />
                            <Text style={{ textAlign: 'right', fontSize: 10, fontWeight: '700', color: 'rgba(0,0,0,0.2)', marginTop: 6 }}>{note.length}/300</Text>
                        </View>

                        {/* Submit */}
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            disabled={!selectedReason}
                            activeOpacity={0.85}
                            style={{
                                marginTop: 8,
                                backgroundColor: selectedReason ? BLACK : 'rgba(0,0,0,0.1)',
                                borderRadius: 32,
                                paddingVertical: 18,
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{ fontSize: 14, fontWeight: '900', color: selectedReason ? CREAM : 'rgba(0,0,0,0.3)', letterSpacing: 2, textTransform: 'uppercase' }}>
                                Submit Report
                            </Text>
                        </TouchableOpacity>

                        <Text style={{ textAlign: 'center', fontSize: 10, fontWeight: '600', color: 'rgba(0,0,0,0.3)', marginTop: 12, lineHeight: 16 }}>
                            Reports are reviewed within 24 hours.{'\n'}We take every report seriously.
                        </Text>
                    </Animated.View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default ReportScreen;
