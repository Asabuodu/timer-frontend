"use client";
// import Image from "next/image";
import StartPage from "./components/Start";

export default function Home() {
  return (
    <div className=" items-center bg-white bg-linear-to-r/srgb from-white via-blue-100 to-white-100 to-90%  min-h-screen p-6">
      <StartPage />
  
      {/* <h1>Timer App</h1> */}
    </div>
  );
}
