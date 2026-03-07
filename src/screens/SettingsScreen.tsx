import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BLACK, ORANGE } from '../constants/colors';

const SettingsScreen = () => {
    const navigation = useNavigation<any>();

    return (
        <View className="flex-1 bg-cream">
            <SafeAreaView className="flex-1">
                {/* Header */}
                <View className="p-6 flex-row items-center">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
                        <MaterialIcons name="arrow-back" size={32} color={BLACK} />
                    </TouchableOpacity>
                    <Text className="text-ink text-3xl font-black uppercase" style={{ letterSpacing: 1 }}>
                        Settings
                    </Text>
                </View>

                <ScrollView className="px-6 py-4">
                    <View className="space-y-4">
                        <TouchableOpacity
                            className="bg-white/10 p-6 rounded-2xl flex-row items-center justify-between active:bg-white/20"
                            onPress={() => navigation.navigate('Help')}
                        >
                            <View className="flex-row items-center space-x-4">
                                <MaterialIcons name="help-outline" size={28} color={ORANGE} />
                                    <Text className="text-ink text-xl font-bold uppercase" style={{ letterSpacing: 1 }}>Help & Support</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={28} color={BLACK} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="bg-white/10 p-6 rounded-2xl flex-row items-center justify-between active:bg-white/20"
                            onPress={() => navigation.navigate('About')}
                        >
                            <View className="flex-row items-center space-x-4">
                                <MaterialIcons name="info-outline" size={28} color={ORANGE} />
                                    <Text className="text-ink text-xl font-bold uppercase" style={{ letterSpacing: 1 }}>About Align</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={28} color={BLACK} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="bg-white/10 p-6 rounded-2xl flex-row items-center justify-between active:bg-white/20 mt-8"
                            onPress={() => console.log('Log out')}
                        >
                            <View className="flex-row items-center space-x-4">
                                <MaterialIcons name="logout" size={28} color="#E03A2F" />
                                    <Text className="text-[#E03A2F] text-xl font-bold uppercase" style={{ letterSpacing: 1 }}>Log Out</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default SettingsScreen;
