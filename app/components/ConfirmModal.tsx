

// components/ConfirmModal.tsx
import React from "react";

type ConfirmModalProps = {
  message: string;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  message,
  isOpen,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Semi-transparent background (but still see content behind) */}
      <div className="absolute inset-0 bg-transparent bg-opacity-40 backdrop-blur-sm border-2"></div>

      {/* Modal box */}
      <div className="relative bg-transparent p-6 rounded-xl shadow-xl w-[90%] max-w-sm z-50">
        <p className="text-gray-800 text-center mb-4">{message}</p>
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
