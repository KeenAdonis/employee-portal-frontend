import DataTable from "@/components/table/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import { getInitials } from "@/lib/utils";

import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { MailPlus, Paperclip } from "lucide-react";

export default function SecureDocumentTable({
    data,
    onSendSingle,
    onSendGrouped,
    selected,
    toggle,
}) {

    /*
    |--------------------------------------------------------------------------
    | GROUP DOCUMENTS
    |--------------------------------------------------------------------------
    */

    const groupedData = data || [];

    const columns = [
        "",
        "Employee",
        "Email",
        "Files",
        "Status",
        "Actions"
    ];

    return (
        <DataTable
            columns={columns}
            data={groupedData}
            renderRow={(item) => (

                <tr
                    key={item.ids.join("-")}
                    className="hover:bg-gray-50"
                >

                    {/* CHECKBOX */}
                    <td className="px-4 py-3">

                        <input
                            type="checkbox"
                            disabled={
                                item.status === "Sent" ||
                                item.status === "Queued" ||
                                item.status === "Processing"
                            }
                            checked={item.ids.every(id =>
                                selected.includes(id)
                            )}
                            onChange={() => {

                                const isSelected =
                                    item.ids.every(id =>
                                        selected.includes(id)
                                    );

                                if (isSelected) {

                                    item.ids.forEach(id => {

                                        if (selected.includes(id)) {

                                            const row = data.find(
                                                d => d.id === id
                                            );

                                            if (row) {
                                                toggle(row);
                                            }
                                        }
                                    });

                                } else {

                                    item.ids.forEach(id => {

                                        if (!selected.includes(id)) {

                                            const row = data.find(
                                                d => d.id === id
                                            );

                                            if (row) {
                                                toggle(row);
                                            }
                                        }
                                    });
                                }
                            }}
                            className={
                                item.status === "Sent" ||
                                    item.status === "Queued" ||
                                    item.status === "Processing"
                                    ? "cursor-not-allowed opacity-50"
                                    : ""
                            }
                        />

                    </td>

                    {/* EMPLOYEE */}
                    <td className="px-4 py-3">

                        <div className="flex items-center gap-3">

                            <div className="
                                w-10 h-10
                                rounded-full
                                bg-gradient-to-r
                                from-indigo-500
                                to-blue-500
                                text-white
                                flex
                                items-center
                                justify-center
                                text-sm
                                font-semibold
                            ">
                                {getInitials(item.employee_name)}
                            </div>

                            <div>
                                <div className="
                                    font-medium
                                    text-gray-900
                                ">
                                    {item.employee_name}
                                </div>
                            </div>

                        </div>

                    </td>

                    {/* EMAIL */}
                    <td className="px-4 py-3">

                        <div className="flex flex-wrap gap-2 max-w-[260px]">

                            {item.allEmails.slice(0, 1).map((email, index) => (
                            
                                <span
                                    key={index}
                                    className="
                                        px-2 py-1
                                        rounded-full
                                        bg-gray-100
                                        text-gray-700
                                        text-xs
                                        truncate
                                        max-w-[220px]
                                    "
                                >
                                    {email}
                                </span>

                            ))}

                            {item.allEmails.length > 1 && (
                            
                                <Popover>
                                
                                    <PopoverTrigger asChild>
                            
                                        <button
                                            type="button"
                                            className="
                                                px-2 py-1
                                                rounded-full
                                                bg-indigo-100
                                                text-indigo-700
                                                text-xs
                                                font-medium
                                                hover:bg-indigo-200
                                                transition
                                            "
                                        >
                                            +{item.allEmails.length - 1}
                                        </button>
                            
                                    </PopoverTrigger>
                            
                                    <PopoverContent
                                        align="start"
                                        className="w-80 p-3"
                                    >
                                    
                                        <div className="space-y-2">
                            
                                            <div className="mb-2">
                            
                                                <h4 className="text-sm font-semibold text-gray-800">
                                                    Recipient Emails
                                                </h4>
                            
                                                <p className="text-xs text-gray-500">
                                                    Additional email recipients
                                                </p>
                            
                                            </div>
                            
                                            <div className="
                                                max-h-64
                                                overflow-y-auto
                                                space-y-2
                                                pr-1
                                            ">
                                            
                                                {item.allEmails.slice(1).map((email, idx) => (
                                                
                                                    <div
                                                        key={idx}
                                                        className="
                                                            flex items-center gap-2
                                                            rounded-xl
                                                            border
                                                            bg-gray-50
                                                            px-3 py-2
                                                        "
                                                    >
                                                    
                                                        <div className="
                                                            w-8 h-8
                                                            rounded-lg
                                                            bg-indigo-100
                                                            flex items-center justify-center
                                                            shrink-0
                                                            text-xs
                                                        ">
                                                            <MailPlus size={16}/>
                                                        </div>
                                                
                                                        <div className="overflow-hidden">
                                                
                                                            <p className="
                                                                text-xs
                                                                text-gray-700
                                                                truncate
                                                            ">
                                                                {email}
                                                            </p>
                                                
                                                        </div>
                                                
                                                    </div>

                                                ))}

                                            </div>
                                            
                                        </div>
                                            
                                    </PopoverContent>
                                            
                                </Popover>

                            )}

                        </div>
                        
                    </td>

                    {/* FILES */}
                    <td className="px-4 py-3">

                        <div className="flex flex-wrap gap-2 max-w-[320px]">

                            {item.files.slice(0, 3).map((file, index) => (
                            
                                <span
                                    key={index}
                                    title={file}
                                    className="
                                        px-2 py-1
                                        rounded-full
                                        bg-indigo-50
                                        text-indigo-700
                                        text-xs
                                        max-w-[220px]
                                        truncate
                                    "
                                >
                                    {file}
                                </span>

                            ))}

                            {item.files.length > 3 && (
                            
                                <Popover>
                                
                                    <PopoverTrigger asChild>
                            
                                        <button
                                            type="button"
                                            className="
                                                px-2 py-1
                                                rounded-full
                                                bg-indigo-100
                                                text-indigo-700
                                                text-xs
                                                font-medium
                                                hover:bg-indigo-200
                                                transition
                                            "
                                        >
                                            +{item.files.length - 3} more
                                        </button>
                            
                                    </PopoverTrigger>
                            
                                    <PopoverContent
                                        align="start"
                                        className="w-80 p-3"
                                    >
                                    
                                        <div className="space-y-2">
                            
                                            <div className="mb-2">
                            
                                                <h4 className="text-sm font-semibold text-gray-800">
                                                    Additional Files
                                                </h4>
                            
                                                <p className="text-xs text-gray-500">
                                                    Remaining encrypted PDF files
                                                </p>
                            
                                            </div>
                            
                                            <div className="
                                                max-h-64
                                                overflow-y-auto
                                                space-y-2
                                                pr-1
                                            ">
                                            
                                                {item.files.slice(3).map((file, idx) => (
                                                
                                                    <div
                                                        key={idx}
                                                        className="
                                                            flex items-center gap-2
                                                            rounded-xl
                                                            border
                                                            bg-gray-50
                                                            px-3 py-2
                                                        "
                                                    >
                                                    
                                                        <div className="
                                                            w-8 h-8
                                                            rounded-lg
                                                            bg-indigo-100
                                                            flex items-center justify-center
                                                            shrink-0
                                                        ">
                                                            <Paperclip size={16}/>
                                                        </div>
                                                
                                                        <div className="overflow-hidden">
                                                
                                                            <p className="
                                                                text-xs
                                                                text-gray-700
                                                                truncate
                                                            ">
                                                                {file}
                                                            </p>
                                                
                                                        </div>
                                                
                                                    </div>

                                                ))}

                                            </div>
                                            
                                        </div>
                                            
                                    </PopoverContent>
                                            
                                </Popover>

                            )}

                        </div>
                        
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-3">
                        <StatusBadge status={item.status} />
                    </td>

                    {/* ACTIONS */}
                    <td className="px-4 py-3">

                        <div className="flex items-center gap-2">

                            {/* DRAFT */}
                            {item.status === "Draft" && (
                                <>
                                    {/* SEND FILE */}
                                    <button
                                        onClick={() =>
                                            onSendSingle(item.ids[0])
                                        }
                                        className="
                                            px-2 py-1
                                            rounded-lg
                                            border
                                            text-xs
                                            text-gray-600
                                            hover:bg-gray-100
                                        "
                                    >
                                        Send File
                                    </button>

                                    {/* SEND GROUP */}
                                    {item.files.length > 1 && (

                                        <button
                                            onClick={() =>
                                                onSendGrouped(item.ids[0])
                                            }
                                            className="
                                                px-2 py-1
                                                rounded-lg
                                                bg-indigo-600
                                                text-white
                                                text-xs
                                                hover:bg-indigo-700
                                            "
                                        >
                                            Send Group
                                        </button>
                                    )}
                                </>
                            )}

                            {/* PROCESSING */}
                            {(item.status === "Queued" ||
                                item.status === "Processing") && (

                                    <div
                                        className="
                                            px-2 py-1
                                            rounded-lg
                                            bg-gray-100
                                            text-gray-500
                                            text-xs
                                            cursor-not-allowed
                                        "
                                    >
                                        Processing...
                                    </div>
                                )}

                            {/* SENT */}
                            {item.status === "Sent" && (

                                <div
                                    className="
                                            px-2 py-1
                                            rounded-lg
                                            bg-green-50
                                            text-green-700
                                            text-xs
                                            cursor-default
                                        "
                                >
                                    Delivered
                                </div>
                            )}

                        </div>

                    </td>

                </tr>
            )}
        />
    );
}