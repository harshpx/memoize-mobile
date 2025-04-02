import { Stack } from "expo-router";

const ResetLayout = () => {
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

export default ResetLayout;
