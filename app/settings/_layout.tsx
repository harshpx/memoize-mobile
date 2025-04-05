import { Stack } from "expo-router";

const SettingsLayout = () => {
  return (
    <Stack
      screenOptions={{
        animation: "default",
        headerShown: false,
        contentStyle: { backgroundColor: "black" },
      }}
    />
  );
};

export default SettingsLayout;
