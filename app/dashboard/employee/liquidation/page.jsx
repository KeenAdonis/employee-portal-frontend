"use client";

import { useEffect, useState } from "react";
import LiquidationTable from "@/components/liquidation/LiquidationTable";
import Drawer from "@/components/ui/Drawer";
import Pagination from "@/components/table/Pagination";
import CreateLiquidationModal from "@/components/employee/CreateLiquidationModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
import { formatCurrency } from "@/lib/format";
import api from "@/services/api";

export default function EmployeeLiquidationPage() {

    const [data, setData] = useState([]);
    const [meta, setMeta] = useState(null);
    const [page, setPage] = useState(1);

    const [selected, setSelected] = useState(null);

    const [openDrawer, setOpenDrawer] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);

    const [loadingList, setLoadingList] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false);

    const { showToast } = useToast();

    /* ================= FETCH ================= */
    const fetchLiquidations = async (
        pageNumber = 1
    ) => {

        setLoadingList(true);

        try {

            const res = await api.get(
                `/liquidations?page=${pageNumber}`
            );

            setData(res.data.data.data || []);
            setMeta(res.data.data);

        } catch (err) {

            showToast({
                title: "Error",
                message:
                    "Failed to fetch liquidations",
                type: "error",
            });

        } finally {

            setLoadingList(false);

        }
    };

    /* ================= VIEW ================= */
    const handleView = async (item) => {

        setSelected(item);
        setOpenDrawer(true);

        setLoadingDetails(true);

        try {

            const res = await api.get(
                `/liquidations/${item.id}`
            );

            setSelected(res.data);

        } catch {

            showToast({
                title: "Error",
                message:
                    "Failed to load liquidation details",
                type: "error",
            });

        } finally {

            setLoadingDetails(false);

        }
    };

    /* ================= EFFECT ================= */
    useEffect(() => {
        fetchLiquidations(page);
    }, [page]);

    return (
        <div className="p-6 space-y-5">

            {/* ================= HEADER ================= */}
            <div className="flex items-center justify-between">

                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Liquidation
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Manage and monitor your
                        liquidation requests.
                    </p>
                </div>

                <Button
                    onClick={() =>
                        setOpenCreate(true)
                    }
                    className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Create Liquidation
                </Button>

            </div>

            {/* ================= TABLE ================= */}
            <LiquidationTable
                data={data}
                loading={loadingList}
                onView={handleView}
            />

            {/* ================= PAGINATION ================= */}
            <div className="flex justify-end">
                <Pagination
                    meta={meta}
                    onPageChange={setPage}
                />
            </div>

            {/* ================= CREATE MODAL ================= */}
            <CreateLiquidationModal
                open={openCreate}
                onClose={() =>
                    setOpenCreate(false)
                }
                onSuccess={() =>
                    fetchLiquidations(page)
                }
            />

            {/* ================= DETAILS DRAWER ================= */}
            <Drawer
                open={openDrawer}
                onClose={() =>
                    setOpenDrawer(false)
                }
                title="Liquidation Details"
            >

                {loadingDetails ? (

                    <div className="animate-pulse space-y-4">
                        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-24 bg-gray-200 rounded"></div>
                    </div>

                ) : selected && (

                    <div className="space-y-6">

                        {/* HEADER */}
                        <div className="border rounded-2xl p-5 space-y-2">

                            <p>
                                <strong>
                                    Reference:
                                </strong>{" "}
                                {selected.request_id}
                            </p>

                            <p>
                                <strong>
                                    Status:
                                </strong>{" "}
                                {selected.status}
                            </p>

                        </div>

                        {/* PARTICULARS */}
                        <div className="border rounded-2xl p-5">

                            <h4 className="text-sm font-semibold mb-3">
                                Particulars
                            </h4>

                            <div className="overflow-hidden border rounded-xl">

                                <table className="w-full text-sm">

                                    <thead className="bg-gray-50 text-xs text-gray-500">
                                        <tr>
                                            <th className="text-left px-4 py-2">
                                                Particular
                                            </th>

                                            <th className="text-left px-4 py-2">
                                                OR No
                                            </th>

                                            <th className="text-right px-4 py-2">
                                                Amount
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {selected.particulars?.length ? (

                                            selected.particulars.map(
                                                (p, i) => (
                                                    <tr
                                                        key={i}
                                                        className="border-t"
                                                    >

                                                        <td className="px-4 py-3">
                                                            {p.particulars}
                                                        </td>

                                                        <td className="px-4 py-3">
                                                            {p.or_no || "-"}
                                                        </td>

                                                        <td className="px-4 py-3 text-right font-medium">
                                                            {formatCurrency(
                                                                p.amount
                                                            )}
                                                        </td>

                                                    </tr>
                                                )
                                            )

                                        ) : (

                                            <tr>
                                                <td
                                                    colSpan="3"
                                                    className="text-center py-4 text-gray-400"
                                                >
                                                    No particulars
                                                </td>
                                            </tr>

                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                        {/* SUMMARY */}
                        <div className="border rounded-2xl p-5 text-sm space-y-2">

                            <p>
                                Cash Advance:
                                {" "}
                                <strong>
                                    {formatCurrency(
                                        selected.cash_advance
                                    )}
                                </strong>
                            </p>

                            <p>
                                Total Expenses:
                                {" "}
                                <strong>
                                    {formatCurrency(
                                        selected.total_expenses
                                    )}
                                </strong>
                            </p>

                            <p>
                                Returned:
                                {" "}
                                <strong>
                                    {formatCurrency(
                                        selected.amount_returned
                                    )}
                                </strong>
                            </p>

                            <p>
                                Reimbursement:
                                {" "}
                                <strong>
                                    {formatCurrency(
                                        selected.amount_reimbursement
                                    )}
                                </strong>
                            </p>

                        </div>

                    </div>

                )}

            </Drawer>

        </div>
    );
}