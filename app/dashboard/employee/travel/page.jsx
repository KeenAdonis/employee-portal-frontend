"use client";

import { useEffect, useState } from "react";

import TravelRequestTable from "@/components/travel/TravelRequestTable";

import CreateTravelModal from "@/components/employee/CreateTravelModal";

import Drawer from "@/components/ui/Drawer";
import Pagination from "@/components/table/Pagination";
import StatusBadge from "@/components/ui/StatusBadge";
import Tabs from "@/components/ui/Tabs";

import { useToast } from "@/components/ui/ToastProvider";

import { formatDate } from "@/lib/format";

import api from "@/services/api";

import {
    Eye,
    Paperclip,
    Plus,
} from "lucide-react";

export default function Page() {

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState(null);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);
    const [meta, setMeta] = useState(null);
    const [page, setPage] = useState(1);
    const [tab, setTab] = useState("requests");
    const { showToast } = useToast();

    /*
    |--------------------------------------------------------------------------
    | FETCH
    |--------------------------------------------------------------------------
    */
    const fetchTravelRequests = async (
        pageNumber = 1
    ) => {

        try {

            setLoading(true);

            let statusFilter =
                tab === "requests"
                    ? "Pending"
                    : "Approved,Rejected,Liquidated";

            const res = await api.get(
                `/travel/requests?page=${pageNumber}&status=${statusFilter}`
            );

            setData(
                res.data.data.data || []
            );

            setMeta(
                res.data.data
            );

        } catch (err) {

            console.error(err);

            showToast({
                title: "Error",
                message:
                    "Failed to fetch travel requests",
                type: "error",
            });

        } finally {

            setLoading(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | VIEW
    |--------------------------------------------------------------------------
    */
    const handleView = (item) => {

        setSelected(item);

        setOpenDrawer(true);
    };

    /*
    |--------------------------------------------------------------------------
    | EFFECTS
    |--------------------------------------------------------------------------
    */
    useEffect(() => {

        fetchTravelRequests(page);

    }, [page, tab]);

    useEffect(() => {

        setPage(1);

    }, [tab]);

    return (

        <div className="p-6">

            {/* HEADER */}
            <div
                className="
                    mb-4
                    flex
                    items-center
                    justify-between
                "
            >

                <Tabs
                    value={tab}
                    onChange={setTab}
                />

                {/* CREATE BUTTON */}
                <button
                    onClick={() =>
                        setCreateOpen(true)
                    }
                    className="
                        h-11
                        px-5
                        rounded-xl
                        bg-indigo-600
                        text-white
                        hover:bg-indigo-700
                        transition
                        flex
                        items-center
                        gap-2
                        font-medium
                    "
                >

                    <Plus className="w-4 h-4" />

                    Create Travel Request

                </button>

            </div>

            {/* TABLE */}
            <TravelRequestTable
                data={data}
                loading={loading}
                onView={handleView}
                employeeView={true}
            />

            {/* PAGINATION */}
            <div className="mt-4 flex justify-end">

                <Pagination
                    meta={meta}
                    onPageChange={setPage}
                />

            </div>

            {/* DRAWER */}
            <Drawer
                open={openDrawer}
                onClose={() =>
                    setOpenDrawer(false)
                }
                title="Travel Request Details"
            >

                {selected && (

                    <div className="space-y-6">

                        {/* MAIN CARD */}
                        <div
                            className="
                                border
                                rounded-2xl
                                p-5
                                space-y-4
                            "
                        >

                            <div
                                className="
                                    flex
                                    justify-between
                                    items-start
                                "
                            >

                                <div>

                                    <h3
                                        className="
                                            font-semibold
                                            text-gray-900
                                        "
                                    >
                                        {
                                            selected.travel_no
                                        }
                                    </h3>

                                    <p
                                        className="
                                            text-xs
                                            text-gray-500
                                        "
                                    >
                                        {
                                            selected.employee
                                                ? [
                                                    selected.employee.FirstName,
                                                    selected.employee.MiddleInitial,
                                                    selected.employee.LastName,
                                                ]
                                                    .filter(Boolean)
                                                    .join(" ")
                                                : "Unknown Employee"
                                        }
                                    </p>

                                </div>

                                <StatusBadge
                                    status={
                                        selected.status
                                    }
                                    size="sm"
                                />

                            </div>

                            {/* DETAILS */}
                            <div
                                className="
                                    grid
                                    grid-cols-2
                                    gap-6
                                    text-sm
                                "
                            >

                                <div>

                                    <p
                                        className="
                                            text-gray-500
                                            text-xs
                                        "
                                    >
                                        Destination
                                    </p>

                                    <p
                                        className="
                                            font-medium
                                            text-gray-900
                                        "
                                    >
                                        {
                                            selected.destination
                                        }
                                    </p>

                                </div>

                                <div>

                                    <p
                                        className="
                                            text-gray-500
                                            text-xs
                                        "
                                    >
                                        Transportation
                                    </p>

                                    <p
                                        className="
                                            font-medium
                                            text-gray-900
                                        "
                                    >
                                        {
                                            selected.transportation_type
                                        }
                                    </p>

                                </div>

                                <div>

                                    <p
                                        className="
                                            text-gray-500
                                            text-xs
                                        "
                                    >
                                        Departure
                                    </p>

                                    <p
                                        className="
                                            font-medium
                                            text-gray-900
                                        "
                                    >
                                        {formatDate(
                                            selected.departure_datetime
                                        )}
                                    </p>

                                </div>

                                <div>

                                    <p
                                        className="
                                            text-gray-500
                                            text-xs
                                        "
                                    >
                                        Return
                                    </p>

                                    <p
                                        className="
                                            font-medium
                                            text-gray-900
                                        "
                                    >
                                        {formatDate(
                                            selected.return_datetime
                                        )}
                                    </p>

                                </div>

                                <div>

                                    <p
                                        className="
                                            text-gray-500
                                            text-xs
                                        "
                                    >
                                        Total Days
                                    </p>

                                    <p
                                        className="
                                            font-medium
                                            text-gray-900
                                        "
                                    >
                                        {
                                            selected.total_days
                                        }
                                    </p>

                                </div>

                            </div>

                            {/* PURPOSE */}
                            <div>

                                <p
                                    className="
                                        text-gray-500
                                        text-xs
                                    "
                                >
                                    Purpose
                                </p>

                                <p
                                    className="
                                        text-sm
                                        text-gray-900
                                    "
                                >
                                    {
                                        selected.purpose
                                    }
                                </p>

                            </div>

                            {/* PERSONAL VEHICLE */}
                            {selected.transportation_type ===
                                "personal_vehicle" && (

                                    <div
                                        className="
                                        border-t
                                        pt-4
                                        grid
                                        grid-cols-2
                                        gap-6
                                        text-sm
                                    "
                                    >

                                        <div>

                                            <p
                                                className="
                                                text-gray-500
                                                text-xs
                                            "
                                            >
                                                Plate Number
                                            </p>

                                            <p
                                                className="
                                                font-medium
                                            "
                                            >
                                                {
                                                    selected.plate_number
                                                }
                                            </p>

                                        </div>

                                        <div>

                                            <p
                                                className="
                                                text-gray-500
                                                text-xs
                                            "
                                            >
                                                Fuel Type
                                            </p>

                                            <p
                                                className="
                                                font-medium
                                            "
                                            >
                                                {
                                                    selected.fuel_type
                                                }
                                            </p>

                                        </div>

                                        <div>

                                            <p
                                                className="
                                                text-gray-500
                                                text-xs
                                            "
                                            >
                                                Fuel Consumption
                                            </p>

                                            <p
                                                className="
                                                font-medium
                                            "
                                            >
                                                {
                                                    selected.fuel_consumption
                                                } km/L
                                            </p>

                                        </div>

                                    </div>

                                )}

                        </div>

                        {/* ATTACHMENTS */}
                        {selected.attachments
                            ?.length ? (

                            <div className="space-y-2">

                                {selected.attachments.map(
                                    (
                                        file,
                                        index
                                    ) => (

                                        <div
                                            key={index}
                                            className="
                                                flex
                                                items-center
                                                justify-between
                                                border
                                                rounded-xl
                                                p-4
                                                hover:shadow-sm
                                                transition
                                            "
                                        >

                                            {/* LEFT */}
                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-3
                                                "
                                            >

                                                <div
                                                    className="
                                                        w-10
                                                        h-10
                                                        flex
                                                        items-center
                                                        justify-center
                                                        rounded-lg
                                                        bg-gray-100
                                                    "
                                                >
                                                    <Paperclip />
                                                </div>

                                                <div>

                                                    <p
                                                        className="
                                                            text-sm
                                                            font-medium
                                                            text-gray-900
                                                        "
                                                    >
                                                        {
                                                            file.file_name
                                                        }
                                                    </p>

                                                    <p
                                                        className="
                                                            text-xs
                                                            text-gray-500
                                                        "
                                                    >
                                                        {
                                                            file.mime_type
                                                        }
                                                    </p>

                                                </div>

                                            </div>

                                            {/* RIGHT */}
                                            <button
                                                onClick={() =>
                                                    window.open(
                                                        file.file_url,
                                                        "_blank"
                                                    )
                                                }
                                                className="
                                                    p-2
                                                    hover:bg-gray-100
                                                    rounded-lg
                                                "
                                            >

                                                <Eye
                                                    className="
                                                        w-4
                                                        h-4
                                                    "
                                                />

                                            </button>

                                        </div>

                                    )
                                )}

                            </div>

                        ) : (

                            <div
                                className="
                                    text-center
                                    py-6
                                    text-gray-400
                                    text-sm
                                "
                            >
                                No attachments uploaded
                            </div>

                        )}

                    </div>

                )}

            </Drawer>

            {/* CREATE MODAL */}
            <CreateTravelModal
                open={createOpen}
                onClose={() =>
                    setCreateOpen(false)
                }
                onSuccess={() =>
                    fetchTravelRequests(page)
                }
            />

        </div>
    );
}