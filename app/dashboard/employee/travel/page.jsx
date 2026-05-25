"use client";

import { useEffect, useState } from "react";

import TravelRequestTable from "@/components/travel/TravelRequestTable";

import CreateTravelModal from "@/components/employee/CreateTravelModal";

import Drawer from "@/components/ui/Drawer";
import Modal from "@/components/ui/Modal";
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
    const [cancelOpen, setCancelOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [selectedTravel, setSelectedTravel] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [meta, setMeta] = useState(null);
    const [page, setPage] = useState(1);
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

            const res = await api.get(
                `/travel/requests?page=${pageNumber}`
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

    const handleOpenCancel = (item) => {

        setSelectedTravel(item);

        setCancelOpen(true);
    };

    const handleComplete = async (id) => {

        try {

            setActionLoading(true);

            await api.patch(
                `/travel/requests/${id}/complete`
            );

            showToast({
                title: "Success",
                message:
                    "Travel marked as completed.",
                type: "success",
            });

            fetchTravelRequests(page);

        } catch (err) {

            showToast({
                title: "Error",
                message:
                    err?.response?.data?.message
                    ||
                    "Failed to complete travel.",
                type: "error",
            });

        } finally {

            setActionLoading(false);
        }
    };

    const handleCancel = async () => {

        try {

            setActionLoading(true);

            await api.patch(
                `/travel/requests/${selectedTravel.id}/cancel`,
                {
                    cancellation_reason:
                        cancelReason,
                }
            );

            showToast({
                title: "Success",
                message:
                    "Travel request cancelled.",
                type: "success",
            });

            fetchTravelRequests(page);

            setCancelOpen(false);

            setCancelReason("");

            setSelectedTravel(null);

        } catch (err) {

            showToast({
                title: "Error",
                message:
                    err?.response?.data?.message
                    ||
                    "Failed to cancel request.",
                type: "error",
            });

        } finally {

            setActionLoading(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | EFFECTS
    |--------------------------------------------------------------------------
    */
    useEffect(() => {

        fetchTravelRequests(page);

    }, [page]);

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
                onComplete={
                    handleComplete
                }
                onCancel={
                    handleOpenCancel
                }
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
                                "Personal Vehicle" && (

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

            <Modal
                open={cancelOpen}
                onClose={() => {
                
                    setCancelOpen(false);
                
                    setCancelReason("");
                
                    setSelectedTravel(null);
                }}
                title="Cancel Travel Request"
                subtitle="
                    Please provide a reason for cancellation.
                "
                footer={(
                    <>
                        <button
                            onClick={() => {
                            
                                setCancelOpen(false);
                            
                                setCancelReason("");
                            
                                setSelectedTravel(null);
                            }}
                            className="
                                px-4
                                py-2
                                rounded-xl
                                border
                                hover:bg-gray-50
                            "
                        >
                            Close
                        </button>
                        
                        <button
                            onClick={handleCancel}
                            disabled={
                                actionLoading
                                ||
                                !cancelReason.trim()
                            }
                            className="
                                px-4
                                py-2
                                rounded-xl
                                bg-red-600
                                text-white
                                hover:bg-red-700
                                disabled:opacity-50
                            "
                        >
                            {
                                actionLoading
                                    ? "Cancelling..."
                                    : "Confirm Cancellation"
                            }
                        </button>
                    </>
                )}
            >
            
                <textarea
                    value={cancelReason}
                    onChange={(e) =>
                        setCancelReason(
                            e.target.value
                        )
                    }
                    rows={5}
                    placeholder="
                        Enter cancellation reason...
                    "
                    className="
                        w-full
                        rounded-xl
                        border
                        border-gray-300
                        px-4
                        py-3
                        text-sm
                        focus:outline-none
                        focus:ring-2
                        focus:ring-red-500
                    "
                />
            
            </Modal>

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