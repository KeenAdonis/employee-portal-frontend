"use client";

import { useEffect, useMemo, useState } from "react";
import PayrollTable from "@/components/payroll/PayrollTable";
import Drawer from "@/components/ui/Drawer";
import Pagination from "@/components/table/Pagination";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui/StatusBadge";
import CustomSelect from "@/components/ui/CustomSelect";
import CustomDatePicker from "@/components/ui/CustomDatePicker";
import { useToast } from "@/components/ui/ToastProvider";
import api from "@/services/api";
import {
    DownloadCloud,
    Search,
    FileDown,
} from "lucide-react";

import {
    formatDate,
    formatDateForApi
} from "@/lib/format";

import { useRouter } from "next/navigation";



export default function Page() {

    const [loading, setLoading] = useState(true);

    const [data, setData] = useState([]);
    const [meta, setMeta] = useState(null);

    const [page, setPage] = useState(1);

    const [search, setSearch] = useState("");
    const [filterDate, setFilterDate] = useState("");

    const [selected, setSelected] = useState(null);

    const [openDrawer, setOpenDrawer] = useState(false);

    const [downloadOpen, setDownloadOpen] = useState(false);

    const [cutoffDate, setCutoffDate] = useState("");

    const { showToast } = useToast();

    const [downloadingPayslip, setDownloadingPayslip] =
        useState(false);

    const router = useRouter();

    /* =========================
       FETCH PAYROLL
    ========================= */
    const fetchPayroll = async (pageNumber = 1) => {

        try {

            setLoading(true);

            const params = new URLSearchParams({
                page: pageNumber,
            });

            if (search) {
                params.append("search", search);
            }

            if (filterDate) {

                const formattedDate =
                    formatDateForApi(filterDate);

                if (formattedDate) {
                    params.append(
                        "date_from",
                        formattedDate
                    );
                }
            }

            const res = await api.get(`/payroll?${params.toString()}`);

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

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    /* =========================
       DOWNLOAD REPORT
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

        const url =
            `${process.env.NEXT_PUBLIC_API_URL}/payroll/export?${params.toString()}`;

        window.open(url, "_blank");

        setDownloadOpen(false);
    };

    /* =========================
       DOWNLOAD PAYSLIP
    ========================= */
    const handleDownloadPayslip = async () => {

        try {

            if (!selected) return;

            setDownloadingPayslip(true);

            const response = await api.get(
                `/payroll/${selected.id}/payslip`,
                {
                    responseType: "blob",
                }
            );

            const blob = new Blob(
                [response.data],
                {
                    type: "application/pdf",
                }
            );

            const url =
                window.URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                `Payslip-${selected.EmployeeNo}.pdf`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

            showToast({
                title: "Success",
                message: "Payslip downloaded",
                type: "success",
            });

        } catch (error) {

            console.error(error);

            showToast({
                title: "Error",
                message: "Failed to download payslip",
                type: "error",
            });

        } finally {

            setDownloadingPayslip(false);
        }
    };

    /* =========================
       CUTOFF OPTIONS
    ========================= */
    const formatLabel = (date) =>
        date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });

    const getCutoffOptions = () => {

        const options = [];

        const today = new Date();

        const format = (d) => {

            const year = d.getFullYear();

            const month = String(
                d.getMonth() + 1
            ).padStart(2, "0");

            const day = String(
                d.getDate()
            ).padStart(2, "0");

            return `${year}-${month}-${day}`;
        };

        for (let i = 0; i < 6; i++) {

            const base = new Date(
                today.getFullYear(),
                today.getMonth() - i
            );

            const year = base.getFullYear();

            const month = base.getMonth();

            const firstCutoff = new Date(year, month, 15);

            const lastCutoff = new Date(year, month + 1, 0);

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

    const cutoffOptions = useMemo(
        () => getCutoffOptions(),
        []
    );

    /* =========================
       EFFECTS
    ========================= */
    useEffect(() => {
        fetchPayroll(page);
    }, [page, search, filterDate]);

    return (
        <div className="p-6">

            {/* HEADER */}
            <div className="
                flex
                flex-col
                lg:flex-row
                lg:items-center
                lg:justify-between
                gap-4
                mb-6
            ">

                <div className="
                    flex
                    flex-col
                    md:flex-row
                    gap-3
                    flex-1
                ">

                    {/* DATE FILTER */}
                    <div className="w-full md:w-[260px]">
                        <CustomDatePicker
                            value={filterDate}
                            onChange={setFilterDate}
                            placeholder="Filter payroll date"
                        />
                    </div>

                    {/* SEARCH */}
                    <div className="relative flex-1">

                        <Search className="
                            absolute
                            left-3
                            top-1/2
                            -translate-y-1/2
                            w-4
                            h-4
                            text-gray-400
                        " />

                        <input
                            type="text"
                            placeholder="Search employee..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            className="
                                h-11
                                w-full
                                rounded-xl
                                border
                                border-gray-200
                                bg-white
                                pl-10
                                pr-4
                                text-sm
                                outline-none
                                transition-all
                                focus:ring-2
                                focus:ring-indigo-100
                                focus:border-indigo-400
                            "
                        />

                    </div>

                </div>

                {/* ACTIONS */}
                <div className="flex items-center gap-2">

                    <Button
                        variant="outline"
                        onClick={() => setDownloadOpen(true)}
                        className="
                            h-11
                            rounded-xl
                        "
                    >
                        <DownloadCloud className="w-4 h-4 mr-2" />
                        Export
                    </Button>

                    <Button
                        onClick={() =>
                            router.push(
                                "/dashboard/adminhr/payroll-create"
                            )
                        }
                        className="
                            h-11
                            rounded-xl
                            bg-indigo-600
                            hover:bg-indigo-700
                        "
                    >
                        + Create Payroll
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

            {/* PAYROLL DRAWER */}
            <Drawer
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                title="Payroll Details"

                footer={
                    <div className="flex gap-3 w-full">

                        <Button
                            variant="outline"
                            className="
                                flex-1
                                h-11
                                rounded-xl
                            "
                            onClick={() =>
                                setOpenDrawer(false)
                            }
                        >
                            Close
                        </Button>

                        <Button
                            onClick={handleDownloadPayslip}
                            disabled={downloadingPayslip}
                            className="
                                flex-1
                                h-11
                                rounded-xl
                                bg-indigo-600
                                hover:bg-indigo-700
                            "
                        >
                            <FileDown className="w-4 h-4 mr-2" />

                            {downloadingPayslip
                                ? "Downloading..."
                                : "Download Payslip"}
                        </Button>

                    </div>
                }
            >

                {selected && (

                    <div className="space-y-5">

                        {/* EMPLOYEE */}
                        <div className="
                            border
                            rounded-2xl
                            p-5
                            bg-white
                        ">

                            <div className="
                                flex
                                items-start
                                justify-between
                                mb-5
                            ">

                                <div>

                                    <h3 className="
                                        text-lg
                                        font-semibold
                                        text-gray-900
                                    ">
                                        {selected.EmployeeName}
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        {selected.EmployeeNo}
                                    </p>

                                </div>

                                <StatusBadge
                                    status={selected.status || "Completed"}
                                    size="sm"
                                />

                            </div>

                            <div className="
                                grid
                                grid-cols-2
                                gap-4
                                text-sm
                            ">

                                <div>
                                    <p className="text-gray-500 text-xs">
                                        Position
                                    </p>

                                    <p className="font-medium">
                                        {selected.Position}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-xs">
                                        Pay Date
                                    </p>

                                    <p className="font-medium">
                                        {formatDate(selected.PayDate)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-xs">
                                        Gross Pay
                                    </p>

                                    <p className="font-semibold text-green-600">
                                        ₱ {selected.Gross}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-xs">
                                        Net Pay
                                    </p>

                                    <p className="font-semibold text-indigo-600">
                                        ₱ {selected.NetPay}
                                    </p>
                                </div>

                            </div>

                        </div>

                        {/* EARNINGS */}
                        <div className="
                            border
                            rounded-2xl
                            p-5
                            bg-white
                        ">

                            <h3 className="
                                text-sm
                                font-semibold
                                text-gray-900
                                mb-4
                            ">
                                Earnings
                            </h3>

                            <div className="
                                grid
                                grid-cols-2
                                gap-4
                                text-sm
                            ">

                                <div>
                                    Overtime:
                                    <span className="float-right font-medium">
                                        ₱ {selected.TotalOvertime}
                                    </span>
                                </div>

                                <div>
                                    Holiday Pay:
                                    <span className="float-right font-medium">
                                        ₱ {selected.TotalPerDay}
                                    </span>
                                </div>

                                <div>
                                    Allowances:
                                    <span className="float-right font-medium">
                                        ₱ {selected.TotalDeMinimis}
                                    </span>
                                </div>

                            </div>

                        </div>

                        {/* GOVERNMENT */}
                        <div className="
                            border
                            rounded-2xl
                            p-5
                            bg-white
                        ">

                            <h3 className="
                                text-sm
                                font-semibold
                                text-gray-900
                                mb-4
                            ">
                                Government Deductions
                            </h3>

                            <div className="
                                grid
                                grid-cols-2
                                gap-4
                                text-sm
                            ">

                                <div>
                                    SSS
                                    <span className="float-right font-medium">
                                        ₱ {selected.SSS}
                                    </span>
                                </div>

                                <div>
                                    PhilHealth
                                    <span className="float-right font-medium">
                                        ₱ {selected.PhilHealth}
                                    </span>
                                </div>

                                <div>
                                    Pagibig
                                    <span className="float-right font-medium">
                                        ₱ {selected.Pagibig}
                                    </span>
                                </div>

                                <div>
                                    Tax
                                    <span className="float-right font-medium">
                                        ₱ {selected.Tax}
                                    </span>
                                </div>

                                <div>
                                    HMO
                                    <span className="float-right font-medium">
                                        ₱ {selected.HMO}
                                    </span>
                                </div>

                            </div>

                        </div>

                        {/* LOANS */}
                        <div className="
                            border
                            rounded-2xl
                            p-5
                            bg-white
                        ">

                            <h3 className="
                                text-sm
                                font-semibold
                                text-gray-900
                                mb-4
                            ">
                                Loan Deductions
                            </h3>

                            <div className="
                                grid
                                grid-cols-2
                                gap-4
                                text-sm
                            ">

                                <div>
                                    Salary Loan
                                    <span className="float-right font-medium">
                                        ₱ {selected.SalaryLoanPayment}
                                    </span>
                                </div>

                                <div>
                                    Laptop Loan
                                    <span className="float-right font-medium">
                                        ₱ {selected.LaptopLoanPayment}
                                    </span>
                                </div>

                                <div>
                                    SSS Loan
                                    <span className="float-right font-medium">
                                        ₱ {selected.SSSPersonalLoanPayment}
                                    </span>
                                </div>

                                <div>
                                    Pagibig Loan
                                    <span className="float-right font-medium">
                                        ₱ {selected.PagibigPersonalLoanPayment}
                                    </span>
                                </div>

                            </div>

                        </div>

                    </div>
                )}

            </Drawer>

            {/* EXPORT DRAWER */}
            <Drawer
                open={downloadOpen}
                onClose={() => setDownloadOpen(false)}
                title="Download Payroll Report"

                footer={
                    <div className="w-full flex gap-3">

                        <Button
                            variant="outline"
                            onClick={() =>
                                setDownloadOpen(false)
                            }
                            className="
                                flex-1
                                h-11
                                rounded-xl
                            "
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={handleDownload}
                            className="
                                flex-1
                                h-11
                                rounded-xl
                            "
                        >
                            Download
                        </Button>

                    </div>
                }
            >

                <div className="space-y-6">

                    <div className="
                        border
                        rounded-2xl
                        p-5
                        space-y-4
                    ">

                        <div>

                            <h3 className="
                                text-sm
                                font-semibold
                                text-gray-900
                            ">
                                Payroll Date Range
                            </h3>

                            <p className="
                                text-xs
                                text-gray-500
                            ">
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