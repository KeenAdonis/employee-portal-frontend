"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

import DataTable from "@/components/table/DataTable";
import Pagination from "@/components/table/Pagination";

import Input from "@/components/ui/Input";
import CustomSelect from "@/components/ui/CustomSelect";
import StatusBadge from "@/components/ui/StatusBadge";

import { useToast } from "@/components/ui/ToastProvider";
import { getInitials } from "@/lib/utils";
import { formatDate } from "@/lib/format";
import { logActionOptions, logStatusOptions } from "@/config/options";

/* =========================
   FILTER OPTIONS
========================= */

export default function LogsPage() {
    const [logs, setLogs] = useState([]);
    const [meta, setMeta] = useState(null);
    const [page, setPage] = useState(1);

    const [search, setSearch] = useState("");
    const [action, setAction] = useState("");
    const [status, setStatus] = useState("");

    const [loading, setLoading] = useState(false);

    const { showToast } = useToast();

    /* ================= FETCH ================= */
    const fetchLogs = async (pageNumber = 1) => {
        try {
            setLoading(true);

            const res = await api.get("/logs", {
                params: {
                    page: pageNumber,
                    search,
                    action,
                    status,
                },
            });

            setLogs(res?.data?.data?.data || []);
            setMeta(res?.data?.data);

        } catch (err) {
            showToast({
                title: "Error",
                message: "Failed to fetch logs",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs(page);
    }, [page, search, action, status]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    /* ================= TABLE ================= */
    const columns = [
        "Full Name",
        "Email",
        "Action",
        "Status",
        "Message",
        "Date",
    ];

    return (
        <div className="p-6 space-y-6">

            {/* HEADER */}
            <div>
                <h1 className="text-xl font-semibold text-gray-900">
                    Audit Logs
                </h1>
                <p className="text-sm text-gray-500">
                    Track all document activities
                </p>
            </div>

            {/* FILTERS */}
            <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">

                <div className="flex gap-3 w-full md:w-auto">

                    <Input
                        placeholder="Search employee, email..."
                        value={search}
                        onChange={(e) => {
                            setPage(1);
                            setSearch(e.target.value);
                        }}
                        className="w-full md:w-80"
                    />

                    <CustomSelect
                        value={action}
                        options={logActionOptions}
                        onChange={(value) => {
                            setPage(1);
                            setAction(value);
                        }}
                        className="w-40"
                    />

                    <CustomSelect
                        value={status}
                        options={logStatusOptions}
                        onChange={(value) => {
                            setPage(1);
                            setStatus(value);
                        }}
                        className="w-40"
                    />

                </div>

            </div>

            {/* TABLE */}
            <DataTable
                columns={columns}
                data={logs}
                loading={loading}
                renderRow={(log) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition">

                        {/* EMPLOYEE */}
                        <td className="px-4 py-3">
                            <div className="flex items-center gap-3">

                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex items-center justify-center text-sm font-semibold">
                                    {getInitials(log.employee_name || "—")}
                                </div>

                                <div className="font-medium text-gray-900">
                                    {log.employee_name || "—"}
                                </div>

                            </div>
                        </td>

                        {/* EMAIL */}
                        <td className="px-4 py-3 text-sm text-gray-600">
                            {log.email || "—"}
                        </td>

                        {/* ACTION */}
                        <td className="px-4 py-3">
                            <StatusBadge status={log.action} />
                        </td>

                        {/* STATUS */}
                        <td className="px-4 py-3">
                            <StatusBadge status={log.status} />
                        </td>

                        {/* MESSAGE */}
                        <td className="px-4 py-3 text-sm text-gray-600">
                            {log.message || "—"}
                        </td>

                        {/* DATE */}
                        <td className="px-4 py-3 text-sm text-gray-500">
                            {formatDate(log.created_at)}
                        </td>

                    </tr>
                )}
            />

            {/* PAGINATION */}
            <div className="flex justify-end">
                <Pagination meta={meta} onPageChange={handlePageChange} />
            </div>

        </div>
    );
}