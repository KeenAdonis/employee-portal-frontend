"use client";

import {
    Info,
    Trophy,
    ArrowDownUp,
    ShieldCheck,
} from "lucide-react";

export default function SurveyInstructions() {
    return (
        <div
            className="
                bg-gradient-to-br
                from-amber-50 to-white
                border border-amber-100
                rounded-2xl
                p-6
                space-y-5
            "
        >

            {/* HEADER */}
            <div className="flex items-start gap-3">

                <div
                    className="
                        w-12 h-12 rounded-2xl
                        bg-amber-100
                        flex items-center justify-center
                        text-amber-600
                    "
                >
                    <Info className="w-6 h-6" />
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        Employee Engagement Survey
                    </h2>

                    <p className="text-sm text-gray-600 mt-1">
                        Rank employees from highest to lowest based on
                        your overall professional experience working with them.
                    </p>
                </div>

            </div>

            {/* RULES */}
            <div className="space-y-4">

                <InstructionItem
                    icon={<ArrowDownUp className="w-5 h-5" />}
                    title="Drag & Drop Ranking"
                    description="Drag employee cards to reorder rankings from highest to lowest."
                />

                <InstructionItem
                    icon={<Trophy className="w-5 h-5" />}
                    title="Top Ranked Employee"
                    description="Your #1 employee will automatically receive the highest score."
                />

                <InstructionItem
                    icon={<ShieldCheck className="w-5 h-5" />}
                    title="Anonymous & Confidential"
                    description="Individual rankings and responses are kept confidential."
                />

            </div>

        </div>
    );
}

function InstructionItem({
    icon,
    title,
    description,
}) {
    return (
        <div className="flex items-start gap-3">

            <div
                className="
                    w-10 h-10 rounded-xl
                    bg-white border
                    flex items-center justify-center
                    text-amber-500
                    shrink-0
                "
            >
                {icon}
            </div>

            <div>
                <h3 className="font-medium text-gray-900">
                    {title}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                    {description}
                </p>
            </div>

        </div>
    );
}