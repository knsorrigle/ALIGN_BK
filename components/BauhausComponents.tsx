import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { styled } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Bauhaus Background Watermark
interface BauhausWrapperProps {
    children: React.ReactNode;
    watermarkText: string;
    className?: string;
    style?: ViewStyle;
}

export const BauhausWrapper: React.FC<BauhausWrapperProps> = ({ children, watermarkText, className, style }) => {
    const insets = useSafeAreaInsets();

    // Create a repeated string for the watermark
    const repeatedText = Array(10).fill(watermarkText).join(' · ');

    return (
        <View style={[{ flex: 1 }, style]} className={`relative overflow-hidden ${className}`}>
            {/* Background Watermark */}
            <View className="absolute inset-0 z-0 flex flex-wrap content-start opacity-10 pointer-events-none">
                <Text style={{ letterSpacing: -2 }} className="text-[100px] font-black text-white uppercase leading-none opacity-10">
                    {repeatedText}
                </Text>
            </View>

            {/* Content */}
            <View style={{ flex: 1, paddingTop: insets.top }} className="relative z-10">
                {children}
            </View>
        </View>
    );
};

// Bauhaus Button
interface BauhausButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    className?: string;
}

export const BauhausButton: React.FC<BauhausButtonProps> = ({ title, onPress, variant = 'primary', className }) => {
    let bgClass = '';
    let textClass = '';
    let borderClass = '';

    switch (variant) {
        case 'primary':
            bgClass = 'bg-align-orange-1';
            textClass = 'text-white';
            break;
        case 'secondary':
            bgClass = 'bg-align-black';
            textClass = 'text-white';
            break;
        case 'outline':
            bgClass = 'bg-transparent';
            textClass = 'text-align-black';
            borderClass = 'border-2 border-align-black';
            break;
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            className={`h-14 items-center justify-center px-6 ${bgClass} ${borderClass} ${className}`}
            style={{ borderRadius: 32 }}
        >
            <Text style={{ letterSpacing: 2 }} className={`font-black uppercase ${textClass}`}>{title}</Text>
        </TouchableOpacity>
    );
};

// Bauhaus Input
interface BauhausInputProps {
    placeholder: string;
    value?: string;
    onChangeText?: (text: string) => void;
    className?: string;
}

export const BauhausInput: React.FC<BauhausInputProps> = ({ placeholder, value, onChangeText, className }) => {
    return (
        <TextInput
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            placeholderTextColor="#999"
            className={`h-14 bg-transparent border-2 border-align-black px-4 font-bold uppercase ${className}`}
            style={{ borderRadius: 32 }}
        />
    );
};

// Bauhaus Header
interface BauhausHeaderProps {
    title: string;
    subtitle?: string;
    showBack?: boolean;
    onBack?: () => void;
    rightElement?: React.ReactNode;
}

export const BauhausHeader: React.FC<BauhausHeaderProps> = ({ title, subtitle, showBack, onBack, rightElement }) => {
    return (
        <View className="px-6 py-4 flex-row items-start justify-between">
            <View>
                {showBack && (
                    <TouchableOpacity onPress={onBack} className="mb-4">
                        <Text className="text-2xl font-bold">←</Text>
                    </TouchableOpacity>
                )}
                <Text style={{ letterSpacing: -1 }} className="text-5xl font-black uppercase leading-none">{title}</Text>
                {subtitle && <Text style={{ letterSpacing: 2 }} className="text-sm font-light uppercase mt-2">{subtitle}</Text>}
            </View>
            {rightElement}
        </View>
    );
};
