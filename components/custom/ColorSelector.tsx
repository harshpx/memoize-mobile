import { colors } from "@/utils/common";
import AnimatedButton from "@/components/custom/AnimatedButton";
import { TouchableOpacity, View } from "react-native";
import { Palette } from "lucide-react-native";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
} from "@/components/ui/modal";
import { Text } from "@/components/ui/text";
import { useState } from "react";

interface ColorSelectorProps {
  color: any;
  setColor: (note: any) => void;
  className?: string;
}
const ColorSelector = ({ color, setColor, className }: ColorSelectorProps) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <AnimatedButton
        onPress={() => setShowModal(true)}
        overrideStyles
        innerClassName={className}
      >
        <Palette color="white" size={20} />
      </AnimatedButton>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="md">
        <ModalBackdrop />
        <ModalContent className="bg-black border shadow-lg rounded-2xl">
          <ModalCloseButton />
          <ModalHeader className="flex-row items-center justify-center">
            <Text className="text-white py-4 text-2xl">Select your color</Text>
          </ModalHeader>
          <ModalBody className="w-full">
            <View className="flex flex-row justify-center flex-wrap gap-2">
              {colors.map((c) => (
                <TouchableOpacity
                  key={c}
                  className={`w-16 h-16 rounded-full ${
                    c === color ? "border-2 border-white" : ""
                  }`}
                  style={{ backgroundColor: c }}
                  onPress={() => {
                    setColor(c);
                    setShowModal(false);
                  }}
                />
              ))}
            </View>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ColorSelector;
