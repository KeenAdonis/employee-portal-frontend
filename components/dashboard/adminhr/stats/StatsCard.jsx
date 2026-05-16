import { ArrowUpRight } from "lucide-react";

export default function StatsCard({
    title,
    value,
    icon: Icon,
    iconColor = "text-blue-600",
    iconBg = "bg-blue-100",
    description,
}) {

    return (
        <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

            {/* TOP */}
            <div className="flex items-start justify-between">

                {/* TEXT */}
                <div className="space-y-2">

                    <p className="text-sm font-medium text-gray-500">
                        {title}
                    </p>

                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                        {value}
                    </h2>

                </div>

                {/* ICON */}
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}>

                    <Icon className={`h-6 w-6 ${iconColor}`} />

                </div>

            </div>

            {/* BOTTOM */}
            <div className="mt-5 flex items-center justify-between">

                <p className="text-sm text-gray-500">
                    {description}
                </p>

                <ArrowUpRight className="h-4 w-4 text-gray-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />

            </div>

        </div>
    );
}