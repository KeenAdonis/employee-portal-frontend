export default function DashboardSkeleton() {

    return (
        <div className="space-y-6 animate-pulse">

            {/* =========================================================
                HEADER SKELETON
            ========================================================= */}
            <div className="rounded-2xl bg-[#0B1739] p-6">

                <div className="h-8 w-56 rounded-lg bg-white/10" />

                <div className="mt-3 h-4 w-80 rounded-lg bg-white/10" />

            </div>

            {/* =========================================================
                QUICK ACTIONS
            ========================================================= */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                <div className="mb-6">

                    <div className="h-6 w-40 rounded-lg bg-gray-200" />

                    <div className="mt-2 h-4 w-64 rounded-lg bg-gray-100" />

                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

                    {[...Array(4)].map((_, index) => (

                        <div
                            key={index}
                            className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
                        >

                            <div className="h-14 w-14 rounded-2xl bg-gray-200" />

                            <div className="mt-5 h-5 w-32 rounded-lg bg-gray-200" />

                            <div className="mt-2 h-4 w-44 rounded-lg bg-gray-100" />

                        </div>

                    ))}

                </div>

            </div>

            {/* =========================================================
                STATS CARDS
            ========================================================= */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

                {[...Array(3)].map((_, index) => (

                    <div
                        key={index}
                        className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                    >

                        <div className="flex items-start justify-between">

                            <div>

                                <div className="h-4 w-28 rounded-lg bg-gray-200" />

                                <div className="mt-4 h-10 w-20 rounded-lg bg-gray-300" />

                            </div>

                            <div className="h-12 w-12 rounded-xl bg-gray-200" />

                        </div>

                        <div className="mt-6 h-4 w-40 rounded-lg bg-gray-100" />

                    </div>

                ))}

            </section>

            {/* =========================================================
                LARGE SECTIONS
            ========================================================= */}
            {[...Array(3)].map((_, index) => (

                <div
                    key={index}
                    className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                >

                    <div className="h-6 w-52 rounded-lg bg-gray-200" />

                    <div className="mt-2 h-4 w-72 rounded-lg bg-gray-100" />

                    <div className="mt-6 space-y-4">

                        {[...Array(3)].map((_, innerIndex) => (

                            <div
                                key={innerIndex}
                                className="flex items-center justify-between rounded-2xl border border-gray-100 p-4"
                            >

                                <div className="flex items-center gap-4">

                                    <div className="h-12 w-12 rounded-2xl bg-gray-200" />

                                    <div>

                                        <div className="h-4 w-40 rounded-lg bg-gray-200" />

                                        <div className="mt-2 h-3 w-28 rounded-lg bg-gray-100" />

                                    </div>

                                </div>

                                <div className="h-4 w-24 rounded-lg bg-gray-100" />

                            </div>

                        ))}

                    </div>

                </div>

            ))}

        </div>
    );
}