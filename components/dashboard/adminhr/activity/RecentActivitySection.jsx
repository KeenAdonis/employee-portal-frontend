"use client";

import ActivityItem from "./ActivityItem";

export default function RecentActivitySection({
    activities = [],
}) {

    return (
        <section
            className="
                rounded-2xl
                border
                border-gray-200
                bg-white
                p-6
                shadow-sm
            "
        >

            {/* ======================================================
                HEADER
            ====================================================== */}
            <div className="mb-6">

                <h2
                    className="
                        text-xl
                        font-bold
                        text-gray-900
                    "
                >
                    Recent Activities
                </h2>

                <p
                    className="
                        mt-1
                        text-sm
                        text-gray-500
                    "
                >
                    Latest HR and employee activities.
                </p>

            </div>

            {/* ======================================================
                EMPTY STATE
            ====================================================== */}
            {activities.length === 0 && (

                <div
                    className="
                        flex
                        h-40
                        items-center
                        justify-center
                        rounded-2xl
                        border
                        border-dashed
                        border-gray-300
                        bg-gray-50
                    "
                >

                    <p
                        className="
                            text-sm
                            text-gray-500
                        "
                    >
                        No recent activities.
                    </p>

                </div>
            )}

            {/* ======================================================
                TIMELINE
            ====================================================== */}
            {activities.length > 0 && (

                <div
                    className="
                        max-h-[700px]
                        overflow-y-auto
                        pr-2
                    "
                >

                    {activities.map((activity) => (

                        <ActivityItem
                            key={activity.id}
                            activity={activity}
                        />

                    ))}

                </div>
            )}

        </section>
    );
}