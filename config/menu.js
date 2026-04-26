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
      section: "My Account",
      items: [
        {
          label: "My Profile",
          href: "/dashboard/profile",
          icon: <User size={18} />,
        },
        {
          label: "Payslip",
          href: "/dashboard/payslip",
          icon: <Wallet size={18} />,
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
          href: "/dashboard",
          icon: <LayoutDashboard size={18} />,
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
          label: "Payroll",
          href: "/dashboard/adminhr/payroll",
          icon: <Wallet size={18} />,
        },
      ],
    },
    {
      section: "Forms",
      items: [
        {
          label: "Travel Itinerary",
          href: "/dashboard/adminhr/travel-itinerary",
          icon: <FileText size={18} />,
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
          label: "Payroll",
          href: "/dashboard/payroll",
          icon: <Wallet size={18} />,
        },
        {
          label: "Reports",
          href: "/dashboard/reports",
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
};