import { Text } from "@/components/ui/text";
import { AppContext } from "@/utils/AppContext";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { View, ScrollView, Platform } from "react-native";

const TodosPage = () => {
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
    <View className="flex-1 flex-grow w-full bg-neutral-800">
      <ScrollView
        contentContainerClassName={`bg-neutral-800 flex-col gap-5 items-center justify-start ${
          Platform.OS === "ios" ? "pt-20 pb-4 px-4" : "pt-12 pb-2 px-5"
        }`}
      >
        <Text className="text-white text-lg">Todos</Text>
        <Text className="text-white text-lg">Todos will come soon!</Text>
      </ScrollView>
    </View>
  );
};

export default TodosPage;
