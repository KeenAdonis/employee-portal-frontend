"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Clock3 } from "lucide-react";

/* =========================
   GENERATE TIME OPTIONS
========================= */
const generateTimes = (interval = 30) => {

  const times = [];

  for (let hour = 0; hour < 24; hour++) {

    for (
      let minute = 0;
      minute < 60;
      minute += interval
    ) {

      const date = new Date();

      date.setHours(hour);
      date.setMinutes(minute);

      const formatted = date.toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }
      );

      const value = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

      times.push({
        label: formatted,
        value,
      });
    }
  }

  return times;
};

const TIME_OPTIONS = generateTimes(30);

export default function CustomTimePicker({
  value,
  onChange,
  placeholder = "Select time",
  disabled = false,
}) {

  const [open, setOpen] = useState(false);

  const [selected, setSelected] = useState("");

  /* =========================
     SYNC VALUE
  ========================= */
  useEffect(() => {

    setSelected(value || "");

  }, [value]);

  /* =========================
     DISPLAY LABEL
  ========================= */
  const displayValue = useMemo(() => {

    if (!selected) return "";

    const found = TIME_OPTIONS.find(
      (t) => t.value === selected
    );

    return found?.label || selected;

  }, [selected]);

  /* =========================
     SELECT TIME
  ========================= */
  const handleSelect = (time) => {

    setSelected(time);

    onChange?.(time);

    setOpen(false);
  };

  return (

    <Popover
      open={open}
      onOpenChange={setOpen}
    >

      {/* INPUT */}
      <PopoverTrigger asChild>

        <button
          type="button"
          disabled={disabled}
          className="
                        w-full h-11 px-3
                        border border-gray-300 rounded-lg
                        bg-white hover:bg-gray-50
                        text-sm text-left
                        flex items-center justify-between
                        transition
                        disabled:bg-gray-100
                        disabled:cursor-not-allowed
                    "
        >

          <span
            className={
              displayValue
                ? "text-gray-900"
                : "text-gray-400"
            }
          >
            {displayValue || placeholder}
          </span>

          <Clock3 className="w-4 h-4 text-gray-500" />

        </button>

      </PopoverTrigger>

      {/* DROPDOWN */}
      <PopoverContent
        align="start"
        className="w-[240px] p-2"
      >

        <div className="
                    max-h-[300px]
                    overflow-y-auto
                    space-y-1
                ">

          {TIME_OPTIONS.map((time) => (

            <button
              key={time.value}
              type="button"

              onClick={() =>
                handleSelect(time.value)
              }

              className={`
                                w-full text-left
                                px-3 py-2 rounded-lg
                                text-sm transition
                                ${selected === time.value
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-gray-100 text-gray-700"
                }
                            `}
            >
              {time.label}
            </button>
          ))}

        </div>

      </PopoverContent>

    </Popover>
  );
}