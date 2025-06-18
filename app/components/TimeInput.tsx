"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CategoryInput from "./CategoryInput";
import TimeInput from "./TimeInput";
// import OngoingSchedule from "./OngoingSchedule";
import { useScheduleStore } from "../lib/scheduleStore";
import axios from "../lib/axios";

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

const TimerForm = () => {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState<Time>({
    hours: 1,
    minutes: 30,
    seconds: 30,
  });
  const [categories, setCategories] = useState<Category[]>([
    {
      id: 1,
      name: "",
      duration: { hours: 1, minutes: 30, seconds: 30 },
    },
  ]);

  const router = useRouter();
  const setStoreCategories = useScheduleStore((state) => state.setCategories);
  const editingSchedule = useScheduleStore((state) => state.editingSchedule);

  useEffect(() => {
    if (editingSchedule) {
      setTitle(editingSchedule.title);
      setDuration(editingSchedule.duration);
      setCategories(editingSchedule.categories);
    }
  }, [editingSchedule]);

  const addCategory = () => {
    setCategories([
      ...categories,
      {
        id: Date.now(),
        name: "",
        duration: { hours: 0, minutes: 0, seconds: 0 },
      },
    ]);
  };

  const updateCategoryName = (id: number, name: string) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, name } : cat))
    );
  };

  const updateCategoryTime = (id: number, time: Time) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, duration: time } : cat))
    );
  };

  const removeCategoryById = (id: number) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  const handleSave = async () => {
    const newSchedule = {
      title,
      duration,
      categories,
    };

    try {
      await axios.post("/schedules", newSchedule);
      router.push("/saved");
    } catch (error) {
      console.error("Error saving schedule:", error);
      alert("Failed to save schedule.");
    }
  };

  return (
    <div className="mt-10 px-4">
      <div>
        <h1 className="text-center text-black text-2xl font-bold mb-10">
          Welcome
        </h1>
        <div className="max-w-4xl mx-auto border-8 border-white p-6 rounded-2xl shadow-lg bg-transparent">
          <p className="font-semibold text-gray-800 text-center mb-6">
            Create Your Time Schedule
          </p>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <label className="text-gray-600 font-medium">Timer Title</label>
              <input
                className="w-full p-3 border rounded-lg"
                placeholder="e.g., Church Program"
                maxLength={50}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="text-gray-600 font-medium">Duration</label>
              <div className="flex items-center gap-4">
                <TimeInput time={duration} onChange={setDuration} />
                <p className="bg-black text-white px-4 py-2 rounded-full">
                  {String(duration.hours).padStart(2, "0")}:
                  {String(duration.minutes).padStart(2, "0")}:
                  {String(duration.seconds).padStart(2, "0")}
                </p>
              </div>
            </div>
          </div>

          <hr className="my-6 border-gray-300" />

          <label className="block text-gray-700 font-bold mb-4">Categories</label>

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

          <button
            onClick={addCategory}
            className="mt-4 border border-gray-500 px-4 py-2 text-gray-700 rounded-lg"
          >
            + Add Category
          </button>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              onClick={() => {
                setStoreCategories(categories);
                router.push("/ongoing");
              }}
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
    </div>
  );
};

export default TimerForm;
