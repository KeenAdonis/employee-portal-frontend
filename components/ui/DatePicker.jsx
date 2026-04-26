"use client";

export default function DatePicker({
  name,
  value,
  onChange,
}) {
  return (
    <input
      type="date"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
    />
  );
}