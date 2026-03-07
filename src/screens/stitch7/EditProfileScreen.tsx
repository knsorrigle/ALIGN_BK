import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { BauhausWrapper, BauhausInput, BauhausHeader } from '../../components/BauhausComponents';
import { Ionicons } from '@expo/vector-icons';

const PhotoSlot = ({ imageUri, isEmpty = false }: { imageUri?: string; isEmpty?: boolean }) => (
    <TouchableOpacity
        className={`aspect-square border-2 border-align-black relative ${isEmpty ? 'bg-align-black/5 items-center justify-center' : 'bg-zinc-300'}`}
    >
        {isEmpty ? (
            <Text className="text-2xl font-bold">+</Text>
        ) : (
            <>
                <Image source={{ uri: imageUri }} className="w-full h-full" resizeMode="cover" />
                <View className="absolute -top-2 -right-2 bg-align-black w-6 h-6 items-center justify-center border border-white z-10">
                    <Text className="text-white text-xs font-bold">✕</Text>
                </View>
            </>
        )}
    </TouchableOpacity>
);

const Tag = ({ label, isSelected = false }: { label: string; isSelected?: boolean }) => (
    <TouchableOpacity
        className={`border border-align-black px-3 py-1 mr-1 mb-1 ${isSelected ? 'bg-align-black' : 'bg-transparent'}`}
    >
        <Text className={`text-xs font-bold uppercase ${isSelected ? 'text-white' : 'text-align-black'}`}>
            {label}
        </Text>
    </TouchableOpacity>
);

const IntentBox = ({ label, isSelected = false }: { label: string; isSelected?: boolean }) => (
    <TouchableOpacity
        className={`border-2 border-align-black p-3 items-center justify-center ${isSelected ? 'bg-align-black' : 'bg-transparent'}`}
    >
        <Text className={`font-bold text-xs uppercase ${isSelected ? 'text-align-cream-2' : 'text-align-black'}`}>
            {label}
        </Text>
    </TouchableOpacity>
);

export default function EditProfileScreen() {
    const insets = useSafeAreaInsets();
    const [bio, setBio] = useState("Digital architect based in Brooklyn. I like raw concrete, brutalist layouts, and overpriced espresso. Not here for small talk.");

    return (
        <View className="flex-1 bg-align-cream-2">
            <StatusBar style="dark" />
            <BauhausWrapper watermarkText="PROFILE · REAL · YOU · EDIT · ALIGN">
                {/* Header */}
                <View className="flex-row justify-between items-center p-6 border-b-2 border-align-black/5 bg-align-cream-2 sticky top-0 z-50">
                    <TouchableOpacity>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-align-black px-6 py-2">
                        <Text className="text-align-cream-2 font-bold text-sm uppercase" style={{ letterSpacing: 1 }}>SAVE</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
                    {/* Main Heading */}
                    <View className="relative mb-12">
                        <Text className="text-7xl font-black leading-[0.8] text-align-black" style={{ letterSpacing: -1 }}>
                            YOUR{'\n'}PROFILE.
                        </Text>
                        <View className="absolute -top-2 -right-2 w-4 h-4 bg-cream" />
                    </View>

                    {/* Photo Grid */}
                    <View className="mb-10">
                        <View className="flex-row flex-wrap -mx-1">
                            <View className="w-1/3 px-1 mb-2">
                                <PhotoSlot imageUri="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" />
                            </View>
                            <View className="w-1/3 px-1 mb-2">
                                <PhotoSlot imageUri="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" />
                            </View>
                            <View className="w-1/3 px-1 mb-2"><PhotoSlot isEmpty /></View>
                            <View className="w-1/3 px-1 mb-2"><PhotoSlot isEmpty /></View>
                            <View className="w-1/3 px-1 mb-2"><PhotoSlot isEmpty /></View>
                            <View className="w-1/3 px-1 mb-2"><PhotoSlot isEmpty /></View>
                        </View>
                    </View>

                    {/* Form Fields */}
                    <View className="space-y-8">
                        <View>
                            <Text className="text-align-orange-2 font-black text-xs mb-1" style={{ letterSpacing: -1 }}>NAME</Text>
                            <BauhausInput placeholder="NAME" value="ALEX RIVERA" />
                        </View>

                        <View>
                            <Text className="text-align-orange-2 font-black text-xs mb-1" style={{ letterSpacing: -1 }}>BIO</Text>
                            <TextInput
                                className="border-2 border-align-black bg-transparent p-3 font-medium text-sm leading-tight text-align-black"
                                multiline
                                numberOfLines={4}
                                value={bio}
                                onChangeText={setBio}
                                style={{ borderRadius: 32, height: 100, textAlignVertical: 'top' }}
                            />
                        </View>

                        <View>
                            <Text className="text-align-orange-2 font-black text-xs mb-1" style={{ letterSpacing: -1 }}>OCCUPATION</Text>
                            <BauhausInput placeholder="OCCUPATION" value="SENIOR DESIGNER" />
                        </View>

                        <View>
                            <Text className="text-align-orange-2 font-black text-xs mb-2" style={{ letterSpacing: -1 }}>INTERESTS</Text>
                            <View className="flex-row flex-wrap">
                                <Tag label="TYPOGRAPHY" isSelected />
                                <Tag label="TECHNO" />
                                <Tag label="ARCHITECTURE" isSelected />
                                <Tag label="FILM NOIR" />
                                <Tag label="CHESS" />
                                <Tag label="BAUHAUS" isSelected />
                                <Tag label="SNEAKERS" />
                            </View>
                        </View>

                        <View>
                            <Text className="text-align-orange-2 font-black text-xs mb-3" style={{ letterSpacing: -1 }}>INTENT</Text>
                            <View className="flex-row flex-wrap -mx-1">
                                <View className="w-1/2 px-1 mb-2"><IntentBox label="LONG-TERM" isSelected /></View>
                                <View className="w-1/2 px-1 mb-2"><IntentBox label="CASUAL" /></View>
                                <View className="w-1/2 px-1 mb-2"><IntentBox label="FRIENDSHIP" /></View>
                                <View className="w-1/2 px-1 mb-2"><IntentBox label="UNSURE" /></View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </BauhausWrapper>
        </View>
    );
}
