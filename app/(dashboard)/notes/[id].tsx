import KeyboardHandelingView from "@/components/custom/KeyboardHandelingView";
import { Text } from "@/components/ui/text";
import { AppContext } from "@/utils/AppContext";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useContext, useEffect, useRef, useState } from "react";
import {
  Platform,
  View,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

const Note = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const { user, setUser, token } = useContext(AppContext);

  // useEffect(() => {
  //   const goBackTrigger = navigation.addListener("beforeRemove", updateHandler);
  //   return () => goBackTrigger();
  // }, [navigation]);

  // const updateHandler = () => {
  //   console.log("Went back!");
  // };

  return (
    <KeyboardHandelingView>
      <View className="flex-1 w-full">
        <ScrollView
          className={`w-full bg-neutral-800 flex-1 ${
            Platform.OS === "ios" ? "pt-20 pb-4 px-4" : "pt-12 pb-2 px-5"
          }`}
          // keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
        >
          <TextInput
            className="font-poppins w-full text-5xl text-white"
            style={{ lineHeight: 60 }}
            placeholder="Title"
            textAlignVertical="bottom"
            cursorColor="#d4d4d4"
            placeholderTextColor="#737373"
          />
          <View className="w-full px-2">
            <TextInput
              className="font-poppins w-full text-lg text-white min-h-full"
              style={{ lineHeight: 24 }}
              placeholder="Note..."
              textAlignVertical="top"
              cursorColor="#d4d4d4"
              placeholderTextColor="#737373"
              multiline
              scrollEnabled={false}
            />
          </View>
        </ScrollView>
        {/* Persistent Footer */}
        <View
          className={`w-full bg-black flex flex-row items-center justify-between px-6 shadow-lg h-16 py-2 `}
        >
          <Text className="text-white text-center">Persistent Footer</Text>
        </View>
      </View>
    </KeyboardHandelingView>
  );
};

export default Note;
