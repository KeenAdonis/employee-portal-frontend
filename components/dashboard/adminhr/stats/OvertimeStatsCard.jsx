"use client";

import { Clock3 } from "lucide-react";
import StatsCard from "./StatsCard";

export default function OvertimeStatsCard({
    approvedOvertime = 0,
}) {

    return (
        <StatsCard
            title="Approved Overtime"
            value={approvedOvertime}
            icon={Clock3}
            iconColor="text-green-600"
            iconBg="bg-green-100"
            description="Approved overtime requests today"
        />
    );
}