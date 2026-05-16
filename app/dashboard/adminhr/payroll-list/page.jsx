"use client";

import { useEffect, useState } from "react";
import PayrollTable from "@/components/payroll/PayrollTable";
import Drawer from "@/components/ui/Drawer";
import Pagination from "@/components/table/Pagination";
import Tabs from "@/components/ui/Tabs";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui/StatusBadge";
import CustomSelect from "@/components/ui/CustomSelect";
import { useToast } from "@/components/ui/ToastProvider";
import api from "@/services/api";
import { DownloadCloud } from "lucide-react";
import { formatDate } from "@/lib/format";
import { useRouter } from "next/navigation";
import { useMemo } from "react";



export default function Page() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState(null);
    const [page, setPage] = useState(1);
    const [tab, setTab] = useState("all");

    const [selected, setSelected] = useState(null);
    const [openDrawer, setOpenDrawer] = useState(false);

    const { showToast } = useToast();

    const router = useRouter();

    const [downloadOpen, setDownloadOpen] = useState(false);



    const [cutoffDate, setCutoffDate] = useState("");

    /* =========================
       FETCH PAYROLL
    ========================= */
    const fetchPayroll = async (pageNumber = 1) => {
        try {

            setLoading(true);

            const res = await api.get(`/payroll?page=${pageNumber}`);

            setData(res.data.data.data || []);
            setMeta(res.data.data);

        } catch (err) {
            console.error(err);
            showToast({
                title: "Error",
                message: "Failed to fetch payroll",
                type: "error",
            });

        } finally {
            setLoading(false);
        }
    };

    /* =========================
       VIEW
    ========================= */
    const handleView = (item) => {
        setSelected(item);
        setOpenDrawer(true);
    };

    /* =========================
       PAGINATION
    ========================= */
    const handlePageChange = (newPage) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    /* =========================
       DOWNLOAD (SIMPLE VERSION)
    ========================= */
    const handleDownload = () => {
        if (!cutoffDate) {
            showToast({
                title: "Warning",
                message: "Please select cutoff",
                type: "warning",
            });
            return;
        }

        const params = new URLSearchParams({
            from: cutoffDate,
        });

        const url = `http://127.0.0.1:8000/api/payroll/export?${params.toString()}`;

        window.open(url, "_blank");

        setDownloadOpen(false);
    };

    const formatLabel = (date) =>
        date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });

    const getCutoffOptions = () => {
        const options = [];
        const today = new Date();

        // ✅ safer formatter (no timezone bug)
        const format = (d) => {
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        };

        // 🔥 latest first
        for (let i = 0; i < 6; i++) {
            const base = new Date(today.getFullYear(), today.getMonth() - i);

            const year = base.getFullYear();
            const month = base.getMonth();

            const firstCutoff = new Date(year, month, 15);
            const lastCutoff = new Date(year, month + 1, 0);

            // 🔥 use your formatter (clean UI)
            options.push({
                label: `15 (${formatLabel(firstCutoff)})`,
                value: format(firstCutoff),
            });

            options.push({
                label: `${lastCutoff.getDate()} (${formatLabel(lastCutoff)})`,
                value: format(lastCutoff),
            });
        }

        return options;
    };

    const cutoffOptions = useMemo(() => getCutoffOptions(), []);

    /* =========================
       EFFECTS
    ========================= */
    useEffect(() => {
        fetchPayroll(page);
    }, [page]);

    return (
        <div className="p-6">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">

                {/* LEFT: TABS */}
                <Tabs value={tab} onChange={setTab} />

                {/* RIGHT: ACTIONS */}
                <div className="flex items-center gap-2">

                    {/* CREATE PAYROLL */}
                    <Button
                        onClick={() => router.push("/dashboard/adminhr/payroll-create")}
                        className="
                            bg-indigo-600 text-white
                            px-4 py-2 rounded-lg
                            shadow-md shadow-indigo-500/30
                            hover:bg-indigo-500
                            hover:shadow-lg hover:shadow-indigo-500/40
                            active:scale-[0.98]
                            transition-all duration-200
                        "
                    >
                        + Create Payroll
                    </Button>

                    <Button
                        onClick={() => setDownloadOpen(true)}
                        className="
                            bg-gradient-to-r from-amber-400 to-amber-500
                            text-white
                            px-4 py-2 rounded-lg
                            shadow-md shadow-amber-500/30
                            hover:from-amber-300 hover:to-amber-400
                            hover:shadow-lg hover:shadow-amber-500/40
                            active:scale-[0.98]
                            transition-all duration-200
                        "
                    >
                        Download
                    </Button>

                </div>


            </div>


            {/* TABLE */}
            <PayrollTable
                data={data}
                loading={loading}
                onView={handleView}
            />

            {/* PAGINATION */}
            <div className="mt-4 flex justify-end">
                <Pagination
                    meta={meta}
                    onPageChange={handlePageChange}
                />
            </div>

            {/* DRAWER */}
            <Drawer
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                title="Payroll Details"
            >
                {selected && (
                    <div className="space-y-6">

                        {/* HEADER */}
                        <div className="border rounded-2xl p-5 space-y-4">

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        {selected.EmployeeName}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        {selected.EmployeeNo}
                                    </p>
                                </div>

                                <StatusBadge status={selected.status || "Processed"} size="sm" />
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">

                                <div>
                                    <p className="text-gray-500 text-xs">Pay Date</p>
                                    <p className="font-medium">{formatDate(selected.PayDate)}</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-xs">Monthly Salary</p>
                                    <p className="font-medium">₱ {selected.MonthlySalary}</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-xs">Gross</p>
                                    <p className="font-semibold text-green-600">
                                        ₱ {selected.Gross}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-xs">Net Pay</p>
                                    <p className="font-semibold text-blue-600">
                                        ₱ {selected.NetPay}
                                    </p>
                                </div>

                            </div>

                        </div>

                        {/* BREAKDOWN */}
                        <div className="border rounded-2xl p-5 space-y-4">

                            <h3 className="text-sm font-semibold text-gray-900">
                                Government Deductions
                            </h3>

                            <div className="grid grid-cols-2 gap-4 text-sm">

                                <div>SSS: ₱ {selected.SSS}</div>
                                <div>PhilHealth: ₱ {selected.PhilHealth}</div>
                                <div>Pagibig: ₱ {selected.Pagibig}</div>
                                <div>Tax: ₱ {selected.Tax}</div>

                            </div>

                        </div>

                    </div>
                )}
            </Drawer>

            <Drawer
                open={downloadOpen}
                onClose={() => setDownloadOpen(false)}
                title="Download Payroll Report"

                footer={
                    <div className="w-full flex gap-3">
                        <button
                            onClick={() => setDownloadOpen(false)}
                            className="flex-1 py-3 text-sm border rounded-xl"
                        >
                            Cancel
                        </button>

                        <Button
                            onClick={handleDownload}
                            className="flex-1 h-12"
                        >
                            Download
                        </Button>
                    </div>
                }
            >
                <div className="space-y-6">

                    {/* DATE RANGE */}
                    <div className="border rounded-2xl p-5 space-y-4">

                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">
                                Payroll Date Range
                            </h3>
                            <p className="text-xs text-gray-500">
                                Select payroll coverage
                            </p>
                        </div>

                        <CustomSelect
                            label="Select Cutoff"
                            value={cutoffDate}
                            onChange={setCutoffDate}
                            options={cutoffOptions}
                        />

                    </div>

                </div>
            </Drawer>

        </div>
    );
}
