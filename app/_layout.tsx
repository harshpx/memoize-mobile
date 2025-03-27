import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import AppContextProvider from "@/utils/AppContext";

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
        <Stack
          screenOptions={{
            animation: "default",
            headerShown: false,
            contentStyle: { backgroundColor: "#262626" },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="(dashboard)" />
          <Stack.Screen name="no-internet" />
        </Stack>
        <StatusBar style="auto" hidden={false} />
      </GluestackUIProvider>
    </AppContextProvider>
  );
};

export default RootLayout;
