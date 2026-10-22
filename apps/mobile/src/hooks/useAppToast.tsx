import React from "react";
import { useToast } from "heroui-native";
import {
  CustomToast,
  CustomToastProps,
  ToastVariant,
} from "@/components/common/custom-toast";

export interface ShowToastOptions
  extends Omit<CustomToastProps, "hide" | "id"> {
  id?: string;
  duration?: number | "persistent";
}

/**
 * Enhanced Toast hook providing compact, animated toasts positioned at the bottom,
 * reacting to the keyboard automatically.
 */
export const useAppToast = () => {
  const { toast } = useToast();

  const show = (options: string | ShowToastOptions) => {
    if (typeof options === "string") {
      return toast.show({
        duration: 3500,
        component: (props) => (
          <CustomToast {...props} label={options} variant="default" />
        ),
      });
    }

    const { duration = 3500, ...rest } = options;

    return toast.show({
      id: rest.id,
      duration,
      component: (props) => <CustomToast {...props} {...rest} />,
    });
  };

  const success = (label: string, description?: string) =>
    show({ label, description, variant: "success" });

  const error = (label: string, description?: string) =>
    show({ label, description, variant: "danger" });

  const warning = (label: string, description?: string) =>
    show({ label, description, variant: "warning" });

  const info = (label: string, description?: string) =>
    show({ label, description, variant: "default" });

  const hide = (ids?: string | string[] | "all") => toast.hide(ids);

  return {
    show,
    success,
    error,
    warning,
    info,
    hide,
    toast,
  };
};

export default useAppToast;
