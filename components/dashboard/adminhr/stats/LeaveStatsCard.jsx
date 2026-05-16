"use client";

import { CalendarCheck2 } from "lucide-react";
import StatsCard from "./StatsCard";

export default function LeaveStatsCard({
    approvedLeaves = 0,
}) {

    return (
        <StatsCard
            title="Approved Leaves"
            value={approvedLeaves}
            icon={CalendarCheck2}
            iconColor="text-orange-600"
            iconBg="bg-orange-100"
            description="Employees currently on leave"
        />
    );
}