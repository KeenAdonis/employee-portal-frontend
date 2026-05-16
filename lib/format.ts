export const formatDate = (date?: string | Date): string => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

export const formatDateForApi = (
    date?: string | Date
): string | null => {
    if (!date) return null;

    const d = new Date(date);

    // 🔥 Prevent invalid dates
    if (isNaN(d.getTime())) return null;

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

export const formatTime = (time?: string): string => {
    if (!time) return "—";

    const [hour, minute] = time.split(":");

    const date = new Date();
    date.setHours(Number(hour), Number(minute));

    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
};

export const formatHours = (
    hours?: number | string
): string => {
    if (!hours) return "—";

    const h = Number(hours);

    if (isNaN(h)) return "—";

    return `${h} hour${h > 1 ? "s" : ""}`;
};

export const formatCurrency = (
    amount?: number | string,
    currency: string = "PHP"
): string => {
    if (
        amount === null ||
        amount === undefined ||
        amount === ""
    ) {
        return "—";
    }

    const value = Number(amount);

    if (isNaN(value)) return "—";

    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
    }).format(value);
};