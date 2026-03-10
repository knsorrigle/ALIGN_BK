import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Animated, Easing, KeyboardAvoidingView, Platform, Modal, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ORANGE } from '../../constants/colors';
import { useUpdateOnboarding } from '../../hooks/useUpdateOnboarding';

const PROMPTS_LIST = [
    "A non-negotiable for me is...",
    "I'm convinced that...",
    "The way to win me over is...",
    "My simple pleasure is...",
    "I geek out on...",
    "Together we could...",
    "I'm looking for...",
    "My most controversial opinion is...",
    "I bet you can't...",
    "Worst idea I've ever had..."
];

const ProfilePromptsScreen = () => {
    const navigation = useNavigation<any>();
    const saveField = useUpdateOnboarding();

    const [prompts, setPrompts] = useState([
        { id: 1, question: "Select a prompt...", answer: "" },
        { id: 2, question: "Select a prompt...", answer: "" },
        { id: 3, question: "Select a prompt...", answer: "" }
    ]);
    const [activePromptIndex, setActivePromptIndex] = useState<number | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const titleTranslateX = useRef(new Animated.Value(-60)).current;
    const titleOpacity = useRef(new Animated.Value(0)).current;
    const contentOpacity = useRef(new Animated.Value(0)).current;
    const bgDriftY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(bgDriftY, { toValue: -15, duration: 10000, easing: Easing.linear, useNativeDriver: true }),
                Animated.timing(bgDriftY, { toValue: 0, duration: 10000, easing: Easing.linear, useNativeDriver: true }),
            ])
        ).start();

        Animated.parallel([
            Animated.timing(titleTranslateX, { toValue: 0, duration: 350, easing: Easing.bezier(0.16, 1, 0.3, 1), useNativeDriver: true }),
            Animated.timing(titleOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
            Animated.timing(contentOpacity, { toValue: 1, duration: 600, delay: 200, useNativeDriver: true }),
        ]).start();
    }, []);

    const handleSelectPrompt = (index: number) => {
        setActivePromptIndex(index);
        setIsModalVisible(true);
    };

    const confirmPromptSelection = (question: string) => {
        if (activePromptIndex !== null) {
            const newPrompts = [...prompts];
            newPrompts[activePromptIndex].question = question;
            setPrompts(newPrompts);
            setIsModalVisible(false);
        }
    };

    const updateAnswer = (index: number, text: string) => {
        const newPrompts = [...prompts];
        newPrompts[index].answer = text;
        setPrompts(newPrompts);
    };

    const filledCount = prompts.filter(p => p.question !== "Select a prompt..." && p.answer.length > 0).length;
    const isReady = filledCount >= 1;

    return (
        <View className="flex-1 bg-cream relative overflow-hidden">

            {/* Background Text Layer */}
            <View className="absolute inset-0 pointer-events-none z-0">
                <Animated.Text style={{ position: 'absolute', top: 60, right: -20, fontSize: 100, fontWeight: '300', color: '#000', opacity: 0.03, transform: [{ rotate: '5deg' }, { translateY: bgDriftY }] }}>
                    VIBE
                </Animated.Text>
                <Animated.Text style={{ position: 'absolute', bottom: 200, left: -20, fontSize: 90, fontWeight: '300', color: '#000', opacity: 0.03, transform: [{ rotate: '-4deg' }, { translateY: bgDriftY }] }}>
                    PROMPTS
                </Animated.Text>
            </View>

            {/* Accent Dot */}
            <View className="absolute top-28 right-8 w-3 h-3 bg-[#1A1AFF] rounded-full z-0" />

            <SafeAreaView className="flex-1 z-10">
                {/* Header */}
                <View className="flex-row items-center justify-between px-6 py-4">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 items-center justify-center rounded-full">
                        <MaterialIcons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text className="text-xs font-black uppercase text-black/40" style={{ letterSpacing: 2 }}>PERSONALITY</Text>
                    <View className="w-10" />
                </View>

                {/* Progress Bar */}
                <View className="mx-6 h-1 bg-black/10 rounded-full overflow-hidden mb-2">
                    <View style={{ height: '100%', backgroundColor: ORANGE, width: '55%', borderRadius: 4 }} />
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1 px-6 pt-4"
                >
                    <Animated.View style={{ opacity: contentOpacity }} className="flex-1">
                        <View className="px-2">
                            <Animated.Text
                                className="text-black text-[44px] font-black uppercase leading-[0.9] mb-3"
                                style={{ letterSpacing: -1, transform: [{ translateX: titleTranslateX }], opacity: titleOpacity }}
                            >
                                TELL US{'\n'}MORE.
                            </Animated.Text>
                            <Text className="text-black/40 text-sm font-medium uppercase mb-8" style={{ letterSpacing: 1 }}>
                                Pick 3 prompts to show who you are.
                            </Text>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                            {prompts.map((item, index) => (
                                <View
                                    key={item.id}
                                    className="mb-4 bg-white rounded-2xl border-2 border-black/8 p-5"
                                    style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}
                                >
                                    <TouchableOpacity
                                        onPress={() => handleSelectPrompt(index)}
                                        className="mb-3 flex-row justify-between items-center"
                                    >
                                        <Text className={`font-black uppercase text-[10px] flex-1 pr-2 ${item.question === "Select a prompt..." ? 'text-black/30' : 'text-black'}`} style={{ letterSpacing: 2 }}>
                                            {item.question === "Select a prompt..." ? "TAP TO SELECT A PROMPT" : item.question.toUpperCase()}
                                        </Text>
                                        <View className="w-7 h-7 rounded-full bg-black/5 items-center justify-center">
                                            <MaterialIcons name="edit" size={13} color="rgba(0,0,0,0.35)" />
                                        </View>
                                    </TouchableOpacity>

                                    <View className="h-px bg-black/8 mb-3" />

                                    <TextInput
                                        className="text-base font-semibold text-black min-h-[40px]"
                                        placeholder="Type your answer here..."
                                        placeholderTextColor="rgba(0,0,0,0.15)"
                                        multiline
                                        maxLength={150}
                                        value={item.answer}
                                        onChangeText={(text) => updateAnswer(index, text)}
                                        editable={item.question !== "Select a prompt..."}
                                    />
                                    <Text className="text-right text-[10px] text-black/15 mt-2 font-black">{item.answer.length}/150</Text>
                                </View>
                            ))}
                            <View className="h-20" />
                        </ScrollView>
                    </Animated.View>
                </KeyboardAvoidingView>

                {/* Continue Button */}
                <View className="px-8 pb-10 pt-4">
                    <TouchableOpacity
                        className={`w-full py-4 rounded-full items-center active:scale-95 ${isReady ? 'bg-black' : 'bg-black/20'}`}
                        onPress={async () => {
                            const filledPrompts = prompts
                                .filter(p => p.question !== 'Select a prompt...' && p.answer.trim())
                                .map((p, i) => ({ id: i, question: p.question, answer: p.answer }));
                            if (filledPrompts.length > 0) await saveField({ prompts: filledPrompts });
                            navigation.navigate('Drinking');
                        }}
                        disabled={!isReady}
                    >
                        <Text className={`text-base font-black uppercase ${isReady ? 'text-cream' : 'text-black/30'}`} style={{ letterSpacing: 2 }}>
                            {filledCount < 3 ? `CONTINUE (${filledCount}/3)` : 'CONTINUE'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {/* Prompt Selection Modal */}
            <Modal
                visible={isModalVisible}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View className="flex-1 bg-cream">
                    <View className="flex-row items-center justify-between p-6 border-b border-black/8">
                        <Text className="text-sm font-black uppercase" style={{ letterSpacing: 2 }}>SELECT A QUESTION</Text>
                        <TouchableOpacity onPress={() => setIsModalVisible(false)} className="w-8 h-8 bg-black/6 rounded-full items-center justify-center">
                            <MaterialIcons name="close" size={18} color="black" />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={PROMPTS_LIST}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                className="p-6 border-b border-black/5 active:bg-black/5"
                                onPress={() => confirmPromptSelection(item)}
                            >
                                <Text className="text-base font-semibold text-black">{item}</Text>
                            </TouchableOpacity>
                        )}
                        className="flex-1"
                    />
                </View>
            </Modal>
        </View>
    );
};

export default ProfilePromptsScreen;
