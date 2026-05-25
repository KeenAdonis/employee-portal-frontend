"use client";

import { Eye, Pencil } from "lucide-react";
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
        bg-white rounded-2xl p-5
        border border-gray-100
        shadow-sm hover:shadow-lg
        transition-all duration-300
        cursor-pointer
        flex flex-col h-full
      "
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <span
            className={`
                text-xs
                px-3
                py-1
                rounded-full
                font-medium
                border
                ${companyStatusMeta.className}
            `}
        >
            {companyStatusMeta.label}
        </span>

        <div className="flex items-center justify-center">

            <div
                className={`
                    relative
                    flex
                    items-center
                    justify-center
                `}
            >
            
                {/* PING */}
                <div
                    className={`
                        absolute
                        w-3
                        h-3
                        rounded-full
                        animate-ping
                        opacity-75
                        ${
                            employee.Status?.toUpperCase() === "ACTIVE"
                                ? "bg-green-400"
                                : "bg-red-400"
                        }
                    `}
                />
        
                {/* DOT */}
                <div
                    className={`
                        relative
                        w-2.5
                        h-2.5
                        rounded-full
                        ${
                            employee.Status?.toUpperCase() === "ACTIVE"
                                ? "bg-green-500"
                                : "bg-red-500"
                        }
                    `}
                />
        
            </div>
                      
        </div>
      </div>

      {/* PROFILE */}
      <div className="flex flex-col items-center text-center">
        {/* AVATAR */}
        <div
          className={`
            w-16
            h-16
            rounded-full
            mb-3
            overflow-hidden
            flex
            items-center
            justify-center
            text-white
            font-semibold
            text-lg
            shadow-sm
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

        <h2 className="font-semibold text-gray-900 text-sm">
          {fullName}
        </h2>

        <p className="text-xs text-gray-500 mt-1">
          {employee.Position}
        </p>
      </div>

      {/* INFO */}
      <div className="mt-4 space-y-2 text-xs text-gray-600">
        <div className="flex justify-between">
          <span className="text-gray-400">ID</span>
          <span className="font-medium">#{employee.EmployeeNo}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Department</span>
          <span className="font-medium truncate max-w-[120px] text-right">
            {employee.Department}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Email</span>
          <span className="truncate max-w-[140px] text-right">
            {employee.EmailAddress}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Contact</span>
          <span>{employee.ContactNumber}</span>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-auto pt-4 border-t flex justify-between items-center text-xs text-gray-500">
        <span>
          Joined: {employee.DateHired || "-"}
        </span>

        {/* ACTIONS */}
        <div
          className="flex gap-2"
          onClick={(e) => e.stopPropagation()} // prevent card click
        >
          <button
            onClick={() => onView && onView()}
            className="
                                    bg-gradient-to-r from-amber-400 to-amber-500
                                    text-white
                                    font-medium
                                    px-2 py-2 rounded-lg
                                    shadow-md shadow-amber-500/30
                                    hover:from-amber-300 hover:to-amber-400
                                    hover:shadow-lg hover:shadow-amber-500/40
                                    active:scale-[0.98]
                                    transition-all duration-200
                                    "
          >
            <Eye size={16} />
          </button>

        </div>
      </div>
    </div>
  );
}