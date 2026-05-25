"use client";

import { useEffect, useState } from "react";
import LiquidationTable from "@/components/liquidation/LiquidationTable";
import Drawer from "@/components/ui/Drawer";
import Pagination from "@/components/table/Pagination";
import CreateLiquidationModal from "@/components/employee/CreateLiquidationModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatCurrency } from "@/lib/format";

import Input from "@/components/ui/Input";
import CustomSelect from "@/components/ui/CustomSelect";

import {
    liquidationStatusOptions
} from "@/config/options";

import api from "@/services/api";

export default function EmployeeLiquidationPage() {

    const [data, setData] = useState([]);
    const [meta, setMeta] = useState(null);
    const [page, setPage] = useState(1);

    const [search, setSearch] = useState("");

    const [selectedStatus, setSelectedStatus] = useState("all");

    const [selected, setSelected] = useState(null);
    const [editingLiquidation, setEditingLiquidation] =
        useState(null);

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

                `/liquidations?page=${pageNumber}${search
                    ? `&search=${search}`
                    : ""
                }${selectedStatus !== "all"
                    ? `&status=${selectedStatus}`
                    : ""
                }`
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

    const handleEdit = async (item) => {

        try {

            const res = await api.get(
                `/liquidations/${item.id}`
            );

            setEditingLiquidation(res.data);

            setOpenCreate(true);

        } catch {

            showToast({
                title: "Error",
                message:
                    "Failed to load draft liquidation.",
                type: "error",
            });
        }
    };

    /* ================= EFFECT ================= */
    useEffect(() => {
        fetchLiquidations(page);
    }, [page, search, selectedStatus]);

    return (
        <div className="p-6 space-y-5">

            {/* HEADER */}
            <div className="
                flex
                items-center
                justify-between
                gap-4
            ">

                {/* LEFT */}
                <div>

                    <h1 className="
                        text-2xl
                        font-bold
                        text-gray-900
                    ">
                        Liquidation
                    </h1>

                    <p className="
                        text-sm
                        text-gray-500
                        mt-1
                    ">
                        Manage and monitor your
                        liquidation requests.
                    </p>

                </div>

                {/* RIGHT */}
                <div className="
                    flex
                    items-center
                    gap-3
                ">

                    {/* SEARCH */}
                    <div className="w-[260px]">

                        <Input
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search liquidation..."
                        />

                    </div>

                    {/* STATUS FILTER */}
                    <div className="w-[180px]">

                        <CustomSelect
                            value={selectedStatus}
                            onChange={setSelectedStatus}
                            options={liquidationStatusOptions}
                            placeholder="Filter Status"
                        />

                    </div>

                    {/* CREATE */}
                    <Button
                        onClick={() => {

                            setEditingLiquidation(null);

                            setOpenCreate(true);
                        }}

                        className="
                            h-11
                            px-5
                    
                            rounded-xl
                    
                            bg-indigo-600
                            hover:bg-indigo-700
                    
                            text-white
                            text-sm
                            font-medium
                    
                            shadow-sm
                    
                            transition
                    
                            whitespace-nowrap
                        "
                    >
                        <Plus className="w-4 h-4" />

                        Create Liquidation

                    </Button>

                </div>

            </div>

            {/* ================= TABLE ================= */}
            <LiquidationTable
                data={data}
                loading={loadingList}
                onView={handleView}
                onEdit={handleEdit}
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
                onClose={() => {

                    setOpenCreate(false);

                    setEditingLiquidation(null);
                }}

                onSuccess={() =>
                    fetchLiquidations(page)
                }

                editingLiquidation={
                    editingLiquidation
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

        <div className="h-24 bg-gray-100 rounded-2xl"></div>

        <div className="h-64 bg-gray-100 rounded-2xl"></div>

        <div className="h-32 bg-gray-100 rounded-2xl"></div>

    </div>

) : selected && (

    <div className="space-y-6">

        {/* ================= HEADER ================= */}

        <div className="
            rounded-2xl
            border
            bg-gradient-to-r
            from-indigo-50
            to-purple-50
            p-6
        ">

            <div className="
                flex
                items-start
                justify-between
                gap-4
            ">

                <div>

                    <p className="
                        text-xs
                        uppercase
                        tracking-wide
                        text-gray-500
                        font-medium
                    ">
                        Liquidation Reference
                    </p>

                    <h2 className="
                        text-xl
                        font-bold
                        text-gray-900
                        mt-1
                    ">
                        {selected.request_id}
                    </h2>

                </div>

                <StatusBadge
                    status={selected.status}
                />

            </div>

        </div>

        {/* ================= SUMMARY CARDS ================= */}

        <div className="
            grid
            grid-cols-2
            gap-4
        ">

            <div className="
                border
                rounded-2xl
                p-5
                bg-white
            ">

                <p className="
                    text-xs
                    uppercase
                    text-gray-500
                    font-medium
                ">
                    Cash Advance
                </p>

                <h3 className="
                    text-2xl
                    font-bold
                    text-gray-900
                    mt-2
                ">
                    {formatCurrency(
                        selected.cash_advance
                    )}
                </h3>

            </div>

            <div className="
                border
                rounded-2xl
                p-5
                bg-white
            ">

                <p className="
                    text-xs
                    uppercase
                    text-gray-500
                    font-medium
                ">
                    Total Expenses
                </p>

                <h3 className="
                    text-2xl
                    font-bold
                    text-indigo-600
                    mt-2
                ">
                    {formatCurrency(
                        selected.total_expenses
                    )}
                </h3>

            </div>

            <div className="
                border
                rounded-2xl
                p-5
                bg-green-50
                border-green-200
            ">

                <p className="
                    text-xs
                    uppercase
                    text-green-700
                    font-medium
                ">
                    Amount Returned
                </p>

                <h3 className="
                    text-2xl
                    font-bold
                    text-green-700
                    mt-2
                ">
                    {formatCurrency(
                        selected.amount_returned
                    )}
                </h3>

            </div>

            <div className="
                border
                rounded-2xl
                p-5
                bg-red-50
                border-red-200
            ">

                <p className="
                    text-xs
                    uppercase
                    text-red-700
                    font-medium
                ">
                    Reimbursement
                </p>

                <h3 className="
                    text-2xl
                    font-bold
                    text-red-700
                    mt-2
                ">
                    {formatCurrency(
                        selected.amount_reimbursement
                    )}
                </h3>

            </div>

        </div>

        {/* ================= PARTICULARS ================= */}

        <div className="
            border
            rounded-2xl
            overflow-hidden
            bg-white
        ">

            <div className="
                px-5
                py-4
                border-b
                bg-gray-50
            ">

                <h4 className="
                    text-sm
                    font-semibold
                    text-gray-900
                ">
                    Expense Particulars
                </h4>

                <p className="
                    text-xs
                    text-gray-500
                    mt-1
                ">
                    Detailed liquidation expenses and receipts.
                </p>

            </div>

            <div className="overflow-x-auto">

                <table className="w-full text-sm">

                    <thead className="
                        bg-gray-50
                        text-xs
                        uppercase
                        text-gray-500
                    ">

                        <tr>

                            <th className="text-left px-5 py-3">
                                Particular
                            </th>

                            <th className="text-left px-5 py-3">
                                OR Number
                            </th>

                            <th className="text-right px-5 py-3">
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
                                        className="
                                            border-t
                                            hover:bg-gray-50
                                            transition
                                        "
                                    >

                                        <td className="
                                            px-5
                                            py-4
                                            font-medium
                                            text-gray-800
                                        ">
                                            {p.particulars}
                                        </td>

                                        <td className="
                                            px-5
                                            py-4
                                            text-gray-600
                                        ">
                                            {p.or_no || "-"}
                                        </td>

                                        <td className="
                                            px-5
                                            py-4
                                            text-right
                                            font-semibold
                                            text-gray-900
                                        ">
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
                                    className="
                                        text-center
                                        py-10
                                        text-gray-400
                                    "
                                >
                                    No particulars found
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

        </div>

        {/* ================= REMARKS ================= */}

        {selected.remarks && (

            <div className="
                border
                rounded-2xl
                p-5
                bg-white
            ">

                <h4 className="
                    text-sm
                    font-semibold
                    text-gray-900
                    mb-3
                ">
                    Remarks
                </h4>

                <p className="
                    text-sm
                    text-gray-600
                    leading-relaxed
                ">
                    {selected.remarks}
                </p>

            </div>

        )}

    </div>

)}

            </Drawer>

        </div>
    );
}