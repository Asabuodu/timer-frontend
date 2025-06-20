"use client";

import { useEffect, useState } from "react";
import CategoryInput from "./CategoryInput";
import TimeInput from "./TimeInput";
import OngoingSchedule from "./OngoingSchedule";
import { useScheduleStore } from "../lib/scheduleStore";
import { useRouter } from "next/navigation";
import axios from "../lib/axios";
import type { Time, Category } from "../lib/types";

const TimerForm = () => {
  const [started, setStarted] = useState(false);
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState<Time>({
    hours: 1,
    minutes: 30,
    seconds: 30,
  });
  const [categories, setCategories] = useState<Category[]>([
    {
      id: crypto.randomUUID(),
      name: "",
      duration: { hours: 1, minutes: 30, seconds: 30 },
    },
  ]);

  const setStoreCategories = useScheduleStore((state) => state.setCategories);
  const editingSchedule = useScheduleStore((state) => state.editingSchedule);
  const router = useRouter();

  useEffect(() => {
    if (editingSchedule) {
      setTitle(editingSchedule.title);
      setDuration(editingSchedule.duration);
      setCategories(editingSchedule.categories);
    }
  }, [editingSchedule]);

  const addCategory = () => {
    setCategories((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "",
        duration: { hours: 0, minutes: 0, seconds: 0 },
      },
    ]);
  };

  const removeCategoryById = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  const updateCategoryName = (id: string, name: string) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, name } : cat))
    );
  };

  const updateCategoryTime = (id: string, time: Time) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, duration: time } : cat))
    );
  };



    const validateForm = () => {
    if (!title.trim()) {
      alert("Timer title is required.");
      return false;
    }


    for (const cat of categories) {
      if (!cat.name.trim()) {
        alert("Each category must have a name.");
        return false;
      }
    }

    return true;
  };


const handleSave = async () => {
  if (!validateForm()) return;


    const token = localStorage.getItem("authToken"); // ✅ Match the key from login


  if (!token) {
    alert("⚠️ You must be logged in to save a schedule.");
    //router.push("/signup"); // Or redirect to /signin
    return;
  }

  const schedule = {
    title,
    categories,
    duration,
    createdAt: new Date().toISOString(),
  };




  try {
    const res = await axios.post("/schedules", schedule, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 201 || res.status === 200) {
      alert("✅ Schedule saved successfully!");
      router.push("/saved");
    } else {
      alert("⚠️ Failed to save schedule");
    }
  } catch (error) {
    console.error("❌ Error saving schedule:", error);
    alert("An error occurred while saving schedule.");
  }
   console.log("Token being sent:", token);
};


  const handleStart = () => {
  if (!validateForm()) return;

  setStoreCategories(categories);
  router.push("/ongoing"); // Navigate to the dedicated route
};


  return (
    <div className="mt-10 px-4">
      {/* {started ? (
        <OngoingSchedule categories={categories} />
      ) : ( */}
        <div>
          <h1 className="text-center text-black text-2xl font-bold mb-10">
            Welcome
          </h1>

          <div className="max-w-4xl mx-auto border-8 border-white p-6 rounded-2xl shadow-lg bg-transparent">
            <p className="font-semibold text-gray-800 text-center mb-6">
              Create Your Time Schedule
            </p>

            <div className="flex flex-col md:flex-row gap-10 text-center ">
              <div className="flex-1">
                <label className="text-gray-600 font-bold">Purpose/Title</label>
                <input
                  className="w-full mt-4 p-3 border text-gray-500 border-gray-500 rounded-lg"
                  placeholder="e.g., Church Program"
                  maxLength={50}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="text-gray-600 font-bold">Total Duration</label>
                <div className="flex items-center text-gray-400 mt-4 gap-4">
                  <TimeInput time={duration} onChange={setDuration}  />
                  <p className="bg-black text-white px-1 text-center py-2 text-xl  rounded-full w-30">
                    {String(duration.hours).padStart(2, "0")}:
                    {String(duration.minutes).padStart(2, "0")}:
                    {String(duration.seconds).padStart(2, "0")}
                  </p>
                </div>
              </div>
            </div>

            <hr className="my-10 border-gray-300 " />

            <label className="block text-gray-700 text-center mt-4 font-bold mb-2">
              How many Categories?
            </label>

            <div className="text-gray-500">

            {categories.map((cat, index) => (
              
              <CategoryInput
                key={cat.id}
                index={index + 1}
                data={cat}
                onNameChange={updateCategoryName}
                onTimeChange={updateCategoryTime}
                onRemove={removeCategoryById}
              />
            ))}
            </div>


            <button
              onClick={addCategory}
              className=" border border-gray-500 px-4 py-2 text-gray-700 rounded-lg mx- hover:bg-gray-500 hover:text-white transition"
            >
              + Add Category
            </button>

            <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
              <button
                onClick={handleStart}
                className="bg-black text-white px-6 py-2 rounded-full hover:bg-transparent hover:text-black hover:border"
              >
                Start
              </button>
              <button
                onClick={handleSave}
                className="border border-black px-6 py-2 rounded-full text-black hover:bg-black hover:text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      {/* )} */}
    </div>
  );
};

export default TimerForm;
