import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

export default function Pagination({ meta, onPageChange }) {
    if (!meta) return null;

    const { current_page, last_page } = meta;

    // =========================
    // SMART 5-PAGE WINDOW
    // =========================
    const getPages = () => {
        const pages = [];
        const maxVisible = 5;

        let start = Math.max(1, current_page - 2);
        let end = Math.min(last_page, current_page + 2);

        if (current_page <= 3) {
            start = 1;
            end = Math.min(last_page, maxVisible);
        }

        if (current_page >= last_page - 2) {
            end = last_page;
            start = Math.max(1, last_page - (maxVisible - 1));
        }

        if (start > 1) {
            pages.push(1);
            if (start > 2) pages.push("...");
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (end < last_page) {
            if (end < last_page - 1) pages.push("...");
            pages.push(last_page);
        }

        return pages;
    };

    const pages = getPages();

    return (
        <div className="w-full flex flex-col items-center justify-center mt-8 space-y-2">

            {/* PAGINATION CONTROLS */}
            <div className="flex items-center gap-1">

                {/* PREV */}
                <button
                    disabled={current_page === 1}
                    onClick={() => onPageChange(current_page - 1)}
                    className={`h-9 w-9 flex items-center justify-center rounded-lg border transition
                        ${current_page === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "hover:bg-gray-100 text-gray-700"
                        }
                    `}
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {/* PAGE NUMBERS */}
                {pages.map((page, index) =>
                    page === "..." ? (
                        <span
                            key={index}
                            className="h-9 w-9 flex items-center justify-center text-gray-400"
                        >
                            <MoreHorizontal className="w-4 h-4" />
                        </span>
                    ) : (
                        <button
                            key={index}
                            onClick={() => onPageChange(page)}
                            className={`h-9 min-w-[36px] px-2 flex items-center justify-center rounded-lg text-sm transition
                                ${page === current_page
                                    ? "bg-indigo-600 text-white shadow-sm"
                                    : "hover:bg-gray-100 text-gray-700"
                                }
                            `}
                        >
                            {page}
                        </button>
                    )
                )}

                {/* NEXT */}
                <button
                    disabled={current_page === last_page}
                    onClick={() => onPageChange(current_page + 1)}
                    className={`h-9 w-9 flex items-center justify-center rounded-lg border transition
                        ${current_page === last_page
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "hover:bg-gray-100 text-gray-700"
                        }
                    `}
                >
                    <ChevronRight className="w-4 h-4" />
                </button>

            </div>

            {/* PAGE INFO (BOTTOM CENTER) */}
            <p className="text-xs text-gray-500">
                Page{" "}
                <span className="font-semibold text-gray-900">
                    {current_page}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                    {last_page}
                </span>
            </p>

        </div>
    );
}