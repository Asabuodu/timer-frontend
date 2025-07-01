
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CategoryInput from "./CategoryInput";
import TimeInput from "./TimeInput";
import { useScheduleStore } from "../lib/scheduleStore";
import { useRouter } from "next/navigation";
import axios from "../lib/axios";
import type { Time, Category } from "../lib/types";

const TimerForm = () => {
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

  const [authError, setAuthError] = useState("");


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

  // const handleSave = async () => {
  //   if (!validateForm()) return;

  //   const token = localStorage.getItem("authToken");
  //   if (!token) {
  //     alert("⚠️ You must be logged in to save a schedule.");
  //     return;
  //   }

  //   const schedule = {
  //     title,
  //     categories,
  //     duration,
  //     createdAt: new Date().toISOString(),
  //   };

  //   try {
  //     const res = await axios.post("/schedules", schedule, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     if (res.status === 201 || res.status === 200) {
  //       alert("✅ Schedule saved successfully!");
  //       router.push("/saved");
  //     } else {
  //       alert("⚠️ Failed to save schedule");
  //     }
  //   } catch (error) {
  //     console.error("❌ Error saving schedule:", error);
  //     alert("An error occurred while saving schedule.");
  //   }
  // };

  const handleSave = async () => {
  setAuthError(""); // Clear any previous error

  if (!validateForm()) return;

  const token = localStorage.getItem("authToken");
  if (!token) {
    setAuthError("You need to signin before you can save a schedule.");
    return;
  }

  // proceed to save
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
};


  const handleStart = () => {
    if (!validateForm()) return;
    setStoreCategories(categories);
    router.push("/ongoing");
  };

  return (
    <motion.div
      // className="mt-10 px-4"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div>
        <h1 className="text-center text-black text-2xl font-bold mb-10">
          Welcome
        </h1>

        <motion.div
          layout
          className="max-w-4xl mx-auto border-8 border-white p-6 rounded-2xl shadow-lg bg-transparent"
        >
          <p className="font-semibold text-gray-800 text-center mb-6">
            Create Your Time Schedule
          </p>

          <div className="flex flex-col md:flex-row gap-10 text-center">
            <div className="flex-1">
              <label className="text-gray-600 font-bold">Purpose/Title</label>
              <input
                className="w-full mt-4 p-3 border text-gray-500 border-gray-500 rounded-lg"
                placeholder="e.g., Church Program"
                maxLength={20}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="text-gray-600 font-bold">Total Duration</label>
              <div className="flex flex-col sm:flex-row sm:items-center justify-center text-gray-400 mt-4 gap-4">
                <TimeInput time={duration} onChange={setDuration} />
                <p className="bg-black text-white px-4 py-2 text-xl rounded-full">
                  {String(duration.hours).padStart(2, "0")}:
                  {String(duration.minutes).padStart(2, "0")}:
                  {String(duration.seconds).padStart(2, "0")}
                </p>
              </div>
            </div>
          </div>

          <hr className="my-10 border-gray-300" />

          <label className="block text-gray-700 text-center mt-4 font-bold mb-2">
            How many Categories?
          </label>

          <AnimatePresence>
            <div className="text-gray-500 space-y-6">
              {categories.map((cat, index) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                >
                  <CategoryInput
                    index={index + 1}
                    data={cat}
                    onNameChange={updateCategoryName}
                    onTimeChange={updateCategoryTime}
                    onRemove={removeCategoryById}
                  />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>

          <div className="flex justify-center my-6">
            <button
              onClick={addCategory}
              className="border border-gray-500 px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-500 hover:text-white transition"
            >
              + Add Category
            </button>
          </div>

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
              {authError && (
          <p className="text-center text-sm text-red-400 mt-8">{authError}</p>
        )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TimerForm;
