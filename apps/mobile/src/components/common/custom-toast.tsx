import React from "react";
import { TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import { Typography, cn } from "heroui-native";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  Sparkles,
  X,
} from "lucide-react-native";

export type ToastVariant = "default" | "accent" | "success" | "warning" | "danger";

export interface CustomToastProps {
  id?: string;
  label?: string;
  description?: string;
  variant?: ToastVariant;
  icon?: React.ReactNode;
  actionLabel?: string;
  onActionPress?: () => void;
  onClose?: () => void;
  hide?: (id?: string) => void;
}

const VARIANT_CONFIG: Record<
  ToastVariant,
  {
    borderColor: string;
    glowColor: string;
    icon: React.ReactNode;
  }
> = {
  default: {
    borderColor: "border-slate-700/80",
    glowColor: "shadow-slate-900/50",
    icon: <Info size={16} color="#94A3B8" />,
  },
  accent: {
    borderColor: "border-blue-500/40",
    glowColor: "shadow-blue-500/10",
    icon: <Sparkles size={16} color="#3B82F6" />,
  },
  success: {
    borderColor: "border-emerald-500/40",
    glowColor: "shadow-emerald-500/10",
    icon: <CheckCircle2 size={16} color="#10B981" />,
  },
  warning: {
    borderColor: "border-amber-500/40",
    glowColor: "shadow-amber-500/10",
    icon: <AlertTriangle size={16} color="#F59E0B" />,
  },
  danger: {
    borderColor: "border-rose-500/40",
    glowColor: "shadow-rose-500/10",
    icon: <AlertCircle size={16} color="#EF4444" />,
  },
};

/**
 * Compact, modern animated Toast component built for HeroUI Native.
 * Features a sleek dark glass design, concise typography, variant indicator icons,
 * and smooth spring physics.
 */
export const CustomToast: React.FC<CustomToastProps> = ({
  id,
  label,
  description,
  variant = "default",
  icon,
  actionLabel,
  onActionPress,
  onClose,
  hide,
}) => {
  const config = VARIANT_CONFIG[variant] ?? VARIANT_CONFIG.default;

  const handleDismiss = () => {
    if (onClose) {
      onClose();
    } else if (hide && id) {
      hide(id);
    }
  };

  return (
    <Animated.View
      entering={FadeInDown.springify().damping(20).stiffness(220)}
      exiting={FadeOutDown.duration(160)}
      className={cn(
        "flex-row items-center self-center max-w-[92%] px-3.5 py-2.5 rounded-2xl",
        "bg-slate-900/95 border shadow-xl",
        config.borderColor,
        config.glowColor,
      )}
    >
      {/* ── Status Icon ── */}
      <View className="mr-2.5 items-center justify-center">
        {icon ?? config.icon}
      </View>

      {/* ── Content Text ── */}
      <View className="flex-1 mr-2 justify-center">
        {label ? (
          <Typography
            type="body"
            className="text-white font-bold text-[13px] leading-tight"
          >
            {label}
          </Typography>
        ) : null}

        {description ? (
          <Typography
            type="body-xs"
            className="text-slate-400 font-medium text-[11px] leading-tight mt-0.5"
          >
            {description}
          </Typography>
        ) : null}
      </View>

      {/* ── Action Button ── */}
      {actionLabel && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onActionPress}
          className="bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-xl mr-1.5"
        >
          <Typography
            type="body-xs"
            className="text-blue-400 font-black text-[11px]"
          >
            {actionLabel}
          </Typography>
        </TouchableOpacity>
      )}

      {/* ── Close Button ── */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handleDismiss}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        className="w-5 h-5 rounded-full items-center justify-center bg-slate-800/60"
      >
        <X size={12} color="#94A3B8" />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default CustomToast;
