

"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
type SplashProps = {
  show: boolean;
  onClose: () => void;
};

const Splash = ({ show, onClose }: SplashProps) => {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setVisible(true);
      setTimeout(() => {
        setVisible(false);
        setTimeout(() => {
          onClose();
        }, 500); // Match with transition duration
      }, 2000);
    }
  }, [show, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center  bg-white bg-linear-to-r/srgb from-white via-blue-200 to-white-100 to-90%  ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`text-center px-8 transform transition-all duration-500 ease-out ${
          visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
      >
        <div className="text-6xl md:text-8xl items-center w-40 mb-4 mx-auto text-amber-500 font-bold">
          <Image src="/vector.png" alt="logo" width={120} height={120} className="mx-auto"/>
        </div>
        <h1 className="text-5xl md:text-5xl font-hover font-light text-black mt-2 mb-10">Simp</h1>
        <p className="mt-4 text-gray-600 text-lg md:text-xl font-medium">
          Your personal time schedule <br /> Any Where,  Any Time.
        </p>
      </div>
    </div>
  );
};

export default Splash;
