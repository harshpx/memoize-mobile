import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import AppContextProvider from "@/utils/AppContext";
import { SafeAreaView } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded] = useFonts({
    Poppins: require("../assets/fonts/Poppins.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <AppContextProvider>
      <GluestackUIProvider mode="dark">
        <SafeAreaView
          style={{ flex: 1, backgroundColor: "black" }}
          edges={["bottom"]}
        >
          <Stack
            screenOptions={{
              animation: "default",
              headerShown: false,
              contentStyle: {
                backgroundColor: "black",
              },
            }}
          />
        </SafeAreaView>
        <StatusBar style="auto" hidden={false} />
      </GluestackUIProvider>
    </AppContextProvider>
  );
};

export default RootLayout;
