"use client";

import { useEffect, useState, ReactNode, JSX } from "react";
import loaderAnimation from "../../../public/animations/logo-loader.json";

const Loader = (): JSX.Element => {
  const [LottieComponent, setLottieComponent] = useState<ReactNode>(null);

  useEffect(() => {
    import("lottie-react").then((module) => {
      const Lottie = module.default;
      setLottieComponent(
        <Lottie animationData={loaderAnimation} loop={true} autoplay={true} />
      );
    });
  }, []);

  return (
    <div className="w-screen h-screen fade-in fixed inset-0 flex items-center justify-center z-50">
      <div className="w-80 h-80 flex items-center justify-center">
        {LottieComponent || <div>Loading...</div>}
      </div>
    </div>
  );
};

export default Loader;
