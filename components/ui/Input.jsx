"use client";

export default function Input({
  name,
  placeholder,
  value,
  onChange,
  type = "text",
  disabled = false,
  className = "",
}) {
  return (
    <input
      name={name}
      type={type}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`
        w-full h-11 px-3
        rounded-lg border border-gray-300
        bg-white text-sm text-gray-700
        placeholder:text-gray-400
        transition

        focus:outline-none 
        focus:ring-2 focus:ring-purple-300 
        focus:border-purple-500

        disabled:bg-gray-100 disabled:cursor-not-allowed

        ${className}
      `}
    />
  );
}