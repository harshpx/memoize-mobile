import AnimatedButton from "@/components/custom/AnimatedButton";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "@/components/ui/actionsheet";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { AppContext } from "@/utils/AppContext";
import { syncUserData } from "@/utils/features";
import { storage } from "@/utils/methods";
import { Link, usePathname, useRouter } from "expo-router";
import {
  CloudUpload,
  ListTodo,
  LogOut,
  NotepadText,
  Settings,
} from "lucide-react-native";
import { useContext, useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import * as Haptics from "expo-haptics";

const Footer = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser, token, setToken, isOnline } = useContext(AppContext);
  const [showActionsheet, setShowActionsheet] = useState(false);

  // logout handler
  const logoutHandler = async () => {
    await storage.remove("user");
    await storage.remove("token");
    setUser(null);
    setToken(null);
  };

  // cloud push handler
  const [cloudPushing, setCloudPushing] = useState(false);
  const cloudPushHandler = async () => {
    if (!user || !token) return;
    try {
      setCloudPushing(true);
      const response = await syncUserData(user, token);
      if (response.success) {
        await storage.set("user", response.user);
        setUser(response.user);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setCloudPushing(false);
    }
  };
  // sync on mount
  useEffect(() => {
    if (isOnline && user) {
      cloudPushHandler();
    }
  }, []);
  return (
    <>
      <View className="w-full bg-black flex flex-row items-center justify-between px-6 shadow-lg h-16 py-2">
        <AnimatedButton
          onPress={cloudPushHandler}
          overrideStyles
          innerClassName="rounded-full px-5 py-3 bg-neutral-800"
        >
          {!cloudPushing ? (
            <CloudUpload color="#d4d4d4" size={20} />
          ) : (
            <Spinner color="white" size="small" />
          )}
        </AnimatedButton>
        <View className="h-full flex flex-row items-center bg-neutral-800 rounded-full">
          <Link href="/notes" replace asChild>
            <TouchableOpacity
              className={`flex flex-row items-center px-4 py-3 gap-2 rounded-full ${
                pathname === "/notes" ? "bg-neutral-300" : ""
              }`}
              onPress={() => {
                if (pathname !== "/notes") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }
              }}
            >
              <NotepadText
                color={pathname === "/notes" ? "black" : "#d4d4d4"}
                size={20}
              />
              <Text
                className={`${
                  pathname === "/notes" ? "text-black" : "text-white"
                }`}
              >
                Notes
              </Text>
            </TouchableOpacity>
          </Link>

          <Link href="/todos" replace asChild>
            <TouchableOpacity
              className={`flex flex-row items-center px-4 py-3 gap-2 rounded-full ${
                pathname === "/todos" ? "bg-neutral-300" : ""
              }`}
              onPress={() => {
                if (pathname !== "/todos") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }
              }}
            >
              <ListTodo
                color={pathname === "/todos" ? "black" : "#d4d4d4"}
                size={20}
              />
              <Text
                className={`${
                  pathname === "/todos" ? "text-black" : "text-white"
                }`}
              >
                Todos
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
        <TouchableOpacity
          onPress={() => {
            setShowActionsheet(true);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }}
        >
          <Avatar className="w-12 h-12">
            <AvatarFallbackText>{user?.username}</AvatarFallbackText>
            <AvatarImage source={{ uri: user?.avatar?.url }} />
          </Avatar>
        </TouchableOpacity>
      </View>
      <Actionsheet
        isOpen={showActionsheet}
        onClose={() => setShowActionsheet(false)}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent className="bg-black border-0 shadow-lg">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <View className="my-5 flex flex-col gap-5 items-center justify-center">
            <View className="relative">
              <Avatar className="w-44 h-44">
                <AvatarFallbackText>{user?.username}</AvatarFallbackText>
                <AvatarImage source={{ uri: user?.avatar?.url }} />
              </Avatar>
            </View>
            <View className="flex-col items-center justify-center">
              <Text className="text-3xl">Hi {user?.username}!</Text>
              <Text className="text-neutral-400 text-sm">{user?.email}</Text>
            </View>
            <View className="flex-row gap-2">
              <AnimatedButton onPress={cloudPushHandler} innerClassName="w-24 gap-1">
                <Text className="text-black text-sm">Sync</Text>
                {!cloudPushing ? (
                  <CloudUpload color="black" size={18} />
                ) : (
                  <Spinner color="black" size="small" />
                )}
              </AnimatedButton>
              <AnimatedButton
                onPress={() => {
                  setShowActionsheet(false);
                  router.push("/settings");
                }}
                innerClassName="w-24 gap-1"
              >
                <Text className="text-black text-sm">Settings</Text>
                <Settings color="black" size={18} />
              </AnimatedButton>
              <AnimatedButton onPress={logoutHandler} innerClassName="w-24 gap-1">
                <Text className="text-black text-sm">Logout</Text>
                <LogOut color="black" size={18} />
              </AnimatedButton>
            </View>
          </View>
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
};

export default Footer;
