import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
// import * as ImagePicker from 'expo-image-picker'; // Commented out due to install issues

const MediaSelectionScreen = () => {
    const navigation = useNavigation<any>();
    const [media, setMedia] = useState<(string | null)[]>([null, null, null, null, null, null]);

    // Animations
    const titleOpacity = useRef(new Animated.Value(0)).current;
    const gridOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.stagger(200, [
            Animated.timing(titleOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
            Animated.timing(gridOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        ]).start();
    }, []);

    const pickImage = async (index: number) => {
        // Mock implementation for now since package install failed
        alert("Image picker requires 'expo-image-picker' which failed to install. This is a mock action.");
        /*
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            const newMedia = [...media];
            newMedia[index] = result.assets[0].uri;
            setMedia(newMedia);
        }
        */
    };

    return (
        <View className="flex-1 bg-cream relative">
            <SafeAreaView className="flex-1">
                {/* Header */}
                <View className="flex-row items-center justify-between px-6 py-4 mb-4">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="p-1 hover:bg-black/5"
                    >
                        <MaterialIcons name="arrow-back" size={32} color="black" />
                    </TouchableOpacity>
                    <Text className="text-xs font-bold uppercase opacity-40" style={{ letterSpacing: 4 }}>Step 05 / 05</Text>
                </View>

                <View className="flex-1 px-6">
                    {/* Massive Header */}
                    <Animated.View style={{ opacity: titleOpacity }} className="mb-10">
                        <Text className="text-[80px] font-black uppercase text-black leading-[0.85]" style={{ letterSpacing: -1 }}>
                            VISUALS
                        </Text>
                        <Text className="text-xl font-thin text-black/80 leading-tight mt-2">
                            Pick your photos and videos
                        </Text>
                    </Animated.View>

                    {/* Media Grid */}
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Animated.View style={{ opacity: gridOpacity }}>
                            <View className="flex-row flex-wrap gap-4 justify-between">
                                {media.map((uri, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => pickImage(index)}
                                        className="w-[47%] aspect-square border-2 border-black bg-white/50 items-center justify-center overflow-hidden relative"
                                    >
                                        {uri ? (
                                            <Image source={{ uri }} className="w-full h-full" resizeMode="cover" />
                                        ) : (
                                            index === 0 ? (
                                                <View className="w-16 h-16 bg-[#0000FF] rounded-full items-center justify-center">
                                                    <MaterialIcons name="add" size={32} color="white" />
                                                </View>
                                            ) : (
                                                <MaterialIcons name="add" size={40} color="rgba(0,0,0,0.2)" />
                                            )
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Requirement Text */}
                            <View className="mt-8 flex-col items-center gap-2 mb-10">
                                <Text className="text-[10px] font-black text-black uppercase opacity-60" style={{ letterSpacing: 2 }}>
                                    6 REQUIRED
                                </Text>
                                <View className="h-[1px] w-12 bg-black/20" />
                            </View>
                        </Animated.View>
                    </ScrollView>
                </View>

                {/* Footer */}
                <View className="p-6">
                    <TouchableOpacity
                        className="w-full bg-primary items-center py-4 rounded-full shadow-lg active:scale-95"
                        onPress={() => navigation.navigate('VoicePrompt')}
                    >
                        <Text className="text-white font-bold uppercase text-sm" style={{ letterSpacing: 1 }}>Continue to Layout</Text>
                    </TouchableOpacity>
                    <Text className="text-center text-[9px] mt-4 text-black/40 uppercase leading-none" style={{ letterSpacing: -1 }}>
                        By uploading media you agree to our creative terms of service.
                    </Text>
                </View>

            </SafeAreaView>
        </View>
    );
};

export default MediaSelectionScreen;
