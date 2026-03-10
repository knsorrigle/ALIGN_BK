import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Animated, Easing, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { ORANGE } from '../../constants/colors';
import { useUpdateOnboarding } from '../../hooks/useUpdateOnboarding';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useUser } from '@clerk/expo';

const LocationScreen = () => {
    const navigation = useNavigation<any>();
    const saveField = useUpdateOnboarding();
    const updateUserLocation = useMutation(api.users.updateUserLocation);
    const { user } = useUser();
    const [location, setLocation] = useState('');
    const [isDetecting, setIsDetecting] = useState(false);

    const titleTranslateY = useRef(new Animated.Value(-100)).current;
    const contentOpacity = useRef(new Animated.Value(0)).current;
    const pulseScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(titleTranslateY, {
                toValue: -20,
                duration: 800,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(contentOpacity, {
                toValue: 1,
                duration: 800,
                delay: 200,
                useNativeDriver: true,
            }),
        ]).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseScale, { toValue: 1.3, duration: 1000, useNativeDriver: true }),
                Animated.timing(pulseScale, { toValue: 1, duration: 1000, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    const handleUseCurrentLocation = async () => {
        setIsDetecting(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setIsDetecting(false);
                return;
            }
            const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
            const [geo] = await Location.reverseGeocodeAsync({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
            });
            const city = geo.city || geo.subregion || '';
            const region = geo.region || '';
            const country = geo.country || '';
            const display = city && region ? `${city}, ${region}` : city || region || country;
            setLocation(display);
            if (user?.id) {
                await updateUserLocation({
                    clerkId: user.id,
                    city,
                    region,
                    country,
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                });
            }
        } catch {
            // silently fail — user can type manually
        } finally {
            setIsDetecting(false);
        }
    };

    const isReady = location.trim().length > 0;

    return (
        <View className="flex-1 bg-cream relative overflow-hidden">

            {/* Bleeding Background Text */}
            <View className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none select-none z-0">
                <Animated.Text
                    style={{ transform: [{ translateY: titleTranslateY }] }}
                    className="text-[160px] leading-[0.8] font-black text-black opacity-5 uppercase -ml-4"
                >
                    WHERE
                </Animated.Text>
            </View>

            <SafeAreaView className="flex-1 z-10">
                {/* Header */}
                <View className="flex-row items-center justify-between px-6 py-4">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="w-10 h-10 items-center justify-center rounded-full"
                    >
                        <MaterialIcons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text className="text-xs font-black uppercase text-black/40" style={{ letterSpacing: 2 }}>Step 04 / 05</Text>
                    <View className="w-10" />
                </View>

                {/* Progress Bar */}
                <View className="mx-6 h-1 bg-black/10 rounded-full overflow-hidden mb-2">
                    <View style={{ height: '100%', backgroundColor: ORANGE, width: '80%', borderRadius: 4 }} />
                </View>

                {/* Bauhaus Map Visualization */}
                <View className="h-[260px] w-full relative mb-4">
                    {/* Black Curve */}
                    <View className="absolute top-[5%] -left-[100px] w-[300px] h-[150px] overflow-hidden">
                        <View className="w-[300px] h-[300px] border-[12px] border-black rounded-full" />
                    </View>

                    {/* Blue Curve */}
                    <View className="absolute top-[25%] -right-[50px] w-[200px] h-[100px] overflow-hidden rotate-180">
                        <View className="w-[200px] h-[200px] border-[8px] border-[#0047AB] rounded-full" />
                    </View>

                    {/* Green Curve */}
                    <View className="absolute top-[0%] right-[20%] w-[75px] h-[400px] overflow-hidden">
                        <View className="w-[150px] h-[400px] border-[6px] border-[#2E8B57] rounded-full -ml-[75px]" />
                    </View>

                    {/* Pulsing Dot */}
                    <Animated.View
                        style={{ transform: [{ scale: pulseScale }] }}
                        className="absolute top-[45%] left-[45%] w-6 h-6 bg-[#32CD32] rounded-full shadow-lg shadow-green-500/50"
                    />
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1 px-8"
                >
                    <Animated.View style={{ opacity: contentOpacity }}>
                        <Text className="text-black text-[42px] font-black leading-tight mb-8" style={{ letterSpacing: -1 }}>
                            Where do{'\n'}you live?
                        </Text>

                        <View className="mb-4">
                            <Text className="text-xs font-black uppercase text-black/50 mb-3" style={{ letterSpacing: 2 }}>Your Location</Text>
                            <View className="relative">
                                <TextInput
                                    className="w-full h-14 px-4 text-base font-semibold border-2 border-black/15 bg-white rounded-2xl text-black"
                                    placeholder="Address or Neighbourhood"
                                    placeholderTextColor="rgba(0,0,0,0.3)"
                                    value={location}
                                    onChangeText={setLocation}
                                />
                                <View className="absolute right-4 top-4">
                                    <MaterialIcons name="my-location" size={20} color="rgba(0,0,0,0.4)" />
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity
                            className="flex-row items-center gap-2"
                            onPress={handleUseCurrentLocation}
                            disabled={isDetecting}
                        >
                            {isDetecting
                                ? <ActivityIndicator size="small" color={ORANGE} />
                                : <MaterialIcons name="near-me" size={16} color={ORANGE} />
                            }
                            <Text className="text-primary font-black text-xs uppercase" style={{ letterSpacing: 1 }}>
                                {isDetecting ? 'Detecting...' : 'Use current location'}
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                </KeyboardAvoidingView>

                {/* Continue Button */}
                <View className="px-8 pb-10">
                    <TouchableOpacity
                        className={`py-4 rounded-full w-full items-center active:scale-95 ${isReady ? 'bg-black' : 'bg-black/20'}`}
                        disabled={!isReady}
                        onPress={async () => {
                            if (isReady) await saveField({ location: location.trim() });
                            navigation.navigate('IntroStatement');
                        }}
                    >
                        <Text className={`text-base font-black uppercase ${isReady ? 'text-cream' : 'text-black/30'}`} style={{ letterSpacing: 2 }}>Continue</Text>
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
        </View>
    );
};

export default LocationScreen;
