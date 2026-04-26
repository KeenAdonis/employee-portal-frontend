"use client";

export default function Tabs({ value, onChange }) {

    const tabs = [
        { key: "requests", label: "Requests" },
        { key: "history", label: "History" },
    ];

    return (
        <div className="border-b border-gray-200 mb-4">
            <div className="flex gap-6">

                {tabs.map((tab) => {
                    const active = value === tab.key;

                    return (
                        <button
                            key={tab.key}
                            onClick={() => onChange(tab.key)}
                            className={`relative pb-3 text-sm font-medium transition
                                ${active
                                    ? "text-indigo-600"
                                    : "text-gray-500 hover:text-gray-700"
                                }
                            `}
                        >
                            {tab.label}

                            {active && (
                                <span className="absolute left-0 bottom-0 w-full h-[2px] bg-indigo-600 rounded-full" />
                            )}
                        </button>
                    );
                })}

            </div>
        </div>
    );
}