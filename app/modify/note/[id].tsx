import AnimatedButton from "@/components/custom/AnimatedButton";
import ColorSelector from "@/components/custom/ColorSelector";
import KeyboardHandelingView from "@/components/custom/KeyboardHandelingView";
import { Text } from "@/components/ui/text";
import { AppContext } from "@/utils/AppContext";
import { syncNotes } from "@/utils/features";
import { storage } from "@/utils/methods";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { ChevronLeft, Code, Pin, PinOff, Trash } from "lucide-react-native";
import { useContext, useEffect, useRef, useState } from "react";
import { Platform, View, ScrollView, TextInput } from "react-native";
import * as Haptics from "expo-haptics";

const Note = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const { user, setUser, token, isOnline } = useContext(AppContext);

  const noteToBeUpdated = user?.notes?.find(
    (note: any) => note.id === id.toString(),
  );

  const newNote = {
    id:
      noteToBeUpdated?.id ||
      "note-" +
        Math.random().toString(36).substring(2) +
        "-" +
        Math.random().toString(36).substring(2) +
        "-" +
        Math.random().toString(36).substring(2),
    title: noteToBeUpdated?.title || "",
    content: noteToBeUpdated?.content || "",
    color: noteToBeUpdated?.color || "#171717",
    pinned: noteToBeUpdated?.pinned || false,
    deleted: noteToBeUpdated?.deleted || false,
    status: noteToBeUpdated?.status || "active",
    updatedAt: noteToBeUpdated?.updatedAt || new Date(),
  };

  const [title, setTitle] = useState(newNote?.title);
  const [content, setContent] = useState(newNote?.content);
  const [color, setColor] = useState(newNote?.color);
  const [pinned, setPinned] = useState(newNote?.pinned);

  useEffect(() => {
    const goBackTrigger = navigation.addListener("beforeRemove", updateHandler);
    return () => goBackTrigger();
  }, [navigation, title, content, color, pinned]);

  const updateHandler = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    newNote.title = title;
    newNote.content = content;
    newNote.color = color;
    newNote.pinned = pinned;
    newNote.updatedAt = new Date();

    try {
      // if new note is to be created
      if (id.toString() === "new") {
        // no title and no content, return
        if (!newNote.title && !newNote.content) return;
        // else create a new note
        const updatedNotes = [newNote, ...user?.notes];
        await storage.set("user", { ...user, notes: updatedNotes });
        setUser({ ...user, notes: updatedNotes });
        if (isOnline) {
          const response = await syncNotes(updatedNotes, token);
          if (response.success) {
            await storage.set("user", { ...user, notes: response.notes });
            setUser({ ...user, notes: response.notes });
          }
        }
      } // else note is to be updated
      else {
        // if no title and no content, delete the note (soft delete)
        if (!newNote.title && !newNote.content) {
          const updatedNotes = user?.notes.map((note: any) =>
            note.id === id
              ? { ...note, deleted: true, updatedAt: new Date() }
              : note,
          );
          await storage.set("user", { ...user, notes: updatedNotes });
          setUser({ ...user, notes: updatedNotes });
          if (isOnline) {
            const response = await syncNotes(updatedNotes, token);
            if (response.success) {
              await storage.set("user", { ...user, notes: response.notes });
              setUser({ ...user, notes: response.notes });
            }
          }
          return;
        }
        // else update the note
        // if the note is not changed, return
        if (
          newNote.title === noteToBeUpdated?.title &&
          newNote.content === noteToBeUpdated?.content &&
          newNote.color === noteToBeUpdated?.color &&
          newNote.pinned === noteToBeUpdated?.pinned
        ) {
          return;
        }
        // else update the note
        const updatedNotes = user?.notes?.filter((note: any) => note.id !== id); // remove the note from the list
        updatedNotes.unshift(newNote); // add the updated note to the top of the list
        // simiar to -> updatedNotes = [...updatedNotes, newNote] but better;
        await storage.set("user", { ...user, notes: updatedNotes });
        setUser({ ...user, notes: updatedNotes });
        if (isOnline) {
          const response = await syncNotes(updatedNotes, token);
          if (response.success) {
            await storage.set("user", { ...user, notes: response.notes });
            setUser({ ...user, notes: response.notes });
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteNoteHandler = async () => {
    try {
      const updatedNotes = user?.notes.map((note: any) =>
        note.id === id
          ? { ...note, deleted: true, updatedAt: new Date() }
          : note,
      );
      navigation.goBack();
      await storage.set("user", { ...user, notes: updatedNotes });
      setUser({ ...user, notes: updatedNotes });
      if (isOnline) {
        const response = await syncNotes(updatedNotes, token);
        if (response.success) {
          await storage.set("user", { ...user, notes: response.notes });
          setUser({ ...user, notes: response.notes });
        }
      }
      return;
    } catch (error) {
      console.log(error);
    }
  };

  const goBackHandler = async () => {
    navigation.goBack();
    await updateHandler();
  };

  return (
    <KeyboardHandelingView>
      <View className="flex-1 w-full" style={{ backgroundColor: color }}>
        <ScrollView
          className={`w-full ${
            Platform.OS === "ios" ? "pt-20 pb-4 px-4" : "pt-16 pb-4 px-5"
          }`}
          // keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="gap-4 pb-[100px]"
        >
          <AnimatedButton
            onPress={goBackHandler}
            overrideStyles
            innerClassName="flex-row items-center py-2"
          >
            <ChevronLeft color="white" size={22} />
            <Text className="text-white">Notes</Text>
          </AnimatedButton>
          <TextInput
            className="font-poppins w-full text-3xl text-white"
            style={{ lineHeight: 50 }}
            placeholder="Title"
            textAlignVertical="center"
            cursorColor="#d4d4d4"
            placeholderTextColor="#737373"
            value={title}
            onChangeText={setTitle}
          />
          <View className="w-full px-1.5">
            <TextInput
              className="font-poppins w-full text-md text-white min-h-full"
              style={{ lineHeight: 24 }}
              placeholder="Note..."
              textAlignVertical="top"
              cursorColor="#d4d4d4"
              placeholderTextColor="#737373"
              multiline
              scrollEnabled={false}
              value={content}
              onChangeText={setContent}
            />
          </View>
        </ScrollView>
        {/* footer bar */}
        <View className="w-full bg-black flex-row items-center justify-center gap-4 h-16 px-6 py-2">
          <ColorSelector
            color={color}
            setColor={setColor}
            className="px-4 py-3 rounded-full bg-neutral-800"
          />
          <AnimatedButton
            overrideStyles
            innerClassName="px-4 py-3 rounded-full bg-neutral-800"
            onPress={() => {
              setPinned((prev: boolean) => !prev);
            }}
          >
            {!pinned ? (
              <Pin color="white" size={20} />
            ) : (
              <PinOff color="white" size={20} />
            )}
          </AnimatedButton>
          {id.toString() !== "new" && (
            <AnimatedButton
              overrideStyles
              innerClassName="px-4 py-3 rounded-full bg-neutral-800"
              onPress={deleteNoteHandler}
            >
              <Trash color="white" size={20} />
            </AnimatedButton>
          )}
        </View>
      </View>
    </KeyboardHandelingView>
  );
};

export default Note;
