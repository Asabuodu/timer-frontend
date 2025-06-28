"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlayIcon,
  StopIcon,
} from "@heroicons/react/24/outline";
import { CheckIcon, PauseIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Time, Category } from "../lib/types";

const getTotalSeconds = (time: Time) =>
  time.hours * 3600 + time.minutes * 60 + time.seconds;

const getTotalTimeOfAllCategories = (categories: Category[]) =>
  categories.reduce((sum, cat) => sum + getTotalSeconds(cat.duration), 0);

const format = (n: number) => String(n).padStart(2, "0");

const OngoingSchedule = ({ categories }: { categories: Category[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(
    categories.length > 0 ? getTotalSeconds(categories[0].duration) : 0
  );
  const [totalTimeLeft, setTotalTimeLeft] = useState(
    getTotalTimeOfAllCategories(categories)
  );
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showSavedTime, setShowSavedTime] = useState(false);
  const [, setElapsedSeconds] = useState(0);
  const [completedCategories, setCompletedCategories] = useState<Record<number, boolean>>({});
  const [savedTimes, setSavedTimes] = useState<Record<number, number>>({});

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentCategory = categories[currentIndex] || {
    name: "No Category",
    duration: { hours: 0, minutes: 0, seconds: 0 },
  };

  const total = getTotalSeconds(currentCategory.duration) || 1;
  const percentage = 100 - (secondsLeft / total) * 100;
  const allTotalSeconds = getTotalTimeOfAllCategories(categories);
  const allPercentage = 100 - (totalTimeLeft / allTotalSeconds) * 100;

  useEffect(() => {
    setTotalTimeLeft(getTotalTimeOfAllCategories(categories));
  }, [categories]);

  useEffect(() => {
    if (!isRunning || isCompleted || categories.length === 0) return;

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (currentIndex + 1 < categories.length) {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            setSecondsLeft(getTotalSeconds(categories[nextIndex].duration));
          } else {
            clearInterval(intervalRef.current!);
            setIsCompleted(true);
            setSecondsLeft(0);
          }
          return 0;
        }
        return prev - 1;
      });

      setElapsedSeconds((prev) => prev + 1);
      setTotalTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(intervalRef.current!);
  }, [isRunning, currentIndex, categories, isCompleted]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const reset = () => {
    clearInterval(intervalRef.current!);
    setIsRunning(false);
    setIsCompleted(false);
    setShowSavedTime(false);

    const currentDuration = getTotalSeconds(categories[currentIndex].duration);
    setSecondsLeft(currentDuration);

    setCompletedCategories((prev) => {
      const updated = { ...prev };
      delete updated[currentIndex];
      return updated;
    });

    setSavedTimes((prev) => {
      const updated = { ...prev };
      delete updated[currentIndex];
      return updated;
    });

    const saved = savedTimes[currentIndex];
    if (saved !== undefined) {
      setElapsedSeconds((prev) => Math.max(0, prev - saved));
      setTotalTimeLeft((prev) => prev + saved);
    }
  };

  const finish = () => {
    if (isCompleted) return;

    clearInterval(intervalRef.current!);
    setIsRunning(false);
    setIsCompleted(true);

    const saved = secondsLeft;
    setElapsedSeconds((prev) => prev + saved);
    setTotalTimeLeft((prev) => Math.max(0, prev - saved));
    setCompletedCategories((prev) => ({ ...prev, [currentIndex]: true }));
    setSavedTimes((prev) => ({ ...prev, [currentIndex]: saved }));

    setTimeout(() => {
      setIsCompleted(false);
      setShowSavedTime(true);
    }, 2000);
  };

  const hrs = Math.floor(secondsLeft / 3600);
  const mins = Math.floor((secondsLeft % 3600) / 60);
  const secs = secondsLeft % 60;

  const mainHrs = Math.floor(totalTimeLeft / 3600);
  const mainMins = Math.floor((totalTimeLeft % 3600) / 60);
  const mainSecs = totalTimeLeft % 60;

  // const totalScheduledSeconds = getTotalTimeOfAllCategories(categories);
  // const savedSeconds = Math.max(0, totalScheduledSeconds - elapsedSeconds);
  // const savedHrs = Math.floor(savedSeconds / 3600);
  // const savedMins = Math.floor((savedSeconds % 3600) / 60);
  // const savedSecs = savedSeconds % 60;

  return (
    <motion.div
      className="flex flex-col items-center min-h-screen bg-transparent"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p
        className={`text-2xl mt-28 w-40 h-10 flex justify-center items-center rounded-full
          ${allPercentage > 80 ? "bg-red-500 text-white" : "bg-black text-white"}`}
      >
        {format(mainHrs)} : {format(mainMins)} : {format(mainSecs)}
      </p>

      <div className="w-full max-w-4xl border-8 mt-16 border-white p-6 rounded-2xl shadow-md">
        <div className="flex justify-between">
          <button
            disabled={currentIndex === 0}
            onClick={() => {
              const newIndex = Math.max(0, currentIndex - 1);
              setCurrentIndex(newIndex);
              const newSeconds = completedCategories[newIndex]
                ? savedTimes[newIndex] ?? 0
                : getTotalSeconds(categories[newIndex].duration);
              setSecondsLeft(newSeconds);
              setIsCompleted(false);
              setShowSavedTime(completedCategories[newIndex] || false);
            }}
            className="text-gray-600 flex disabled:text-gray-400"
          >
            <ChevronLeftIcon className="w-8 -mt-2" /> Previous
          </button>

          <p className="text-xl font-semibold border rounded-full px-2.5 mx-auto text-gray-600">
            {currentCategory.name}
          </p>

          <button
            disabled={currentIndex === categories.length - 1}
            onClick={() => {
              const newIndex = Math.min(categories.length - 1, currentIndex + 1);
              setCurrentIndex(newIndex);
              const newSeconds = completedCategories[newIndex]
                ? savedTimes[newIndex] ?? 0
                : getTotalSeconds(categories[newIndex].duration);
              setSecondsLeft(newSeconds);
              setIsCompleted(false);
              setShowSavedTime(completedCategories[newIndex] || false);
            }}
            className="text-gray-600 flex disabled:text-gray-400"
          >
            Next <ChevronRightIcon className="w-8 -mt-1" />
          </button>
        </div>

        <div className="w-[260px] h-[260px] relative mt-14 mx-auto">
          <svg className="w-full h-full transform" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="47" stroke="#eee" strokeWidth="4" fill="none" />
            <motion.circle
              cx="50"
              cy="50"
              r="47"
              stroke={percentage > 80 ? "#DC2626" : "#000"}
              strokeWidth="4"
              fill="none"
              strokeDasharray="282.74"
              strokeDashoffset={(282.74 * percentage) / 100}
              strokeLinecap="round"
              initial={{ strokeDashoffset: 282.74 }}
              animate={{ strokeDashoffset: (282.74 * percentage) / 100 }}
              transition={{ duration: 0.3 }}
            />
          </svg>

          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* <AnimatePresence>
              {isCompleted && (
                <motion.div
                  key="completed"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="text-xl font-bold text-black flex flex-col items-center"
                >
                  <CheckIcon className="text-black text-6xl fill-black" />
                  Completed
                </motion.div>

                

              )}
            </AnimatePresence> */}

            <AnimatePresence>
            {isCompleted && (
              <motion.div
                key="completed"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="text-xl font-bold text-black flex flex-col items-center"
              >
                <CheckIcon className="text-black text-6xl fill-black" />
                Completed
              </motion.div>
            )}

          {showSavedTime && savedTimes[currentIndex] !== undefined && (
            <motion.div
              key="saved-time"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="text-center text-lg mt-2 text-gray-600 font-semibold flex flex-col items-center"
            >
              time Saved  <span className="font-bold"></span>
              <span className="mt-1 text-2xl">
                {format(Math.floor(savedTimes[currentIndex]! / 3600))}:
                {format(Math.floor((savedTimes[currentIndex]! % 3600) / 60))}:
                {format(savedTimes[currentIndex]! % 60)}
              </span>
            </motion.div>
          )}

          </AnimatePresence>


            {!isCompleted && !showSavedTime && (
              <>
                <motion.p
                  className={`text-4xl font-mono ${percentage > 80 ? "text-red-500" : "text-black"}`}
                  key="countdown"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {format(hrs)} : {format(mins)} : {format(secs)}
                  
                  <p className="text-lg text-gray-500">hr &nbsp;&nbsp; mins &nbsp;&nbsp; secs</p>
                </motion.p>
              </>
            )}
          </motion.div>

          <div className="flex gap-6 mt-6 justify-around items-center text-gray-200 text-5xl">
            {isRunning ? (
              <PauseIcon
                onClick={() => setIsRunning(false)}
                className="w-9 cursor-pointer fill-gray-300 hover:fill-blue-500"
              />
            ) : (
              <PlayIcon
                onClick={() => setIsRunning(true)}
                className="w-9 cursor-pointer fill-gray-300 hover:fill-green-500"
              />
            )}
            <StopIcon
              onClick={reset}
              className="w-9 cursor-pointer fill-gray-300 hover:fill-red-500"
            />
          </div>
        </div> <br />

        <div className="w-full bg-gray-200 rounded-full h-2 mt-18 overflow-hidden">
          <motion.div
            className={`h-2 rounded-full ${
              allPercentage > 80 ? "bg-red-500" : "bg-black"
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${allPercentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="flex justify-center space-x-10 mt-6">
          <button onClick={() => setIsRunning(true)} className="px-4 py-2 text-gray-500 hover:text-gray-700">
            Start
          </button>
          <button onClick={finish} className="px-4 py-2 text-gray-500 hover:text-gray-700">
            Finish
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default OngoingSchedule;
