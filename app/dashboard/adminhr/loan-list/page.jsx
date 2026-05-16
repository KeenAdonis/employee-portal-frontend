"use client";

import { useEffect, useState } from "react";
import LoanTable from "@/components/loan/LoanTable";
import AddLoanModal from "@/components/adminhr/AddLoanModal";
import Drawer from "@/components/ui/Drawer";
import Modal from "@/components/ui/Modal";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import api from "@/services/api";
import { useToast } from "@/components/ui/ToastProvider";

export default function Page() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState(null);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const [downloading, setDownloading] = useState(false);

    const { showToast } = useToast();

    /* =========================
       FETCH LOANS
    ========================= */
    const fetchLoans = async () => {
        try {

            setLoading(true);

            const res = await api.get("/loans");

            console.log("LOANS RESPONSE:", res.data);

            // ✅ SAME PATTERN SA REQUISITION
            setData(res.data.data.data || []);

        } catch (err) {
            console.error(err);

            showToast({
                title: "Error",
                message: "Failed to fetch loans",
                type: "error",
            });

        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchLoans();
    }, []);

    const handleDownload = async (loanId) => {
        try {
            setDownloading(true);

            const res = await api.get(`/loans/${loanId}/download`, {
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));

            const a = document.createElement("a");
            a.href = url;
            a.download = `loan-${loanId}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();

            window.URL.revokeObjectURL(url);

        } catch (err) {
            console.error(err);

            showToast({
                title: "Error",
                message: "Failed to download schedule",
                type: "error",
            });

        } finally {
            setDownloading(false);
        }
    };

    /* =========================
       ACTIONS
    ========================= */
    const handleView = (loan) => {
        setSelected(loan);
        setOpenDrawer(true);
    };

    const handleDelete = (loan) => {
        setSelected(loan);
        setDeleteOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`/loans/${selected.id}`);

            showToast({
                title: "Success",
                message: "Loan deleted",
                type: "success",
            });

            setDeleteOpen(false);
            fetchLoans();

        } catch (err) {
            showToast({
                title: "Error",
                message: "Delete failed",
                type: "error",
            });
        }
    };

    /* =========================
       HELPERS
    ========================= */
    const getEmployeeName = (loan) => {
        if (!loan.employee) return "—";
        return `${loan.employee.FirstName} ${loan.employee.LastName}`;
    };

    const getPerDeduction = (loan) => {
        if (!loan.monthly_amortization) return 0;

        return loan.cutoff_type === "both"
            ? loan.monthly_amortization / 2
            : loan.monthly_amortization;
    };

    return (
        <>

            {/* MAIN CONTENT */}
            <div className="p-6 space-y-6">

                {/* HEADER */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-semibold">Loan Management</h1>
                        <p className="text-sm text-gray-500">
                            Manage employee loans
                        </p>
                    </div>

                    <Button onClick={() => setOpenModal(true)}>
                        + Add Loan
                    </Button>
                </div>

                {/* ADD MODAL */}
                <AddLoanModal
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    onSuccess={fetchLoans}
                />

                {/* TABLE */}
                <LoanTable
                    data={data}
                    loading={loading}
                    onView={handleView}
                    onDelete={handleDelete}
                />

            </div>

            {/* ✅ DRAWER — NASA LABAS NA */}
            <Drawer
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                title="Loan Details"
                footer={
                    <div className="flex justify-end gap-2 w-full">

                        <button
                            onClick={() => setOpenDrawer(false)}
                            className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-50"
                        >
                            Close
                        </button>

                        <button
                            onClick={() => handleDownload(selected?.id)}
                            disabled={!selected || downloading}
                            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {downloading ? "Downloading..." : "Download Schedule"}
                        </button>

                    </div>
                }
            >
                {selected && (
                    <div className="space-y-6">

                        {/* EMPLOYEE */}
                        <div className="border rounded-2xl p-5 space-y-3">
                            <p className="text-xs text-gray-500">Employee</p>

                            <p className="font-semibold text-gray-900">
                                {getEmployeeName(selected)}
                            </p>

                            <p className="text-xs text-gray-500">
                                {selected.employee?.Position || "—"}
                            </p>
                        </div>

                        {/* LOAN INFO */}
                        <div className="border rounded-2xl p-5 space-y-4">

                            <div>
                                <p className="text-xs text-gray-500">Loan Type</p>
                                <p className="font-medium">{selected.loan_type}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">

                                <div>
                                    <p className="text-xs text-gray-500">Total</p>
                                    <p className="font-semibold">
                                        ₱ {Number(selected.total_amount).toLocaleString()}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">Balance</p>
                                    <p className="font-semibold text-red-600">
                                        ₱ {Number(selected.balance).toLocaleString()}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">Monthly</p>
                                    <p className="font-medium">
                                        ₱ {Number(selected.monthly_amortization).toLocaleString()}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">Per Deduction</p>
                                    <p className="font-medium text-indigo-600">
                                        ₱ {getPerDeduction(selected).toLocaleString()}
                                    </p>
                                </div>

                            </div>

                        </div>

                        {/* DETAILS */}
                        <div className="border rounded-2xl p-5 space-y-4">

                            <div>
                                <p className="text-xs text-gray-500">Cutoff Type</p>
                                <p className="font-medium uppercase">
                                    {selected.cutoff_type}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">Start Date</p>
                                <p className="font-medium">
                                    {formatDate(selected.start_date)}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">Status</p>
                                <p className="font-medium capitalize">
                                    {selected.status}
                                </p>
                            </div>

                        </div>

                    </div>
                )}
            </Drawer>

            {/* DELETE MODAL */}
            <Modal
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                title="Delete Loan"
                subtitle="This action cannot be undone"
                footer={
                    <div className="flex justify-end gap-2 w-full">
                        <button
                            onClick={() => setDeleteOpen(false)}
                            className="px-4 py-2 border rounded-lg"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={confirmDelete}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg"
                        >
                            Delete
                        </button>
                    </div>
                }
            >
                <p className="text-sm text-gray-600">
                    Are you sure you want to delete this loan?
                </p>
            </Modal>

        </>
    );
}