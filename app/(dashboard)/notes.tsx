import { Button, ButtonText } from "@/components/ui/button";
import { Fab, FabIcon, FabLabel } from "@/components/ui/fab";
import { Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { AppContext } from "@/utils/AppContext";
import { storage } from "@/utils/methods";
import { useRouter } from "expo-router";
import { Pin, Plus } from "lucide-react-native";
import { useContext, useEffect, useState } from "react";
import { ScrollView, Platform, View } from "react-native";
import AnimatedButton from "@/components/custom/AnimatedButton";

const Note = ({ note }: any) => {
  const router = useRouter();

  return (
    <AnimatedButton
      overrideStyles
      innerClassName="w-full p-3 rounded-xl"
      innerStyle={{ backgroundColor: note?.color || "#171717" }}
      onPress={() => router.push(`/modify/note/${note?.id}`)}
    >
      {note?.pinned && (
        <View className="absolute top-2 right-2">
          <Pin color="white" size={12} />
        </View>
      )}
      <View className="max-h-52 min-h-36 overflow-hidden">
        <Text className="text-white text-lg">{note?.title}</Text>
        <Text className="text-white text-sm">{note?.content}</Text>
      </View>
    </AnimatedButton>
  );
};

const CreateNoteButton = () => {
  const router = useRouter();

  return (
    <AnimatedButton
      overrideStyles
      outerClassName="absolute bottom-5 right-5 z-10"
      innerClassName="rounded-2xl border-2 border-[#d4d4d4] bg-black p-3 flex-row items-center justify-center"
      onPress={() => router.push("/modify/note/new")}
    >
      <Plus size={24} color="#d4d4d4" />
    </AnimatedButton>
  );
};

const NotesPage = () => {
  const router = useRouter();
  const { user, setUser, setToken } = useContext(AppContext);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // logout or no user redirect
  useEffect(() => {
    if (isMounted && !user) {
      router.replace("/");
    }
  }, [user, isMounted]);

  return (
    <View className={`w-full bg-neutral-800 flex-1 flex-grow`}>
      <CreateNoteButton />
      <ScrollView
        contentContainerClassName={`flex-col gap-4 items-center justify-start ${
          Platform.OS === "ios" ? "pt-20 pb-4 px-4" : "pt-12 pb-2 px-5"
        }`}
      >
        {user?.notes?.length === 0 ? (
          <View className="mt-[20rem] flex-col items-center justify-center gap-2">
            <Text className="text-white text-2xl">No notes found</Text>
            <Text className="text-neutral-400 text-sm">
              Tap on + to create a new note
            </Text>
          </View>
        ) : (
          <View className="w-full flex-col gap-5">
            {/* pinned */}
            {user?.notes?.filter((note: any) => note?.pinned)?.length > 0 && (
              <View className="flex-col gap-2">
                <Text className="w-full text-white text-lg">Pinned</Text>
                <View className="flex-row w-full gap-4">
                  {/* Left Column */}
                  <View className="flex-1 gap-4">
                    {user?.notes
                      ?.filter((note: any) => note?.pinned)
                      ?.filter((_: any, i: number) => i % 2 === 0)
                      ?.map((note: any) => (
                        <Note key={note.id} note={note} />
                      ))}
                  </View>
                  {/* Right Column */}
                  <View className="flex-1 gap-4">
                    {user?.notes
                      ?.filter((note: any) => note?.pinned)
                      ?.filter((_: any, i: number) => i % 2 !== 0)
                      ?.map((note: any) => (
                        <Note key={note.id} note={note} />
                      ))}
                  </View>
                </View>
              </View>
            )}
            {/* unpinned */}
            {user?.notes?.filter((note: any) => !note?.pinned)?.length > 0 && (
              <View className="flex-col gap-2">
                <Text className="w-full text-white text-lg">Unpinned</Text>
                <View className="flex-row w-full gap-4">
                  {/* Left Column */}
                  <View className="flex-1 gap-4">
                    {user?.notes
                      ?.filter((note: any) => !note?.pinned)
                      ?.filter((_: any, i: number) => i % 2 === 0)
                      ?.map((note: any) => (
                        <Note key={note.id} note={note} />
                      ))}
                  </View>
                  {/* Right Column */}
                  <View className="flex-1 gap-4">
                    {user?.notes
                      ?.filter((note: any) => !note?.pinned)
                      ?.filter((_: any, i: number) => i % 2 !== 0)
                      ?.map((note: any) => (
                        <Note key={note.id} note={note} />
                      ))}
                  </View>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default NotesPage;
