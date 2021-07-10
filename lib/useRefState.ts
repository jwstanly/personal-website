import React from 'react';

export default function useRefState<T>(
  initialState: T,
): [React.MutableRefObject<T>, (newState: T) => void] {
  const [internalState, setInternalState] = React.useState<T>(initialState);

  const state = React.useRef(internalState);
  const setState = (newState: T) => {
    state.current = newState;
    setInternalState(newState);
  };

  return [state, setState];
}
