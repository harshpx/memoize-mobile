import { useContext, useEffect, useState } from "react";
import { View, TouchableOpacity, Pressable } from "react-native";
import LoginForm from "@/components/custom/LoginForm";
import RegisterForm from "@/components/custom/RegisterForm";
import Logo from "@/components/custom/Logo";
import { Text } from "@/components/ui/text";
import * as Haptics from "expo-haptics";
import { AppContext } from "@/utils/AppContext";
import { useRouter } from "expo-router";

const auth = () => {
  const router = useRouter();
  const { isOnline, user } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [isMounted, setIsMounted] = useState(false);

  const handleTabSwitch = (tab: "login" | "register") => {
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setActiveTab(tab);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // no network redirect
  useEffect(() => {
    if (isMounted && !isOnline) {
      router.replace("/no-internet");
    }
  }, [isOnline, isMounted]);

  // logged in redirect
  useEffect(() => {
    if (isMounted && user) {
      router.replace("/notes");
    }
  }, [user, isMounted]);

  return (
    <View className="min-h-screen min-w-full bg-black">
      <View className="h-full flex-col gap-10 mt-20 p-8">
        <Logo size="lg" style="inline" />
        <View className="h-full w-full flex flex-col items-center gap-1">
          <View className="w-[70%] flex flex-row items-center p-1 bg-neutral-800 rounded-xl">
            <TouchableOpacity
              className={`flex flex-row items-center justify-center p-1 w-1/2 rounded-lg ${
                activeTab === "login" ? "bg-black" : ""
              }`}
              onPress={() => handleTabSwitch("login")}
            >
              <Text
                className={`text-lg text-white ${
                  activeTab === "login" ? "" : "text-gray-500"
                }`}
              >
                Login
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex flex-row items-center justify-center p-1 w-1/2 rounded-lg ${
                activeTab === "register" ? "bg-black" : ""
              }`}
              onPress={() => handleTabSwitch("register")}
            >
              <Text
                className={`text-lg text-white ${
                  activeTab === "register" ? "" : "text-gray-500"
                }`}
              >
                Register
              </Text>
            </TouchableOpacity>
          </View>
          {activeTab === "login" ? <LoginForm /> : <RegisterForm />}
        </View>
      </View>
    </View>
  );
};

export default auth;
