import { useEffect, useRef } from 'react';

export default function useFirstRender(callback: () => void) {
  const ref = useRef(true);

  useEffect(() => {
    const isFirstRender = ref.current;
    if (isFirstRender) callback();
    ref.current = false;
  }, [callback]);
}
