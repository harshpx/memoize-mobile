import { useState, useEffect } from "react";

const useDebounce = (value: String, delay = 300): String => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value]);

  return debouncedValue;
};

export default useDebounce;
