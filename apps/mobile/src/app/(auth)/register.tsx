import { useEffect, useState } from "react";
import { View, Image, Pressable, Platform } from "react-native";
import {
  EyeClosed,
  EyeIcon,
  LockIcon,
  Mail,
  UserRound,
} from "lucide-react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import {
  Button,
  Typography,
  InputGroup,
  Surface,
  Separator,
  PressableFeedback,
  useToast,
} from "heroui-native";
import { registerUser, RegisterUserInput } from "@repo/common/validations/user";
import { ScrollView } from "react-native-gesture-handler";
import useAuthStore from "../../hooks/useAuthStrore";

export default function Register() {
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { register, isAuthenticated } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterUserInput>({
    resolver: zodResolver(registerUser),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: RegisterUserInput) => {
    try {
      // Connect your registration API here.
      console.log("Registration data:", data);

      const res = await register(data);

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
      console.error("Registration failed:", error);
      toast.show({
        variant: "danger",
        label: "Registration failed",
      });
    }
  };

  return (
    <View className="flex-1 justify-center">
      <Image
        source={require("../../../assets/images/onboarding/zuno-boarding-bg.png")}
        className="absolute inset-0"
        resizeMode="cover"
      />

      {/* Header */}
      <View className="flex-2/4 justify-center items-center">
        <Image
          source={require("../../../assets/images/onboarding/zuno-logo.png")}
          className="w-40 h-40"
          resizeMode="contain"
        />

        <View>
          <Typography type="h3" className="text-surface text-center">
            Create Account
          </Typography>

          <Typography type="body-sm" className="text-surface text-center">
            Sign up to start playing with friends
          </Typography>
        </View>
      </View>

      <Surface className="my-5 mb-13 mx-5 flex-2/3 rounded-4xl overflow-hidden">
        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-y-4"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
        >
          {/* Name */}
          <View>
            <Controller
              control={control}
              name="name"
              render={({ field: { value, onChange, onBlur } }) => (
                <InputGroup>
                  <InputGroup.Prefix>
                    <UserRound size={20} strokeWidth={2} />
                  </InputGroup.Prefix>
                  <InputGroup.Input
                    placeholder="Full name"
                    placeholderTextColor="gray"
                    autoCapitalize="words"
                    autoComplete="name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                </InputGroup>
              )}
            />
            {errors.name?.message && (
              <Typography type="body-sm" className="text-danger mt-1">
                {errors.name.message}
              </Typography>
            )}
          </View>

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
                    placeholder="Create password"
                    placeholderTextColor="gray"
                    secureTextEntry={!showPass}
                    autoCapitalize="none"
                    autoComplete="new-password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                  <InputGroup.Suffix>
                    <Pressable onPress={() => setShowPass((prev) => !prev)}>
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

          {/* Confirm Password */}
          <View>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { value, onChange, onBlur } }) => (
                <InputGroup>
                  <InputGroup.Prefix>
                    <LockIcon size={16} />
                  </InputGroup.Prefix>
                  <InputGroup.Input
                    placeholder="Confirm password"
                    placeholderTextColor="gray"
                    secureTextEntry={!showConfirmPass}
                    autoCapitalize="none"
                    autoComplete="new-password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                  <InputGroup.Suffix>
                    <Pressable
                      onPress={() => setShowConfirmPass((prev) => !prev)}
                    >
                      {showConfirmPass ? (
                        <EyeIcon size={16} />
                      ) : (
                        <EyeClosed size={16} />
                      )}
                    </Pressable>
                  </InputGroup.Suffix>
                </InputGroup>
              )}
            />
            {errors.confirmPassword?.message && (
              <Typography type="body-sm" className="text-danger mt-1">
                {errors.confirmPassword.message}
              </Typography>
            )}
          </View>

          {/* Registration Button */}
          <Button
            variant="primary"
            onPress={handleSubmit(onSubmit)}
            isDisabled={isSubmitting}
          >
            <Button.Label>
              {isSubmitting ? "Creating account..." : "Create Account"}
            </Button.Label>
          </Button>

          {/* Divider */}
          <View className="flex-row items-center gap-x-2">
            <Separator thickness={1} className="flex-1" />
            <Typography
              type="body-sm"
              className="text-surface-tertiary-foreground"
            >
              Join the fun
            </Typography>
            <Separator thickness={1} className="flex-1" />
          </View>

          {/* Login Navigation */}
          <View className="flex-row justify-center items-center gap-x-2">
            <Typography type="body-sm">Already have an account?</Typography>
            <PressableFeedback onPress={() => router.push("/login")}>
              <Typography type="body-sm" className="text-primary font-bold">
                Login
              </Typography>
            </PressableFeedback>
          </View>

          {/* Footer */}
          <Typography
            type="h5"
            className="text-center font-extrabold text-surface-muted"
          >
            Zuno © {new Date().getFullYear()}
          </Typography>
        </ScrollView>
      </Surface>
    </View>
  );
}
