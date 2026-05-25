"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";

import { Calendar } from "@/components/ui/calendar";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import {
  CalendarDays,
  X,
} from "lucide-react";

export default function CustomDatePicker({
  value,
  onChange,
  placeholder = "Pick a date",

  // ✅ BUSINESS RULES
  allowedDays = null,
  minDate = null,
  disabledDates = null,

  // ✅ UX
  variant = "popover", // popover | modal
  disabled = false,
}) {

  const [selectedDate, setSelectedDate] =
    useState(
      value ? new Date(value) : null
    );

  const [open, setOpen] =
    useState(false);

  /* =========================
     SYNC VALUE
  ========================= */

  useEffect(() => {

    if (!value) {
      setSelectedDate(null);
      return;
    }

    if (value instanceof Date) {
      setSelectedDate(value);
    } else {
      setSelectedDate(
        new Date(value)
      );
    }

  }, [value]);

  /* =========================
     DISABLED LOGIC
  ========================= */

  const isDisabled = (date) => {

    /* MIN DATE */

    if (minDate) {

      const compareDate =
        new Date(date);

      compareDate.setHours(
        0, 0, 0, 0
      );

      const minimum =
        new Date(minDate);

      minimum.setHours(
        0, 0, 0, 0
      );

      if (compareDate < minimum) {
        return true;
      }
    }

    /* CUSTOM DISABLED */

    if (disabledDates?.(date)) {
      return true;
    }

    /* ALLOWED DAYS */

    if (allowedDays) {
      return !allowedDays.includes(
        date.getDate()
      );
    }

    return false;
  };

  /* =========================
     HANDLE SELECT
  ========================= */

  const handleSelect = (date) => {

    if (!date) return;

    if (isDisabled(date)) return;

    setSelectedDate(date);

    if (typeof onChange === "function") {
      onChange(date);
    }

    setOpen(false);
  };

  /* =========================
     CLEAR DATE
  ========================= */

  const handleClear = (e) => {

    e.stopPropagation();

    setSelectedDate(null);

    if (typeof onChange === "function") {
      onChange("");
    }
  };

  /* =========================
     INPUT UI
  ========================= */

  const TriggerButton = (

    <button
      type="button"

      disabled={disabled}

      className="
        relative
        w-full
        h-11
        px-3

        border
        border-gray-300

        rounded-xl

        text-left
        text-sm

        bg-white

        hover:bg-gray-50
        hover:border-gray-400

        disabled:bg-gray-100
        disabled:cursor-not-allowed
        disabled:opacity-70

        flex
        items-center
        gap-2

        transition-all

        focus:outline-none
        focus:ring-2
        focus:ring-indigo-100
        focus:border-indigo-400
      "
    >

      {/* ICON */}
      <CalendarDays
        className="
          w-4 h-4
          text-gray-400
          shrink-0
        "
      />

      {/* LABEL */}
      <span className="
        flex-1
        truncate
      ">

        {selectedDate
          ? format(
            selectedDate,
            "MMM dd, yyyy"
          )
          : (
            <span className="
              text-gray-400
            ">
              {placeholder}
            </span>
          )}

      </span>

      {/* CLEAR */}
      {selectedDate && !disabled && (

        <span
          onClick={handleClear}
          className="
            flex
            items-center
            justify-center

            w-5 h-5

            rounded-full

            text-gray-400
            hover:text-gray-700
            hover:bg-gray-100

            transition-all

            shrink-0
          "
        >
          <X className="w-3 h-3" />
        </span>

      )}

    </button>
  );

  /* =========================
     CALENDAR UI
  ========================= */

  const CalendarContent = (

    <Calendar
      mode="single"

      selected={selectedDate}

      onSelect={handleSelect}

      disabled={isDisabled}

      modifiers={{
        allowed: (date) =>
          allowedDays?.includes(
            date.getDate()
          ),
      }}

      modifiersClassNames={{
        allowed:
          `
            bg-indigo-100
            text-indigo-700
            rounded-md
          `,
      }}
    />
  );

  /* =========================
     MODAL VARIANT
  ========================= */

  if (variant === "modal") {

    return (

      <>

        {/* TRIGGER */}
        <div onClick={() => !disabled && setOpen(true)}>
          {TriggerButton}
        </div>

        {/* MODAL */}
        <Dialog
          open={open}
          onOpenChange={setOpen}
        >

          <DialogContent
            className="
              w-auto
              max-w-fit
              p-0
              border-0
              bg-transparent
              shadow-none
            "
          >

            <div
              className="
                rounded-2xl
                bg-white
                border
                border-gray-200
                shadow-2xl
                p-3
              "
            >
              {CalendarContent}
            </div>

          </DialogContent>

        </Dialog>

      </>

    );
  }

  /* =========================
     POPOVER VARIANT
  ========================= */

  return (

    <Popover
      open={open}
      onOpenChange={setOpen}
    >

      {/* TRIGGER */}
      <PopoverTrigger asChild>
        {TriggerButton}
      </PopoverTrigger>

      {/* CALENDAR */}
      <PopoverContent
        align="start"
        className="
          w-auto
          p-0
          border-0
          bg-transparent
          shadow-none
        "
      >

        <div
          className="
            rounded-2xl
            bg-white
            border
            border-gray-200
            shadow-xl
            p-3
          "
        >
          {CalendarContent}
        </div>

      </PopoverContent>

    </Popover>
  );
}