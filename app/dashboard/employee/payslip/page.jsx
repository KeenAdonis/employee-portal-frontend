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
    FileDown,
} from "lucide-react";

import {
    formatDate,
    formatDateForApi
} from "@/lib/format";


export default function Page() {

    const [loading, setLoading] = useState(true);

    const [data, setData] = useState([]);
    const [meta, setMeta] = useState(null);

    const [page, setPage] = useState(1);

    const [filterDate, setFilterDate] = useState("");

    const [selected, setSelected] = useState(null);

    const [openDrawer, setOpenDrawer] = useState(false);

    const { showToast } = useToast();

    const [downloadingPayslip, setDownloadingPayslip] =
        useState(false);

    /* =========================
       FETCH PAYROLL
    ========================= */
    const fetchPayroll = async (pageNumber = 1) => {

        try {

            setLoading(true);

            const params = new URLSearchParams({
                page: pageNumber,
            });

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
       EFFECTS
    ========================= */
    useEffect(() => {
        fetchPayroll(page);
    }, [page, filterDate]);

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
            
                <div className="w-full md:w-[260px]">

                    <CustomDatePicker
                        value={filterDate}
                        onChange={setFilterDate}
                        placeholder="Filter payroll date"
                    />

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

        </div>
    );
}