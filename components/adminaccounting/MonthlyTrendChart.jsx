"use client";

import CustomSelect from "@/components/ui/CustomSelect";

import {

    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    Tooltip,
    XAxis,
    YAxis,

} from "recharts";

/*
|--------------------------------------------------------------------------
| FORMAT CURRENCY
|--------------------------------------------------------------------------
*/
const formatCurrency = (value = 0) => {

    return new Intl.NumberFormat(
        "en-PH",
        {
            style: "currency",
            currency: "PHP",
            maximumFractionDigits: 0,
        }
    ).format(value);
};

const currentYear =
    new Date().getFullYear();

const yearOptions =
    Array.from(
        { length: 5 },
        (_, index) => {

            const year =
                currentYear - index;

            return {
                value: String(year),
                label: String(year),
            };
        }
    );

export default function MonthlyTrendChart({

    monthlyTrend = [],
    loading,
    selectedYear,
    setSelectedYear,

}) {

    return (
        <div
            className="
                rounded-[28px]
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
            "
        >

            {/* HEADER */}
            <div
                className="
        mb-6
        flex
        items-start
        justify-between
        gap-4
    "
            >

                <div>

                    <h2
                        className="
                text-2xl
                font-bold
                tracking-tight
                text-slate-900
            "
                    >
                        Monthly Financial Trend
                    </h2>

                    <p
                        className="
                mt-1
                text-sm
                text-slate-500
            "
                    >
                        Monitor approved requisition totals
                        and financial movement per month.
                    </p>

                </div>

                {/* YEAR FILTER */}
                <div className="w-[140px]">

                    <CustomSelect

                        value={String(selectedYear)}

                        onChange={(value) =>
                            setSelectedYear(
                                Number(value)
                            )
                        }

                        options={yearOptions}

                        placeholder="Year"
                    />

                </div>

            </div>

            {/* LOADING */}
            {loading ? (

                <div
                    className="
                        flex
                        h-[350px]
                        items-center
                        justify-center
                        rounded-2xl
                        border
                        border-slate-200
                        bg-slate-50
                        text-sm
                        text-slate-500
                    "
                >
                    Loading chart...
                </div>

            ) : (

                <div className="h-[350px]">

                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >

                        <AreaChart
                            data={monthlyTrend}
                        >

                            {/* GRID */}
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#e2e8f0"
                            />

                            {/* X AXIS */}
                            <XAxis
                                dataKey="month"
                                tick={{
                                    fontSize: 12,
                                    fill: "#64748b",
                                }}
                                tickLine={false}
                                axisLine={false}
                            />

                            {/* Y AXIS */}
                            <YAxis
                                tickFormatter={(value) =>
                                    `₱${(
                                        value / 1000
                                    ).toFixed(0)}k`
                                }
                                tick={{
                                    fontSize: 12,
                                    fill: "#64748b",
                                }}
                                tickLine={false}
                                axisLine={false}
                            />

                            {/* TOOLTIP */}
                            <Tooltip
                                formatter={(value) =>
                                    formatCurrency(
                                        value
                                    )
                                }
                            />

                            {/* AREA */}
                            <Area
                                type="monotone"
                                dataKey="amount"
                                stroke="#2563eb"
                                fill="#3b82f6"
                                fillOpacity={0.15}
                                strokeWidth={3}
                            />

                        </AreaChart>

                    </ResponsiveContainer>

                </div>

            )}

        </div>
    );
}