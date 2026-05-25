"use client";

import { useEffect, useState } from "react";
import AddEmployeeModal from "@/components/adminhr/AddEmployeeModal";
import EditEmployeeModal from "@/components/adminhr/EditEmployeeModal";
import EmployeeCard from "@/components/adminhr/EmployeeCard";
import { Button } from "@/components/ui/button";
import api from "@/services/api";
import { FileDown, FileUp, Hourglass, Pencil, PlusCircle, ShieldCheck, UserRoundPlus, UserX } from "lucide-react";
import Drawer from "@/components/ui/Drawer";
import { useToast } from "@/components/ui/ToastProvider";
import { getStorageUrl } from "@/lib/storage";
import { getInitials } from "@/lib/utils";
import { getStatusMeta } from "@/lib/status";
import { useRef } from "react";

export default function EmployeeListPage() {
    const [open, setOpen] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(null);
    const [openDrawer, setOpenDrawer] = useState(false);
    const { showToast } = useToast();
    const [actionLoading, setActionLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [openEditModal, setOpenEditModal] = useState(false);

    /* =========================
       FETCH EMPLOYEES
    ========================= */
    const fetchEmployees = async (searchTerm = "") => {
        try {
            setLoading(true);

            const res = await api.get(`/employees?search=${searchTerm}`);

            setEmployees(res.data.data.data || []);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fileInputRef = useRef(null);



    const handleView = (emp) => {
        setSelected(emp);
        setOpenDrawer(true);
    };

    const handleToggleStatus = async () => {
        try {
            setActionLoading(true);

            const newStatus =
                selected.Status?.toUpperCase() === "ACTIVE"
                    ? "INACTIVE"
                    : "ACTIVE";

            await api.put(`/employees/${selected.EmployeeNo}/toggle-status`);

            setSelected((prev) => ({
                ...prev,
                Status: newStatus,
            }));

            fetchEmployees();

            showToast({
                title: "Updated",
                message: "Status updated successfully",
                type: "success",
            });

        } catch (err) {
            showToast({
                title: "Error",
                message: "Failed to update status",
                type: "error",
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleSendPassword = async () => {
        try {
            setActionLoading(true);

            showToast({
                title: "Processing your request",
                message: "Please wait while we sync your data.",
                type: "info",
            });

            await api.post(`/employees/${selected.EmployeeNo}/send-password`);

            showToast({
                title: "Email Sent",
                message: "Temporary password has been sent successfully.",
                type: "success",
            });

        } catch (err) {
            console.error("Send password error:", err);

            showToast({
                title: "Error",
                message: "Failed to send temporary password",
                type: "error",
            });

        } finally {
            setActionLoading(false); // ✅ THIS IS MISSING
        }
    };

    const handleEdit = () => {
        setOpenDrawer(false);
        setOpenEditModal(true);
    };

    const handleChange = (field, value) => {
        setEditForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        try {
            setActionLoading(true);

            showToast({
                title: "Updating employee...",
                message: "Please wait...",
                type: "info",
            });

            await api.put(`/employees/${selected.EmployeeNo}`, editForm);

            showToast({
                title: "Success",
                message: "Employee updated successfully.",
                type: "success",
            });

            setEditMode(false);

            // refresh list
            fetchEmployees();

        } catch (err) {
            showToast({
                title: "Error",
                message: "Failed to update employee.",
                type: "error",
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleToggleSurveyEligibility = async () => {

        try {

            setActionLoading(true);

            await api.put(
                `/employees/${selected.EmployeeNo}/toggle-survey-eligibility`
            );

            const updatedValue =
                !selected.IsSurveyExcluded;

            setSelected((prev) => ({
                ...prev,
                IsSurveyExcluded: updatedValue,
            }));

            fetchEmployees(search);

            showToast({
                title: "Updated",
                message: updatedValue
                    ? "Employee excluded from surveys."
                    : "Employee can now participate in surveys.",
                type: "success",
            });

        } catch (err) {

            console.error(err);

            showToast({
                title: "Error",
                message: "Failed to update survey eligibility.",
                type: "error",
            });

        } finally {

            setActionLoading(false);

        }
    };

    /* =========================
       INITIAL LOAD
    ========================= */
    useEffect(() => {
        fetchEmployees();
    }, []);

    /* =========================
       SEARCH (DEBOUNCE)
    ========================= */
    useEffect(() => {
        const delay = setTimeout(() => {
            fetchEmployees(search);
        }, 300);

        return () => clearTimeout(delay);
    }, [search]);

    /* =========================
       DOWNLOAD CSV
    ========================= */
    const handleDownload = async () => {

        if (typeof window === "undefined") return;

        try {

            const res = await api.get(
                `/employees/export?search=${search}`,
                {
                    responseType: "blob",
                }
            );

            const url = window.URL.createObjectURL(
                new Blob([res.data])
            );

            const a = document.createElement("a");

            a.href = url;
            a.download = "employees.csv";

            document.body.appendChild(a);

            a.click();

            a.remove();

            window.URL.revokeObjectURL(url);

        } catch (err) {

            console.error("Download failed:", err);

        }
    };

    const handleImport = async (e) => {

        const file = e.target.files[0];

        if (!file) return;

        try {

            const formData = new FormData();

            formData.append("file", file);

            const res = await api.post(
                "/employees/import",
                formData,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },
                }
            );

            showToast({
                title: "Import Successful",
                message: res.data.message,
                type: "success",
            });

            fetchEmployees();

        } catch (err) {

            showToast({
                title: "Import Failed",
                message:
                    err.response?.data?.message
                    || "CSV import failed",
                type: "error",
            });

        }
    };

    return (
        <div className="p-6">
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">

                {/* 🔥 STICKY HEADER (TITLE + TOOLBAR) */}
                <div className="sticky top-0 z-30 bg-white border-b shadow-sm">

                    <div className="px-6 py-4 space-y-3">

                        {/* TITLE */}
                        <div className="flex items-center justify-between">
                            <h1 className="text-xl font-semibold text-gray-900">
                                Employees
                                <span className="text-gray-400 ml-2 text-sm font-normal">
                                    ({employees.length})
                                </span>
                            </h1>
                        </div>

                        {/* TOOLBAR */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                            {/* SEARCH */}
                            <div className="relative w-full md:w-80">
                                <input
                                    type="text"
                                    placeholder="Search employee..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                                />
                            </div>

                            {/* ACTIONS */}
                            <div className="flex gap-2">


                                <Button
                                    variant="outline"
                                    className="rounded-xl"
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    <FileUp size={22} />
                                </Button>

                                <input
                                    type="file"
                                    accept=".csv,.xlsx,.xls"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleImport}
                                />

                                <Button
                                    variant="outline"
                                    className="rounded-xl"
                                    onClick={handleDownload}
                                >
                                    <FileDown size={22} />
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        window.open(
                                            `${process.env.NEXT_PUBLIC_API_URL}/employees/template`
                                        )
                                    }
                                >
                                    Download Template
                                </Button>

                                <Button
                                    onClick={() => setOpen(true)}
                                    className="
                                    bg-gradient-to-r from-amber-400 to-amber-500
                                    text-white
                                    font-medium
                                    px-4 py-2 rounded-lg
                                    shadow-md shadow-amber-500/30
                                    hover:from-amber-300 hover:to-amber-400
                                    hover:shadow-lg hover:shadow-amber-500/40
                                    active:scale-[0.98]
                                    transition-all duration-200
                                    "
                                >
                                    <UserRoundPlus size={22} /> Add Employee
                                </Button>
                            </div>
                        </div>

                    </div>
                </div>

                {/* CONTENT */}
                <div className="p-6">

                    {/* LOADING */}
                    {loading && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {Array.from({ length: 8 }).map((_, index) => (
                                <EmployeeCardSkeleton key={index} />
                            ))}
                        </div>
                    )}

                    {/* EMPTY */}
                    {!loading && employees.length === 0 && (
                        <div className="border rounded-xl p-10 text-center text-gray-500">
                            No employees found...
                        </div>
                    )}

                    {/* GRID */}
                    {!loading && employees.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {employees.map((emp, index) => (
                                <EmployeeCard
                                    key={emp.id || index}
                                    employee={emp}
                                    onView={() => handleView(emp)}
                                />

                            ))}
                        </div>
                    )}

                </div>

                {/* MODAL */}
                <AddEmployeeModal
                    open={open}
                    onClose={() => setOpen(false)}
                    onSuccess={() => fetchEmployees(search)}
                />

                <Drawer
                    open={openDrawer}
                    onClose={() => setOpenDrawer(false)}
                    title="Employee Details"
                >
                    {selected && (
                        <EmployeeDrawerContent
                            selected={selected}
                            onToggleStatus={handleToggleStatus}
                            onSendPassword={handleSendPassword}
                            onToggleSurveyEligibility={handleToggleSurveyEligibility}
                            onEdit={handleEdit}
                            actionLoading={actionLoading}
                        />
                    )}
                </Drawer>

                <EditEmployeeModal
                    open={openEditModal}
                    onClose={() => setOpenEditModal(false)}
                    onSuccess={fetchEmployees}
                    employee={selected}
                />

            </div>
        </div>
    );
}

function Info({ label, value }) {
    return (
        <div>
            <p className="text-gray-500 text-xs">{label}</p>
            <p className="font-medium">{value || "-"}</p>
        </div>
    );
}

function EmployeeCardSkeleton() {
    return (
        <div className="border rounded-2xl p-5 bg-white shadow-sm animate-pulse">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-200" />

                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
            </div>

            <div className="mt-5 space-y-3">
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-5/6" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
        </div>
    );
}

function EmployeeDrawerContent({
    selected,
    onToggleStatus,
    onToggleSurveyEligibility,
    onSendPassword,
    onEdit,
    actionLoading,
}) {
    const [menuOpen, setMenuOpen] = useState(false);

    const profileImage = getStorageUrl(selected.ProfileImage);

    /* =========================
       DYNAMIC AVATAR COLOR
    ========================= */
    const getColor = (name) => {
        const colors = [
            "bg-red-500",
            "bg-blue-500",
            "bg-green-500",
            "bg-purple-500",
            "bg-indigo-500",
            "bg-pink-500",
        ];

        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }

        return colors[Math.abs(hash) % colors.length];
    };

    return (
        <div className="flex flex-col h-full">

            {/* ================= HEADER ================= */}
            <div className="flex items-center gap-4 border-b pb-5">

                {/* AVATAR */}
                <div
                    className={`
                        w-16 h-16 rounded-full
                        overflow-hidden
                        flex items-center justify-center
                        text-white text-lg font-semibold
                        ${getColor(selected.FirstName + selected.LastName)}
                    `}
                >

                    {profileImage ? (

                        <img
                            src={profileImage}
                            alt={`${selected.FirstName} ${selected.LastName}`}
                            className="w-full h-full object-cover"
                        />

                    ) : (

                        getInitials(
                            `${selected.FirstName} ${selected.LastName}`
                        )

                    )}

                </div>

                {/* INFO */}
                <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {selected.FirstName} {selected.LastName}
                    </h2>

                    <p className="text-sm text-gray-500">
                        {selected.Position}
                    </p>

                    {/* STATUS BADGES */}
                    <div className="flex items-center gap-3 mt-2">

                        {/* ACTIVE INDICATOR */}
                        <div className="flex items-center gap-2">

                            <div className="relative flex items-center justify-center">

                                {/* PING */}
                                <div
                                    className={`
                                        absolute
                                        w-3
                                        h-3
                                        rounded-full
                                        animate-ping
                                        opacity-75
                                        ${selected.Status?.toUpperCase() === "ACTIVE"
                                            ? "bg-green-400"
                                            : "bg-red-400"
                                        }
                                    `}
                                />

                                {/* DOT */}
                                <div
                                    className={`
                                        relative
                                        w-2.5
                                        h-2.5
                                        rounded-full
                                        ${selected.Status?.toUpperCase() === "ACTIVE"
                                            ? "bg-green-500"
                                            : "bg-red-500"
                                        }
                                    `}
                                />

                            </div>

                            <span className="text-xs text-gray-500">
                                {selected.Status}
                            </span>

                        </div>

                        {/* COMPANY STATUS */}
                        <span
                            className={`
                                text-xs
                                px-2.5
                                py-1
                                rounded-full
                                border
                                ${getStatusMeta(selected.CompanyStatus).className}
                            `}
                        >
                            {getStatusMeta(selected.CompanyStatus).label}
                        </span>

                    </div>
                </div>

                {/* ACTION MENU */}
                <div className="relative">
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="p-2 rounded-lg hover:bg-gray-100"
                    >
                        ⋮
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white border rounded-xl shadow-lg z-50">

                            <div className="p-2 text-sm">

                                {/* EDIT */}
                                <button
                                    onClick={() => {
                                        setMenuOpen(false);
                                        onEdit();
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-100 rounded-lg"
                                >
                                    <Pencil size={14} className="text-gray-500" />
                                    <span>Edit Employee</span>
                                </button>

                                {/* SEND PASSWORD */}
                                <button
                                    onClick={() => {
                                        setMenuOpen(false);
                                        onSendPassword();
                                    }}
                                    disabled={actionLoading}
                                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                                >
                                    {actionLoading ? (
                                        <>
                                            <span className="animate-spin"><Hourglass size={12} /></span>
                                            <span>Sending...</span>
                                        </>
                                    ) : (
                                        <>
                                            <ShieldCheck size={14} />
                                            <span>Temporary Password</span>
                                        </>
                                    )}
                                </button>

                                <div className="border-t my-2"></div>

                                {/* EXCLUDED STATUS */}
                                <button
                                    onClick={() => {
                                        setMenuOpen(false);
                                        onToggleSurveyEligibility();
                                    }}
                                    disabled={actionLoading}
                                    className="
                                        w-full flex items-center gap-2
                                        px-3 py-2 text-left
                                        hover:bg-gray-100
                                        rounded-lg
                                        disabled:opacity-50
                                    "
                                >

                                    <UserX
                                        size={14}
                                        className="
                                            text-amber-500
                                        "
                                    />

                                    <span>
                                        {selected.IsSurveyExcluded
                                            ? "Enable Survey Participation"
                                            : "Exclude From Surveys"}
                                    </span>

                                </button>

                                {/* TOGGLE STATUS */}
                                <button
                                    onClick={onToggleStatus}
                                    disabled={actionLoading}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50"
                                >
                                    {actionLoading ? (
                                        <span className="animate-spin"><Hourglass size={12} /></span>
                                    ) : (
                                        <ShieldCheck size={14} />
                                    )}

                                    <span>
                                        {selected.Status?.toUpperCase() === "ACTIVE"
                                            ? "Deactivate Employee"
                                            : "Activate Employee"}
                                    </span>
                                </button>

                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ================= BODY ================= */}
            <div className="flex-1 overflow-y-auto py-5 space-y-5">

                {/* BASIC */}
                <div className="border rounded-2xl p-5 space-y-4">
                    <h3 className="font-medium text-gray-900 text-sm">
                        Basic Info
                    </h3>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <Info label="Employee No" value={selected.EmployeeNo} />
                        <Info label="Email" value={selected.EmailAddress} />
                        <Info label="Contact" value={selected.ContactNumber} />
                        <Info label="Gender" value={selected.Gender} />
                        <Info label="Birthday" value={selected.Birthday} />
                        <Info label="Civil Status" value={selected.CivilStatus} />
                    </div>
                </div>

                {/* EMPLOYMENT */}
                <div className="border rounded-2xl p-5 space-y-4">
                    <h3 className="font-medium text-gray-900 text-sm">
                        Employment
                    </h3>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <Info label="Department" value={selected.Department} />
                        <Info label="Position" value={selected.Position} />
                        <Info label="Job Level" value={selected.JobLevel} />
                        <Info label="Company Status" value={selected.CompanyStatus} />
                        <Info label="Date Hired" value={selected.DateHired} />
                    </div>
                </div>

                {/* GOVERNMENT ID'S */}
                <div className="border rounded-2xl p-5 space-y-4">
                    <h3 className="font-medium text-gray-900 text-sm">
                        Government Id's
                    </h3>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <Info label="SSS Number" value={selected.SSSNumber} />
                        <Info label="PhilHealth Number" value={selected.PhilHealthNumber} />
                        <Info label="Pag-IBIG Number" value={selected.PagIbigNumber} />
                        <Info label="TIN" value={selected.TIN} />
                    </div>
                </div>

                {/* SALARY */}
                <div className="border rounded-2xl p-5">
                    <p className="text-xs text-gray-500">
                        Monthly Salary
                    </p>

                    <p className="text-xl font-semibold text-gray-900">
                        ₱ {Number(selected.MonthlySalary || 0).toLocaleString()}
                    </p>
                </div>

            </div>
        </div>
    );
}