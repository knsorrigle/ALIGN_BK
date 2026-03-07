import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { BLACK, CREAM, ORANGE } from '../../constants/colors';

const ID_TYPES = ['AADHAAR', 'PAN', 'DRIVING LICENSE'];

const IdUploadScreen = () => {
    const navigation = useNavigation<any>();
    const [selectedIdType, setSelectedIdType] = useState<string>(ID_TYPES[0]);
    const [image, setImage] = useState<string | null>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) setImage(result.assets[0].uri);
    };

    return (
        <View style={{ flex: 1, backgroundColor: CREAM }}>
            {/* Watermarks */}
            <View style={{ position: 'absolute', top: 10, left: -20, opacity: 0.04 }}>
                <Text style={{ fontSize: 100, fontWeight: '900', color: BLACK }}>VERIFIED</Text>
            </View>
            <View style={{ position: 'absolute', bottom: 100, right: -10, opacity: 0.04 }}>
                <Text style={{ fontSize: 100, fontWeight: '900', color: BLACK }}>SECURE</Text>
            </View>

            <SafeAreaView style={{ flex: 1 }}>
                {/* Progress Bar */}
                <View style={{ height: 3, backgroundColor: '#E0DDD8' }}>
                    <View style={{ height: '100%', backgroundColor: ORANGE, width: '18%' }} />
                </View>

                {/* Header accent */}
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 24 }}>
                    <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: ORANGE }} />
                </View>

                <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ paddingHorizontal: 24 }}>
                    <Animated.View style={{ opacity: fadeAnim }}>
                        <View style={{ marginTop: 4, marginBottom: 40 }}>
                            <Text style={{ fontSize: 52, fontWeight: '900', color: BLACK, lineHeight: 50, letterSpacing: -1, textTransform: 'uppercase' }}>
                                Prove{'\n'}You're{'\n'}Real.
                            </Text>
                        </View>

                        {/* ID Chips */}
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
                            {ID_TYPES.map((type) => (
                                <TouchableOpacity
                                    key={type}
                                    onPress={() => setSelectedIdType(type)}
                                    style={{
                                        paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
                                        borderWidth: 1.5,
                                        borderColor: selectedIdType === type ? BLACK : '#E0DDD8',
                                        backgroundColor: selectedIdType === type ? BLACK : 'transparent',
                                    }}
                                >
                                    <Text style={{ fontSize: 11, fontWeight: '700', color: selectedIdType === type ? '#FFFFFF' : BLACK }}>{type}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Upload Zone */}
                        <TouchableOpacity
                            onPress={pickImage}
                            style={{
                                width: '100%', aspectRatio: 4 / 3, borderWidth: 2, borderStyle: 'dashed',
                                borderColor: '#E0DDD8', borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 40,
                            }}
                        >
                            {image ? (
                                <View style={{ alignItems: 'center' }}>
                                    <MaterialIcons name="check-circle" size={48} color="#00C853" />
                                    <Text style={{ fontSize: 13, fontWeight: '700', color: BLACK, marginTop: 8 }}>Image Selected</Text>
                                </View>
                            ) : (
                                <>
                                    <MaterialCommunityIcons name="upload" size={48} color={BLACK} />
                                    <Text style={{ fontSize: 12, fontWeight: '900', color: BLACK, letterSpacing: 1, marginTop: 12, textTransform: 'uppercase' }}>Tap to Upload</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <Text style={{ fontSize: 10, color: '#BBB', textAlign: 'center', letterSpacing: 1, textTransform: 'uppercase', lineHeight: 16 }}>
                            Your ID is encrypted and deleted after 30 days.
                        </Text>
                    </Animated.View>
                </ScrollView>

                {/* Footer */}
                <View style={{ padding: 24 }}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('LivenessCheck')}
                        style={{ paddingVertical: 16, borderRadius: 32, alignItems: 'center', backgroundColor: BLACK }}
                    >
                        <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '900', letterSpacing: 2, textTransform: 'uppercase' }}>CONTINUE</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default IdUploadScreen;
