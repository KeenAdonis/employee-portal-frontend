
"use client";

import { formatRelativeTime } from "@/utils/formatRelativeTime";
import { getNotificationMeta } from "@/utils/getNotificationMeta";
import { useAuth } from "@/context/AuthContext";
import echo from "@/lib/echo";

import {
    Bell,
    CheckCheck,
    Loader2,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
    getNotifications,
    getUnreadNotificationCount,
    markAllNotificationsAsRead,
    markNotificationAsRead,
} from "@/services/notificationService";

export default function NotificationBell() {

    const router = useRouter();

    const { user } = useAuth();

    /*
    |--------------------------------------------------------------------------
    | STATE
    |--------------------------------------------------------------------------
    */
    const [open, setOpen] = useState(false);

    const [loading, setLoading] = useState(false);

    const [notifications, setNotifications] = useState([]);

    const [unreadCount, setUnreadCount] = useState(0);

    const dropdownRef = useRef(null);

    /*
    |--------------------------------------------------------------------------
    | FETCH NOTIFICATIONS
    |--------------------------------------------------------------------------
    */
    const fetchNotifications = async () => {

        try {

            setLoading(true);

            const [notificationRes, unreadRes] = await Promise.all([
                getNotifications(),
                getUnreadNotificationCount(),
            ]);

            setNotifications(notificationRes?.data || []);

            setUnreadCount(unreadRes?.count || 0);

        } catch (error) {

            console.error(
                "Failed to fetch notifications:",
                error
            );

        } finally {

            setLoading(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | INITIAL LOAD
    |--------------------------------------------------------------------------
    */
    useEffect(() => {

        fetchNotifications();

    }, []);

    /*
    |--------------------------------------------------------------------------
    | AUTO POLLING
    |--------------------------------------------------------------------------
    */
    useEffect(() => {



        if (!user?.id) {
            console.log("NO USER ID");
            return;
        }

        console.log(
            "SUBSCRIBING TO:",
            `notifications.${user.id}`
        );

        const channel = echo.private(
            `notifications.${user.id}`
        );

        channel.subscribed(() => {
            console.log("SUBSCRIBED");
        });

        channel.error((error) => {
            console.error(
                "CHANNEL ERROR",
                error
            );
        });

        channel.listen(
            ".notification.created",
            (event) => {

                console.log(
                    "EVENT RECEIVED",
                    event
                );

                fetchNotifications();
            }
        );

        return () => {
            echo.leave(
                `notifications.${user.id}`
            );
        };

    }, [user]);

    /*
    |--------------------------------------------------------------------------
    | CLOSE DROPDOWN OUTSIDE CLICK
    |--------------------------------------------------------------------------
    */
    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };

    }, []);

    /*
    |--------------------------------------------------------------------------
    | MARK SINGLE AS READ
    |--------------------------------------------------------------------------
    */
    const handleNotificationClick = async (notification) => {

        try {

            if (!notification.is_read) {

                await markNotificationAsRead(notification.id);
            }

            await fetchNotifications();

            if (notification.action_url) {

                router.push(notification.action_url);
            }

            setOpen(false);

        } catch (error) {

            console.error(
                "Notification click failed:",
                error
            );
        }
    };

    /*
    |--------------------------------------------------------------------------
    | MARK ALL AS READ
    |--------------------------------------------------------------------------
    */
    const handleMarkAllAsRead = async () => {

        try {

            await markAllNotificationsAsRead();

            await fetchNotifications();

        } catch (error) {

            console.error(
                "Failed to mark all as read:",
                error
            );
        }
    };

    return (
        <div
            className="relative"
            ref={dropdownRef}
        >

            {/* =======================================================
                BELL BUTTON
            ======================================================= */}
            <button
                onClick={() => setOpen(!open)}
                className="
                    relative
                    p-2
                    rounded-xl
                    hover:bg-white/10
                    transition
                "
            >

                <Bell className="w-5 h-5" />

                {/* BADGE */}
                {unreadCount > 0 && (
                    <span
                        className="
                            absolute
                            -top-1
                            -right-1
                            min-w-[18px]
                            h-[18px]
                            px-1
                            flex
                            items-center
                            justify-center
                            rounded-full
                            bg-red-500
                            text-white
                            text-[10px]
                            font-semibold
                        "
                    >
                        {unreadCount > 99
                            ? "99+"
                            : unreadCount}
                    </span>
                )}
            </button>

            {/* =======================================================
                DROPDOWN
            ======================================================= */}
            {open && (
                <div
                    className="
                        absolute
                        right-0
                        mt-3
                        w-[400px]
                        max-w-[95vw]
                        bg-[#081028]/95
                        backdrop-blur-xl
                        border
                        border-white/10
                        dark:border-slate-700
                        rounded-2xl
                        shadow-[0_10px_40px_rgba(0,0,0,0.45)]
                        overflow-hidden
                        z-50
                    "
                >

                    {/* =======================================================
                        HEADER
                    ======================================================= */}
                    <div
                        className="
                            sticky
                            top-0
                            z-10
                            flex
                            items-center
                            justify-between
                            px-4
                            py-3
                            border-b
                            border-gray-100
                            dark:border-slate-800
                            bg-white/95
                            dark:bg-slate-900/95
                            backdrop-blur
                        "
                    >

                        <div>
                            <h3
                                className="
                                    text-sm
                                    font-semibold
                                    text-gray-900
                                    dark:text-white
                                "
                            >
                                Notifications
                            </h3>

                            <p
                                className="
                                    text-xs
                                    text-gray-500
                                "
                            >
                                {unreadCount} unread
                            </p>
                        </div>

                        {notifications.length > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="
                                    flex
                                    items-center
                                    gap-1
                                    text-xs
                                    text-blue-600
                                    hover:text-blue-700
                                    font-medium
                                    transition
                                "
                            >
                                <CheckCheck size={14} />

                                Mark all read
                            </button>
                        )}
                    </div>

                    {/* =======================================================
                        BODY
                    ======================================================= */}
                    <div
                        className="
                            max-h-[420px]
                            overflow-y-auto
                            scrollbar-thin
                        "
                    >

                        {/* LOADING */}
                        {loading && (
                            <div
                                className="
                                    flex
                                    items-center
                                    justify-center
                                    py-10
                                "
                            >
                                <Loader2
                                    className="
                                        animate-spin
                                        text-gray-400
                                    "
                                    size={22}
                                />
                            </div>
                        )}

                        {/* EMPTY */}
                        {!loading &&
                            notifications.length === 0 && (
                                <div
                                    className="
                                        flex
                                        flex-col
                                        items-center
                                        justify-center
                                        py-14
                                        px-6
                                        text-center
                                    "
                                >

                                    <Bell
                                        size={36}
                                        className="
                                            mb-3
                                            text-gray-300
                                        "
                                    />

                                    <p
                                        className="
                                            text-sm
                                            font-medium
                                            text-gray-600
                                            dark:text-slate-300
                                        "
                                    >
                                        No notifications yet
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-xs
                                            text-gray-400
                                        "
                                    >
                                        You're all caught up.
                                    </p>
                                </div>
                            )}

                        {/* LIST */}
                        {!loading &&
                            notifications.map((notification) => {

                                const {
                                    icon: NotificationIcon,
                                    iconClass,
                                } = getNotificationMeta(
                                    notification.type,
                                    notification.title
                                );

                                return (
                                    <button
                                        key={notification.id}
                                        onClick={() =>
                                            handleNotificationClick(
                                                notification
                                            )
                                        }
                                        className={`
                                            w-full
                                            text-left
                                            px-4
                                            py-4
                                            border-b
                                            border-gray-100
                                            dark:border-slate-800
                                            hover:bg-gray-50
                                            dark:hover:bg-slate-800
                                            transition-all
                                            duration-200

                                            ${!notification.is_read
                                                ? "bg-white/[0.03]"
                                                : "bg-transparent"
                                            }
                                        `}
                                    >

                                        <div
                                            className="
                                                flex
                                                items-start
                                                gap-3
                                            "
                                        >

                                            {/* ICON */}
                                            <div
                                                className={`
                                                    mt-0.5
                                                    w-11
                                                    h-11
                                                    rounded-2xl
                                                    border
                                                    border-white/5
                                                    shadow-sm
                                                    flex
                                                    items-center
                                                    justify-center
                                                    shrink-0
                                                    ${iconClass}
                                                `}
                                            >
                                                <NotificationIcon size={22} />
                                            </div>

                                            {/* CONTENT */}
                                            <div className="flex-1 min-w-0">

                                                <div
                                                    className="
                                                        flex
                                                        items-start
                                                        justify-between
                                                        gap-2
                                                    "
                                                >

                                                    <div className="min-w-0">

                                                        <p
                                                            className="
                                                                text-sm
                                                                font-semibold
                                                                text-gray-900
                                                                dark:text-white
                                                                truncate
                                                            "
                                                        >
                                                            {notification.title}
                                                        </p>

                                                        {notification.message && (
                                                            <p
                                                                className="
                                                                    mt-1
                                                                    text-xs
                                                                    leading-5
                                                                    text-gray-600
                                                                    dark:text-slate-300
                                                                    line-clamp-2
                                                                "
                                                            >
                                                                {notification.message}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* UNREAD DOT */}
                                                    {!notification.is_read && (
                                                        <div
                                                            className="
                                                                mt-1.5
                                                                w-2.5
                                                                h-2.5
                                                                rounded-full
                                                                bg-blue-500
                                                                shrink-0
                                                            "
                                                        />
                                                    )}
                                                </div>

                                                {/* TIME */}
                                                <p
                                                    className="
                                                        mt-2
                                                        text-[11px]
                                                        font-medium
                                                        text-gray-400
                                                    "
                                                >
                                                    {formatRelativeTime(
                                                        notification.created_at
                                                    )}
                                                </p>

                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                    </div>
                </div>
            )}
        </div>
    );
}

