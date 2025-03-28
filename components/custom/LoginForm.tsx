import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";

import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/validation/loginValidation";
import { ScrollView, RefreshControl, View, Keyboard } from "react-native";
import { useContext, useEffect, useRef, useState } from "react";
import { Text } from "@/components/ui/text";
import { Spinner } from "@/components/ui/spinner";
import { loginUser } from "@/utils/features";
import { storage } from "@/utils/methods";
import { AppContext } from "@/utils/AppContext";
import { useRouter } from "expo-router";

import { ChevronLeft, ChevronRight } from "lucide-react-native";
import AnimatedButton from "./AnimatedButton";

const LoginForm = () => {
  const router = useRouter();
  const { setUser, setToken } = useContext(AppContext);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginResponseMessage, setLoginResponseMessage] = useState("");
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const identifier = useWatch({ control, name: "identifier" });
  const password = useWatch({ control, name: "password" });

  const identifierRef = useRef<any>(null);
  const passwordRef = useRef<any>(null);

  useEffect(() => {
    setLoginResponseMessage("");
  }, [identifier, password]);

  const onRefresh = () => {
    setRefreshing(true);
    reset();
    setLoginResponseMessage("");
    setRefreshing(false);
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      const response = await loginUser(data);
      if (response.success) {
        await storage.set("user", response.user);
        await storage.set("token", response.token, true);
        setUser(response.user);
        setToken(response.token);
      } else {
        setLoginResponseMessage(response.message);
      }
    } catch (error) {
      setLoginResponseMessage("Something went wrong! Please try again.");
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
      {loginResponseMessage && (
        <Text className="text-red-500 text-base my-1">
          {loginResponseMessage}
        </Text>
      )}
      <FormControl isInvalid={!!errors.identifier}>
        <FormControlLabel>
          <FormControlLabelText>Username or Email</FormControlLabelText>
        </FormControlLabel>
        <Controller
          name="identifier"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input className="rounded-xl">
              <InputField
                ref={identifierRef}
                placeholder="Enter your identifier"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
              />
            </Input>
          )}
        />
        {errors.identifier && (
          <Text className="text-red-500 text-sm mt-1">
            {errors.identifier.message}
          </Text>
        )}
      </FormControl>

      <FormControl isInvalid={!!errors.password} className="mt-4">
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
                placeholder="Enter your password"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                returnKeyType="done"
                onSubmitEditing={handleSubmit(onSubmit)}
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

      <View className="w-full mt-6 h-10 flex flex-row items-center justify-center gap-2">
        <AnimatedButton
          onPress={() => router.replace("/")}
          outerClassName="w-[20%] h-full"
          innerClassName="h-full"
        >
          <ChevronLeft color="black" size={20} />
        </AnimatedButton>
        <AnimatedButton
          onPress={handleSubmit(onSubmit)}
          outerClassName="flex-grow h-full"
          innerClassName="h-full"
        >
          <Text className="text-black text-center">Login</Text>
          <ChevronRight color="black" size={20} />
        </AnimatedButton>
      </View>
    </ScrollView>
  );
};

export default LoginForm;
