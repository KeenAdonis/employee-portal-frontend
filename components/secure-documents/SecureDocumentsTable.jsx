import DataTable from "@/components/table/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import { Send } from "lucide-react";
import { getInitials } from "@/lib/utils";

export default function SecureDocumentTable({
    data,
    onSendSingle,
    selected,
    toggle,
}) {
    const columns = ["", "Employee", "Email", "File", "Status", "Actions"];

    return (
        <DataTable
            columns={columns}
            data={data}
            renderRow={(item) => (
                <tr key={item.id} className="hover:bg-gray-50">

                    {/* CHECKBOX */}
                    <td className="px-4 py-3">
                        <input
                            type="checkbox"
                            checked={selected.includes(item.id)}
                            onChange={() => toggle(item.id)}
                        />
                    </td>

                    {/* EMPLOYEE */}
                    <td className="px-4 py-3">
                        <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white flex items-center justify-center text-sm font-semibold">
                                {getInitials(item.employee_name)}
                            </div>

                            <div>
                                <div className="font-medium text-gray-900">
                                    {item.employee_name}
                                </div>
                            </div>

                        </div>
                    </td>

                    {/* EMAIL */}
                    <td className="px-4 py-3">
                        {item.email}
                    </td>

                    {/* FILE */}
                    <td className="px-4 py-3">
                        {item.file_name}
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-3">
                        <StatusBadge status={item.status} />
                    </td>

                    {/* ACTIONS */}
                    <td className="px-4 py-3">
                        <button
                            onClick={() => onSendSingle(item.id)}
                            className="text-gray-500 hover:text-indigo-600"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </td>

                </tr>
            )}
        />
    );
}