import { NotebookPen } from "lucide-react-native";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
// size: 'sm' | 'md' | 'lg'
// style: 'inline' | 'stacked'
const Logo = ({ size, style }: { size: string; style: string }) => {
  return (
    <View
      className={`flex items-center justify-center
                 ${style === "inline" ? "flex-row" : ""} ${
        style === "block" ? "flex-col" : ""
      }`}
    >
      <NotebookPen
        color="white"
        size={size === "sm" ? 24 : size === "md" ? 40 : 60}
      />
      <Text
        className={`pt-1.5 text-white font-[600] ${
          size === "sm" ? " text-xl font-[400]" : ""
        }${size === "md" ? " text-3xl" : ""}${
          size === "lg" ? " text-4xl" : ""
        }`}
      >
        Memoize
      </Text>
    </View>
  );
};

export default Logo;
