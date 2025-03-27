import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { WifiOff } from "lucide-react-native";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { AppContext } from "@/utils/AppContext";

const NoInternet = () => {
  const router = useRouter();
  const { isOnline } = useContext(AppContext);

  useEffect(() => {
    if (isOnline) {
      router.replace("/");
    }
  }, [isOnline]);

  return (
    <View className="bg-black h-screen min-w-full flex-1 flex-col items-center justify-center gap-8">
      <WifiOff size={100} color="white" />
      <Text className="text-white text-xl">No internet connection</Text>
      <Text className="text-white text-sm text-center p-10">
        You need internet connection to atleast login / register &#40;then app
        can be used offline&#41;
      </Text>
      <Button
        onPress={() => {
          router.replace("/");
        }}
        className="bg-white rounded-xl"
      >
        <ButtonText className="text-black">Try again</ButtonText>
      </Button>
    </View>
  );
};

export default NoInternet;
