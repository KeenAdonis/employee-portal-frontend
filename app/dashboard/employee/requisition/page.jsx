"use client";

import { useState } from "react";
import useSWR from "swr";

import RequisitionTable from "@/components/requisition/RequisitionTable";
import Pagination from "@/components/table/Pagination";
import Drawer from "@/components/ui/Drawer";
import StatusBadge from "@/components/ui/StatusBadge";

import { useToast } from "@/components/ui/ToastProvider";
import { formatDate, formatCurrency } from "@/lib/format";
import { fetcher } from "@/lib/fetcher"; // ✅ from your .ts

import CreateRequisitionModal from "@/components/employee/CreateRequisitionModal";

export default function EmployeeRequisitionPage() {
    const [page, setPage] = useState(1);
    const [openCreate, setOpenCreate] = useState(false);

    // VIEW
    const [selected, setSelected] = useState(null);
    const [openDrawer, setOpenDrawer] = useState(false);

    const { showToast } = useToast();

    /* ================= SWR FETCH ================= */
    const { data, error, isLoading, mutate } = useSWR(
        `/requisition?page=${page}`,
        fetcher,
        {
            keepPreviousData: true, // ✅ smooth pagination
            revalidateOnFocus: false, // avoid spam calls
        }
    );

    const requisitions = data?.data?.data || [];
    const meta = data?.data || null;

    /* ================= VIEW ================= */
    const handleView = (item) => {
        setSelected(item);
        setOpenDrawer(true);
    };

    /* ================= ERROR ================= */
    if (error) {
        showToast({
            title: "Error",
            message: "Failed to fetch data",
            type: "error",
        });
    }

    return (
        <div className="p-6 space-y-4">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">My Requests</h2>

                <button
                    onClick={() => setOpenCreate(true)}
                    className="
                        bg-gradient-to-r from-indigo-500 to-indigo-600
                        text-white px-4 py-2 rounded-lg
                        shadow hover:opacity-90 transition
                    "
                >
                    + Create Request
                </button>
            </div>

            {/* TABLE */}
            <RequisitionTable
                data={requisitions}
                loading={isLoading}
                onView={handleView}
            />

            {/* PAGINATION */}
            {meta && (
                <div className="flex justify-end">
                    <Pagination meta={meta} onPageChange={setPage} />
                </div>
            )}

            {/* CREATE MODAL */}
            <CreateRequisitionModal
                open={openCreate}
                onClose={() => setOpenCreate(false)}
                onSuccess={() => {
                    mutate(); // ✅ instant refresh (no full reload)
                }}
            />

            {/* DRAWER */}
            <Drawer
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                title="Request Details"
            >
                {selected && (
                    <div className="space-y-6">

                        {/* MAIN */}
                        <div className="border rounded-xl p-4 space-y-3">
                            <div className="flex justify-between items-start">

                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        {selected.Type}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        {selected.EmployeeName}
                                    </p>
                                </div>

                                <StatusBadge status={selected.Status} size="sm" />

                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500 text-xs">Total</p>
                                    <p className="font-semibold">
                                        {formatCurrency(selected.TotalAmount)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-xs">Date Filed</p>
                                    <p>
                                        {formatDate(selected.DateFiled)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-xs">Start Date Needed</p>
                                    <p>
                                        {formatDate(selected.StartDateNeeded)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-xs">Start Date Needed</p>
                                    <p>
                                        {formatDate(selected.EndDateNeeded)}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <p className="text-gray-500 text-xs">Remarks</p>
                                <p className="text-sm text-gray-900">
                                    {selected.Remarks || "—"}
                                </p>
                            </div>

                            {/* ✅ OVERDUE DATE */}
                            {selected.overdue_progress?.overdue_start && (
                                <div className="pt-2 border-t">
                                    <p className="text-xs text-gray-500">
                                        Overdue starts on
                                    </p>
                                    <p className="text-sm font-medium text-red-600">
                                        {formatDate(selected.overdue_progress.overdue_start)}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* PARTICULARS */}
                        <div className="border rounded-xl p-4">
                            <h4 className="text-sm font-semibold mb-3">
                                Particulars
                            </h4>

                            {selected.particulars?.length ? (
                                <table className="w-full text-sm">
                                    <thead className="text-xs text-gray-500">
                                        <tr>
                                            <th className="text-left py-2">Particular</th>
                                            <th className="text-right py-2">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selected.particulars.map((p, i) => (
                                            <tr key={i} className="border-t">
                                                <td className="py-2">{p.Particulars}</td>
                                                <td className="py-2 text-right">
                                                    {formatCurrency(p.Amount)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-gray-400 text-sm">
                                    No particulars
                                </p>
                            )}
                        </div>

                        {/* ATTACHMENTS */}
                        <div>
                            <h4 className="text-sm font-semibold mb-2">
                                Attachments
                            </h4>

                            {selected.attachments?.length ? (
                                <div className="space-y-2">
                                    {selected.attachments.map((file, i) => (
                                        <div
                                            key={i}
                                            className="flex justify-between items-center border p-3 rounded-lg"
                                        >
                                            <span className="text-sm">
                                                {file.FileName}
                                            </span>

                                            <button
                                                onClick={() =>
                                                    window.open(file.file_url, "_blank")
                                                }
                                                className="text-indigo-600 text-sm"
                                            >
                                                View
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-sm">
                                    No attachments
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </Drawer>
        </div>
    );
}