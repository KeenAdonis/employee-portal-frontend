// Centralized status constants
export const STATUS = {
    CHECKED: "Checked",
    PENDING: "Pending",
    PRE_APPROVED: "Pre-Approved",
    APPROVED: "Approved",
    REJECTED: "Rejected",
} as const;

// Type-safe status values
export type StatusType = typeof STATUS[keyof typeof STATUS];

// Metadata return type
type StatusMeta = {
    label: string;
    className: string;
};

// Main formatter
export const getStatusMeta = (status?: StatusType | string): StatusMeta => {
    switch (status) {
        case STATUS.CHECKED:
            return {
                label: "Checked",
                className:
                    "bg-fuchsia-100 text-fuchsia-700 border border-fuchsia-200",
            };

        case STATUS.PENDING:
            return {
                label: "Pending",
                className:
                    "bg-yellow-100 text-yellow-700 border border-yellow-200",
            };

        case STATUS.PRE_APPROVED:
            return {
                label: "Pre-Approved",
                className:
                    "bg-blue-100 text-blue-700 border border-blue-200",
            };

        case STATUS.APPROVED:
            return {
                label: "Approved",
                className:
                    "bg-green-100 text-green-700 border border-green-200",
            };

        case STATUS.REJECTED:
            return {
                label: "Rejected",
                className:
                    "bg-red-100 text-red-700 border border-red-200",
            };

        default:
            return {
                label: "Unknown",
                className:
                    "bg-gray-100 text-gray-600 border border-gray-200",
            };
    }
};