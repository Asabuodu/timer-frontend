"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import CategoryInput from "./CategoryInput";
import TimeInput from "./TimeInput";
import OngoingSchedule from "./OngoingSchedule";
import { useScheduleStore } from "../lib/scheduleStore";
import { useRouter } from "next/navigation";
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
      id: 1,
      name: "",
      duration: { hours: 1, minutes: 30, seconds: 30 },
    },
  ]);

  const setStoreCategories = useScheduleStore((state) => state.setCategories);
  const saveSchedule = useScheduleStore((state) => state.saveSchedule);
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
    setCategories([
      ...categories,
      {
        id: Date.now(),
        name: "",
        duration: { hours: 0, minutes: 0, seconds: 0 },
      },
    ]);
  };

  const removeCategoryById = (id: number) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
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

  return (
    <div className="mt-10 px-4">
      {started ? (
        <OngoingSchedule categories={categories} />
      ) : (


        


        <div>
          <h1 className="text-center text-black text-2xl font-bold mb-10">
            Welcome
          </h1>

          <div className="max-w-4xl w-full mx-auto border-white border-8 mt-6 p-6 rounded-2xl shadow-lg bg-transparent">
            <p className="font-semibold text-gray-800 text-center mb-6">
              Create Your Time Schedule
            </p>

            {/* Title + Duration input */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
              <div className="flex flex-col w-full md:w-1/2">
                <p className="text-gray-600 font-medium">
                  Purpose/Title of your timer
                </p>
                <input
                  type="text"
                  placeholder="eg.This is a church programme... max 50 characters"
                  className="w-full p-3 border rounded-lg mb-2 font-sans text-gray-600"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={50}
                />
              </div>

              <div className="flex flex-col w-full md:w-1/2">
                <label className="mb-2 font-medium text-gray-600">
                  State your duration
                </label>
                <div className="flex flex-wrap gap-4 items-center">
                  <TimeInput time={duration} onChange={setDuration} />
                  <p className="rounded-full bg-black text-white px-4 py-2 text-medium w-fit">
                    {String(duration.hours).padStart(2, "0")}:
                    {String(duration.minutes).padStart(2, "0")}:
                    {String(duration.seconds).padStart(2, "0")}
                  </p>
                </div>
              </div>
            </div>

            <hr className="my-6 border-gray-300" />

            <label className="block text-gray-700 mx-auto w-fit mb-6 font-bold">
              How many categories?
            </label>

            <div className="space-y-4">
              <AnimatePresence>
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
                maxLength={40}
              </AnimatePresence>
            </div>

            <div className="flex justify-center mt-4">
              <button
                onClick={addCategory}
                className="border border-gray-500 px-4 py-1 text-gray-500 rounded-lg"
              >
                + Add Category
              </button>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8">
              <button
                className="bg-black text-white px-6 py-2 rounded-full w-full sm:w-40 hover:bg-transparent hover:text-black hover:border-black hover:border"
                onClick={() => {
                  setStoreCategories(categories);
                  // router.push(`/ongoing/${schedule.id}`);
                  router.push("/ongoing");


                }}
              >
                Start
              </button>



                <button
                className="border border-black px-6 py-2 rounded-full w-full sm:w-40 text-black hover:bg-black hover:text-white"
                onClick={async () => {
                  const schedule = {
                    title,
                    categories,
                    duration,
                    createdAt: new Date().toISOString(),
                  };

                  try {
                    const res = await axios.post("/schedules", schedule);

                    if (res.status === 201 || res.status === 200) {
                      alert("Schedule saved successfully!");
                      router.push("/saved");
                    } else {
                      alert("Failed to save schedule");
                    }
                  } catch (error: unknown) {
                    console.error("Error saving schedule:", error);
                    alert("An error occurred while saving schedule.");
                  }
                }}
              >
                Save
              </button>


            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimerForm;



