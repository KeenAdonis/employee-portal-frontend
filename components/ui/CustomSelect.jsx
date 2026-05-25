"use client";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select",
  disabled = false,
}) {
  return (

    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled}
    >

      {/* TRIGGER */}
      <SelectTrigger
        className="
          w-full h-11 px-3
          rounded-lg border border-gray-300
          bg-white text-sm text-gray-700
          focus:ring-2 focus:ring-purple-300
          focus:border-purple-500

          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      {/* DROPDOWN */}
      <SelectContent className="rounded-xl shadow-lg border border-gray-200">

        {options.map((opt) => (

          <SelectItem
            key={opt.value}
            value={opt.value}
            className="text-sm"
          >
            {opt.label}
          </SelectItem>

        ))}

      </SelectContent>

    </Select>
  );
}