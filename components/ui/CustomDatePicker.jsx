"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

export default function CustomDatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  allowedDays = null,
  minDate = null,
  disabledDates = null,
}) {
  const [selectedDate, setSelectedDate] = useState(
    value ? new Date(value) : null
  );
  const [open, setOpen] = useState(false);

  /* =========================
     SYNC VALUE
  ========================= */
  useEffect(() => {
    if (value instanceof Date) {
      setSelectedDate(value);
    } else if (value) {
      setSelectedDate(new Date(value));
    }
  }, [value]);

  /* =========================
     HANDLE SELECT
  ========================= */
  const handleSelect = (date) => {
    if (!date) return;

    // 🔥 block invalid dates
    if (isDisabled(date)) return;

    setSelectedDate(date);

    // ✅ safe callback
    if (typeof onChange === "function") {
      onChange(date);
    }

    setOpen(false);
  };

  const isDisabled = (date) => {

    /* =========================
       MIN DATE
    ========================= */

    if (minDate) {
      const compareDate = new Date(date);
      compareDate.setHours(0, 0, 0, 0);

      const minimum = new Date(minDate);
      minimum.setHours(0, 0, 0, 0);

      if (compareDate < minimum) {
        return true;
      }
    }

    /* =========================
       CUSTOM DISABLED
    ========================= */

    if (disabledDates?.(date)) {
      return true;
    }

    /* =========================
       ALLOWED DAYS
    ========================= */

    if (allowedDays) {
      return !allowedDays.includes(date.getDate());
    }

    return false;
  };

  /* =========================
     UI
  ========================= */
  return (
    <Popover open={open} onOpenChange={setOpen}>

      {/* INPUT */}
      <PopoverTrigger asChild>
        <button
          type="button"
          className="
            w-full h-11 px-3
            border border-gray-300 rounded-lg
            text-left text-sm
            bg-white hover:bg-gray-50
            flex items-center
          "
        >
          {selectedDate
            ? format(selectedDate, "MMM dd, yyyy")
            : <span className="text-gray-400">{placeholder}</span>}
        </button>
      </PopoverTrigger>

      {/* CALENDAR */}
      <PopoverContent className="w-[300px] p-3">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}

          // 🔥 disable other dates
          disabled={isDisabled}

          // 🔥 highlight allowed dates
          modifiers={{
            allowed: (date) =>
              allowedDays?.includes(date.getDate()),
          }}

          modifiersClassNames={{
            allowed: "bg-indigo-100 text-indigo-700 rounded-md",
          }}
        />
      </PopoverContent>

    </Popover>
  );
}