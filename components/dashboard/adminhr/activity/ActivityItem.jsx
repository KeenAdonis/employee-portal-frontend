"use client";

import { formatRelativeTime } from "@/utils/formatRelativeTime";
import { getNotificationMeta } from "@/utils/getNotificationMeta";

export default function ActivityItem({
    activity,
}) {

    const {
        icon: NotificationIcon,
        iconClass,
    } = getNotificationMeta(
        activity.type,
        activity.title
    );

    return (
        <div
            className="
                relative
                flex
                gap-4
            "
        >

            {/* ======================================================
                TIMELINE LINE
            ====================================================== */}
            <div
                className="
                    absolute
                    left-[22px]
                    top-14
                    bottom-0
                    w-px
                    bg-gray-200
                "
            />

            {/* ======================================================
                ICON
            ====================================================== */}
            <div
                className={`
                    relative
                    z-10
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-white
                    shadow-sm
                    ${iconClass}
                `}
            >
                <NotificationIcon size={20} />
            </div>

            {/* ======================================================
                CONTENT
            ====================================================== */}
            <div className="flex-1 pb-8">

                <div
                    className="
                        rounded-2xl
                        border
                        border-gray-200
                        bg-white
                        p-4
                        shadow-sm
                    "
                >

                    <div
                        className="
                            flex
                            items-start
                            justify-between
                            gap-3
                        "
                    >

                        <div className="min-w-0">

                            <h3
                                className="
                                    text-sm
                                    font-semibold
                                    text-gray-900
                                "
                            >
                                {activity.title}
                            </h3>

                            {activity.message && (
                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        leading-6
                                        text-gray-600
                                    "
                                >
                                    {activity.message}
                                </p>
                            )}

                        </div>

                        {!activity.is_read && (
                            <div
                                className="
                                    mt-1
                                    h-2.5
                                    w-2.5
                                    shrink-0
                                    rounded-full
                                    bg-blue-500
                                "
                            />
                        )}

                    </div>

                    {/* TIME */}
                    <p
                        className="
                            mt-3
                            text-xs
                            font-medium
                            text-gray-400
                        "
                    >
                        {formatRelativeTime(
                            activity.created_at
                        )}
                    </p>

                </div>

            </div>

        </div>
    );
}