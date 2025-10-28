import { View, type ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SafeAreaViewWrapperProps extends Omit<ViewProps, 'style'> {
  edges?: ('top' | 'left' | 'right' | 'bottom')[];
  style?: ViewProps['style'];
}

/**
 * Custom SafeAreaView wrapper that uses useSafeAreaInsets hook
 * to add manual padding instead of using the crash-prone SafeAreaView component.
 * This works with React Native's new architecture.
 */
export default function SafeAreaViewWrapper({ edges = ['top', 'left', 'right'], style, ...props }: SafeAreaViewWrapperProps) {
  const insets = useSafeAreaInsets();
  
  const paddingStyle = {
    paddingTop: edges.includes('top') ? insets.top : 0,
    paddingLeft: edges.includes('left') ? insets.left : 0,
    paddingRight: edges.includes('right') ? insets.right : 0,
    paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
  };

  return <View style={[style, paddingStyle]} {...props} />;
}

