// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, useParams } from "next/navigation";
// import OngoingSchedule from "@/app/components/OngoingSchedule";
// import Navbar from "@/app/components/navbar";
// import axios from "axios";
// import type {  Schedule } from "../../lib/types";

// const OngoingScheduleById = () => {
//   const [schedule, setSchedule] = useState<Schedule | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const params = useParams();
//   const router = useRouter();

//   const scheduleId = params?.id as string;

//   useEffect(() => {
//     const fetchSchedule = async () => {
//       try {
//         const token = localStorage.getItem("authToken");
//         const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/schedules/${scheduleId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setSchedule(res.data);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load schedule.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (scheduleId) {
//       fetchSchedule();
//     }
//   }, [scheduleId]);

//   if (loading) {
//     return (
//       <div className="text-center mt-20 text-gray-600">
//         <Navbar />
//         Loading schedule...
//       </div>
//     );
//   }

//   if (error || !schedule) {
//     return (
//       <div className="text-center mt-20 text-red-500">
//         <Navbar />
//         {error || "Schedule not found."}
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white min-h-screen p-6">
//       <Navbar />
//       <h2 className="text-center text-xl font-bold text-black my-6">
//         {schedule.title}
//       </h2>
//       <OngoingSchedule categories={schedule.categories} />
//     </div>
//   );
// };

// export default OngoingScheduleById;

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
