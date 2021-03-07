import React from 'react';

export default {
  useWindowDimensions: useWindowDimensions,
}

function useWindowDimensions() {

  interface Dims {
    width: number;
    height: number;
  }

  const [windowDimensions, setWindowDimensions] = React.useState<Dims>();

  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }

  function resize() {
    setWindowDimensions(getWindowDimensions());
  }


  React.useEffect(() => {
    setWindowDimensions(getWindowDimensions());
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return windowDimensions;
}