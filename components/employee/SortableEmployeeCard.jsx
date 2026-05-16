"use client";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { GripVertical } from "lucide-react";

export default function SortableEmployeeCard({
    employee,
    index,
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: employee.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`
                bg-white border rounded-2xl
                p-4
                transition-all duration-200
                ${isDragging
                    ? "shadow-2xl scale-[1.02] z-50 border-amber-400"
                    : "hover:shadow-md"
                }
            `}
        >

            <div className="flex items-center gap-4">

                {/* RANK */}
                <div
                    className="
                        w-12 h-12 rounded-2xl
                        bg-gradient-to-r
                        from-amber-400 to-amber-500
                        text-white
                        flex items-center justify-center
                        font-bold text-lg
                        shadow-md shadow-amber-500/30
                    "
                >
                    #{index + 1}
                </div>

                {/* INFO */}
                <div className="flex-1 min-w-0">

                    <h3 className="font-semibold text-gray-900 truncate">
                        {employee.firstname} {employee.lastname}
                    </h3>

                    <p className="text-sm text-gray-500 truncate">
                        {employee.department || "-"}
                    </p>

                </div>

                {/* DRAG HANDLE */}
                <button
                    {...attributes}
                    {...listeners}
                    className="
                        p-2 rounded-xl
                        hover:bg-gray-100
                        text-gray-400
                        hover:text-gray-700
                        cursor-grab active:cursor-grabbing
                    "
                >
                    <GripVertical className="w-5 h-5" />
                </button>

            </div>
        </div>
    );
}