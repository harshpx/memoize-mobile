import { Button, ButtonText } from "@/components/ui/button";
import { Fab, FabIcon, FabLabel } from "@/components/ui/fab";
import { Pressable, RefreshControl } from "react-native";
import { Text } from "@/components/ui/text";
import { AppContext } from "@/utils/AppContext";
import { storage } from "@/utils/methods";
import { useRouter } from "expo-router";
import { Pin, Plus } from "lucide-react-native";
import { useContext, useEffect, useState } from "react";
import { ScrollView, Platform, View } from "react-native";
import AnimatedButton from "@/components/custom/AnimatedButton";
import { syncNotes } from "@/utils/features";

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
      <View className="max-h-52 min-h-36 overflow-hidden flex-col gap-1">
        <Text className="text-white text-xl">{note?.title}</Text>
        <Text className="text-white text-[10px]">{note?.content}</Text>
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
  const { user, setUser, token, isOnline } = useContext(AppContext);
  const [isMounted, setIsMounted] = useState(false);

  const [pinnedNotes, setPinnedNotes] = useState<any>([]);
  const [unpinnedNotes, setUnpinnedNotes] = useState<any>([]);

  const [refreshing, setRefreshing] = useState(false);

  const refreshHandler = async () => {
    setRefreshing(true);
    if (isOnline) {
      try {
        const response = await syncNotes(user?.notes, token);
        if (response.success) {
          await storage.set("user", { ...user, notes: response.notes });
          setUser({ ...user, notes: response.notes });
        }
      } catch (error) {
        console.log(error);
      }
    }
    setRefreshing(false);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const displayNotes = user?.notes?.filter((note: any) => !note.deleted);
    setPinnedNotes(displayNotes?.filter((note: any) => note?.pinned) || []);
    setUnpinnedNotes(displayNotes?.filter((note: any) => !note?.pinned) || []);
  }, [user]);

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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshHandler} />
        }
        contentContainerClassName={`flex-col gap-4 items-center justify-start ${
          Platform.OS === "ios" ? "pt-20 pb-4 px-4" : "pt-12 pb-2 px-5"
        }`}
      >
        {pinnedNotes.length === 0 && unpinnedNotes.length === 0 ? (
          <View className="mt-[20rem] flex-col items-center justify-center gap-2">
            <Text className="text-white text-2xl">No notes found</Text>
            <Text className="text-neutral-400 text-sm">
              Tap on + to create a new note
            </Text>
          </View>
        ) : (
          <View className="w-full flex-col gap-5">
            {/* pinned */}
            {pinnedNotes.length > 0 && (
              <View className="flex-col gap-2">
                <Text className="w-full text-white text-lg">Pinned</Text>
                <View className="flex-row w-full gap-4">
                  {/* Left Column */}
                  <View className="flex-1 gap-4">
                    {pinnedNotes
                      ?.filter((_: any, i: number) => i % 2 === 0)
                      ?.map((note: any) => (
                        <Note key={note.id} note={note} />
                      ))}
                  </View>
                  {/* Right Column */}
                  <View className="flex-1 gap-4">
                    {pinnedNotes
                      ?.filter((_: any, i: number) => i % 2 !== 0)
                      ?.map((note: any) => (
                        <Note key={note.id} note={note} />
                      ))}
                  </View>
                </View>
              </View>
            )}
            {/* unpinned */}
            {unpinnedNotes.length > 0 && (
              <View className="flex-col gap-2">
                <Text className="w-full text-white text-lg">Unpinned</Text>
                <View className="flex-row w-full gap-4">
                  {/* Left Column */}
                  <View className="flex-1 gap-4">
                    {unpinnedNotes
                      ?.filter((_: any, i: number) => i % 2 === 0)
                      ?.map((note: any) => (
                        <Note key={note.id} note={note} />
                      ))}
                  </View>
                  {/* Right Column */}
                  <View className="flex-1 gap-4">
                    {unpinnedNotes
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
