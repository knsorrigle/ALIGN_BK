import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Animated, Easing, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { BLACK, ORANGE } from '../../constants/colors';

const MIN_PHOTOS = 3;
const MAX_PHOTOS = 6;

const MediaSelectionScreen = () => {
    const navigation = useNavigation<any>();
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const saveProfilePhoto = useMutation(api.files.saveProfilePhoto);

    const [photos, setPhotos] = useState<(string | null)[]>(Array(MAX_PHOTOS).fill(null));
    const [uploading, setUploading] = useState<number | null>(null);

    const titleOpacity = useRef(new Animated.Value(0)).current;
    const gridOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.stagger(200, [
            Animated.timing(titleOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
            Animated.timing(gridOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        ]).start();
    }, []);

    const pickImage = async (index: number) => {
        if (uploading !== null) return;

        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (result.canceled || !result.assets?.[0]?.uri) return;

        const uri = result.assets[0].uri;
        setUploading(index);

        try {
            const uploadUrl = await generateUploadUrl();
            // Step 1: Read local file URI as a native Blob via XHR
            const blob: Blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = () => resolve(xhr.response);
                xhr.onerror = () => reject(new Error('Failed to read image file'));
                xhr.responseType = 'blob';
                xhr.open('GET', uri, true);
                xhr.send(null);
            });
            // Step 2: PUT the blob to Convex storage
            const uploadResponse = await fetch(uploadUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'image/jpeg' },
                body: blob,
            });
            if (!uploadResponse.ok) {
                const errText = await uploadResponse.text();
                throw new Error(`Upload failed (${uploadResponse.status}): ${errText}`);
            }
            const { storageId } = await uploadResponse.json();
            const cdnUrl = await saveProfilePhoto({ storageId, position: index });

            const newPhotos = [...photos];
            newPhotos[index] = (cdnUrl as string) || uri;
            setPhotos(newPhotos);
        } catch (err: any) {
            Alert.alert('Upload Failed', err?.message || 'Could not upload photo. Please try again.');
        } finally {
            setUploading(null);
        }
    };

    const filledCount = photos.filter(Boolean).length;
    const isReady = filledCount >= MIN_PHOTOS;

    return (
        <View className="flex-1 bg-cream relative">
            <SafeAreaView className="flex-1">
                {/* Header */}
                <View className="flex-row items-center justify-between px-6 py-4 mb-4">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="p-1"
                    >
                        <MaterialIcons name="arrow-back" size={32} color="black" />
                    </TouchableOpacity>
                    <Text className="text-xs font-bold uppercase opacity-40" style={{ letterSpacing: 4 }}>Step 05 / 05</Text>
                </View>

                <View className="flex-1 px-6">
                    {/* Header */}
                    <Animated.View style={{ opacity: titleOpacity }} className="mb-10">
                        <Text className="text-[80px] font-black uppercase text-black leading-[0.85]" style={{ letterSpacing: -1 }}>
                            VISUALS
                        </Text>
                        <Text className="text-xl font-thin text-black/80 leading-tight mt-2">
                            Add at least {MIN_PHOTOS} photos
                        </Text>
                    </Animated.View>

                    {/* Media Grid */}
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Animated.View style={{ opacity: gridOpacity }}>
                            <View className="flex-row flex-wrap gap-4 justify-between">
                                {photos.map((uri, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => pickImage(index)}
                                        style={{
                                            width: '47%',
                                            aspectRatio: 1,
                                            borderWidth: 2,
                                            borderColor: BLACK,
                                            borderRadius: 16,
                                            backgroundColor: 'rgba(255,255,255,0.5)',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        {uri ? (
                                            <Image source={{ uri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                                        ) : uploading === index ? (
                                            <ActivityIndicator size="large" color={ORANGE} />
                                        ) : (
                                            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
                                                <View style={{
                                                    width: 48, height: 48,
                                                    borderRadius: 24,
                                                    backgroundColor: index === 0 ? BLACK : 'rgba(0,0,0,0.08)',
                                                    alignItems: 'center', justifyContent: 'center',
                                                }}>
                                                    <MaterialIcons name="add" size={28} color={index === 0 ? '#fff' : 'rgba(0,0,0,0.35)'} />
                                                </View>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Requirement Text */}
                            <View className="mt-8 flex-col items-center gap-2 mb-10">
                                <Text className="text-[10px] font-black text-black uppercase opacity-60" style={{ letterSpacing: 2 }}>
                                    {filledCount} / {MIN_PHOTOS} REQUIRED
                                </Text>
                                <View className="h-[1px] w-12 bg-black/20" />
                            </View>
                        </Animated.View>
                    </ScrollView>
                </View>

                {/* Footer */}
                <View className="p-6">
                    <TouchableOpacity
                        style={{
                            width: '100%',
                            backgroundColor: isReady ? BLACK : 'rgba(0,0,0,0.2)',
                            alignItems: 'center',
                            paddingVertical: 16,
                            borderRadius: 32,
                        }}
                        disabled={!isReady}
                        onPress={() => navigation.navigate('VoicePrompt')}
                    >
                        <Text style={{
                            fontWeight: '900',
                            fontSize: 14,
                            letterSpacing: 2,
                            textTransform: 'uppercase',
                            color: isReady ? '#fff' : 'rgba(0,0,0,0.3)',
                        }}>Continue</Text>
                    </TouchableOpacity>
                    <Text className="text-center text-[9px] mt-4 text-black/40 uppercase" style={{ letterSpacing: -1, lineHeight: 14 }}>
                        By uploading media you agree to our creative terms of service.
                    </Text>
                </View>

            </SafeAreaView>
        </View>
    );
};

export default MediaSelectionScreen;
