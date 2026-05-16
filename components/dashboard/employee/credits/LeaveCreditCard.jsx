"use client";

export default function LeaveCreditCard({
    title,
    value,
    icon: Icon,
    iconBg,
    iconColor,
}) {

    return (
        <div
            className="
                flex
                items-center
                justify-between
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                transition-all
                duration-300
                hover:shadow-md
            "
        >

            {/* =====================================================
                LEFT SIDE
            ===================================================== */}
            <div className="flex items-center gap-4">

                {/* ICON */}
                <div
                    className={`
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-2xl
                        ${iconBg}
                    `}
                >
                    <Icon
                        className={`
                            h-6
                            w-6
                            ${iconColor}
                        `}
                    />
                </div>

                {/* INFO */}
                <div>

                    <h3
                        className="
                            text-sm
                            font-semibold
                            text-slate-900
                        "
                    >
                        {title}
                    </h3>

                    <p
                        className="
                            mt-1
                            text-xs
                            text-slate-500
                        "
                    >
                        Available balance
                    </p>
                </div>
            </div>

            {/* =====================================================
                RIGHT SIDE
            ===================================================== */}
            <div
                className="
                    text-xl
                    font-bold
                    tracking-tight
                    text-slate-900
                "
            >
                {value}
            </div>
        </div>
    );
}