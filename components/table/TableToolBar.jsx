"use client";

import { Search } from "lucide-react";

export default function TableToolBar({
    title,
    onSearch,
    onCreate,
    searchPlaceholder = "Search...",
    rightContent,
}) {
    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">

            {/* LEFT */}
            <div>
                {title && (
                    <h2 className="text-lg font-semibold text-gray-800">
                        {title}
                    </h2>
                )}
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2 w-full md:w-auto">

                {/* SEARCH */}
                {onSearch && (
                    <div className="relative w-full md:w-[250px]">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            onChange={(e) => onSearch(e.target.value)}
                            className="
                                w-full pl-9 pr-3 py-2 text-sm
                                border rounded-lg
                                focus:outline-none focus:ring-2 focus:ring-indigo-500
                            "
                        />
                    </div>
                )}

                {/* CUSTOM SLOT */}
                {rightContent}

                {/* CREATE BUTTON */}
                {onCreate && (
                    <button
                        onClick={onCreate}
                        className="
                            bg-indigo-600 text-white text-sm
                            px-4 py-2 rounded-lg shadow
                            hover:bg-indigo-700 transition
                        "
                    >
                        + Create
                    </button>
                )}

            </div>
        </div>
    );
}