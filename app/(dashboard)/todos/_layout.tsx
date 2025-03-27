import { Stack, Slot } from "expo-router";

export const todosLayout = () => {
  return <Stack screenOptions={{ animation: "default", headerShown: false }} />;
};

export default todosLayout;
