import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { BauhausWrapper } from '../../components/BauhausComponents';
import { Ionicons } from '@expo/vector-icons';
import { BLACK } from '../../constants/colors';

const FilterBox = ({ label, isSelected = false }: { label: string; isSelected?: boolean }) => (
    <TouchableOpacity
        className={`p-4 items-center justify-center border border-ink cursor-pointer ${isSelected ? 'bg-ink' : 'bg-cream'}`}
    >
        <Text className={`text-xs font-bold uppercase ${isSelected ? 'text-white' : 'text-ink'}`}>
            {label}
        </Text>
    </TouchableOpacity>
);

const BauhausRange = ({ label, value, range = false }: { label: string; value: string; range?: boolean }) => (
    <View className="mb-10">
        <View className="flex-row justify-between items-end mb-2">
            <Text className="text-ink text-xs font-bold uppercase" style={{ letterSpacing: 2 }}>{label}</Text>
            <Text className="text-ink text-xl font-bold">{value}</Text>
        </View>
        <View className="h-[2px] bg-ink relative my-4">
            {range && <View className="absolute h-full bg-align-orange-2 left-[20%] right-[40%]" />}
            <View className="absolute w-4 h-4 bg-ink top-1/2 -mt-2 -ml-2" style={{ left: range ? '20%' : '45%' }} />
            {range && (
                <View className="absolute w-4 h-4 bg-ink top-1/2 -mt-2 -ml-2" style={{ left: '60%' }}>
                    <View className="absolute w-[6px] h-[6px] bg-align-orange-2 -top-[10px] left-1/2 -ml-[3px]" />
                </View>
            )}
        </View>
    </View>
);

const CompatibilityButton = ({ label, isSelected = false }: { label: string; isSelected?: boolean }) => (
    <TouchableOpacity className={`flex-1 py-3 border border-ink items-center ${isSelected ? 'bg-ink' : 'bg-transparent'}`}>
        <Text className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-ink'}`}>{label}</Text>
    </TouchableOpacity>
);

const DealBreakerChip = ({ label, isSelected = false }: { label: string; isSelected?: boolean }) => (
    <TouchableOpacity className={`px-3 py-1 border border-ink mr-2 mb-2 ${isSelected ? 'bg-ink' : 'bg-transparent'}`}>
        <Text className={`text-[10px] font-bold uppercase ${isSelected ? 'text-white' : 'text-ink'}`}>{label}</Text>
    </TouchableOpacity>
);

export default function PreferencesScreen() {
    const insets = useSafeAreaInsets();

    return (
        <View className="flex-1 bg-cream">
            <StatusBar style="dark" />
            <BauhausWrapper watermarkText="FILTERS · PREFERENCE · MATCH · ALIGN · FIND">
                <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
                    {/* Header */}
                    <View className="flex-row justify-between items-center mb-10">
                        <TouchableOpacity><Ionicons name="arrow-back" size={24} color={BLACK} /></TouchableOpacity>
                        <TouchableOpacity className="border-2 border-ink px-4 py-1">
                            <Text className="text-xs font-bold text-ink uppercase" style={{ letterSpacing: 1 }}>SAVE</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Title */}
                    <View className="mb-12">
                        <Text className="text-6xl font-black leading-none text-ink mb-2">
                            YOUR{'\n'}FILTERS.
                        </Text>
                        <Text className="text-ink text-sm font-light max-w-[200px]" style={{ letterSpacing: 1 }}>
                            We find who fits these. You decide the rest.
                        </Text>
                    </View>

                    {/* Looking For */}
                    <View className="mb-10">
                        <Text className="text-ink text-xs font-bold mb-4 uppercase" style={{ letterSpacing: 2 }}>LOOKING FOR</Text>
                        <View className="flex-row flex-wrap bg-ink border border-ink gap-[1px]">
                            <View className="w-[49%]"><FilterBox label="WOMEN" /></View>
                            <View className="w-[49%]"><FilterBox label="MEN" isSelected /></View>
                            <View className="w-[49%]"><FilterBox label="NON-BINARY" /></View>
                            <View className="w-[49%]"><FilterBox label="EVERYONE" /></View>
                        </View>
                    </View>

                    {/* Sliders */}
                    <BauhausRange label="AGE RANGE" value="24 — 32" range />
                    <BauhausRange label="DISTANCE" value="25km" />

                    {/* Compatibility */}
                    <View className="mb-10">
                        <Text className="text-ink text-xs font-bold mb-4 uppercase" style={{ letterSpacing: 2 }}>COMPATIBILITY</Text>
                        <View className="flex-row gap-4">
                            <CompatibilityButton label="60%+" />
                            <CompatibilityButton label="75%+" isSelected />
                            <CompatibilityButton label="85%+" />
                        </View>
                    </View>

                    {/* Deal Breakers */}
                    <View className="mb-10">
                        <Text className="text-ink text-xs font-bold mb-4 uppercase" style={{ letterSpacing: 2 }}>DEAL BREAKERS</Text>
                        <View className="flex-row flex-wrap">
                            <DealBreakerChip label="SMOKING" isSelected />
                            <DealBreakerChip label="KIDS" />
                            <DealBreakerChip label="DRINKS" isSelected />
                            <DealBreakerChip label="PETS" />
                            <DealBreakerChip label="RELIGION" />
                            <DealBreakerChip label="POLITICS" />
                        </View>
                    </View>

                    {/* Footer */}
                    <View className="mt-8">
                        <TouchableOpacity className="w-full bg-ink py-5 items-center">
                            <Text className="text-align-black font-black text-lg uppercase" style={{ letterSpacing: 3 }}>APPLY FILTERS</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </BauhausWrapper>
        </View>
    );
}
