import React from 'react';

export default function useClosure<T extends () => void, U extends any[], V>({
  child,
  parent,
  parentArgs,
  clearParent,
}: {
  child: T;
  parent: ((child: T, ...args: U) => V) | ((child: T) => V);
  parentArgs?: U;
  clearParent?: (arg: V) => void;
}) {
  const childRef = React.useRef<T>();
  const parentArgsRef = React.useRef<U>();

  React.useEffect(() => {
    childRef.current = child;
  }, [child]);

  React.useEffect(() => {
    parentArgsRef.current = parentArgs;
  }, [parentArgs]);

  React.useEffect(() => {
    const run = <T>(() => {
      childRef.current();
    });

    const parentId = parentArgsRef.current
      ? parent(run, ...parentArgsRef.current)
      : parent(run);

    return () => clearParent?.(parentId);
  }, [parent, clearParent]);
}

export function useInterval(
  callback: () => void,
  msDelay?: number,
  ...callbackArgs: any[]
) {
  return useClosure({
    child: callback,
    parent: setInterval,
    parentArgs: [msDelay, ...callbackArgs],
    clearParent: clearInterval,
  });
}

export function useTimeout(
  callback: () => void,
  msDelay?: number,
  ...callbackArgs: any[]
) {
  return useClosure({
    child: callback,
    parent: setTimeout,
    parentArgs: [msDelay, ...callbackArgs],
    clearParent: clearTimeout,
  });
}
