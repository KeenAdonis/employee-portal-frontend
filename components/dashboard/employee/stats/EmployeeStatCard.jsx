"use client";

export default function EmployeeStatCard({
    title,
    value,
    icon: Icon,
    iconClass = "",
    description,
}) {

    return (
        <div
            className="
                relative
                overflow-hidden
                rounded-3xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-[0_2px_10px_rgba(15,23,42,0.04)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-[0_8px_30px_rgba(15,23,42,0.08)]
            "
        >

            {/* ICON */}
            <div
                className={`
                    absolute
                    right-6
                    top-6
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-2xl
                    ${iconClass}
                `}
            >
                <Icon size={26} />
            </div>

            {/* CONTENT */}
            <div className="pr-20">

                {/* TITLE */}
                <p
                    className="
                        text-base
                        font-medium
                        text-slate-500
                    "
                >
                    {title}
                </p>

                {/* VALUE */}
                <h3
                    className="
                        mt-3
                        text-4xl
                        font-bold
                        leading-none
                        tracking-tight
                        text-slate-900
                    "
                >
                    {value}
                </h3>

                {/* DESCRIPTION */}
                {description && (

                    <p
                        className="
                            mt-3
                            text-sm
                            leading-6
                            text-slate-500
                        "
                    >
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}