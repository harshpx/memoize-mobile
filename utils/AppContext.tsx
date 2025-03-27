import { createContext, useEffect, useState } from "react";
import { storage } from "./methods";
import useOnline from "@/hooks/useOnline";

export const AppContext = createContext<any>({
  user: null,
  setUser: () => {},
  token: null,
  setToken: () => {},
  isOnline: false,
});

const AppContextProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<String | any>(null);
  const isOnline = useOnline();

  useEffect(() => {
    storage.get("user").then((user) => {
      setUser(user);
    });
    storage.get("token").then((token) => {
      setToken(token);
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        isOnline,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
