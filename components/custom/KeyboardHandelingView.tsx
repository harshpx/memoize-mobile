import React, { useState, useEffect, ReactNode } from "react";
import {
  Keyboard,
  View,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  KeyboardEvent,
} from "react-native";

interface KeyboardHandlingViewProps {
  children: ReactNode;
}

const KeyboardHandelingView: React.FC<KeyboardHandlingViewProps> = ({
  children,
}) => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardDidShow = (event: KeyboardEvent) => {
      setKeyboardHeight(event.endCoordinates.height - 32);
    };

    const keyboardDidHide = () => {
      setKeyboardHeight(0);
    };

    const showListener = Keyboard.addListener(
      "keyboardDidShow",
      keyboardDidShow,
    );
    const hideListener = Keyboard.addListener(
      "keyboardDidHide",
      keyboardDidHide,
    );

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1, backgroundColor: "black" }}
        >
          <View
            style={{
              flex: 1,
              // marginBottom: Platform.OS === "android" ? keyboardHeight : 0,
            }}
          >
            {children}
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default KeyboardHandelingView;
