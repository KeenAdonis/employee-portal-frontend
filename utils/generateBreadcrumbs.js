import { menuByRole } from "@/config/menu";

export function generateBreadcrumbs(role, pathname) {
    const menu = menuByRole[role] || [];

    let matchedItem = null;

    for (const section of menu) {
        for (const item of section.items) {

            if (
                pathname === item.href ||
                pathname.startsWith(item.href + "/")
            ) {
                if (
                    !matchedItem ||
                    item.href.length > matchedItem.href.length
                ) {
                    matchedItem = {
                        section: section.section,
                        label: item.label,
                        icon: item.icon,
                        href: item.href,
                    };
                }
            }
        }
    }

    return (
        matchedItem || {
            section: "General",
            label: "Dashboard",
            icon: null,
        }
    );
}