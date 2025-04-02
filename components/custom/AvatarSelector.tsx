import { avatars } from "@/utils/common";
import { AppContext } from "@/utils/AppContext";
import { storage } from "@/utils/methods";
import { updateAvatar } from "@/utils/features";
import { useContext, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Text } from "@/components/ui/text";
import { Pen } from "lucide-react-native";
import { Image } from "@/components/ui/image";
import AnimatedButton from "./AnimatedButton";

const AvatarSelector = () => {
  const { user, setUser, isOnline, token } = useContext(AppContext);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const changeAvatar = async (url: string) => {
    const newAvatar = {
      url,
      updatedAt: new Date(),
    };
    await storage.set("user", { ...user, avatar: newAvatar });
    setUser({ ...user, avatar: newAvatar });
    setShowAvatarModal(false);
    if (isOnline) {
      try {
        const response = await updateAvatar(url, token);
        if (response.success) {
          await storage.set("user", { ...user, avatar: response.avatar });
          setUser({ ...user, avatar: response.avatar });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  return (
    <>
      <AnimatedButton
        onPress={() => setShowAvatarModal(true)}
        innerClassName="rounded-full p-1.5 bg-black border border-white"
        overrideStyles
      >
        <Pen color="white" size={22} />
      </AnimatedButton>
      <Modal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        size="md"
      >
        <ModalBackdrop />
        <ModalContent className="bg-black border shadow-lg rounded-2xl">
          <ModalCloseButton />
          <ModalHeader className="flex-row items-center justify-center">
            <Text className="text-white py-4 text-2xl font-semibold">
              Select your avatar
            </Text>
          </ModalHeader>
          <ModalBody className="w-full">
            <View className="flex flex-row justify-evenly flex-wrap gap-2">
              {avatars.map((url, index) => (
                <TouchableOpacity key={index} onPress={() => changeAvatar(url)}>
                  <Image
                    source={{ uri: url }}
                    alt="A"
                    className={`rounded-full w-20 h-20 ${
                      url === user?.avatar ? "p-1 border-2 border-white" : ""
                    }`}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AvatarSelector;
