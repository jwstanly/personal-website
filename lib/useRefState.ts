import React from 'react';

export default function useRefState<T>(
  initialState: T,
): [React.MutableRefObject<T>, React.Dispatch<React.SetStateAction<T>>] {
  const [internalState, setInternalState] = React.useState<T>(initialState);

  const state = React.useRef<T>(internalState);

  const setState = (newState: React.SetStateAction<T>) => {
    if (newState instanceof Function) {
      state.current = newState(state.current);
      setInternalState(newState);
    } else {
      state.current = newState;
      setInternalState(newState);
    }
  };

  return [state, setState];
}
