import {
  Image,
  ImageSourcePropType,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Typography, cn } from "heroui-native";
import { ArrowRight } from "lucide-react-native";

export interface GameCardProps {
  id?: string;
  title: string;
  subtitle: string;
  icon: ImageSourcePropType;
  colors: [string, string, ...string[]];
  onPress?: () => void;
  className?: string;
}

const GameCard = ({
  title,
  subtitle,
  icon,
  colors,
  onPress,
  className = "",
}: GameCardProps) => {
  const { width } = useWindowDimensions();
  const imageSize = Math.round(Math.min(Math.max(width * 0.22, 68), 96));
  const cardMinHeight = Math.round(Math.min(Math.max(width * 0.27, 96), 124));
  const arrowSize = width < 360 ? 18 : width > 480 ? 24 : 22;

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      className={cn(
        "rounded-[26px] overflow-hidden shadow-md shadow-slate-300",
        className,
      )}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.8 }}
        style={{
          minHeight: cardMinHeight,
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 5,
          paddingVertical: 3.5,
        }}
      >
        {/* Left Game Artwork (Dynamic dimensions proportional to screen size) */}
        <Image
          source={icon}
          style={{ width: imageSize, height: imageSize }}
          className="mr-3.5"
          resizeMode="contain"
        />

        {/* Center Content */}
        <View className="flex-1 mr-2 justify-center">
          <Typography
            type="h3"
            className="text-white font-extrabold text-lg sm:text-xl tracking-tight"
          >
            {title}
          </Typography>
          <Typography
            type="body"
            className="text-white/90 text-sm mt-0.5 max-w-[75%] font-semibold"
          >
            {subtitle}
          </Typography>
        </View>

        {/* Right Arrow Action */}
        <View className="items-center justify-center pr-1">
          <ArrowRight color="white" size={arrowSize} strokeWidth={2.5} />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default GameCard;
