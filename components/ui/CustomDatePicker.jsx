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
}) {
  const [selectedDate, setSelectedDate] = useState(
    value ? new Date(value) : null
  );
  const [open, setOpen] = useState(false);

  // sync with parent
  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value));
    }
  }, [value]);

  const handleSelect = (date) => {
    if (!date) return;

    setSelectedDate(date);

    // ✅ auto save
    onChange(format(date, "yyyy-MM-dd"));

    // ✅ auto close
    setOpen(false);
  };

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
          {value
            ? format(new Date(value), "MMM dd, yyyy")
            : <span className="text-gray-400">{placeholder}</span>}
        </button>
      </PopoverTrigger>

      {/* CALENDAR */}
      <PopoverContent className="w-[300px] p-3">

        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect} // ✅ auto select
        />

      </PopoverContent>
    </Popover>
  );
}