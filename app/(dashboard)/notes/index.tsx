import { Button, ButtonText } from "@/components/ui/button";
import { Fab, FabIcon, FabLabel } from "@/components/ui/fab";
import { Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { AppContext } from "@/utils/AppContext";
import { storage } from "@/utils/methods";
import { useRouter } from "expo-router";
import { Plus } from "lucide-react-native";
import { useContext, useEffect, useState } from "react";
import { ScrollView, Platform, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const Note = ({ note }: any) => {
  const router = useRouter();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => (scale.value = withSpring(0.9))}
      onPressOut={() => (scale.value = withSpring(1))}
      // onPress={() => console.log("note clicked")}
    >
      <Animated.View
        className="w-full p-3 rounded-xl"
        style={[animatedStyle, { backgroundColor: note?.color || "#171717" }]}
      >
        <View className="max-h-52 min-h-36 overflow-hidden">
          <Text className="text-white text-lg">{note?.title}</Text>
          <Text className="text-white text-sm">{note?.content}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const CreateNoteButton = () => {
  const router = useRouter();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => (scale.value = withSpring(0.9))}
      onPressOut={() => (scale.value = withSpring(1))}
      onPress={() => router.push("/notes/new")}
      className="absolute bottom-5 right-5 z-10"
    >
      <Animated.View
        style={[animatedStyle]}
        className="rounded-2xl border-2 border-[#d4d4d4] bg-black p-3 flex-row items-center justify-center"
      >
        <Plus size={24} color="#d4d4d4" />
      </Animated.View>
    </Pressable>
  );
};

const NotesPage = () => {
  const router = useRouter();
  const { user, setUser, setToken } = useContext(AppContext);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // logout or no user redirect
  useEffect(() => {
    if (isMounted && !user) {
      router.replace("/");
    }
  }, [user, isMounted]);

  return (
    <View className={`w-full bg-neutral-800 flex-1 flex-grow`}>
      <CreateNoteButton />
      <ScrollView
        contentContainerClassName={`flex-col gap-5 items-center justify-start ${
          Platform.OS === "ios" ? "pt-20 pb-4 px-4" : "pt-12 pb-2 px-5"
        }`}
      >
        <View className="flex-row w-full gap-4">
          {/* Left Column */}
          <View className="flex-1 gap-4">
            {user?.notes
              ?.filter((_: any, i: number) => i % 2 === 0)
              ?.map((note: any) => (
                <Note key={note.id} note={note} />
              ))}
          </View>
          {/* Right Column */}
          <View className="flex-1 gap-4">
            {user?.notes
              ?.filter((_: any, i: number) => i % 2 !== 0)
              ?.map((note: any) => (
                <Note key={note.id} note={note} />
              ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default NotesPage;
