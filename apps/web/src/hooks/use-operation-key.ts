import { useRef } from 'react';

type OperationKeyState = {
  fingerprint: string;
  key: string;
};

/** Keep one key for retries of the same client-side mutation payload. */
export function useOperationKey() {
  const state = useRef<OperationKeyState | null>(null);

  const getKey = (payload: unknown) => {
    const fingerprint = JSON.stringify(payload);
    if (!state.current || state.current.fingerprint !== fingerprint) {
      state.current = { fingerprint, key: crypto.randomUUID() };
    }
    return state.current.key;
  };

  const reset = () => {
    state.current = null;
  };

  return { getKey, reset };
}
