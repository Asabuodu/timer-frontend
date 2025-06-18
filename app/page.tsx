"use client";
// import Image from "next/image";
import Navbar from "./components/navbar";
import TimerForm from "./components/TimerForm";

export default function Home() {
  return (
    <div className=" items-center bg-white bg-linear-to-r/srgb from-white via-blue-100 to-white-100 to-90%  min-h-screen p-6">
      <Navbar />
      {/* <TimerForm /> */}
      {/* {(() => {
  try {
    return <TimerForm />;
  } catch (err) {
    console.error("TimerForm crashed:", err);
    return <div className="text-red-500">Error loading TimerForm</div>;
  }
})()} */}
      <h1>Timer App</h1>
    </div>
  );
}
