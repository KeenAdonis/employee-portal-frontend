"use client";

import DataTable from "@/components/table/DataTable";

import StatusBadge from "@/components/ui/StatusBadge";

import {
    Eye,
    Pencil,
    Trash2,
    RefreshCcw,
} from "lucide-react";

export default function UsersTable({
    data = [],
    loading = false,

    onView,
    onEdit,
    onDelete,
    onResetPassword,
}) {

    const columns = [
        "User",
        "Email",
        "Role",
        "Status",
        "Actions",
    ];

    return (
        <DataTable
            columns={columns}
            data={data}
            loading={loading}
            emptyTitle="No users found"
            emptyDescription="
        There are currently no users available.
      "

            renderRow={(user) => (

                <tr
                    key={user.id}
                    className="
            hover:bg-gray-50
            transition-colors
          "
                >

                    {/* USER */}
                    <td className="px-4 py-3">

                        <div>

                            <div
                                className="
                  font-medium
                  text-gray-900
                "
                            >
                                {user.name}
                            </div>

                            <div
                                className="
                  text-xs
                  text-gray-500
                "
                            >
                                ID: {user.id}
                            </div>

                        </div>

                    </td>

                    {/* EMAIL */}
                    <td className="px-4 py-3">
                        {user.email}
                    </td>

                    {/* ROLE */}
                    <td className="px-4 py-3">

                        <span
                            className="
                inline-flex
                items-center
                rounded-full
                border
                px-3
                py-1
                text-xs
                font-medium
                capitalize
              "
                        >
                            {user.role}
                        </span>

                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-3">

                        <StatusBadge
                            status={user.status}
                        />

                    </td>

                    {/* ACTIONS */}
                    <td className="px-4 py-3">

                        <div className="flex items-center gap-3">

                            {/* VIEW */}
                            <button
                                onClick={() => onView?.(user)}
                                className="
                  text-gray-500
                  hover:text-indigo-600
                  transition-colors
                "
                            >
                                <Eye className="w-4 h-4" />
                            </button>

                            {/* EDIT */}
                            <button
                                onClick={() => onEdit?.(user)}
                                className="
                  text-gray-500
                  hover:text-blue-600
                  transition-colors
                "
                            >
                                <Pencil className="w-4 h-4" />
                            </button>

                            {/* RESET PASSWORD */}
                            <button
                                onClick={() =>
                                    onResetPassword?.(user)
                                }
                                className="
                  text-gray-500
                  hover:text-yellow-600
                  transition-colors
                "
                            >
                                <RefreshCcw className="w-4 h-4" />
                            </button>

                            {/* DELETE */}
                            <button
                                onClick={() => onDelete?.(user)}
                                className="
                  text-gray-500
                  hover:text-red-600
                  transition-colors
                "
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>

                        </div>

                    </td>

                </tr>

            )}
        />
    );
}