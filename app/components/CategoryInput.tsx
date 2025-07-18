// app/components/CategoryInput.tsx

import { motion } from "framer-motion";
import TimeInput from "./TimeInput";
import type { Time, Category } from "../lib/types";

type Props = {
  index: number;
  data: Category;
  onNameChange: (id: string, name: string) => void;
  onTimeChange: (id: string, time: Time) => void;
  onRemove: (id: string) => void;
};

const CategoryInput = ({
  index,
  data,
  onNameChange,
  onTimeChange,
  onRemove,
}: Props) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.4 }}
      className="mb-6 p-6 border-b border-gray-300 hover:border-gray relative rounded-lg bg-transparent"
    >
      <button
        onClick={() => onRemove(data.id)}
        className="absolute top-3 right-3 text-gray-600 font-bold text-2xl hover:text-gray-800"
        title="Remove category"
      >
        ×
      </button>

      <p className="mb-4 font-semibold text-gray-700">Category {index}</p>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <input
          type="text"
          placeholder="Category name max 40 characters"
          value={data.name}
          onChange={(e) => onNameChange(data.id, e.target.value)}
          className="w-full md:w-1/2 p-2 border rounded-md text-gray-700"
        />

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <TimeInput
            time={data.duration}
            onChange={(newTime) => onTimeChange(data.id, newTime)}
          />
          <p className="rounded-full bg-black text-white px-4 py-2 text-sm font-mono text-center">
            {String(data.duration.hours).padStart(2, "0")}:
            {String(data.duration.minutes).padStart(2, "0")}:
            {String(data.duration.seconds).padStart(2, "0")}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryInput;
