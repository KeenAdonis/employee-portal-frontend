/* =========================
CENTRALIZED STATUS
========================= */

// 🔹 SHARED / GENERIC
export const STATUS = {
    SUCCESS: "Success",
    FAILED: "Failed",
    PROCESSING: "Processing",
} as const;

// 🔹 EMPLOYEE STATUS
export const EMPLOYEE_STATUS = {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
} as const;

// 🔹 EMPLOYMENT STATUS
export const EMPLOYMENT_STATUS = {
    REGULAR: "Regular",
    PROBATIONARY: "Probationary",
    PART_TIME: "Part-Time",
    ON_CALL: "On Call",
    PROJECT_BASED: "Project-Based",
    CONTRACTUAL: "Contractual",
} as const;

// 🔹 APPROVAL-BASED MODULES (Leave, Overtime, Requisition)
export const APPROVAL_STATUS = {
    CHECKED: "Checked",
    PENDING: "Pending",
    PRE_APPROVED: "Pre-Approved",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    CANCELLED: "Cancelled",
    LIQUIDATED: "Liquidated",
} as const;

// 🔹 TASK ACCOMPLISHMENTS FLOW (Overtime)
export const ACCOMPLISHMENT_STATUS = {
    DONE: "Done",
    ONGOING: "Ongoing",
} as const;


// 🔹 DOCUMENT FLOW (Secure Docs)
export const DOCUMENT_STATUS = {
    DRAFT: "Draft",
    QUEUED: "Queued",
    SENT: "Sent",
    FAILED: "Failed",

    SEND: "Send",
    RESEND: "Resend",
    UPLOAD: "Upload",
} as const;

// 🔥 🔥 PAYROLL STATUS (NEW — CLEAN)
export const PAYROLL_STATUS = {
    DRAFT: "Draft",
    PROCESSING: "Processing",
    PROCESSED: "Processed",
    RELEASED: "Released",
    FAILED: "Failed",
} as const;

export const LOAN_STATUS = {
    ACTIVE: "Active",
    COMPLETED: "Completed",
} as const;

// 🔹 TYPE
export type StatusType =
    | typeof STATUS[keyof typeof STATUS]
    | typeof EMPLOYEE_STATUS[keyof typeof EMPLOYEE_STATUS]
    | typeof EMPLOYMENT_STATUS[keyof typeof EMPLOYMENT_STATUS]
    | typeof APPROVAL_STATUS[keyof typeof APPROVAL_STATUS]
    | typeof ACCOMPLISHMENT_STATUS[keyof typeof ACCOMPLISHMENT_STATUS]
    | typeof DOCUMENT_STATUS[keyof typeof DOCUMENT_STATUS]
    | typeof PAYROLL_STATUS[keyof typeof PAYROLL_STATUS]
    | typeof LOAN_STATUS[keyof typeof LOAN_STATUS];

// 🔹 META TYPE
type StatusMeta = {
    label: string;
    className: string;
};

// 🔥 MAIN FORMATTER (UPDATED)
export const getStatusMeta = (status?: StatusType | string): StatusMeta => {


    switch (status) {

        /* =========================
           APPROVAL FLOW
        ========================= */
        case APPROVAL_STATUS.CHECKED:
            return {
                label: "Checked",
                className: "bg-fuchsia-100 text-fuchsia-700 border border-fuchsia-200",
            };

        case APPROVAL_STATUS.PENDING:
            return {
                label: "Pending",
                className: "bg-yellow-100 text-yellow-700 border border-yellow-200",
            };

        case APPROVAL_STATUS.PRE_APPROVED:
            return {
                label: "Pre-Approved",
                className: "bg-blue-100 text-blue-700 border border-blue-200",
            };

        case APPROVAL_STATUS.APPROVED:
            return {
                label: "Approved",
                className: "bg-green-100 text-green-700 border border-green-200",
            };

        case APPROVAL_STATUS.REJECTED:
            return {
                label: "Rejected",
                className: "bg-red-100 text-red-700 border border-red-200",
            };

        case APPROVAL_STATUS.CANCELLED:
            return {
                label: "Cancelled",
                className: "bg-red-100 text-red-700 border border-red-200",
            };

        case APPROVAL_STATUS.LIQUIDATED:
            return {
                label: "Liquidated",
                className: "bg-cyan-100 text-cyan-700 border border-cyan-200",
            };

        /* =========================
           EMPLOYEE
        ========================= */
        case EMPLOYEE_STATUS.ACTIVE:
            return {
                label: "Active",
                className: "bg-green-100 text-green-700 border border-green-200",
            };

        case EMPLOYEE_STATUS.INACTIVE:
            return {
                label: "Inactive",
                className: "bg-red-100 text-red-700 border border-red-200",
            };

        /* =========================
           EMPLOYMENT
        ========================= */
        case EMPLOYMENT_STATUS.REGULAR:
            return {
                label: "Regular",
                className: "bg-blue-100 text-blue-700 border border-blue-200",
            };

        case EMPLOYMENT_STATUS.PROBATIONARY:
            return {
                label: "Probationary",
                className: "bg-yellow-100 text-yellow-700 border border-yellow-200",
            };

        case EMPLOYMENT_STATUS.PART_TIME:
            return {
                label: "Part-Time",
                className: "bg-blue-100 text-blue-700 border border-blue-200",
            };

        case EMPLOYMENT_STATUS.ON_CALL:
            return {
                label: "On Call",
                className: "bg-purple-100 text-purple-700 border border-purple-200",
            };

        case EMPLOYMENT_STATUS.PROJECT_BASED:
            return {
                label: "Project-Based",
                className: "bg-cyan-100 text-cyan-700 border border-cyan-200",
            };

        case EMPLOYMENT_STATUS.CONTRACTUAL:
            return {
                label: "Contractual",
                className: "bg-orange-100 text-orange-700 border border-orange-200",
            };

        /* =========================
           DOCUMENT FLOW
        ========================= */
        case ACCOMPLISHMENT_STATUS.DONE:
            return {
                label: "Done",
                className: "bg-green-100 text-green-700 border border-green-200",
            };


        /* =========================
           DOCUMENT FLOW
        ========================= */
        case DOCUMENT_STATUS.DRAFT:
            return {
                label: "Draft",
                className: "bg-gray-100 text-gray-600 border border-gray-200",
            };

        case DOCUMENT_STATUS.QUEUED:
            return {
                label: "Queued",
                className: "bg-indigo-100 text-indigo-700 border border-indigo-200",
            };

        case DOCUMENT_STATUS.SENT:
            return {
                label: "Sent",
                className: "bg-green-100 text-green-700 border border-green-200",
            };

        case DOCUMENT_STATUS.FAILED:
            return {
                label: "Failed",
                className: "bg-red-100 text-red-700 border border-red-200",
            };


        /* =========================
           PAYROLL FLOW 🔥
        ========================= */
        case PAYROLL_STATUS.DRAFT:
            return {
                label: "Draft",
                className: "bg-gray-100 text-gray-600 border border-gray-200",
            };

        case PAYROLL_STATUS.PROCESSING:
            return {
                label: "Processing",
                className: "bg-blue-100 text-blue-700 border border-blue-200",
            };

        case PAYROLL_STATUS.PROCESSED:
            return {
                label: "Processed",
                className: "bg-green-100 text-green-700 border border-green-200",
            };

        case PAYROLL_STATUS.RELEASED:
            return {
                label: "Released",
                className: "bg-emerald-100 text-emerald-700 border border-emerald-200",
            };

        case PAYROLL_STATUS.FAILED:
            return {
                label: "Failed",
                className: "bg-red-100 text-red-700 border border-red-200",
            };


        /* =========================
           GENERIC
        ========================= */
        case STATUS.SUCCESS:
            return {
                label: "Success",
                className: "bg-green-100 text-green-700 border border-green-200",
            };

        case STATUS.PROCESSING:
            return {
                label: "Processing",
                className: "bg-blue-100 text-blue-700 border border-blue-200",
            };

        case STATUS.FAILED:
            return {
                label: "Failed",
                className: "bg-red-100 text-red-700 border border-red-200",
            };

        /* =========================
           LOAN
        ========================= */
        case LOAN_STATUS.ACTIVE:
            return {
                label: "Active",
                className: "bg-red-100 text-red-700 border border-red-200",
            };

        case LOAN_STATUS.COMPLETED:
            return {
                label: "Completed",
                className: "bg-green-100 text-green-700 border border-green-200",
            };


        /* =========================
           DEFAULT
        ========================= */
        default:
            return {
                label: "Unknown",
                className: "bg-gray-100 text-gray-600 border border-gray-200",
            };
    }


};
