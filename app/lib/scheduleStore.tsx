// import { create } from "zustand";
// import axios from "../lib/axios"; // ✅ use your token-enabled axios

// type Time = {
//   hours: number;
//   minutes: number;
//   seconds: number;
// };

// type Category = {
//   id: number;
//   name: string;
//   duration: Time;
// };

// type Schedule = {
//   id: string;
//   title: string;
//   duration: Time;
//   categories: Category[];
//   createdAt: string;
//   updatedAt?: string;
// };

// type ScheduleStore = {
//   categories: Category[];
//   savedSchedules: Schedule[];
//   setCategories: (categories: Category[]) => void;
//   saveSchedule: (schedule: Omit<Schedule, "id" | "createdAt" | "updatedAt">) => Promise<void>;
//   deleteSchedule: (id: string) => void;
//   setEditingSchedule: (schedule: Schedule | null) => void;
//   editingSchedule: Schedule | null;
//   clearEditingSchedule: () => void;
// };

// export const useScheduleStore = create<ScheduleStore>((set, get) => ({
//   categories: [],
//   savedSchedules: [],
//   editingSchedule: null,

//   setCategories: (categories) => set({ categories }),

//   saveSchedule: async (scheduleData) => {
//     try {
//       const res = await axios.post("/schedules", scheduleData);
//       const saved = { ...res.data, id: res.data._id };

//       set((state) => ({
//         savedSchedules: [...state.savedSchedules, saved],
//         editingSchedule: null,
//       }));
//     } catch (error) {
//       console.error("Failed to save schedule to backend:", error);
//     }
//   },

//   deleteSchedule: (id) =>
//     set((state) => ({
//       savedSchedules: state.savedSchedules.filter((s) => s.id !== id),
//     })),

//   setEditingSchedule: (schedule) => set({ editingSchedule: schedule }),
//   clearEditingSchedule: () => set({ editingSchedule: null }),
// }));



import { create } from "zustand";
import axios from "../lib/axios"; // Make sure this axios instance includes JWT in headers

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
  id: string;
  title: string;
  duration: Time;
  categories: Category[];
  createdAt: string;
  updatedAt?: string;
};

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

export const useScheduleStore = create<ScheduleStore>((set, get) => ({
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
