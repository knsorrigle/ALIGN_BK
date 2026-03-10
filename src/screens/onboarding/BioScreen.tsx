import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BLACK, CREAM, ORANGE } from '../../constants/colors';
import { useUpdateOnboarding } from '../../hooks/useUpdateOnboarding';

const BIO_PROMPTS = [
    "I'm looking for...",
    "My friends say I...",
    "The best way to...",
    "I spend my weekends...",
    "A non-negotiable is..."
];

const BioScreen = () => {
    const navigation = useNavigation<any>();
    const saveField = useUpdateOnboarding();
    const [bio, setBio] = useState('');
    const contentOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(contentOpacity, { toValue: 1, duration: 600, delay: 200, useNativeDriver: true }).start();
    }, []);

    const handleContinue = async () => {
        await saveField({ publicBio: bio.trim() || null });
        navigation.navigate('DatingIntent');
    };

    const handlePromptSelect = (prompt: string) => {
        setBio(prev => {
            const prefix = prev ? prev + '\n' : '';
            return prefix + prompt + ' ';
        });
    };

    return (
        <View style={{ flex: 1, backgroundColor: CREAM }}>
            {/* Watermarks */}
            <View style={{ position: 'absolute', top: 10, left: -10, opacity: 0.04 }}>
                <Text style={{ fontSize: 100, fontWeight: '900', color: BLACK }}>WORDS</Text>
            </View>
            <View style={{ position: 'absolute', top: 120, right: -20, opacity: 0.04 }}>
                <Text style={{ fontSize: 80, fontWeight: '900', color: BLACK }}>STORY</Text>
            </View>

            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                    {/* Header */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16 }}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.06)' }}
                        >
                            <MaterialIcons name="arrow-back" size={24} color={BLACK} />
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Text style={{ fontSize: 11, fontWeight: '700', color: '#999', letterSpacing: 2, textTransform: 'uppercase' }}>Q10 / 30</Text>
                            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: ORANGE }} />
                        </View>
                    </View>

                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ paddingHorizontal: 32, paddingTop: 16 }}>
                        <Animated.View style={{ opacity: contentOpacity, flex: 1 }}>
                            <Text style={{ fontSize: 44, fontWeight: '900', color: BLACK, lineHeight: 42, marginBottom: 32, letterSpacing: -2, textTransform: 'uppercase' }}>
                                In your{'\n'}own words.
                            </Text>

                            <View style={{ flex: 1, minHeight: 200, marginBottom: 24 }}>
                                <TextInput
                                    style={{
                                        flex: 1,
                                        borderWidth: 2,
                                        borderColor: '#E0DDD8',
                                        borderRadius: 24,
                                        padding: 24,
                                        color: BLACK,
                                        fontSize: 16,
                                        lineHeight: 24,
                                        textAlignVertical: 'top',
                                    }}
                                    multiline
                                    placeholder="Write something real. Not your resume."
                                    placeholderTextColor="#BBB"
                                    maxLength={300}
                                    value={bio}
                                    onChangeText={setBio}
                                    selectionColor={ORANGE}
                                />
                                <Text style={{ position: 'absolute', bottom: 16, right: 16, fontSize: 11, color: '#BBB' }}>
                                    {bio.length}/300
                                </Text>
                            </View>

                            {/* Prompt Chips */}
                            <View style={{ marginBottom: 32 }}>
                                <Text style={{ fontSize: 10, color: '#999', fontWeight: '700', marginBottom: 12, letterSpacing: 1, textTransform: 'uppercase' }}>Need a spark?</Text>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                                    {BIO_PROMPTS.map((prompt, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            onPress={() => handlePromptSelect(prompt)}
                                            style={{ paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1.5, borderColor: '#E0DDD8', borderRadius: 20 }}
                                        >
                                            <Text style={{ fontSize: 12, color: BLACK, fontWeight: '600' }}>{prompt}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </Animated.View>
                    </ScrollView>

                    {/* Footer */}
                    <View style={{ paddingHorizontal: 24, paddingBottom: 24, paddingTop: 8 }}>
                        <TouchableOpacity onPress={handleContinue} style={{ alignItems: 'center', marginBottom: 12 }}>
                            <Text style={{ color: ORANGE, fontSize: 13, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' }}>Skip for now</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleContinue}
                            style={{ paddingVertical: 16, borderRadius: 32, alignItems: 'center', backgroundColor: BLACK }}
                        >
                            <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' }}>CONTINUE</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
};

export default BioScreen;
