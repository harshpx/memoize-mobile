import AnimatedButton from "@/components/custom/AnimatedButton";
import AvatarSelector from "@/components/custom/AvatarSelector";
import KeyboardHandelingView from "@/components/custom/KeyboardHandelingView";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { AppContext } from "@/utils/AppContext";
import { useNavigation, useRouter } from "expo-router";
import { ChevronLeft, LogOut, Trash2 } from "lucide-react-native";
import { useContext, useEffect, useState } from "react";
import { Platform, ScrollView, TextInput, View } from "react-native";
import { Accordion, AccordionItem } from "@/components/custom/Accordion";
import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import useDebounce from "@/hooks/useDebounce";
import {
  emailValidation,
  usernameValidation,
} from "@/validation/registerValidation";
import {
  checkEmailAvailability,
  checkUsernameAvailability,
  deleteUser,
  updateEmail,
  updatePassword,
  updateUsername,
} from "@/utils/features";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { storage } from "@/utils/methods";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
} from "@/components/ui/modal";
import { CommonActions } from "@react-navigation/native";

const usernameFormSchema = z.object({
  username: usernameValidation,
});
type UsernameFormData = z.infer<typeof usernameFormSchema>;

const emailFormSchema = z.object({
  email: emailValidation,
});
type EmailFormData = z.infer<typeof emailFormSchema>;

const passwordChangeFormSchema = z
  .object({
    currentPassword: z.string(),
    newPassword: z
      .string()
      .min(6, { message: "Password should be greater than 5 characters" })
      .max(20, { message: "Password should be less than 21 characters" }),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
  });
type PasswordChangeFormData = z.infer<typeof passwordChangeFormSchema>;

const Settings = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const { user, setUser, token, setToken } = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [updateResponseMessage, setUpdateResponseMessage] = useState("");
  const [updateResponseError, setUpdateResponseError] = useState(false);

  // vars for managing username changes
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  // vars for managing email changes
  const [emailMessage, setEmailMessage] = useState("");
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [deleteString, setDeleteString] = useState("");
  const [deleteResponseMessage, setDeleteResponseMessage] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !user) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "(dashboard)" }],
        }),
      );
    }
  }, [isMounted, user]);

  // username form controller
  const usernameFormController = useForm<UsernameFormData>({
    resolver: zodResolver(usernameFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  // email form controller
  const emailFormController = useForm<EmailFormData>({
    resolver: zodResolver(emailFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  // password form controller
  const passwordFormController = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  // catching username, email, and password changes from their forms
  const username = useWatch({
    control: usernameFormController.control,
    name: "username",
  });
  const email = useWatch({
    control: emailFormController.control,
    name: "email",
  });

  // debouncing username and email changes
  // to avoid sending too many requests to the server when user is typing
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
            usernameFormController.clearErrors("username");
          } else {
            setUsernameMessage("");
            usernameFormController.setError("username", {
              type: "manual",
              message: response.message,
            });
          }
        } catch (error) {
          usernameFormController.setError("username", {
            type: "manual",
            message: "Something went wrong / no internet",
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
            emailFormController.clearErrors("email");
          } else {
            setEmailMessage("");
            emailFormController.setError("email", {
              type: "manual",
              message: response.message,
            });
          }
        } catch (error) {
          emailFormController.setError("email", {
            type: "manual",
            message: "Something went wrong. Please try again later.",
          });
        } finally {
          setIsCheckingEmail(false);
        }
      }
    })();
  }, [debouncedEmail]);

  // username update handler
  const handleUsernameUpdate = async (data: UsernameFormData) => {
    try {
      setLoading(true);
      const response = await updateUsername(data?.username, token);
      if (response?.success) {
        setUpdateResponseMessage(response?.message);
        setUpdateResponseError(false);
        await storage.set("user", response?.user);
        setUser(response?.user);
      } else {
        setUpdateResponseMessage(response?.message);
        setUpdateResponseError(true);
      }
    } catch (error) {
      setUpdateResponseMessage("Failed to update username");
      setUpdateResponseError(true);
    } finally {
      setLoading(false);
      setUsernameMessage("");
      usernameFormController.reset();
    }
  };

  // email update handler
  const handleEmailUpdate = async (data: EmailFormData) => {
    try {
      setLoading(true);
      const response = await updateEmail(data?.email, token);
      if (response?.success) {
        setUpdateResponseMessage(response?.message);
        setUpdateResponseError(false);
        await storage.set("user", response?.user);
        setUser(response?.user);
      } else {
        setUpdateResponseMessage(response?.message);
        setUpdateResponseError(true);
      }
    } catch (error) {
      setUpdateResponseMessage("Failed to update email");
      setUpdateResponseError(true);
    } finally {
      setLoading(false);
      setEmailMessage("");
      emailFormController.reset();
    }
  };

  // password update handler
  const handlePasswordUpdate = async (data: PasswordChangeFormData) => {
    try {
      setLoading(true);
      const response = await updatePassword(
        data?.currentPassword,
        data?.newPassword,
        token,
      );
      if (response?.success) {
        setUpdateResponseMessage(response?.message);
        setUpdateResponseError(false);
      } else {
        setUpdateResponseMessage(response?.message);
        setUpdateResponseError(true);
      }
    } catch (error) {
      setUpdateResponseMessage("Failed to update email");
      setUpdateResponseError(true);
    } finally {
      setLoading(false);
      setEmailMessage("");
      passwordFormController.reset();
    }
  };

  // logout handler
  const logoutHandler = async () => {
    await storage.remove("user");
    await storage.remove("token");
    setUser(null);
    setToken(null);
  };

  // delete account handler
  const deleteAccountHandler = async () => {
    if (deleteString !== "DELETE") {
      setDeleteResponseMessage("Please type DELETE to confirm");
      return;
    }
    try {
      setShowDeleteAccountModal(false);
      setLoading(true);
      const response = await deleteUser(token);
      if (response?.success) {
        await storage.remove("user");
        await storage.remove("token");
        setUser(null);
        setToken(null);
        setDeleteResponseMessage(response?.message);
      } else {
        setDeleteResponseMessage(response?.message);
        setUpdateResponseMessage(response?.message);
        setUpdateResponseError(true);
      }
    } catch (error) {
      setDeleteResponseMessage("Failed to delete account");
      setUpdateResponseMessage("Failed to delete account");
      setUpdateResponseError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardHandelingView>
      <View
        className={`w-full flex-1 ${
          Platform.OS === "ios" ? "pt-20 pb-4 px-4" : "pt-16 pb-4 px-5"
        }`}
      >
        {/* header + back button */}
        <View className="w-full relative h-12">
          <AnimatedButton
            onPress={() => navigation.goBack()}
            outerClassName="absolute top-0 left-0 z-10"
            overrideStyles
            innerClassName=""
          >
            <ChevronLeft color="white" size={22} />
          </AnimatedButton>
          <Text className="absolute inset-x-0 text-center text-white">
            Settings
          </Text>
        </View>
        {/* spinner */}
        {loading && (
          <View className="z-50 absolute left-0 top-0 opacity-60 bg-black h-screen w-full flex flex-row items-center justify-center">
            <Spinner size="large" color="white" />
          </View>
        )}
        <ScrollView
          contentContainerClassName="pb-[100px] flex-col gap-2 items-center"
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar and account info */}
          <View className="flex-row items-center justify-center gap-4">
            <View className="relative">
              <Avatar className="w-44 h-44">
                <AvatarFallbackText>{user?.username}</AvatarFallbackText>
                <AvatarImage source={{ uri: user?.avatar?.url }} />
              </Avatar>
              <View className="absolute bottom-2 -right-4">
                <AvatarSelector />
              </View>
            </View>
            <View className="flex-col justify-center">
              <Text className="text-4xl">{user?.username}</Text>
              <Text>{user?.email}</Text>
            </View>
          </View>
          {/* Update response message */}
          {updateResponseMessage && (
            <Text
              className={`text-center text-sm mt-8 ${
                updateResponseError ? "text-red-500" : "text-green-500"
              }`}
            >
              {updateResponseMessage}
            </Text>
          )}
          {/* Edit forms (in an accorion) */}
          <View className="w-full p-4">
            <Accordion>
              <AccordionItem title="Change your username">
                <FormControl
                  isInvalid={!!usernameFormController.formState.errors.username}
                  className="w-full flex-col"
                >
                  <View className="flex-row gap-2 items-end">
                    <View className="w-1/2 flex-col">
                      <FormControlLabel>
                        <FormControlLabelText className="text-sm">
                          Username
                        </FormControlLabelText>
                      </FormControlLabel>
                      <Controller
                        name="username"
                        control={usernameFormController.control}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <Input className="rounded-xl">
                            <InputField
                              placeholder="Enter username"
                              value={value}
                              onChangeText={(text) => {
                                onChange(text);
                                setUpdateResponseMessage("");
                                setUpdateResponseError(false);
                                if (text.length === 0) {
                                  usernameFormController.clearErrors(
                                    "username",
                                  );
                                }
                              }}
                              onBlur={onBlur}
                            />
                          </Input>
                        )}
                      />
                    </View>
                    <AnimatedButton
                      outerClassName="w-fit"
                      disabled={
                        usernameFormController.formState.errors.username ||
                        isCheckingUsername ||
                        !usernameFormController.getValues("username")
                          ? true
                          : false
                      }
                      onPress={usernameFormController.handleSubmit(
                        handleUsernameUpdate,
                      )}
                    >
                      <Text className="text-black">Update</Text>
                    </AnimatedButton>
                  </View>
                  {isCheckingUsername && (
                    <View className="flex-row justify-start mt-1">
                      <Spinner size="small" color={"white"} />
                    </View>
                  )}
                  {usernameFormController.formState.errors.username && (
                    <Text className="text-red-500 text-sm mt-1">
                      {
                        usernameFormController.formState.errors.username
                          ?.message
                      }
                    </Text>
                  )}
                  {!isCheckingUsername &&
                    !usernameFormController.formState.errors.username &&
                    usernameMessage && (
                      <Text className="text-green-500 text-sm mt-1">
                        {usernameMessage}
                      </Text>
                    )}
                </FormControl>
              </AccordionItem>
              <AccordionItem title="Change your email">
                <View className="flex-row gap-2 items-end">
                  <View className="w-1/2">
                    <FormControl
                      isInvalid={!!emailFormController.formState.errors?.email}
                      className="w-full flex-col"
                    >
                      <FormControlLabel>
                        <FormControlLabelText className="text-sm">
                          Email
                        </FormControlLabelText>
                      </FormControlLabel>
                      <Controller
                        name="email"
                        control={emailFormController.control}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <Input className="rounded-xl">
                            <InputField
                              placeholder="Enter email"
                              value={value}
                              onChangeText={(text) => {
                                onChange(text);
                                setUpdateResponseMessage("");
                                setUpdateResponseError(false);
                                if (text.length === 0) {
                                  emailFormController.clearErrors("email");
                                }
                              }}
                              onBlur={onBlur}
                            />
                          </Input>
                        )}
                      />
                    </FormControl>
                  </View>
                  <AnimatedButton
                    outerClassName="w-fit"
                    disabled={
                      emailFormController.formState.errors?.email ||
                      isCheckingEmail ||
                      !emailFormController.getValues("email")
                        ? true
                        : false
                    }
                    onPress={emailFormController.handleSubmit(
                      handleEmailUpdate,
                    )}
                  >
                    <Text className="text-black">Update</Text>
                  </AnimatedButton>
                </View>
                {isCheckingEmail && (
                  <View className="flex-row justify-start mt-1">
                    <Spinner size="small" color={"white"} />
                  </View>
                )}
                {emailFormController.formState.errors?.email && (
                  <Text className="text-red-500 text-sm mt-1">
                    {emailFormController.formState.errors?.email?.message}
                  </Text>
                )}
                {!isCheckingEmail &&
                  !emailFormController.formState.errors?.email &&
                  emailMessage && (
                    <Text className="text-green-500 text-sm mt-1">
                      {emailMessage}
                    </Text>
                  )}
              </AccordionItem>
              <AccordionItem title="Change your password">
                <View className="flex-row gap-2 items-start">
                  <View className="w-[48%]">
                    <FormControl
                      isInvalid={
                        !!passwordFormController.formState.errors
                          ?.currentPassword
                      }
                      className="w-full flex-col"
                    >
                      <FormControlLabel>
                        <FormControlLabelText className="text-sm">
                          Current password
                        </FormControlLabelText>
                      </FormControlLabel>
                      <Controller
                        name="currentPassword"
                        control={passwordFormController.control}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <Input className="rounded-xl">
                            <InputField
                              secureTextEntry
                              placeholder="Current password"
                              value={value}
                              onChangeText={(text) => {
                                onChange(text);
                                setUpdateResponseMessage("");
                                setUpdateResponseError(false);
                                if (text.length === 0) {
                                  passwordFormController.clearErrors(
                                    "currentPassword",
                                  );
                                }
                              }}
                              onBlur={onBlur}
                            />
                          </Input>
                        )}
                      />
                      {passwordFormController.formState.errors
                        ?.currentPassword && (
                        <Text className="text-red-500 text-sm mt-1">
                          {
                            passwordFormController.formState.errors
                              ?.currentPassword?.message
                          }
                        </Text>
                      )}
                    </FormControl>
                  </View>
                  <View className="w-[48%]">
                    <FormControl
                      isInvalid={
                        !!passwordFormController.formState.errors?.newPassword
                      }
                      className="w-full flex-col"
                    >
                      <FormControlLabel>
                        <FormControlLabelText className="text-sm">
                          New password
                        </FormControlLabelText>
                      </FormControlLabel>
                      <Controller
                        name="newPassword"
                        control={passwordFormController.control}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <Input className="rounded-xl">
                            <InputField
                              secureTextEntry
                              placeholder="New password"
                              value={value}
                              onChangeText={(text) => {
                                onChange(text);
                                setUpdateResponseMessage("");
                                setUpdateResponseError(false);
                                if (text.length === 0) {
                                  passwordFormController.clearErrors(
                                    "newPassword",
                                  );
                                }
                              }}
                              onBlur={onBlur}
                            />
                          </Input>
                        )}
                      />
                      {passwordFormController.formState.errors?.newPassword && (
                        <Text className="text-red-500 text-sm mt-1">
                          {
                            passwordFormController.formState.errors?.newPassword
                              ?.message
                          }
                        </Text>
                      )}
                    </FormControl>
                  </View>
                </View>
                <View className="flex-row gap-2 items-end mt-4">
                  <View className="w-[48%]">
                    <FormControl
                      isInvalid={
                        !!passwordFormController.formState.errors
                          ?.confirmNewPassword
                      }
                      className="w-full flex-col"
                    >
                      <FormControlLabel>
                        <FormControlLabelText className="text-sm">
                          Confirm new password
                        </FormControlLabelText>
                      </FormControlLabel>
                      <Controller
                        name="confirmNewPassword"
                        control={passwordFormController.control}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <Input className="rounded-xl">
                            <InputField
                              secureTextEntry
                              placeholder="Confirm password"
                              value={value}
                              onChangeText={(text) => {
                                onChange(text);
                                setUpdateResponseMessage("");
                                setUpdateResponseError(false);
                                if (text.length === 0) {
                                  passwordFormController.clearErrors(
                                    "confirmNewPassword",
                                  );
                                }
                              }}
                              onBlur={onBlur}
                            />
                          </Input>
                        )}
                      />
                    </FormControl>
                  </View>
                  <AnimatedButton
                    outerClassName="w-fit"
                    disabled={
                      !passwordFormController.getValues("currentPassword") ||
                      passwordFormController.formState.errors
                        ?.currentPassword ||
                      !passwordFormController.getValues("newPassword") ||
                      passwordFormController.formState.errors?.newPassword ||
                      !passwordFormController.getValues("confirmNewPassword") ||
                      passwordFormController.formState.errors
                        ?.confirmNewPassword
                        ? true
                        : false
                    }
                    onPress={passwordFormController.handleSubmit(
                      handlePasswordUpdate,
                    )}
                  >
                    <Text className="text-black">Update</Text>
                  </AnimatedButton>
                </View>
                {passwordFormController.formState.errors
                  ?.confirmNewPassword && (
                  <Text className="text-red-500 text-sm mt-1">
                    {
                      passwordFormController.formState.errors
                        ?.confirmNewPassword?.message
                    }
                  </Text>
                )}
              </AccordionItem>
            </Accordion>
          </View>
          {/* other buttons */}
          <View className="mt-24 flex-row gap-2">
            <AnimatedButton
              onPress={logoutHandler}
              innerClassName="w-fit gap-1"
            >
              <Text className="text-black text-sm">Logout</Text>
              <LogOut color="black" size={18} />
            </AnimatedButton>
            <AnimatedButton
              onPress={() => setShowDeleteAccountModal(true)}
              overrideStyles
              innerClassName="w-fit gap-1 rounded-xl py-2 px-3 bg-red-500 flex-row items-center justify-center"
            >
              <Text className="text-white text-sm">Delete account</Text>
              <Trash2 color="white" size={18} />
            </AnimatedButton>
          </View>

          {/* delete account modal */}
          <Modal
            isOpen={showDeleteAccountModal}
            onClose={() => setShowDeleteAccountModal(false)}
            size="md"
            className={`${Platform.OS === "ios" ? "-mt-20" : ""}`}
          >
            <ModalBackdrop />
            <ModalContent className="bg-black border shadow-lg rounded-2xl">
              <ModalCloseButton />
              <ModalHeader className="flex-row items-center justify-center">
                <Text className="text-white py-4 text-xl font-semibold">
                  Are you sure?
                </Text>
              </ModalHeader>
              <ModalBody className="w-full">
                <Text className="text-red-500 text-sm">
                  NOTE: This will completely wipe ALL your data, which you won't
                  be able to recover from our database.
                </Text>
                <View className="flex-row gap-1 items-center mt-5">
                  <Text className="text-white text-sm">
                    If you are sure, please type
                  </Text>
                  <Text className="text-red-500 text-sm">DELETE</Text>
                  <Text className="text-white text-sm">below</Text>
                </View>
                <TextInput
                  className="font-poppins w-full text-md text-white border border-white px-2 py-2 mt-2 rounded-xl"
                  placeholder="type DELETE here"
                  textAlignVertical="center"
                  cursorColor="#d4d4d4"
                  placeholderTextColor="#737373"
                  onChangeText={(text) => {
                    setDeleteString(text);
                    setDeleteResponseMessage("");
                  }}
                  returnKeyType="done"
                  returnKeyLabel="Confirm"
                  onSubmitEditing={deleteAccountHandler}
                />
                {deleteResponseMessage && (
                  <Text className="text-center text-sm mt-2 text-red-500">
                    {deleteResponseMessage}
                  </Text>
                )}
                <View className="w-full mt-5 flex-row gap-1 items-center">
                  <AnimatedButton
                    onPress={() => setShowDeleteAccountModal(false)}
                  >
                    <Text className="text-sm text-black">Cancel</Text>
                  </AnimatedButton>
                  <AnimatedButton
                    onPress={deleteAccountHandler}
                    overrideStyles
                    innerClassName="w-fit gap-1 rounded-xl py-2 px-3 bg-red-500 flex-row items-center justify-center"
                  >
                    <Text className="text-white text-sm">Confirm</Text>
                  </AnimatedButton>
                </View>
              </ModalBody>
            </ModalContent>
          </Modal>
        </ScrollView>
      </View>
    </KeyboardHandelingView>
  );
};

export default Settings;
