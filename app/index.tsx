import Logo from "@/components/custom/Logo";
import { useRouter, useSegments } from "expo-router";
import { View } from "react-native";
import * as Haptics from "expo-haptics";
import { Text } from "@/components/ui/text";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "@/utils/AppContext";
import AnimatedButton from "@/components/custom/AnimatedButton";

const index = () => {
  const { isOnline, user } = useContext(AppContext);
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();

  const handlePress = async () => {
    // await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    isOnline ? router.replace("/auth") : router.replace("/no-internet");
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // already logged in redirect
  useEffect(() => {
    if (isMounted && user) {
      router.replace("/notes");
    }
  }, [user, isMounted]);

  return (
    <View className="h-screen min-w-full flex-1 flex-col items-center justify-center gap-10 bg-black">
      <View className="flex flex-col items-center justify-center gap-6">
        <Text className="text-white text-lg">Welcome to</Text>
        <Logo size="lg" style="block" />
      </View>
      <AnimatedButton onPress={handlePress}>
        <Text className="text-black">Get Started</Text>
      </AnimatedButton>
    </View>
  );
};

export default index;
