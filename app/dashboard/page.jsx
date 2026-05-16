"use client";

import { useAuth } from "@/context/AuthContext";

import AdminHrDashboardPage from "./adminhr/page";

import EmployeeDashboardPage from "./employee/page";

import AdminAccountingDashboardPage from "./adminaccounting/page";

export default function DashboardPage() {

    const { user } = useAuth();

    if (!user) {
        return (
            <div className="p-6">
                Loading dashboard...
            </div>
        );
    }

    switch (user.role) {

        case "adminhr":
            return <AdminHrDashboardPage />;

        case "employee":
            return <EmployeeDashboardPage />;

        case "adminaccounting":
            return <AdminAccountingDashboardPage />;


        default:
            return (
                <div className="p-6">
                    No dashboard available for this role.
                </div>
            );
    }
}