import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BLACK, CREAM, ORANGE } from '../../constants/colors';

export default function MatchmakerScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();

    return (
        <View style={{ flex: 1, backgroundColor: CREAM }}>
            <StatusBar style="dark" />
            <View style={{ flex: 1, paddingTop: insets.top }}>
                {/* Header */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 }}>
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: '900',
                            color: BLACK,
                            fontStyle: 'italic',
                            letterSpacing: -0.5,
                        }}
                    >
                        ALIGN
                    </Text>
                    <View
                        style={{
                            backgroundColor: BLACK,
                            paddingHorizontal: 14,
                            paddingVertical: 6,
                            borderRadius: 20,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 11,
                                fontWeight: '900',
                                color: '#FFFFFF',
                                letterSpacing: 1.5,
                            }}
                        >
                            DAILY
                        </Text>
                    </View>
                </View>

                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Hero Title */}
                    <View style={{ marginBottom: 24, marginTop: 8 }}>
                        <Text
                            style={{
                                fontSize: 52,
                                fontWeight: '900',
                                color: BLACK,
                                letterSpacing: -2,
                                lineHeight: 52,
                                textTransform: 'uppercase',
                            }}
                        >
                            TODAY'S{'\n'}ALIGNMENT.
                        </Text>
                    </View>

                    {/* Alex Card — Top Pick */}
                    <TouchableOpacity
                        onPress={() => navigation.navigate('AlignAI')}
                        activeOpacity={0.9}
                        style={{
                            backgroundColor: BLACK,
                            borderRadius: 24,
                            padding: 24,
                            marginBottom: 12,
                            borderLeftWidth: 6,
                            borderLeftColor: ORANGE,
                        }}
                    >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
                            <Text
                                style={{
                                    fontSize: 36,
                                    fontWeight: '900',
                                    fontStyle: 'italic',
                                    color: '#FFFFFF',
                                    letterSpacing: -1,
                                }}
                            >
                                ALEX
                            </Text>
                            <Text
                                style={{
                                    fontSize: 36,
                                    fontWeight: '900',
                                    color: '#00C853',
                                    letterSpacing: -1,
                                }}
                            >
                                98%
                            </Text>
                        </View>

                        <Text
                            style={{
                                fontSize: 13,
                                fontWeight: '600',
                                color: 'rgba(255,255,255,0.85)',
                                textTransform: 'uppercase',
                                lineHeight: 20,
                                letterSpacing: -0.3,
                                marginBottom: 20,
                            }}
                        >
                            DESIGN LEAD. COFFEE ENTHUSIAST. BELIEVES IN MORNING RUNS AND BRUTALIST ARCHITECTURE. LOOKING FOR A GENUINE CONNECTION.
                        </Text>

                        <View
                            style={{
                                borderWidth: 1,
                                borderColor: '#FFFFFF',
                                paddingHorizontal: 10,
                                paddingVertical: 5,
                                alignSelf: 'flex-start',
                                borderRadius: 2,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 10,
                                    fontWeight: '900',
                                    color: '#FFFFFF',
                                    letterSpacing: 1.5,
                                }}
                            >
                                TOP PICK
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {/* Jordan Card */}
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={{
                            backgroundColor: BLACK,
                            borderRadius: 24,
                            padding: 24,
                            marginBottom: 12,
                        }}
                    >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                            <Text
                                style={{
                                    fontSize: 36,
                                    fontWeight: '900',
                                    fontStyle: 'italic',
                                    color: '#FFFFFF',
                                    letterSpacing: -1,
                                }}
                            >
                                JORDAN
                            </Text>
                            <Text
                                style={{
                                    fontSize: 36,
                                    fontWeight: '900',
                                    color: '#00C853',
                                    letterSpacing: -1,
                                }}
                            >
                                84%
                            </Text>
                        </View>

                        <Text
                            style={{
                                fontSize: 11,
                                fontWeight: '800',
                                color: '#00C853',
                                letterSpacing: 1.5,
                                textTransform: 'uppercase',
                            }}
                        >
                            SHARED: ART · TECH · TRAVEL
                        </Text>
                    </TouchableOpacity>
                </ScrollView>

                {/* Bottom Bar — Ask Align Anything */}
                <View
                    style={{
                        position: 'absolute',
                        bottom: 16,
                        left: 16,
                        right: 16,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => navigation.navigate('AlignAI')}
                        activeOpacity={0.9}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: BLACK,
                            paddingHorizontal: 20,
                            paddingVertical: 16,
                            borderRadius: 32,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 13,
                                fontWeight: '900',
                                color: '#FFFFFF',
                                letterSpacing: 1,
                                textTransform: 'uppercase',
                            }}
                        >
                            ASK ALIGN ANYTHING
                        </Text>
                        <Ionicons
                            name="arrow-forward"
                            size={20}
                            color="#FFFFFF"
                            style={{ transform: [{ rotate: '-45deg' }] }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
