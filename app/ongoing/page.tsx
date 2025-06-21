"use client";

import { useScheduleStore } from "@/app/lib/scheduleStore";
import OngoingSchedule from "@/app/components/OngoingSchedule";
import Navbar from "@/app/components/navbar";

const OngoingPage = () => {
  const categories = useScheduleStore((state) => state.categories);

  if (!categories || categories.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center p-6 bg-gradient-to-r from-white via-blue-100 to-white">
        <Navbar />
        <p className="text-gray-600 text-lg mt-9">No schedule started.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-white via-blue-100 to-white p-6">
      <Navbar />
      <OngoingSchedule categories={categories} />
    </div>
  );
};

export default OngoingPage;
