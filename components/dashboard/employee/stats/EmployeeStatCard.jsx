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
                p-7
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
                    right-7
                    top-7
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-2xl
                    ${iconClass}
                `}
            >
                <Icon size={28} />
            </div>

            {/* CONTENT */}
            <div className="pr-20">

                <p
                    className="
                        text-base
                        font-medium
                        text-slate-500
                    "
                >
                    {title}
                </p>

                <h3
                    className="
                        mt-4
                        text-5xl
                        font-bold
                        leading-none
                        tracking-tight
                        text-slate-900
                    "
                >
                    {value}
                </h3>

                {description && (

                    <p
                        className="
                            mt-4
                            text-base
                            leading-7
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