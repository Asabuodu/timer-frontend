"use client";

import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useScheduleStore } from "@/app/lib/scheduleStore";
import CategoryInput from "@/app/components/CategoryInput";
import TimeInput from "@/app/components/TimeInput";
import OngoingSchedule from "@/app/components/OngoingSchedule";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/navbar";
import Link from "next/link";

const EditSchedule = () => {
  const router = useRouter();
  const {
    editingSchedule,
    saveSchedule,
    setCategories: updateZustandCategories,
    clearEditingSchedule,
  } = useScheduleStore();

  const [started, setStarted] = useState(false);
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [categories, setCategories] = useState([
    { id: Date.now(), name: "", duration: { hours: 0, minutes: 0, seconds: 0 } },
  ]);

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

  const updateCategoryTime = (id: number, time: typeof duration) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, duration: time } : cat))
    );
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert("Please enter a schedule title.");
      return;
    }

    const updated = {
      id: editingSchedule?.id ?? Date.now(),
      title,
      duration,
      categories,
      createdAt: editingSchedule?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveSchedule(updated);
    clearEditingSchedule();
    router.push("/saved");
  };

  return (
    <div className="px-4 py-8 min-h-screen bg-gradient-to-r from-white via-blue-100 to-white">
      {started ? (
        <OngoingSchedule categories={categories} />
      ) : (
        <div>
          <Navbar />
          <h1 className="text-center mt-12 shadow-sm w-fit mx-auto p-4 text-2xl text-black font-bold mb-10">
            Edit Your Schedule
          </h1>

          <div className="max-w-4xl w-full mx-auto border-white border-8 mt-6 p-6 rounded-2xl shadow-lg bg-white bg-opacity-80">
            <p className="font-semibold text-gray-800 text-center mb-6">
              Modify Your Time Schedule
            </p>

            {/* Title + Duration input */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
              <div className="flex flex-col w-full md:w-1/2">
                <label className="text-gray-600 font-medium mb-1">
                  Purpose/Title of your timer
                </label>
                <input
                  type="text"
                  placeholder="Eg. Church programme..."
                  className="w-full p-3 border rounded-lg mb-2 font-sans text-gray-600"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
              <Link href={`/ongoing/${schedule._id}`}>
              
              <button
                className="bg-black text-white px-6 py-2 rounded-full w-full sm:w-40"
                onClick={() => {
                  updateZustandCategories(categories);
                  setStarted(true);
                }}
              >
                Start
              </button>
              </Link>

              <button
                className="border border-black px-6 py-2 rounded-full w-full sm:w-40 text-black"
                onClick={handleSave}
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

export default EditSchedule;
