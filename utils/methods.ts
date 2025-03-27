import * as secureStorage from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const isWeb = Platform.OS === "web";

// Description: This file contains the methods for storing data in local storage.
// secureStorage for Expo Go
// localStorage for Web
export const storage = {
  get: async <T = any>(key: string): Promise<T | null> => {
    try {
      let value: string | null = null;
      if (isWeb) {
        value = localStorage.getItem(key);
      } else {
        value = await secureStorage.getItemAsync(key);
        if (!value) {
          value = await AsyncStorage.getItem(key);
        }
      }
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error getting key "${key}" from storage:`, error);
      return null;
    }
  },
  set: async (
    key: string,
    value: string | number | object,
    secure: boolean = false,
  ): Promise<void> => {
    try {
      const stringValue = JSON.stringify(value);
      if (isWeb) {
        localStorage.setItem(key, stringValue);
      } else {
        if (secure) {
          await secureStorage.setItemAsync(key, stringValue);
        } else {
          await AsyncStorage.setItem(key, stringValue);
        }
      }
    } catch (error) {
      console.error(`Error setting key "${key}" in storage:`, error);
    }
  },
  remove: async (key: string): Promise<void> => {
    try {
      if (isWeb) {
        localStorage.removeItem(key);
      } else {
        await secureStorage.deleteItemAsync(key);
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing key "${key}" from storage:`, error);
    }
  },
};
