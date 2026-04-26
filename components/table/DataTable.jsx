"use client";

export default function DataTable({ columns = [], data = [], renderRow }) {
    return (
        <div className="w-full overflow-x-auto bg-white rounded-xl border">

            <table className="min-w-full text-sm">

                {/* HEADER */}
                <thead className="bg-gray-50 border-b">
                    <tr>
                        {columns.map((col, index) => (
                            <th
                                key={index}
                                className="text-left px-4 py-3 font-medium text-gray-600"
                            >
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>

                {/* BODY */}
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="text-center py-10 text-gray-400"
                            >
                                No data found
                            </td>
                        </tr>
                    ) : (
                        data.map((item) => renderRow(item))
                    )}
                </tbody>

            </table>
        </div>
    );
}