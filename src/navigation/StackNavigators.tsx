import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Onboarding & Auth Screens
import WelcomeScreen from '../screens/WelcomeScreen';
import SignInScreen from '../screens/onboarding/SignInScreen';
import NameScreen from '../screens/onboarding/NameScreen';
import BirthdayScreen from '../screens/onboarding/BirthdayScreen';
import GenderScreen from '../screens/onboarding/GenderScreen';
import LocationScreen from '../screens/onboarding/LocationScreen';
import IntroStatementScreen from '../screens/onboarding/IntroStatementScreen';
import MediaSelectionScreen from '../screens/onboarding/MediaSelectionScreen';
import VoicePromptScreen from '../screens/onboarding/VoicePromptScreen';
import SafetyNoticeScreen from '../screens/onboarding/SafetyNoticeScreen';
import ProfileStartScreen from '../screens/onboarding/ProfileStartScreen';
import PronounsScreen from '../screens/onboarding/PronounsScreen';
import WorkplaceScreen from '../screens/onboarding/WorkplaceScreen';
import ProfilePromptsScreen from '../screens/onboarding/ProfilePromptsScreen';
import DrinkingScreen from '../screens/onboarding/DrinkingScreen';
import SmokingScreen from '../screens/onboarding/SmokingScreen';
import DrugsScreen from '../screens/onboarding/DrugsScreen';
import PoliticsScreen from '../screens/onboarding/PoliticsScreen';
import ReligionScreen from '../screens/onboarding/ReligionScreen';
import BioScreen from '../screens/onboarding/BioScreen';
import DatingIntentScreen from '../screens/onboarding/DatingIntentScreen';
import ChildrenScreen from '../screens/onboarding/ChildrenScreen';
import DistancePreferenceScreen from '../screens/onboarding/DistancePreferenceScreen';
import IdUploadScreen from '../screens/onboarding/IdUploadScreen';
import LivenessCheckScreen from '../screens/onboarding/LivenessCheckScreen';
import VerificationWaitScreen from '../screens/onboarding/VerificationWaitScreen';
import OnboardingCompleteScreen from '../screens/onboarding/OnboardingCompleteScreen';

// Main App Screens
import StitchHomeScreen from '../screens/StitchHomeScreen';
import ProfileDetailScreen from '../screens/ProfileDetailScreen';
import MatchmakerScreen from '../screens/stitch7/MatchmakerScreen';
import ChatListScreen from '../screens/ChatListScreen';
import ActiveChatScreen from '../screens/ActiveChatScreen';
import LikesScreen from '../screens/LikesScreen';
import AlignAIScreen from '../screens/stitch7/AlignAIScreen';
import MyProfileScreen from '../screens/MyProfileScreen';
import SettingsScreen from '../screens/stitch7/SettingsScreen';
import EditProfileScreen from '../screens/stitch7/EditProfileScreen';
import PreferencesScreen from '../screens/stitch7/PreferencesScreen';
import AboutScreen from '../screens/stitch7/AboutScreen';
import HelpScreen from '../screens/HelpScreen';
import SubscriptionScreen from '../screens/onboarding/SubscriptionScreen';

const Stack = createNativeStackNavigator();

// --- Auth Navigator ---
export const AuthNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
    </Stack.Navigator>
);

// --- Onboarding Navigator ---
export const OnboardingNavigator = () => (
    <Stack.Navigator
        screenOptions={{
            headerShown: false,
            animation: 'fade_from_bottom',
            animationDuration: 500,
            gestureEnabled: true,
            fullScreenGestureEnabled: true,
        }}
    >
        <Stack.Screen name="Name" component={NameScreen} />
        <Stack.Screen name="Birthday" component={BirthdayScreen} />
        <Stack.Screen name="Gender" component={GenderScreen} />
        <Stack.Screen name="Location" component={LocationScreen} />
        <Stack.Screen name="IntroStatement" component={IntroStatementScreen} />
        <Stack.Screen name="MediaSelection" component={MediaSelectionScreen} />
        <Stack.Screen name="VoicePrompt" component={VoicePromptScreen} />
        <Stack.Screen name="SafetyNotice" component={SafetyNoticeScreen} />
        <Stack.Screen name="ProfileStart" component={ProfileStartScreen} />
        <Stack.Screen name="Pronouns" component={PronounsScreen} />
        <Stack.Screen name="Workplace" component={WorkplaceScreen} />
        <Stack.Screen name="ProfilePrompts" component={ProfilePromptsScreen} />
        <Stack.Screen name="Drinking" component={DrinkingScreen} />
        <Stack.Screen name="Smoking" component={SmokingScreen} />
        <Stack.Screen name="Drugs" component={DrugsScreen} />
        <Stack.Screen name="Politics" component={PoliticsScreen} />
        <Stack.Screen name="Religion" component={ReligionScreen} />
        <Stack.Screen name="Bio" component={BioScreen} />
        <Stack.Screen name="DatingIntent" component={DatingIntentScreen} />
        <Stack.Screen name="Children" component={ChildrenScreen} />
        <Stack.Screen name="DistancePreference" component={DistancePreferenceScreen} />
        <Stack.Screen name="IdUpload" component={IdUploadScreen} />
        <Stack.Screen name="LivenessCheck" component={LivenessCheckScreen} />
        <Stack.Screen name="VerificationWait" component={VerificationWaitScreen} />
        <Stack.Screen name="OnboardingComplete" component={OnboardingCompleteScreen} />
    </Stack.Navigator>
);

// --- Home Navigator (Stitch Homescreen) ---
export const HomeNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="StitchHome" component={StitchHomeScreen} />
        <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen} options={{ presentation: 'transparentModal', animation: 'none' }} />
    </Stack.Navigator>
);

// --- Matchmaker Navigator ---
export const MatchmakerNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MatchList" component={AlignAIScreen} />
        {/* Modal style or standard push depending on interaction */}
        <Stack.Screen name="Chat" component={ActiveChatScreen} options={{ presentation: 'transparentModal', animation: 'none' }} />
    </Stack.Navigator>
);

// --- Likes Navigator ---
export const LikesNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LikesList" component={LikesScreen} />
        <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen} options={{ presentation: 'transparentModal', animation: 'none' }} />
    </Stack.Navigator>
);

// --- Chat Navigator ---
export const ChatNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ChatList" component={ChatListScreen} />
        <Stack.Screen name="ActiveChat" component={ActiveChatScreen} options={{ presentation: 'transparentModal', animation: 'none' }} />
    </Stack.Navigator>
);

// --- Profile Navigator ---
export const ProfileNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MyProfile" component={MyProfileScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="Preferences" component={PreferencesScreen} />
        <Stack.Screen name="Subscription" component={SubscriptionScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Help" component={HelpScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
    </Stack.Navigator>
);
