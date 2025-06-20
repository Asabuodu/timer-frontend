
import React from "react";

type Time = {
  hours: number;
  minutes: number;
  seconds: number;
};

type Props = {
  time: Time;
  onChange: (time: Time) => void;
};

const TimeInput = ({ time, onChange }: Props) => {
  const pad = (num: number) => String(num).padStart(2, "0");

  const [h1, h2] = pad(time.hours);
  const [m1, m2] = pad(time.minutes);
  const [s1, s2] = pad(time.seconds);

  const handleDigitChange = (
    unit: keyof Time,
    index: number,
    value: string
  ) => {
    const digit = value.replace(/\D/g, "").slice(0, 1); // allow only 1 numeric character
    if (!digit) return;

    const current = pad(time[unit]);
    const updated =
      index === 0 ? digit + current[1] : current[0] + digit;
    const numeric = parseInt(updated, 10);
    onChange({ ...time, [unit]: numeric });
  };

  const inputClass = "w-5  border rounded text-center text-lg";

  return (
    <div className="flex gap-2 items-center">
      {/* Hours */}
      <input
        type="text"
        value={h1}
        onChange={(e) => handleDigitChange("hours", 0, e.target.value)}
        className={inputClass}
      />
      <input
        type="text"
        value={h2}
        onChange={(e) => handleDigitChange("hours", 1, e.target.value)}
        className={inputClass}
      />
      <span className="text-xl font-bold">:</span>

      {/* Minutes */}
      <input
        type="text"
        value={m1}
        onChange={(e) => handleDigitChange("minutes", 0, e.target.value)}
        className={inputClass}
      />
      <input
        type="text"
        value={m2}
        onChange={(e) => handleDigitChange("minutes", 1, e.target.value)}
        className={inputClass}
      />
      <span className="text-xl font-bold">:</span>

      {/* Seconds */}
      <input
        type="text"
        value={s1}
        onChange={(e) => handleDigitChange("seconds", 0, e.target.value)}
        className={inputClass}
      />
      <input
        type="text"
        value={s2}
        onChange={(e) => handleDigitChange("seconds", 1, e.target.value)}
        className={inputClass}
      />
    </div>
  );
};

export default TimeInput;
