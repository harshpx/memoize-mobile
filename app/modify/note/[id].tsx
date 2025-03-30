import AnimatedButton from "@/components/custom/AnimatedButton";
import ColorSelector from "@/components/custom/ColorSelector";
import KeyboardHandelingView from "@/components/custom/KeyboardHandelingView";
import { AppContext } from "@/utils/AppContext";
import { pushNotes } from "@/utils/features";
import { storage } from "@/utils/methods";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Code, Pin, PinOff, Trash } from "lucide-react-native";
import { useContext, useEffect, useRef, useState } from "react";
import { Platform, View, ScrollView, TextInput } from "react-native";

const Note = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const { user, setUser, token, isOnline } = useContext(AppContext);

  const newNote = {
    id:
      "note-" +
      Math.random().toString(36).substring(2) +
      "-" +
      Math.random().toString(36).substring(2) +
      "-" +
      Math.random().toString(36).substring(2),
    title: "",
    content: "",
    color: "#171717",
    pinned: false,
    status: "active",
    updatedAt: new Date(),
  };

  const currNote =
    id.toString() === "new"
      ? newNote
      : user?.notes?.find((note: any) => note.id === id.toString());

  const [title, setTitle] = useState(currNote?.title);
  const [content, setContent] = useState(currNote?.content);
  const [color, setColor] = useState(currNote?.color);
  const [pinned, setPinned] = useState(currNote?.pinned);

  useEffect(() => {
    const goBackTrigger = navigation.addListener("beforeRemove", updateHandler);
    return () => goBackTrigger();
  }, [navigation, title, content, color, pinned]);

  const updateHandler = async () => {
    try {
      newNote.title = title;
      newNote.content = content;
      newNote.color = color;
      newNote.pinned = pinned;
      newNote.updatedAt = new Date();
      // if new note is to be created
      if (id.toString() === "new") {
        // no title and no content, return
        if (!newNote.title && !newNote.content) return;
        // else create a new note
        const updatedNotes = [...user?.notes, newNote];
        await storage.set("user", { ...user, notes: updatedNotes });
        setUser({ ...user, notes: updatedNotes });
        if (isOnline) {
          await pushNotes(updatedNotes, token);
        }
      }
      // else if note is to be updated
      else {
        // if no title and no content, delete the note
        if (!newNote.title && !newNote.content) {
          const updatedNotes = user?.notes.filter(
            (note: any) => note.id !== id,
          );
          await storage.set("user", { ...user, notes: updatedNotes });
          setUser({ ...user, notes: updatedNotes });
          if (isOnline) {
            await pushNotes(updatedNotes, token);
          }
          return;
        }
        // else update the note
        // if the note is not changed, return
        if (
          newNote.title === currNote?.title &&
          newNote.content === currNote?.content &&
          newNote.color === currNote?.color &&
          newNote.pinned === currNote?.pinned
        ) {
          return;
        }
        // else update the note
        const updatedNotes = user?.notes.map((note: any) =>
          note.id === id ? newNote : note,
        );
        await storage.set("user", { ...user, notes: updatedNotes });
        setUser({ ...user, notes: updatedNotes });
        if (isOnline) {
          await pushNotes(updatedNotes, token);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <KeyboardHandelingView>
      <View className="flex-1 w-full" style={{ backgroundColor: color }}>
        <ScrollView
          className={`w-full flex-1 ${
            Platform.OS === "ios" ? "pt-20 pb-4 px-4" : "pt-16 pb-4 px-5"
          }`}
          // keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 100,
            gap: 15,
          }}
        >
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
          <AnimatedButton
            overrideStyles
            innerClassName="px-4 py-3 rounded-full bg-neutral-800"
            onPress={() => {
              setPinned((prev: boolean) => !prev);
            }}
          >
            <Trash color="white" size={20} />
          </AnimatedButton>
        </View>
      </View>
    </KeyboardHandelingView>
  );
};

export default Note;
