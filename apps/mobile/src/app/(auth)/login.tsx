import { useEffect, useState } from "react";
import {
  View,
  Image,
  Pressable,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import FontAwesome from "@react-native-vector-icons/fontawesome";
import {
  CheckIcon,
  EyeClosed,
  EyeIcon,
  LockIcon,
  Mail,
} from "lucide-react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import {
  Button,
  Typography,
  InputGroup,
  Surface,
  Checkbox,
  Separator,
  PressableFeedback,
  useToast,
} from "heroui-native";
import { loginUser, LoginUserInput } from "@repo/common/validations/user";
import useAuthStore from "../../hooks/useAuthStrore";

export default function Onboarding() {
  const [showPass, setShowPass] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const router = useRouter();
  const { login } = useAuthStore();
  const { toast } = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginUserInput>({
    resolver: zodResolver(loginUser),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginUserInput) => {
    try {
      // Connect your existing login API here.
      console.log("Login data:", data);
      const res = await login(data);

      if (res.success) {
        toast.show({
          variant: "success",
          label: res.message,
        });

        router.push("/(tabs)");
      } else {
        toast.show({
          variant: "danger",
          label: res.error,
        });
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleShowPass = () => {
    setShowPass((prev) => !prev);
  };

  return (
    <View className="flex-1 justify-center">
      {/* Background */}
      <Image
        source={require("../../../assets/images/onboarding/zuno-boarding-bg.png")}
        className="absolute inset-0"
        resizeMode="cover"
      />

      {/* Header stays fixed */}
      <View className="flex-2/4 justify-center items-center">
        <Image
          source={require("../../../assets/images/onboarding/zuno-logo.png")}
          className="w-40 h-40"
          resizeMode="contain"
        />

        <View>
          <Typography type="h3" className="text-surface text-center">
            Welcome Back!
          </Typography>

          <Typography type="body-sm" className="text-surface text-center">
            Login to your account to continue
          </Typography>
        </View>
      </View>

      {/* Scrollable white container */}
      <Surface className="my-5 mb-13 mx-5 flex-2/3 rounded-4xl overflow-hidden">
        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-y-4"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
        >
          {/* Email */}
          <View>
            <Controller
              control={control}
              name="email"
              render={({ field: { value, onChange, onBlur } }) => (
                <InputGroup>
                  <InputGroup.Prefix>
                    <Mail size={20} strokeWidth={2} />
                  </InputGroup.Prefix>

                  <InputGroup.Input
                    placeholder="Email"
                    placeholderTextColor="gray"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                </InputGroup>
              )}
            />

            {errors.email?.message && (
              <Typography type="body-sm" className="text-danger mt-1">
                {errors.email.message}
              </Typography>
            )}
          </View>

          {/* Password */}
          <View>
            <Controller
              control={control}
              name="password"
              render={({ field: { value, onChange, onBlur } }) => (
                <InputGroup>
                  <InputGroup.Prefix>
                    <LockIcon size={16} />
                  </InputGroup.Prefix>

                  <InputGroup.Input
                    placeholder="Enter your password"
                    placeholderTextColor="gray"
                    secureTextEntry={!showPass}
                    autoCapitalize="none"
                    autoComplete="current-password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />

                  <InputGroup.Suffix>
                    <Pressable onPress={handleShowPass}>
                      {showPass ? (
                        <EyeIcon size={16} />
                      ) : (
                        <EyeClosed size={16} />
                      )}
                    </Pressable>
                  </InputGroup.Suffix>
                </InputGroup>
              )}
            />

            {errors.password?.message && (
              <Typography type="body-sm" className="text-danger mt-1">
                {errors.password.message}
              </Typography>
            )}
          </View>

          {/* Remember Me and Forgot Password */}
          <View className="flex-row gap-x-4 justify-between items-center">
            <View className="flex-row gap-2 items-center">
              <Checkbox
                isSelected={isSelected}
                onSelectedChange={setIsSelected}
              >
                <Checkbox.Indicator>
                  {({ isSelected }) =>
                    isSelected ? <CheckIcon size={16} color="#FFF" /> : null
                  }
                </Checkbox.Indicator>
              </Checkbox>

              <Typography type="body-sm">Remember Me</Typography>
            </View>

            <TouchableOpacity onPress={() => router.push("/forgot-password")}>
              <Typography type="body-sm" className="text-primary">
                Forgot Password?
              </Typography>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <Button
            variant="primary"
            onPress={handleSubmit(onSubmit)}
            isDisabled={isSubmitting}
          >
            <Button.Label>
              {isSubmitting ? "Logging in..." : "Login"}
            </Button.Label>
          </Button>

          {/* Divider */}
          <View className="flex-row items-center gap-x-2">
            <Separator thickness={1} className="flex-1" />

            <Typography
              type="body-sm"
              className="text-surface-tertiary-foreground"
            >
              or continue with
            </Typography>

            <Separator thickness={1} className="flex-1" />
          </View>

          {/* Google Login */}
          <PressableFeedback className="bg-surface-muted p-3 rounded-2xl">
            <View className="flex-row justify-center items-center gap-x-2">
              <FontAwesome name="google" size={20} />

              <Typography
                type="body"
                className="text-background-game font-bold"
              >
                Continue With Google
              </Typography>
            </View>
          </PressableFeedback>

          {/* Register */}
          <View className="flex-row justify-center items-center gap-x-2">
            <Typography type="body-sm">Don't have an account?</Typography>

            <PressableFeedback onPress={() => router.push("/register")}>
              <Typography type="body-sm" className="text-primary font-bold">
                Sign Up
              </Typography>
            </PressableFeedback>
          </View>

          {/* Footer */}
          <Typography
            type="h5"
            className="text-center font-extrabold text-surface-muted mt-4"
          >
            Zuno © {new Date().getFullYear()}
          </Typography>
        </ScrollView>
      </Surface>
    </View>
  );
}
