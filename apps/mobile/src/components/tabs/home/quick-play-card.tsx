import { Image, View } from "react-native";
import { Button, Typography } from "heroui-native";
import { ArrowRight } from "lucide-react-native";
import quickPlayImg from "@assets/images/quick-play.jpg";

const QuickPlayCard = () => {
  return (
    <View className="p-3.5 rounded-2xl bg-white flex-row items-center mx-4 mt-2 mb-3 shadow-sm border border-slate-100">
      <Image
        source={quickPlayImg}
        className="w-14 h-14 rounded-2xl mr-3"
        resizeMode="cover"
      />
      <View className="flex-1 mr-3 gap-y-0.5">
        <Typography type="h5" className="font-extrabold text-slate-900 text-base">
          Quick Play
        </Typography>
        <Typography
          type="body-sm"
          className="text-slate-400 font-medium text-xs leading-4"
        >
          Jump into a game instantly
        </Typography>
      </View>
      <Button
        isIconOnly
        variant="primary"
        className="w-10 h-10 rounded-full aspect-square shadow-lg shadow-primary/20 items-center justify-center"
      >
        <ArrowRight color="white" size={18} />
      </Button>
    </View>
  );
};

export default QuickPlayCard;
