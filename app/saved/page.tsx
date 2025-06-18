"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "../lib/axios";
import Navbar from "../components/navbar";
import ConfirmModal from "../components/ConfirmModal";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useScheduleStore } from "@/app/lib/scheduleStore";
import Link from "next/link";

export default function SavedPage() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
  const [expandedScheduleId, setExpandedScheduleId] = useState<string | null>(null);
  const setEditingSchedule = useScheduleStore((state) => state.setEditingSchedule);
  const router = useRouter();

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await axios.get("/schedules");
        setSchedules(res.data);
      } catch (err) {
        console.error("Error fetching schedules:", err);
      }
    };

    fetchSchedules();
  }, []);

  const openModal = (id: string) => {
    setSelectedScheduleId(id);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedScheduleId) return;

    try {
      await axios.delete(`/schedules/${selectedScheduleId}`);
      setSchedules((prev) => prev.filter((s) => s._id !== selectedScheduleId));
    } catch (err) {
      console.error("Error deleting schedule:", err);
    }

    setModalOpen(false);
    setSelectedScheduleId(null);
  };

  const toggleExpanded = (id: string) => {
    setExpandedScheduleId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="p-6 min-h-screen bg-white text-gray-700">
      <Navbar />
      <div className="p-8">
        <h1 className="text-2xl font-bold text-center mb-10">Saved Schedules</h1>

        {schedules.length === 0 ? (
          <p className="text-center">No schedules saved yet.</p>
        ) : (
          <ul className="space-y-6">
            {schedules.map((schedule) => {
              const isExpanded = expandedScheduleId === schedule._id;
              return (
                <li key={schedule._id} className="p-6 border rounded-xl shadow text-left">
                  <h2
                    className="text-xl font-bold flex justify-between cursor-pointer"
                    onClick={() => toggleExpanded(schedule._id)}
                  >
                    <span>{schedule.title}</span>
                    <ChevronDownIcon
                      className={`w-6 h-6 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </h2>
                  <p className="text-sm text-gray-500">
                    Duration:{" "}
                    {String(schedule.duration.hours).padStart(2, "0")}:
                    {String(schedule.duration.minutes).padStart(2, "0")}:
                    {String(schedule.duration.seconds).padStart(2, "0")}
                  </p>
                  {isExpanded && (
                    <div className="mt-4 space-y-2">
                      {schedule.categories.map((cat: any) => (
                        <div key={cat.id}>
                          • {cat.name} –{" "}
                          {String(cat.duration.hours).padStart(2, "0")}:
                          {String(cat.duration.minutes).padStart(2, "0")}:
                          {String(cat.duration.seconds).padStart(2, "0")}
                        </div>
                      ))}
                      <div className="mt-4 flex gap-4">
                        {/* <button
                          onClick={() => {
                            useScheduleStore.getState().setCategories(schedule.categories);
                            router.push("/ongoing");
                          }}
                          className="bg-gray-500 text-white px-4 py-2 rounded-full"
                        >
                          Start
                        </button> */}


                          <Link href={`/ongoing/${schedule._id}`}>
                          <button className="bg-gray-500 text-white px-4 py-2 rounded-full">
                            Start
                          </button>
                        </Link>

                        <button
                          onClick={() => {
                            setEditingSchedule(schedule);
                            router.push(`/edit/${schedule._id}`);
                          }}
                          className="bg-blue-500 text-white px-4 py-2 rounded-full"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openModal(schedule._id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-full"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        <ConfirmModal
          message="Are you sure you want to delete this schedule?"
          isOpen={isModalOpen}
          onConfirm={handleConfirmDelete}
          onCancel={() => setModalOpen(false)}
        />
      </div>
    </div>
  );
}
