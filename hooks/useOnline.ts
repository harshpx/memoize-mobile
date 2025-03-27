import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

const useOnline = () => {
  const [isOnline, setIsOnline] = useState(false);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(!!state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  return isOnline;
};

export default useOnline;
