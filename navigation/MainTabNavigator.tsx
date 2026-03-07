import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Triangle, Heart, MessageSquare, User } from 'lucide-react-native';
import { CREAM, ORANGE } from '../constants/colors';
import {
    HomeNavigator,
    MatchmakerNavigator,
    LikesNavigator,
    ChatNavigator,
    ProfileNavigator,
} from './StackNavigators';

const Tab = createBottomTabNavigator();

const ICON_COLOR = '#0D0D0D'; // Near-black for both states (opacity handles the difference)
const ICON_SIZE = 24;
const ICON_WEIGHT = 1.5;

interface TabIconProps {
    focused: boolean;
    children: React.ReactNode;
}

import { Animated, Easing } from 'react-native';

const TabIconWrapper = ({ focused, children }: TabIconProps) => {
    const opacityAnim = React.useRef(new Animated.Value(focused ? 1 : 0.35)).current;
    const scaleAnim = React.useRef(new Animated.Value(focused ? 1 : 0.85)).current;
    const dotScale = React.useRef(new Animated.Value(focused ? 1 : 0)).current;

    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(opacityAnim, {
                toValue: focused ? 1 : 0.35,
                duration: 320,
                easing: Easing.bezier(0.22, 1, 0.36, 1),
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: focused ? 1 : 0.85,
                friction: 7,
                tension: 140,
                useNativeDriver: true,
            }),
            Animated.spring(dotScale, {
                toValue: focused ? 1 : 0,
                friction: 6,
                tension: 180,
                useNativeDriver: true,
            }),
        ]).start();
    }, [focused]);

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <Animated.View style={{ opacity: opacityAnim, transform: [{ scale: scaleAnim }] }}>
                {children}
            </Animated.View>
            <Animated.View
                style={{
                    position: 'absolute',
                    bottom: 4,
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: ORANGE,
                    transform: [{ scale: dotScale }],
                }}
            />
        </View>
    );
};

import { useIsFocused } from '@react-navigation/native';

const TabTransitionWrapper = ({ children }: { children: React.ReactNode }) => {
    const isFocused = useIsFocused();
    const animValue = React.useRef(new Animated.Value(isFocused ? 1 : 0)).current;

    React.useEffect(() => {
        Animated.timing(animValue, {
            toValue: isFocused ? 1 : 0,
            duration: 560,
            easing: Easing.bezier(0.22, 1, 0.36, 1),
            useNativeDriver: true,
        }).start();
    }, [isFocused]);

    const translateY = animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [18, 0],
    });

    return (
        <Animated.View style={{ flex: 1, opacity: animValue, transform: [{ translateY }] }}>
            {children}
        </Animated.View>
    );
};

const WrappedHome = () => <TabTransitionWrapper><HomeNavigator /></TabTransitionWrapper>;
const WrappedMatchmaker = () => <TabTransitionWrapper><MatchmakerNavigator /></TabTransitionWrapper>;
const WrappedLikes = () => <TabTransitionWrapper><LikesNavigator /></TabTransitionWrapper>;
const WrappedChat = () => <TabTransitionWrapper><ChatNavigator /></TabTransitionWrapper>;
const WrappedProfile = () => <TabTransitionWrapper><ProfileNavigator /></TabTransitionWrapper>;

export default function MainTabNavigator() {
    const insets = useSafeAreaInsets();

    return (
        <Tab.Navigator
            detachInactiveScreens={false}
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: CREAM,
                    borderTopWidth: 0,
                    height: 96, // h-24
                    paddingHorizontal: 32, // px-8
                    paddingBottom: insets.bottom > 0 ? insets.bottom : 20,
                    paddingTop: 12,
                    justifyContent: 'space-between',
                    elevation: 0, // No shadow
                    shadowOpacity: 0, // No shadow
                },
            }}
        >
            {/* Tab 1: Home */}
            <Tab.Screen
                name="TabHome"
                component={WrappedHome}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIconWrapper focused={focused}>
                            <Home size={ICON_SIZE} color={ICON_COLOR} strokeWidth={ICON_WEIGHT} />
                        </TabIconWrapper>
                    ),
                }}
            />

            {/* Tab 2: Align triangle */}
            <Tab.Screen
                name="TabMatchmaker"
                component={WrappedMatchmaker}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIconWrapper focused={focused}>
                            <Triangle size={ICON_SIZE} color={ICON_COLOR} strokeWidth={ICON_WEIGHT} />
                        </TabIconWrapper>
                    ),
                }}
            />

            {/* Tab 3: Likes */}
            <Tab.Screen
                name="TabLikes"
                component={WrappedLikes}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIconWrapper focused={focused}>
                            <Heart size={ICON_SIZE} color={ICON_COLOR} strokeWidth={ICON_WEIGHT} />
                        </TabIconWrapper>
                    ),
                }}
            />

            {/* Tab 4: Messages */}
            <Tab.Screen
                name="TabChat"
                component={WrappedChat}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIconWrapper focused={focused}>
                            <MessageSquare size={ICON_SIZE} color={ICON_COLOR} strokeWidth={ICON_WEIGHT} />
                        </TabIconWrapper>
                    ),
                }}
            />

            {/* Tab 5: Profile */}
            <Tab.Screen
                name="TabProfile"
                component={WrappedProfile}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIconWrapper focused={focused}>
                            <User size={ICON_SIZE} color={ICON_COLOR} strokeWidth={ICON_WEIGHT} />
                        </TabIconWrapper>
                    ),
                }}
            />
        </Tab.Navigator>
    );
}