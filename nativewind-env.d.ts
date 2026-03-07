/// <reference types="nativewind/types" />
/// <reference path="node_modules/react-native/types/index.d.ts" />

import 'react-native';
import { NativeSafeAreaViewProps } from 'react-native-safe-area-context';

declare module 'react-native' {
    interface ViewProps {
        className?: string;
    }
    interface TextProps {
        className?: string;
    }
    interface ImageProps {
        className?: string;
    }
    interface TextInputProps {
        className?: string;
    }
    interface ScrollViewProps {
        className?: string;
    }
    interface TouchableOpacityProps {
        className?: string;
    }
    interface FlatListProps<ItemT> {
        className?: string;
    }
    interface PressableProps {
        className?: string;
    }
    interface ImageBackgroundProps {
        className?: string;
    }
    interface ActivityIndicatorProps {
        className?: string;
    }
}

declare module 'react-native-safe-area-context' {
    export interface NativeSafeAreaViewProps {
        className?: string;
        style?: import('react-native').StyleProp<import('react-native').ViewStyle>;
    }
}
