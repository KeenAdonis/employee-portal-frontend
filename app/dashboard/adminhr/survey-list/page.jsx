"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import Drawer from "@/components/ui/Drawer";
import SurveyCommentsModal from "@/components/employee/SurveyCommentsModal";
import CreateSurveyBatchModal from "@/components/adminhr/CreateSurveyBatchModal";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { useToast } from "@/components/ui/ToastProvider";
import {
    BarChart3,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Eye,
    PlusCircle,
    Users,
    Trash2,
    XCircle,
} from "lucide-react";

const companyBadgeClasses = {

    "Psy Systems and Innovations, OPC":
        "bg-amber-200 text-amber-700",

    "Pillars Psychological Services":
        "bg-blue-200 text-blue-700",
};

export default function EmployeeSurveyPage() {
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    const [selectedBatch, setSelectedBatch] = useState(null);
    const [openDrawer, setOpenDrawer] = useState(false);

    const [processingBatchId, setProcessingBatchId] = useState(null);

    const [openCommentsModal, setOpenCommentsModal] = useState(false);

    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [openDeleteModal, setOpenDeleteModal] =
        useState(false);

    const [selectedDeleteBatch, setSelectedDeleteBatch] =
        useState(null);

    const { showToast } = useToast();

    /* =========================================
       FETCH BATCHES
    ========================================= */
    const fetchBatches = async (searchTerm = "") => {
        try {
            setLoading(true);

            const res = await api.get(
                `/employee-survey/batches?search=${searchTerm}`
            );

            setBatches(res.data.data || []);

        } catch (err) {
            console.error(err);

            showToast({
                title: "Error",
                message: "Failed to load survey batches.",
                type: "error",
            });

        } finally {
            setLoading(false);
        }
    };

    const handleOpenComments = (employee) => {
        setSelectedEmployee(employee);
        setOpenCommentsModal(true);
    };

    /* =========================================
       INITIAL LOAD
    ========================================= */
    useEffect(() => {
        fetchBatches();
    }, []);

    /* =========================================
       SEARCH
    ========================================= */
    useEffect(() => {
        const delay = setTimeout(() => {
            fetchBatches(search);
        }, 300);

        return () => clearTimeout(delay);
    }, [search]);

    /* =========================================
       VIEW BATCH
    ========================================= */
    const handleView = (batch) => {
        setSelectedBatch(batch);
        setOpenDrawer(true);
    };

    /* =========================================
       TOGGLE STATUS
    ========================================= */
    const handleToggleStatus = async (batch) => {

        try {

            setProcessingBatchId(batch.id);

            await api.put(
                `/employee-survey/batches/${batch.id}/toggle-status`
            );

            showToast({
                title: "Success",
                message: `Survey batch ${batch.is_active
                    ? "closed"
                    : "activated"
                    } successfully.`,
                type: "success",
            });

            await fetchBatches(search);

            if (selectedBatch?.id === batch.id) {

                setSelectedBatch((prev) => ({
                    ...prev,
                    is_active: !prev.is_active,
                }));
            }

        } catch (err) {

            console.error(err);

            showToast({
                title: "Error",
                message: "Failed to update survey batch.",
                type: "error",
            });

        } finally {

            setProcessingBatchId(null);
        }
    };

    /* =========================================
       DELETE BATCH
    ========================================= */
    const handleDeleteBatch = async () => {

        if (!selectedDeleteBatch) return;

        try {

            setDeleteLoading(true);

            await api.delete(
                `/employee-survey/batches/${selectedDeleteBatch.id}`
            );

            showToast({
                title: "Success",
                message: "Survey batch deleted successfully.",
                type: "success",
            });

            fetchBatches(search);

            setOpenDeleteModal(false);

            setSelectedDeleteBatch(null);

        } catch (err) {

            console.error(err);

            showToast({
                title: "Error",
                message: "Failed to delete survey batch.",
                type: "error",
            });

        } finally {

            setDeleteLoading(false);

        }
    };

    return (
        <div className="p-6">
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">

                {/* =========================================
                    HEADER
                ========================================= */}
                <div className="sticky top-0 z-30 bg-white border-b shadow-sm">

                    <div className="px-6 py-4 space-y-3">

                        {/* TITLE */}
                        <div className="flex items-center justify-between">

                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">
                                    Employee Survey
                                </h1>

                                <p className="text-sm text-gray-500 mt-1">
                                    Manage employee survey batches and analytics
                                </p>
                            </div>

                        </div>

                        {/* TOOLBAR */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                            {/* SEARCH */}
                            <div className="relative w-full md:w-80">
                                <input
                                    type="text"
                                    placeholder="Search survey batch..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="
                                        w-full border rounded-xl px-4 py-2 text-sm
                                        focus:outline-none focus:ring-2
                                        focus:ring-amber-400
                                    "
                                />
                            </div>

                            {/* ACTIONS */}
                            <div className="flex gap-2">

                                <Button
                                    variant="outline"
                                    className="rounded-xl"
                                >
                                    Export Reports
                                </Button>

                                <Button
                                    onClick={() => setOpenCreateModal(true)}
                                    className="
                                            bg-gradient-to-r
                                            from-amber-400 to-amber-500
                                            text-white
                                            shadow-md shadow-amber-500/30
                                            hover:from-amber-300
                                            hover:to-amber-400
                                            hover:shadow-lg
                                            hover:shadow-amber-500/40
                                            rounded-xl
                                        "
                                >
                                    <PlusCircle className="w-4 h-4 mr-2" />
                                    Create Survey Batch
                                </Button>



                            </div>
                        </div>

                    </div>
                </div>

                {/* =========================================
                    CONTENT
                ========================================= */}
                <div className="p-6">

                    {/* LOADING */}
                    {loading && (
                        <div className="text-center py-10 text-gray-500">
                            Loading survey batches...
                        </div>
                    )}

                    {/* EMPTY */}
                    {!loading && batches.length === 0 && (
                        <div className="border rounded-2xl p-10 text-center text-gray-500">
                            No survey batches found...
                        </div>
                    )}

                    {/* GRID */}
                    {!loading && batches.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                            {batches.map((batch) => {

                                const completionRate =
                                    batch.total_employees > 0
                                        ? Math.round(
                                            (batch.total_submitted /
                                                batch.total_employees) * 100
                                        )
                                        : 0;

                                return (
                                    <div
                                        key={batch.id}
                                        className="
                                            border rounded-2xl p-5
                                            hover:shadow-lg
                                            transition-all
                                            duration-200
                                            bg-white
                                        "
                                    >

                                        {/* TOP */}
                                        <div className="flex items-start justify-between">

                                            <div>
                                                <h2 className="text-lg font-semibold text-gray-900">
                                                    {batch.name}
                                                </h2>

                                                <div className="flex items-center gap-2 mt-2">

                                                    <span
                                                        className={`
                                                            text-xs px-2 py-1 rounded-full
                                                            font-medium
                                                            ${companyBadgeClasses[batch.company] ||
                                                            "bg-gray-100 text-gray-700"}
                                                        `}
                                                    >
                                                        {batch.company}
                                                    </span>



                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleView(batch)}
                                                className="
                                                    p-2 rounded-lg
                                                    hover:bg-gray-100
                                                    transition
                                                "
                                            >
                                                <Eye className="w-5 h-5 text-gray-500" />
                                            </button>

                                        </div>

                                        {/* DATES */}
                                        <div className="mt-5 space-y-3 text-sm">

                                            <div className="flex items-center gap-2 text-gray-600">
                                                <CalendarDays className="w-4 h-4" />
                                                <span>
                                                    {batch.start_date} - {batch.end_date}
                                                </span>

                                                <span
                                                    className={`
                                                            text-xs px-2 py-1 rounded-full font-medium
                                                            ${batch.is_active
                                                            ? "bg-green-100 text-green-600"
                                                            : "bg-gray-100 text-gray-600"
                                                        }
                                                        `}
                                                >
                                                    {batch.is_active
                                                        ? "ACTIVE"
                                                        : "CLOSED"}
                                                </span>
                                            </div>

                                        </div>

                                        {/* STATS */}
                                        <div className="grid grid-cols-2 gap-4 mt-6">

                                            <StatCard
                                                icon={<Users className="w-4 h-4" />}
                                                label="Employees"
                                                value={batch.total_employees || 0}
                                            />

                                            <StatCard
                                                icon={<CheckCircle2 className="w-4 h-4" />}
                                                label="Submitted"
                                                value={batch.total_submitted || 0}
                                            />

                                            <StatCard
                                                icon={<Clock3 className="w-4 h-4" />}
                                                label="Pending"
                                                value={batch.total_pending || 0}
                                            />

                                            <StatCard
                                                icon={<BarChart3 className="w-4 h-4" />}
                                                label="Completion"
                                                value={`${completionRate}%`}
                                            />

                                        </div>

                                        {/* PROGRESS */}
                                        <div className="mt-6">

                                            <div className="flex items-center justify-between text-xs mb-2">
                                                <span className="text-gray-500">
                                                    Completion Progress
                                                </span>

                                                <span className="font-medium text-gray-700">
                                                    {completionRate}%
                                                </span>
                                            </div>

                                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">

                                                <div
                                                    className="
                                                        h-full bg-gradient-to-r
                                                        from-amber-400
                                                        to-amber-500
                                                    "
                                                    style={{
                                                        width: `${completionRate}%`
                                                    }}
                                                />

                                            </div>

                                        </div>

                                        {/* ACTIONS */}
                                        <div className="flex gap-2 mt-6">

                                            <Button
                                                variant="outline"
                                                className="flex-1 rounded-xl"
                                                onClick={() => handleView(batch)}
                                            >
                                                View Analytics
                                            </Button>

                                            <Button
                                                disabled={processingBatchId === batch.id}
                                                className={`
                                                    flex-1 rounded-xl text-white
                                                    disabled:opacity-60
                                                    disabled:cursor-not-allowed
                                                    ${batch.is_active
                                                        ? "bg-red-500 hover:bg-red-600"
                                                        : "bg-green-500 hover:bg-green-600"
                                                    }
                                                `}
                                                onClick={() => handleToggleStatus(batch)}
                                            >
                                                {processingBatchId === batch.id
                                                    ? (
                                                        batch.is_active
                                                            ? "Closing..."
                                                            : "Activating..."
                                                    )
                                                    : (
                                                        batch.is_active
                                                            ? "Close"
                                                            : "Activate"
                                                    )}
                                            </Button>

                                            <Button
                                                variant="outline"
                                                className="
                                                    rounded-xl
                                                    border-red-200
                                                    text-red-600
                                                    hover:bg-red-50
                                                    hover:border-red-300
                                                "
                                                onClick={() => {
                                                
                                                    setSelectedDeleteBatch(batch);
                                                
                                                    setOpenDeleteModal(true);
                                                
                                                }}
                                                disabled={deleteLoading}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>

                                        </div>

                                    </div>
                                );
                            })}

                        </div>
                    )}

                </div>

                {/* =========================================
                    DRAWER
                ========================================= */}
                <Drawer
                    open={openDrawer}
                    onClose={() => setOpenDrawer(false)}
                    title="Survey Analytics"
                >
                    {selectedBatch && (
                        <SurveyAnalyticsDrawer
                            batch={selectedBatch}
                            onOpenComments={handleOpenComments}
                        />
                    )}
                </Drawer>

                <SurveyCommentsModal
                    open={openCommentsModal}
                    onClose={() => setOpenCommentsModal(false)}
                    employee={selectedEmployee}
                />

                <CreateSurveyBatchModal
                    open={openCreateModal}
                    onClose={() => setOpenCreateModal(false)}
                    onSuccess={() => {
                        fetchBatches(search);
                    }}
                />

                <ConfirmationModal
                    open={openDeleteModal}
                    onClose={() => {
                        setOpenDeleteModal(false);
                        setSelectedDeleteBatch(null);
                    }}
                    onConfirm={handleDeleteBatch}
                    loading={deleteLoading}

                    type="danger"

                    title="Delete Survey Batch"

                    message="
                        Are you sure you want to delete
                        this survey batch?
                    "

                    confirmText="Delete Batch"

                    itemName={selectedDeleteBatch?.name}
                />

            </div>
        </div>
    );
}

/* =========================================
   STAT CARD
========================================= */
function StatCard({ icon, label, value }) {
    return (
        <div className="border rounded-xl p-3">
            <div className="flex items-center gap-2 text-gray-500 text-xs">
                {icon}
                <span>{label}</span>
            </div>

            <p className="mt-2 text-lg font-semibold text-gray-900">
                {value}
            </p>
        </div>
    );
}

/* =========================================
   DRAWER CONTENT
========================================= */
function SurveyAnalyticsDrawer({ batch, onOpenComments, }) {
    return (
        <div className="space-y-6">

            {/* SUMMARY */}
            <div className="border rounded-2xl p-5">

                <h3 className="font-semibold text-gray-900">
                    Survey Summary
                </h3>

                <div className="grid grid-cols-2 gap-4 mt-5">

                    <Info
                        label="Survey Batch"
                        value={batch.name}
                    />

                    <Info
                        label="Company"
                        value={batch.company}
                    />

                    <Info
                        label="Start Date"
                        value={batch.start_date}
                    />

                    <Info
                        label="End Date"
                        value={batch.end_date}
                    />

                    <Info
                        label="Total Employees"
                        value={batch.total_employees}
                    />

                    <Info
                        label="Submitted"
                        value={batch.total_submitted}
                    />

                </div>

                {/* DESCRIPTION */}
                {batch.description && (
                    <div className="mt-5 border-t pt-5">

                        <p className="text-xs text-gray-500 mb-2">
                            Description
                        </p>

                        <p className="text-sm text-gray-700 leading-relaxed">
                            {batch.description}
                        </p>

                    </div>
                )}

            </div>

            {/* TOP EMPLOYEES */}
            <div className="border rounded-2xl p-5">

                <h3 className="font-semibold text-gray-900 mb-4">
                    Top Ranked Employees
                </h3>

                <div className="space-y-3">

                    {(batch.top_employees || []).map((employee, index) => (
                        <div
                            key={index}
                            onClick={() => onOpenComments(employee)}
                            className="
                                flex items-center justify-between
                                border rounded-xl px-4 py-3
                                cursor-pointer
                                hover:border-amber-300
                                hover:bg-amber-50
                                transition-all
                            "
                        >

                            <div>
                                <p className="font-medium text-gray-900">
                                    {employee.name}
                                </p>

                                <p className="text-xs text-gray-500">
                                    {employee.department}
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="font-semibold text-amber-600">
                                    {employee.score}
                                </p>

                                <p className="text-xs text-gray-500">
                                    points
                                </p>
                            </div>

                        </div>
                    ))}

                    {(!batch.top_employees ||
                        batch.top_employees.length === 0) && (
                            <div className="
                                border border-dashed
                                rounded-2xl
                                p-6
                                text-center
                            ">
                                <p className="text-sm text-gray-500">
                                    No employee rankings available yet.
                                </p>

                                <p className="text-xs text-gray-400 mt-1">
                                    Rankings and analytics will appear after submissions.
                                </p>
                            </div>
                        )}

                </div>

            </div>

            {/* PARTICIPATION */}
            <div className="border rounded-2xl p-5">

                <h3 className="font-semibold text-gray-900 mb-4">
                    Participation Status
                </h3>

                <div className="space-y-2">

                    {(batch.participants || []).map((participant, index) => (
                        <div
                            key={index}
                            className="
                                flex items-center justify-between
                                border rounded-xl px-4 py-3
                            "
                        >

                            <div>
                                <p className="font-medium text-gray-900">
                                    {participant.name}
                                </p>

                                <p className="text-xs text-gray-500">
                                    {participant.department}
                                </p>
                            </div>

                            <div>
                                {participant.submitted ? (
                                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">
                                        Submitted
                                    </span>
                                ) : (
                                    <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-600">
                                        Pending
                                    </span>
                                )}
                            </div>

                        </div>
                    ))}

                </div>

            </div>

        </div>
    );
}

/* =========================================
   INFO
========================================= */
function Info({ label, value }) {
    return (
        <div>
            <p className="text-xs text-gray-500">
                {label}
            </p>

            <p className="font-medium text-gray-900">
                {value || "-"}
            </p>
        </div>
    );
}