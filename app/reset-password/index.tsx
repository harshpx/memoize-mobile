import Logo from "@/components/custom/Logo";
import { Text } from "@/components/ui/text";
import { Platform, RefreshControl, ScrollView, View } from "react-native";
import { z } from "zod";

import { emailValidation } from "@/validation/registerValidation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { useState } from "react";
import AnimatedButton from "@/components/custom/AnimatedButton";
import { ChevronRight } from "lucide-react-native";
import { Spinner } from "@/components/ui/spinner";
import { sendResetPasswordEmail } from "@/utils/features";

const emailFormSchema = z.object({
  email: emailValidation,
});
type EmailFormData = z.infer<typeof emailFormSchema>;

const ResetPassword = () => {
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [responseError, setResponseError] = useState(false);

  const refreshHandler = () => {
    setRefresh(true);
    reset();
    setResponseMessage("");
    setRefresh(false);
  };

  const onSubmit = async (data: EmailFormData) => {
    try {
      setLoading(true);
      const response = await sendResetPasswordEmail(data?.email);
      if (response?.success) {
        setResponseMessage(response.message);
        setResponseError(false);
      } else {
        setResponseMessage(response.message);
        setResponseError(true);
      }
    } catch (error) {
      setResponseMessage("Failed to send reset password email");
      setResponseError(true);
    } finally {
      setLoading(false);
      reset();
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
        <RefreshControl refreshing={refresh} onRefresh={refreshHandler} />
      }
      className="flex-1 min-w-full p-10 flex-col gap-8"
    >
      <View className={`w-full flex-col items-center px-6 pt-24`}>
        <View className="w-full flex-col gap-2 items-center mb-10">
          <Text className="text-lg">Reset password of your</Text>
          <View className="flex-row gap-2 items-center">
            <Logo size="md" style="inline" />
            <Text className="text-lg font-extralight pt-2">Account</Text>
          </View>
        </View>

        <FormControl isInvalid={!!errors.email} className="w-full mb-5">
          <FormControlLabel>
            <FormControlLabelText className="font-normal text-sm">
              Enter your registered email
            </FormControlLabelText>
          </FormControlLabel>
          <Controller
            name="email"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input className="rounded-xl ">
                <InputField
                  placeholder="Email"
                  value={value}
                  onChangeText={(text) => {
                    onChange(text);
                    setResponseMessage("");
                  }}
                  onBlur={onBlur}
                  returnKeyType="next"
                  onSubmitEditing={handleSubmit(onSubmit)}
                />
              </Input>
            )}
          />
          {errors.email && (
            <Text className="text-red-500 text-sm mt-1">
              {errors.email.message}
            </Text>
          )}
          {responseMessage && (
            <Text
              className={`text-sm mt-1 ${
                responseError ? "text-red-500" : "text-green-500"
              }`}
            >
              {responseMessage}
            </Text>
          )}
        </FormControl>
        <View className="w-full flex-row gap-2 items-center justify-center">
          <AnimatedButton onPress={handleSubmit(onSubmit)}>
            <Text className="text-black text-center text-sm">
              Send reset link
            </Text>
          </AnimatedButton>
        </View>
      </View>
    </ScrollView>
  );
};

export default ResetPassword;
