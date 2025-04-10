import { Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

const AnimatedButton = ({
  onPress,
  children,
  outerClassName = "",
  innerClassName = "",
  innerStyle = {},
  intensity = 0.9,
  overrideStyles = false,
  disabled = false,
}: any) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => (scale.value = withSpring(intensity))}
      onPressOut={() => (scale.value = withSpring(1))}
      onPress={() => {
        if (!disabled) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          onPress?.();
        }
      }}
      className={outerClassName}
      disabled={disabled}
    >
      <Animated.View
        style={[animatedStyle, innerStyle]}
        className={`${
          overrideStyles
            ? `${disabled ? " opacity-70" : ""}${innerClassName}`
            : `${
                disabled ? " opacity-70" : ""
              } rounded-xl py-2 px-3 bg-neutral-300 flex-row items-center justify-center ${innerClassName}`
        }`}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
};

export default AnimatedButton;
