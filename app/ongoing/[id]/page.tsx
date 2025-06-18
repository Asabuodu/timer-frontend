"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import OngoingSchedule from "@/app/components/OngoingSchedule";
import Navbar from "@/app/components/navbar";
import axios from "axios";

type Time = {
  hours: number;
  minutes: number;
  seconds: number;
};

type Category = {
  id: number;
  name: string;
  duration: Time;
};

type Schedule = {
  _id: string;
  title: string;
  duration: Time;
  categories: Category[];
};

const OngoingScheduleById = () => {
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const params = useParams();
  const router = useRouter();

  const scheduleId = params?.id as string;

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/schedules/${scheduleId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSchedule(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load schedule.");
      } finally {
        setLoading(false);
      }
    };

    if (scheduleId) {
      fetchSchedule();
    }
  }, [scheduleId]);

  if (loading) {
    return (
      <div className="text-center mt-20 text-gray-600">
        <Navbar />
        Loading schedule...
      </div>
    );
  }

  if (error || !schedule) {
    return (
      <div className="text-center mt-20 text-red-500">
        <Navbar />
        {error || "Schedule not found."}
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen p-6">
      <Navbar />
      <h2 className="text-center text-xl font-bold text-black my-6">
        {schedule.title}
      </h2>
      <OngoingSchedule categories={schedule.categories} />
    </div>
  );
};

export default OngoingScheduleById;
