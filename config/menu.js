import {
  LayoutDashboard,
  Users,
  Clock,
  Calendar,
  Wallet,
  FileText,
  HandCoins,
  User,
  BarChart3,
  Megaphone,
  FileLock,
  ClipboardClock,
  UserSearchIcon,
  PiggyBank,
  Handshake,
  Receipt,
  Car,
} from "lucide-react";

export const menuByRole = {
  /* =========================
     ADMIN (SUPER ADMIN)
  ========================= */
  admin: [
    {
      section: "General",
      items: [
        {
          label: "Dashboard",
          href: "/dashboard",
          icon: <LayoutDashboard size={18} />,
        },
      ],
    },
    {
      section: "Management",
      items: [
        {
          label: "Employees",
          href: "/dashboard/employees",
          icon: <Users size={18} />,
        },
        {
          label: "HR",
          href: "/dashboard/hr",
          icon: <Users size={18} />,
        },
        {
          label: "Accounting",
          href: "/dashboard/accounting",
          icon: <Wallet size={18} />,
        },
        {
          label: "Marketing",
          href: "/dashboard/marketing",
          icon: <Megaphone size={18} />,
        },
      ],
    },
  ],

  /* =========================
     EMPLOYEE
  ========================= */
  employee: [
    {
      section: "General",
      items: [
        {
          label: "Dashboard",
          href: "/dashboard",
          icon: <LayoutDashboard size={18} />,
        },
      ],
    },
    {
      section: "Profile",
      items: [
        {
          label: "My Profile",
          href: "/dashboard/employee/profile",
          icon: <User size={18} />,
        },
      ],
    },
    {
      section: "Finance Forms",
      items: [
        {
          label: "Finance",
          href: "/dashboard/employee/requisition",
          icon: <HandCoins size={18} />,
        },
        {
          label: "Liquidation",
          href: "/dashboard/employee/liquidation",
          icon: <Receipt size={18} />,
        },
      ],
    },
    {
      section: "Human Resources Forms",
      items: [
        {
          label: "Overtime",
          href: "/dashboard/employee/overtime",
          icon: <Clock size={18} />,
        },
        {
          label: "Leave",
          href: "/dashboard/employee/leave",
          icon: <Calendar size={18} />,
        },
        {
          label: "Employee Survey",
          href: "/dashboard/employee/survey",
          icon: <UserSearchIcon size={18} />,
        },
        {
          label: "Travel Itinerary",
          href: "/dashboard/employee/travel",
          icon: <Car size={18} />,
        },
      ],
    },
  ],

  /* =========================
     ADMIN HR
  ========================= */
  adminhr: [
    {
      section: "General",
      items: [
        {
          label: "Dashboard",
          href: "/dashboard/adminhr",
          icon: (
            <LayoutDashboard
              size={18}
              className="text-cyan-900"
            />
          ),
        },
      ],
    },
    {
      section: "HR Management",
      items: [
        {
          label: "Employee Directory",
          href: "/dashboard/adminhr/employee-list",
          icon: <Users size={18} />,
        },
        {
          label: "Overtime",
          href: "/dashboard/adminhr/overtime-list",
          icon: <Clock size={18} />,
        },
        {
          label: "Leave",
          href: "/dashboard/adminhr/leave-list",
          icon: <Calendar size={18} />,
        },
      ],
    },
    {
      section: "Finance",
      items: [
        {
          label: "Finance Management",
          href: "/dashboard/adminhr/requisition-list",
          icon: <HandCoins size={18} />,
        },
        {
          label: "Liquidation",
          href: "/dashboard/adminhr/liquidation-list",
          icon: <Receipt size={18} />,
        },
        {
          label: "Payroll",
          href: "/dashboard/adminhr/payroll-list",
          icon: <Wallet size={18} />,
        },
        {
          label: "Loans",
          href: "/dashboard/adminhr/loan-list",
          icon: <Handshake size={18} />,
        },
      ],
    },
    {
      section: "Forms",
      items: [
        {
          label: "Travel Itinerary",
          href: "/dashboard/adminhr/travel-list",
          icon: <Car size={18} />,
        },
        {
          label: "Daily Time Record",
          href: "/dashboard/adminhr/dtr-list",
          icon: <ClipboardClock size={18} />,
        },
        {
          label: "Employee Survey",
          href: "/dashboard/adminhr/survey-list",
          icon: <UserSearchIcon size={18} />,
        },
      ],
    },
  ],

  /* =========================
     ADMIN ACCOUNTING
  ========================= */
  adminaccounting: [
    {
      section: "General",
      items: [
        {
          label: "Dashboard",
          href: "/dashboard",
          icon: <LayoutDashboard size={18} />,
        },
      ],
    },
    {
      section: "Finance",
      items: [
        {
          label: "Finance Requests",
          href: "/dashboard/adminaccounting/finance-requisition",
          icon: <Wallet size={18} />,
        },
        {
          label: "Liquidations",
          href: "/dashboard/adminaccounting/finance-liquidation",
          icon: <Receipt size={18} />,
        },
        {
          label: "Reports",
          href: "/dashboard/adminaccounting/finance-report",
          icon: <BarChart3 size={18} />,
        },
      ],
    },
  ],

  /* =========================
     ADMIN MARKETING
  ========================= */
  adminmarketing: [
    {
      section: "General",
      items: [
        {
          label: "Dashboard",
          href: "/dashboard",
          icon: <LayoutDashboard size={18} />,
        },
      ],
    },
    {
      section: "Marketing",
      items: [
        {
          label: "Campaigns",
          href: "/dashboard/campaigns",
          icon: <Megaphone size={18} />,
        },
        {
          label: "Analytics",
          href: "/dashboard/analytics",
          icon: <BarChart3 size={18} />,
        },
      ],
    },
  ],

  /* =========================
   ADMIN TESTING
========================= */
  admintesting: [
    {
      section: "General",
      items: [
        {
          label: "Dashboard",
          href: "/dashboard",
          icon: <LayoutDashboard size={18} />,
        },
      ],
    },
    {
      section: "Testing Tools", // 👈 new section
      items: [
        {
          label: "Secure Documents",
          href: "/dashboard/admintesting/secure-documents",
          icon: <FileLock size={18} />, // 👈 bagay na icon
        },
        {
          label: "Activity & Logs",
          href: "/dashboard/admintesting/logs",
          icon: <FileText size={18} />, // 👈 bagay na icon
        },
      ],
    },
  ],
};