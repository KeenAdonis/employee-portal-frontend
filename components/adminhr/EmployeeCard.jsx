"use client";

import {
  Eye,
  Building2,
  Mail,
  Phone,
  BadgeCheck,
  BriefcaseBusiness,
  Hash,
} from "lucide-react";

import { getStorageUrl } from "@/lib/storage";
import { getStatusMeta } from "@/lib/status";


export default function EmployeeCard({ employee, onView }) {

  const fullName = `${employee.FirstName} ${employee.LastName}`;
  const statusMeta = getStatusMeta(employee.Status);
  const companyStatusMeta = getStatusMeta(
    employee.CompanyStatus
  );

  const profileImage = getStorageUrl(employee.ProfileImage);

  /* =========================
     INITIALS
  ========================= */
  const getInitials = (first, last) => {
    return `${first?.charAt(0) || ""}${last?.charAt(0) || ""}`.toUpperCase();
  };

  /* =========================
     COLOR GENERATOR
  ========================= */
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
  ];

  const getColor = (name) => {
    let hash = 0;

    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div
      onClick={() => onView && onView()}
      className="
      group
      bg-white
      rounded-2xl
      p-5
      border border-gray-100
      shadow-sm
      hover:shadow-xl
      hover:-translate-y-1
      transition-all duration-300
      cursor-pointer
      flex flex-col
      h-full
    "
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <span
          className={`
          text-xs
          px-3 py-1
          rounded-full
          font-medium
          border
          ${companyStatusMeta.className}
        `}
        >
          {companyStatusMeta.label}
        </span>

        <div
          className={`
          flex items-center gap-1
          text-xs font-medium
          ${employee.Status?.toUpperCase() === "ACTIVE"
              ? "text-green-600"
              : "text-red-600"
            }
        `}
        >
          <BadgeCheck size={14} />
          {statusMeta.label}
        </div>
      </div>

      {/* PROFILE */}
      <div className="flex flex-col items-center text-center">
        <div
          className={`
          w-20
          h-20
          rounded-full
          mb-3
          overflow-hidden
          flex
          items-center
          justify-center
          text-white
          font-semibold
          text-xl
          shadow-md
          ${getColor(fullName)}
        `}
        >
          {profileImage ? (
            <img
              src={profileImage}
              alt={fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            getInitials(employee.FirstName, employee.LastName)
          )}
        </div>

        <h2 className="font-semibold text-gray-900 text-base">
          {fullName}
        </h2>

        {/* POSITION BADGE */}
        <span
          className="
          mt-2
          inline-flex
          items-center
          px-3
          py-1
          rounded-full
          bg-blue-50
          text-blue-700
          text-xs
          font-medium
        "
        >
          {employee.Position}
        </span>

        {/* COMPANY */}
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-wide">
            Company
          </p>

          <p className="text-sm font-medium text-gray-700">
            {employee.Company}
          </p>
        </div>
      </div>

      {/* INFO */}
      <div className="mt-3 pt-3 border-t divide-y">

        <div className="py-1 flex items-center justify-between gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-purple-50">
            <Hash size={14} className="text-purple-600" />
          </div>

          <span className="font-semibold text-gray-900 text-right">
            #{employee.EmployeeNo}
          </span>
        </div>

        <div className="py-1 flex items-center justify-between gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-blue-50">
            <BriefcaseBusiness
              size={14}
              className="text-blue-600"
            />
          </div>

          <span className="font-medium text-gray-700 text-right">
            {employee.Department}
          </span>
        </div>

        <div className="py-1 flex items-center justify-between gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-green-50">
            <Mail
              size={14}
              className="text-green-600"
            />
          </div>

          <span className="text-gray-700 text-right truncate">
            {employee.EmailAddress}
          </span>
        </div>

        <div className="py-1 flex items-center justify-between gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-amber-50">
            <Phone
              size={14}
              className="text-amber-600"
            />
          </div>

          <span className="text-gray-700 text-right">
            {employee.ContactNumber || "-"}
          </span>
        </div>

      </div>

      {/* FOOTER */}
      <div className="mt-auto pt-4 border-t flex items-center justify-between">
        <div>
          <p className="text-[11px] text-gray-400">
            Date Hired
          </p>

          <p className="text-xs font-medium text-gray-700">
            {employee.DateHired || "-"}
          </p>
        </div>

        <div
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onView && onView()}
            className="
            flex
            items-center
            justify-center
            w-10
            h-10
            rounded-xl
            bg-gradient-to-r
            from-amber-400
            to-amber-500
            text-white
            shadow-md
            shadow-amber-500/30
            hover:shadow-lg
            hover:shadow-amber-500/40
            hover:scale-105
            transition-all
            duration-200
          "
          >
            <Eye size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}