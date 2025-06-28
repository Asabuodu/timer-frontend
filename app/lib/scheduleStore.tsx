import { create } from "zustand";
import axios from "../lib/axios"; // Make sure this axios instance includes JWT in headers
import type { Category, Schedule } from "../lib/types";

type ScheduleStore = {
  categories: Category[];
  savedSchedules: Schedule[];
  editingSchedule: Schedule | null;

  // Setters and actions
  setCategories: (categories: Category[]) => void;
  saveSchedule: (schedule: Omit<Schedule, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  deleteSchedule: (id: string) => void;
  setEditingSchedule: (schedule: Schedule | null) => void;
  clearEditingSchedule: () => void;
};

export const useScheduleStore = create<ScheduleStore>((set) => ({
  categories: [],
  savedSchedules: [],
  editingSchedule: null,

  setCategories: (categories) => set({ categories }),

  saveSchedule: async (scheduleData) => {
    try {
      const res = await axios.post("/schedules", scheduleData);
      const saved: Schedule = {
        ...res.data,
        id: res.data._id,
        createdAt: res.data.createdAt,
        updatedAt: res.data.updatedAt,
      };

      set((state) => ({
        savedSchedules: [...state.savedSchedules, saved],
        editingSchedule: null,
      }));
    } catch (error) {
      console.error("❌ Failed to save schedule:", error);
    }
  },

  deleteSchedule: (id) =>
    set((state) => ({
      savedSchedules: state.savedSchedules.filter((s) => s.id !== id),
    })),

  setEditingSchedule: (schedule) => set({ editingSchedule: schedule }),
  clearEditingSchedule: () => set({ editingSchedule: null }),
}));
