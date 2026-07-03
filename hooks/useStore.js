import { useEffect, useState } from "react";

export const useStore = (store, selector) => {
  const result = store(selector);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted ? result : undefined;
};
