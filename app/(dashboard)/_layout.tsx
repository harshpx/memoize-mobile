import Footer from "@/components/custom/Footer";
import { Stack } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DashboardLayout = () => {
  const inset = useSafeAreaInsets();

  return (
    <View
      className="flex-1 flex-col min-h-screen min-w-full bg-neutral-800"
      style={{ paddingBottom: inset.bottom }}
    >
      <View className="flex-1">
        <Stack
          screenOptions={{
            animation: "none",
            headerShown: false,
            contentStyle: { backgroundColor: "#262626" },
          }}
        >
          <Stack.Screen name="notes" />
          <Stack.Screen name="todos" />
        </Stack>
      </View>
      <Footer />
    </View>
  );
};

export default DashboardLayout;

// ${
//   /^\/(notes|todos|checklists)\/[^/]+$/.test(pathname) ? "hidden" : ""
// }
