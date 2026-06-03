export default function ToggleRow({
    label,
    checked,
    onChange,
}) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">
                {label}
            </span>

            <button
                onClick={onChange}
                className={`
                    relative
                    inline-flex
                    h-6
                    w-11
                    items-center
                    rounded-full
                    transition
                    ${checked
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }
                `}
            >
                <span
                    className={`
                        inline-block
                        h-4
                        w-4
                        transform
                        rounded-full
                        bg-white
                        transition
                        ${checked
                            ? "translate-x-6"
                            : "translate-x-1"
                        }
                    `}
                />
            </button>
        </div>
    );
}