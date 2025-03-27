import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  RegisterFormData,
  usernameValidation,
  emailValidation,
} from "@/validation/registerValidation";
import { AppContext } from "@/utils/AppContext";
import { storage } from "@/utils/methods";
import { useRouter } from "expo-router";
import useDebounce from "@/hooks/useDebounce";
import { ScrollView, RefreshControl, View } from "react-native";
import { useContext, useEffect, useRef, useState } from "react";
import {
  checkEmailAvailability,
  checkUsernameAvailability,
  registerUser,
} from "@/utils/features";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import AnimatedButton from "./AnimatedButton";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

const RegisterForm = () => {
  const router = useRouter();
  const { setUser, setToken } = useContext(AppContext);
  const [registerResponseMessage, setRegisterResponseMessage] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [usernameMessage, setUsernameMessage] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const {
    control,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const username = useWatch({ control, name: "username" });
  const email = useWatch({ control, name: "email" });
  const password = useWatch({ control, name: "password" });
  const confirmPassword = useWatch({ control, name: "confirmPassword" });

  const usernameRef = useRef<any>(null);
  const emailRef = useRef<any>(null);
  const passwordRef = useRef<any>(null);
  const confirmPasswordRef = useRef<any>(null);

  useEffect(() => {
    setRegisterResponseMessage("");
    if (!username) setUsernameMessage("");
    if (!email) setEmailMessage("");
  }, [username, email, password, confirmPassword]);

  const debouncedUsername = useDebounce(username, 500);
  const debouncedEmail = useDebounce(email, 500);

  // for checking username availability
  useEffect(() => {
    (async () => {
      if (
        debouncedUsername &&
        usernameValidation.safeParse(debouncedUsername).success
      ) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response: any = await checkUsernameAvailability(
            debouncedUsername,
          );
          if (response.success) {
            setUsernameMessage(response.message);
            clearErrors("username");
          } else {
            setUsernameMessage("");
            setError("username", {
              type: "manual",
              message: response.message,
            });
          }
        } catch (error) {
          setError("username", {
            type: "manual",
            message: "Something went wrong. Please try again later.",
          });
        } finally {
          setIsCheckingUsername(false);
        }
      }
    })();
  }, [debouncedUsername]);

  // for checking email availability
  useEffect(() => {
    (async () => {
      if (debouncedEmail && emailValidation.safeParse(debouncedEmail).success) {
        setIsCheckingEmail(true);
        setEmailMessage("");
        try {
          const response: any = await checkEmailAvailability(debouncedEmail);
          if (response.success) {
            setEmailMessage(response.message);
            clearErrors("email");
          } else {
            setEmailMessage("");
            setError("email", {
              type: "manual",
              message: response.message,
            });
          }
        } catch (error) {
          setError("email", {
            type: "manual",
            message: "Something went wrong. Please try again later.",
          });
        } finally {
          setIsCheckingEmail(false);
        }
      }
    })();
  }, [debouncedEmail]);

  const onRefresh = () => {
    setRefreshing(true);
    reset();
    setUsernameMessage("");
    setEmailMessage("");
    setRegisterResponseMessage("");
    setRefreshing(false);
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      const response = await registerUser(data);
      if (response.success) {
        await storage.set("user", response.user);
        await storage.set("token", response.token, true);
        setUser(response.user);
        setToken(response.token);
      } else {
        setRegisterResponseMessage(response.message);
      }
    } catch (error) {
      setRegisterResponseMessage("Something went wrong! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="h-60 w-full flex flex-row items-center justify-center">
        <Spinner size="large" color="white" />
      </View>
    );
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      className="p-4 w-full"
    >
      {registerResponseMessage && (
        <Text className="text-red-500 text-base my-1">
          {registerResponseMessage}
        </Text>
      )}
      {/* Username Field */}
      <View className="w-full flex-row justify-between gap-2">
        <FormControl isInvalid={!!errors.username} className="w-[48%]">
          <FormControlLabel>
            <FormControlLabelText>Username</FormControlLabelText>
          </FormControlLabel>
          <Controller
            name="username"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input className="rounded-xl">
                <InputField
                  ref={usernameRef}
                  placeholder="Enter username"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  returnKeyType="next"
                  onSubmitEditing={() => emailRef?.current?.focus()}
                />
              </Input>
            )}
          />
          {isCheckingUsername && (
            <View className="flex-row justify-start mt-1">
              <Spinner size="small" color={"white"} />
            </View>
          )}
          {errors.username && (
            <Text className="text-red-500 text-sm mt-1">
              {errors.username.message}
            </Text>
          )}
          {!isCheckingUsername && !errors.username && usernameMessage && (
            <Text className="text-green-500 text-sm mt-1">
              {usernameMessage}
            </Text>
          )}
        </FormControl>

        {/* email Field */}
        <FormControl isInvalid={!!errors.email} className="w-[48%]">
          <FormControlLabel>
            <FormControlLabelText>Email</FormControlLabelText>
          </FormControlLabel>
          <Controller
            name="email"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input className="rounded-xl">
                <InputField
                  ref={emailRef}
                  placeholder="Enter email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef?.current?.focus()}
                />
              </Input>
            )}
          />
          {isCheckingEmail && (
            <View className="flex-row justify-start mt-1">
              <Spinner size="small" color={"white"} />
            </View>
          )}
          {errors.email && (
            <Text className="text-red-500 text-sm mt-1">
              {errors.email.message}
            </Text>
          )}
          {!isCheckingEmail && !errors.email && emailMessage && (
            <Text className="text-green-500 text-sm mt-1">{emailMessage}</Text>
          )}
        </FormControl>
      </View>

      <View className="w-full flex-row justify-between gap-2 mt-4">
        {/* Password Field */}
        <FormControl isInvalid={!!errors.password} className="w-[48%]">
          <FormControlLabel>
            <FormControlLabelText>Password</FormControlLabelText>
          </FormControlLabel>
          <Controller
            name="password"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input className="rounded-xl">
                <InputField
                  ref={passwordRef}
                  secureTextEntry
                  placeholder="Enter password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  returnKeyType="next"
                  onSubmitEditing={() => confirmPasswordRef?.current?.focus()}
                />
              </Input>
            )}
          />
          {errors.password && (
            <Text className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </Text>
          )}
        </FormControl>

        {/* Confirm Password Field */}
        <FormControl isInvalid={!!errors.confirmPassword} className="w-[48%]">
          <FormControlLabel>
            <FormControlLabelText>Confirm Password</FormControlLabelText>
          </FormControlLabel>
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input className="rounded-xl">
                <InputField
                  ref={confirmPasswordRef}
                  secureTextEntry
                  placeholder="Confirm your password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit(onSubmit)}
                />
              </Input>
            )}
          />
          {errors.confirmPassword && (
            <Text className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </Text>
          )}
        </FormControl>
      </View>
      <View className="w-full mt-6 flex flex-row items-center justify-center gap-2">
        <AnimatedButton
          onPress={() => router.replace("/")}
          outerClassName="w-[20%]"
        >
          <ChevronLeft color="black" size={20} />
        </AnimatedButton>
        <AnimatedButton
          onPress={handleSubmit(onSubmit)}
          outerClassName="flex-grow"
        >
          <Text className="text-black text-center">Register</Text>
          <ChevronRight color="black" size={20} />
        </AnimatedButton>
      </View>
    </ScrollView>
  );
};

export default RegisterForm;
