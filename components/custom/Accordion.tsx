import React, { useEffect, useState } from "react";
import { View, Text, Pressable, LayoutChangeEvent } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import * as Haptics from "expo-haptics";

interface AccordionProps {
  children: React.ReactElement<AccordionItemProps>[];
  className?: string;
}

export interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
}

export const Accordion = ({ children, className = "" }: AccordionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <View className={`w-full flex-col gap-2 ${className}`}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return null;
        return React.cloneElement(child, {
          isOpen: openIndex === index,
          onToggle: () =>
            setOpenIndex((prev) => (prev === index ? null : index)),
        });
      })}
    </View>
  );
};

export const AccordionItem = ({
  title,
  children,
  isOpen = false,
  onToggle = () => {},
}: AccordionItemProps) => {
  const maxHeight = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    maxHeight: maxHeight.value,
    overflow: "hidden",
  }));

  useEffect(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    maxHeight.value = withTiming(isOpen ? 1000 : 0, {
      duration: 500,
    });
  }, [isOpen]);

  return (
    <View className="rounded-xl overflow-hidden">
      {/* Trigger */}
      <Pressable
        onPress={onToggle}
        className={`flex-row justify-between items-center px-2 py-2 rounded-xl ${isOpen ? "bg-neutral-700" : ""}`}
      >
        <Text className="text-white font-semibold text-base font-poppins pb-[0.7px]">
          {title}
        </Text>
        {isOpen ? (
          <ChevronUp size={20} color="white" />
        ) : (
          <ChevronDown size={20} color="white" />
        )}
      </Pressable>

      {/* Animated collapsible */}
      <Animated.View style={animatedStyle}>
        <View className="px-1 py-2">{children}</View>
      </Animated.View>
    </View>
  );
};
