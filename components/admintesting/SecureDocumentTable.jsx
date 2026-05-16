"use client";

import { useState, useEffect, useRef } from "react";
import DataTable from "@/components/table/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import { getInitials } from "@/lib/utils";
import { Send, RotateCcw, Eye, Download, Trash, Loader2, ChevronDown } from "lucide-react";


/* =========================
   ACTION MENU COMPONENT
========================= */
function ActionMenu({
    item,
    onSendSingle,
    onResend,
    onView,
    onDownload,
    onDelete,
    onViewHistory, // ✅ ADD
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef();

    useEffect(() => {
        const handler = (e) => {
            if (!ref.current?.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="p-2 rounded-lg hover:bg-gray-100"
            >
                ⋮
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-lg z-50">
                    <div className="p-2 text-sm">

                        {/* SEND */}
                        {item.status === "Draft" && (
                            <button
                                onClick={() => {
                                    setOpen(false);
                                    onSendSingle(item.id);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg"
                            >
                                <Send size={14} />
                                Send
                            </button>
                        )}

                        {/* RESEND */}
                        {(item.status === "Sent" || item.status === "Failed") && (
                            <button
                                onClick={() => {
                                    setOpen(false);
                                    onResend(item.id);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg"
                            >
                                <RotateCcw size={14} />
                                Resend
                            </button>
                        )}

                        {/* VIEW */}
                        <button
                            onClick={() => {
                                setOpen(false);
                                onView(item);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg"
                        >
                            <Eye size={14} />
                            View
                        </button>

                        {/* 🔥 HISTORY (NEW) */}
                        {/* 🔥 HISTORY (CONDITIONAL) */}
                        {item.history_count > 1 && (
                            <button
                                onClick={() => {
                                    setOpen(false);
                                    onViewHistory(item.email);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg"
                            >
                                <Eye size={14} />
                                View History
                            </button>
                        )}

                        {/* DOWNLOAD */}
                        <button
                            onClick={() => {
                                setOpen(false);
                                onDownload(item);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg"
                        >
                            <Download size={14} />
                            Download
                        </button>

                        <div className="border-t my-2"></div>

                        {/* DELETE */}
                        <button
                            onClick={() => {
                                setOpen(false);
                                onDelete(item.id);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                            <Trash size={14} />
                            Delete
                        </button>

                    </div>
                </div>
            )}
        </div>
    );
}

function EmailTags({ recipients = [] }) {
    const emails = recipients.map(r => r.email);

    const visible = emails.slice(0, 2);
    const remaining = emails.length - visible.length;

    return (
        <div className="flex items-center gap-1 flex-wrap">

            {/* TAGS */}
            {visible.map((email, i) => (
                <span
                    key={i}
                    className="px-2 py-1 bg-gray-100 text-xs rounded-full"
                >
                    {email}
                </span>
            ))}

            {/* +MORE */}
            {remaining > 0 && (
                <div className="relative group">
                    <span className="px-2 py-1 bg-gray-200 text-xs rounded-full cursor-pointer">
                        +{remaining}
                    </span>

                    {/* TOOLTIP */}
                    <div className="absolute left-0 mt-2 hidden group-hover:block bg-white border shadow-lg rounded-lg p-2 z-50 min-w-[200px]">

                        {emails.map((email, i) => (
                            <div
                                key={i}
                                className="text-xs text-gray-700 py-1"
                            >
                                {email}
                            </div>
                        ))}

                    </div>
                </div>
            )}

        </div>
    );
}

/* =========================
   MAIN TABLE
========================= */
export default function SecureDocumentTable({
    data = [],
    selected = [],
    toggle,
    onSendSingle,
    onResend,
    onView,
    onDownload,
    onDelete,
    toggleAll,
    allSelected,
    onBulkSend,
    onBulkDelete,
    onViewHistory, // ✅ ADD THIS
}) {
    const [headerOpen, setHeaderOpen] = useState(false);
    const columns = [
        <div className="flex items-center gap-2 relative">

            {/* SELECT ALL */}
            <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
            />

            {/* DROPDOWN BUTTON */}
            <button
                onClick={() => setHeaderOpen(!headerOpen)}
                className="text-gray-500 hover:text-gray-700"
            >
                <ChevronDown size={16} />
            </button>

            {/* DROPDOWN */}
            {headerOpen && (
                <div className="absolute top-6 left-0 w-44 bg-white border rounded-lg shadow z-50">

                    <button
                        onClick={() => {
                            setHeaderOpen(false);
                            onBulkSend();
                        }}
                        className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                    >
                        Send Selected
                    </button>

                    <button
                        onClick={() => {
                            setHeaderOpen(false);
                            onBulkDelete();
                        }}
                        className="block w-full text-left px-3 py-2 text-red-500 hover:bg-red-50"
                    >
                        Delete Selected
                    </button>

                </div>
            )}

        </div>,

        "Employee",
        "Email",
        "File",
        "Status",
        "Actions",
    ];

    return (

        <DataTable
            columns={columns}
            data={data}
            renderRow={(item) => (
                <tr key={item.id} className="hover:bg-gray-50">

                    {/* CHECKBOX */}
                    <td className="px-4 py-3">
                        <input
                            type="checkbox"
                            checked={selected?.includes(item.id)}
                            onChange={() => toggle(item.id)}
                            disabled={item.status === "Sent"}
                        />
                    </td>

                    {/* EMPLOYEE */}
                    <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white flex items-center justify-center text-sm font-semibold">
                                {getInitials(item.employee_name || "")}
                            </div>

                            <div className="font-medium text-gray-900">
                                {item.employee_name || "—"}
                            </div>
                        </div>
                    </td>

                    {/* EMAIL */}
                    <td className="px-4 py-3">
                        <EmailTags recipients={item.recipients} />
                    </td>

                    {/* FILE */}
                    <td className="px-4 py-3">
                        {item.file_name || "—"}
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-3">
                        {item.status === "Queued" ? (
                            <div className="flex items-center gap-2 text-yellow-600 font-medium">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Processing...
                            </div>
                        ) : (
                            <StatusBadge status={item.status} />
                        )}
                    </td>

                    {/* ACTION MENU */}
                    <td className="px-4 py-3">
                        <ActionMenu
                            item={item}
                            onSendSingle={onSendSingle}
                            onResend={onResend}
                            onView={onView}
                            onDownload={onDownload}
                            onDelete={onDelete}
                            onViewHistory={onViewHistory}
                        />
                    </td>

                </tr>
            )}
        />
    );
}