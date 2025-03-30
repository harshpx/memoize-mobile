import { Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const AnimatedButton = ({
  onPress,
  children,
  outerClassName = "",
  innerClassName = "",
  innerStyle = {},
  intensity = 0.9,
  overrideStyles = false,
}: any) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => (scale.value = withSpring(intensity))}
      onPressOut={() => (scale.value = withSpring(1))}
      onPress={onPress}
      className={outerClassName}
    >
      <Animated.View
        style={[animatedStyle, innerStyle]}
        className={`${
          overrideStyles
            ? `${innerClassName}`
            : `rounded-xl py-2 px-3 bg-neutral-300 flex-row items-center justify-center ${innerClassName}`
        }`}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
};

export default AnimatedButton;
