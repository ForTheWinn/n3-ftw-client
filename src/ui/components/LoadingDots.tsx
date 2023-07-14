import React, { useState, useEffect } from "react";

const LoadingDots = () => {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDots((dots) => (dots.length >= 3 ? "." : dots + "."));
    }, 1000);

    // cleanup on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return <>{dots}</>;
};

export default LoadingDots;
