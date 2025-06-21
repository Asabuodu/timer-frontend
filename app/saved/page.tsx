"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "../lib/axios";
import Navbar from "../components/navbar";
import ConfirmModal from "../components/ConfirmModal";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useScheduleStore } from "@/app/lib/scheduleStore";

export default function SavedPage() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
  const [expandedScheduleId, setExpandedScheduleId] = useState<string | null>(null);
  const setEditingSchedule = useScheduleStore((state) => state.setEditingSchedule);
  const router = useRouter();



  useEffect(() => {
  const fetchSchedules = async () => {
    const token = localStorage.getItem("authToken"); // ✅ should match what you saved in SigninPage


    
    if (!token) {
      console.warn("⚠️ No token found. User not logged in.");
      return;
    }

    try {
      const res = await axios.get("/schedules", {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ send token here
        },
      });
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

  const token = localStorage.getItem("authToken");
  if (!token) {
    alert("You must be logged in to delete a schedule.");
    return;
  }

  try {
    await axios.delete(`/schedules/${selectedScheduleId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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
    <div className="p-6 min-h-screen bg-gradient-to-r from-white via-blue-100 to-white text-gray-700">
      <Navbar />
      <div className=" p-8">
        <h1 className="text-2xl font-bold text-center mb-10">Saved Schedules</h1>

        {schedules.length === 0 ? (
          <p className="text-center">No schedules saved yet.</p>
        ) : (
          <ul className="space-y-6 max-w-6xl mx-auto border-8 border-white p-6 pb-14 rounded-2xl shadow-lg bg-transparent">
            {schedules.map((schedule) => {
              const isExpanded = expandedScheduleId === schedule._id;
              return (
                <li key={schedule._id} className="p-6 border rounded-xl shadow text-left">

               <h2
              className="text-xl font-bold flex justify-between cursor-pointer"
              onClick={() => toggleExpanded(schedule._id)}
            >
              <div className="flex-1  flex items-center gap-4">
                <span className="mr-2.5 w-md">{schedule.title}

                <span className="text-sm text-gray-500 mt-1 block">
                  {schedule.categories.length} {schedule.categories.length === 1 ? "category" : "schedules"}
                </span>
                </span>

                <div className="text-sm text-gray-400 mt-2">
                      Created: {new Date(schedule.createdAt).toLocaleString()} <br />
                      Updated: {new Date(schedule.updatedAt).toLocaleString()}
                    </div>

                <p className="text-sm text-gray-500">
                   {" "}
                    {String(schedule.duration.hours).padStart(2, "0")}:
                    {String(schedule.duration.minutes).padStart(2, "0")}:
                    {String(schedule.duration.seconds).padStart(2, "0")}
                  </p>


    
                    {/* <div className="text-sm text-gray-400">
                    </div> */}
              </div>
              <ChevronDownIcon
                className={`w-6 h-6 transition-transform ${isExpanded ? "rotate-180" : ""}`}
              />
            </h2>

                  
                

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

                    {/* ✅ NEW: Timestamps */}
                  

                    <div className="mt-4 flex gap-4">
                      <button
                        className="bg-gray-500 text-white px-8 py-2 rounded-full hover:bg-gray-600 hover:shadow-lg"
                        onClick={() => {
                          useScheduleStore.getState().setCategories(schedule.categories);
                          router.push("/ongoing");
                        }}
                      >
                        Start
                      </button>

                      <button
                        onClick={() => {
                          setEditingSchedule(schedule);
                          router.push(`/edit/${schedule._id}`);
                        }}
                        className="bg-blue-500 text-white px-8 py-2 rounded-full hover:bg-blue-600 hover:shadow-lg"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openModal(schedule._id)}
                        className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 hover:shadow-lg"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
)}

                </li>
              );
            })}
      <button className="rounded-full float-right mt-2 mb-2 mr-2 border px-4" 
      onClick={() => {
        setEditingSchedule(null);
        router.push("/");
      }}>create +</button>
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
