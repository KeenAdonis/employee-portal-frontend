import {
    CalendarDays,
    Clock3,
    Wallet,
    Receipt,
    Bell,
    FileText,
    CheckCircle2,
    AlertTriangle,
    Users,
    Landmark,
} from "lucide-react";

export function getNotificationMeta(type = "", title = "") {

    const normalizedType = String(type).toLowerCase();

    const normalizedTitle = String(title).toLowerCase();

    /*
    |--------------------------------------------------------------------------
    | STATUS-BASED PRIORITY
    |--------------------------------------------------------------------------
    */

    // APPROVED
    if (normalizedTitle.includes("approved")) {
        return {
            icon: CheckCircle2,
            iconClass:
                "bg-green-500/15 text-green-500",
        };
    }

    // REJECTED
    if (normalizedTitle.includes("rejected")) {
        return {
            icon: AlertTriangle,
            iconClass:
                "bg-red-500/15 text-red-500",
        };
    }

    // CHECKED / PRE-APPROVED
    if (
        normalizedTitle.includes("checked")) {
        return {
            icon: FileText,
            iconClass:
                "bg-amber-500/15 text-amber-500",
        };
    }

    if (normalizedTitle.includes("pre-approved")) {
        return {
            icon: CheckCircle2,
            iconClass:
                "bg-blue-500/15 text-blue-500",
        };
    }

    /*
    |--------------------------------------------------------------------------
    | MODULE TYPES
    |--------------------------------------------------------------------------
    */

    // LEAVE
    if (normalizedType.includes("leave")) {
        return {
            icon: CalendarDays,
            iconClass:
                "bg-blue-600/15 text-blue-500",
        };
    }

    // OVERTIME
    if (normalizedType.includes("overtime")) {
        return {
            icon: Clock3,
            iconClass:
                "bg-amber-500/15 text-amber-500",
        };
    }

    // PAYROLL
    if (normalizedType.includes("payroll")) {
        return {
            icon: Wallet,
            iconClass:
                "bg-green-500/15 text-green-500",
        };
    }

    // REQUISITION
    if (normalizedType.includes("requisition")) {
        return {
            icon: Receipt,
            iconClass:
                "bg-purple-500/15 text-purple-500",
        };
    }

    // LIQUIDATION
    if (normalizedType.includes("liquidation")) {
        return {
            icon: Landmark,
            iconClass:
                "bg-cyan-500/15 text-cyan-500",
        };
    }

    // LOAN
    if (normalizedType.includes("loan")) {
        return {
            icon: Wallet,
            iconClass:
                "bg-orange-500/15 text-orange-500",
        };
    }

    // EMPLOYEE SURVEY
    if (
        normalizedType.includes("survey") ||
        normalizedType.includes("employee_survey")
    ) {
        return {
            icon: Users,
            iconClass:
                "bg-pink-500/15 text-pink-500",
        };
    }

    // SYSTEM / WELCOME
    if (normalizedType.includes("system")) {
        return {
            icon: Bell,
            iconClass:
                "bg-slate-500/15 text-slate-300",
        };
    }

    /*
    |--------------------------------------------------------------------------
    | DEFAULT
    |--------------------------------------------------------------------------
    */

    return {
        icon: Bell,
        iconClass:
            "bg-slate-500/15 text-slate-300",
    };
}