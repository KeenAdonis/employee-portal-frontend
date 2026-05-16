"use client";

import { Users } from "lucide-react";
import StatsCard from "./StatsCard";

export default function EmployeeStatsCard({
    totalEmployees = 0,
}) {

    return (
        <StatsCard
            title="Total Employees"
            value={totalEmployees}
            bg-white
            icon={Users}
            iconColor="text-blue-600"
            iconBg="bg-blue-100"
            description="Active employees across all companies"
        />
    );
}