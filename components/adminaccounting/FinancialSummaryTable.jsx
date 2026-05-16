"use client";

import {
    FileText,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| FORMAT CURRENCY
|--------------------------------------------------------------------------
*/
const formatCurrency = (amount = 0) => {

    return new Intl.NumberFormat(
        "en-PH",
        {
            style: "currency",
            currency: "PHP",
            maximumFractionDigits: 0,
        }
    ).format(amount);
};

export default function FinancialSummaryTable({

    financialSummary = [],

    loading,

}) {

    return (
        <div
            className="
                rounded-[28px]
                border
                border-slate-200
                bg-white
                shadow-sm
                overflow-hidden
            "
        >

            {/* HEADER */}
            <div className="p-6 border-b border-slate-200">

                <div
                    className="
                        flex
                        items-center
                        justify-between
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
                            Financial Summary
                        </h2>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-slate-500
                            "
                        >
                            Summary of approved requests
                            categorized by requisition type.
                        </p>

                    </div>

                    <div
                        className="
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-2xl
                            bg-blue-100
                        "
                    >

                        <FileText
                            className="
                                h-6
                                w-6
                                text-blue-600
                            "
                        />

                    </div>

                </div>

            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead
                        className="
                            border-b
                            border-slate-200
                            bg-slate-50
                        "
                    >

                        <tr>

                            <th
                                className="
                                    px-6
                                    py-4
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-slate-500
                                "
                            >
                                Request Type
                            </th>

                            <th
                                className="
                                    px-6
                                    py-4
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-slate-500
                                "
                            >
                                Total Requests
                            </th>

                            <th
                                className="
                                    px-6
                                    py-4
                                    text-right
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-slate-500
                                "
                            >
                                Approved Amount
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {loading ? (

                            <tr>

                                <td
                                    colSpan="3"
                                    className="
                                        px-6
                                        py-10
                                        text-center
                                        text-sm
                                        text-slate-500
                                    "
                                >
                                    Loading financial summary...
                                </td>

                            </tr>

                        ) : financialSummary.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="3"
                                    className="
                                        px-6
                                        py-10
                                        text-center
                                        text-sm
                                        text-slate-500
                                    "
                                >
                                    No financial data found.
                                </td>

                            </tr>

                        ) : (

                            financialSummary.map(
                                (item, index) => (

                                    <tr
                                        key={index}
                                        className="
                                            border-b
                                            border-slate-100
                                            transition-colors
                                            hover:bg-slate-50
                                        "
                                    >

                                        {/* TYPE */}
                                        <td
                                            className="
                                                px-6
                                                py-5
                                            "
                                        >

                                            <div
                                                className="
                                                    font-medium
                                                    text-slate-900
                                                "
                                            >
                                                {item.type}
                                            </div>

                                        </td>

                                        {/* COUNT */}
                                        <td
                                            className="
                                                px-6
                                                py-5
                                                text-sm
                                                text-slate-600
                                            "
                                        >
                                            {item.total_requests}
                                        </td>

                                        {/* AMOUNT */}
                                        <td
                                            className="
                                                px-6
                                                py-5
                                                text-right
                                            "
                                        >

                                            <span
                                                className="
                                                    font-semibold
                                                    text-slate-900
                                                "
                                            >
                                                {formatCurrency(
                                                    item.approved_amount
                                                )}
                                            </span>

                                        </td>

                                    </tr>
                                )
                            )

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}