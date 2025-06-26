"use client";
// import Image from "next/image";
import Navbar from "../components/navbar";
import TimerForm from "../components/TimerForm";

export default function SchedulePage() {
  return (
    <div className=" items-center bg-white bg-linear-to-r/srgb from-white via-blue-100 to-white-100 to-90%  min-h-screen p-6">
      <Navbar />
      <TimerForm />
      {/* <h1>Timer App</h1> */}
    </div>
  );
}
