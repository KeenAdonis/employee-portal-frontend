import { getStatusMeta } from "@/lib/status";

export default function StatusBadge({ status, size = "sm" }) {
    const meta = getStatusMeta(status);

    const sizeClasses = {
        sm: "px-2 py-0.5 text-xs",
        md: "px-3 py-1 text-sm",
        lg: "px-4 py-1.5 text-sm",
    };

    return (
        <span className={`font-medium rounded-full ${sizeClasses[size]} ${meta.className}`}>
            {meta.label}
        </span>
    );
}