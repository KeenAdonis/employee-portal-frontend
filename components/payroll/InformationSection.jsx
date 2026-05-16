"use client";

import Input from "@/components/ui/Input";
import CustomSelect from "@/components/ui/CustomSelect";
import CustomDatePicker from "@/components/ui/CustomDatePicker";

/* =========================
FORM FIELD WRAPPER
========================= */
function FormField({ label, required = false, error, value, children }) {

    const isValid =
        value !== undefined &&
        value !== null &&
        value.toString().trim() !== "" &&
        !error;

    const starColor = isValid
        ? "text-green-500"
        : error
            ? "text-red-500"
            : "text-gray-400";

    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">
                {label}
                {required && (
                    <span className={`${starColor} ml-1 font-bold`}>*</span>
                )}
            </label>

            {children}

            {error && (
                <span className="text-xs text-red-500">
                    {error}
                </span>
            )}
        </div>
    );
}

export default function PayrollInformationSection({
    form,
    errors,
    employees,
    onChange,
    onSelectEmployee,
}) {
    return (
        <div className="bg-white border rounded-2xl p-6 space-y-6">

            {/* HEADER */}
            <div>
                <h2 className="text-sm font-semibold text-gray-700">
                    Payroll Information
                </h2>
                <p className="text-xs text-gray-500">
                    Basic employee payroll details
                </p>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-2 gap-4">

                {/* EMPLOYEE */}
                <FormField
                    label="Employee"
                    required
                    value={form.EmployeeNo}
                >
                    <CustomSelect
                        options={employees}
                        value={form.employee_id}
                        onChange={onSelectEmployee} // ✅ ONLY THIS
                        placeholder="Select Employee"
                    />
                </FormField>

                {/* EMPLOYEE NO */}
                <FormField label="Employee No" value={form.EmployeeNo}>
                    <Input value={form.EmployeeNo || ""} disabled />
                </FormField>

                {/* POSITION */}
                <FormField label="Position" value={form.Position}>
                    <Input value={form.Position || ""} disabled />
                </FormField>

                {/* COMPANY STATUS */}
                <FormField label="Company Status" value={form.CompanyStatus}>
                    <Input value={form.CompanyStatus || ""} disabled />
                </FormField>

                {/* PAY DATE */}
                <FormField
                    label="Pay Date"
                    required
                    error={errors.PayDate}
                    value={form.PayDate}
                >
                    <CustomDatePicker

                        value={form.PayDate}
                        onChange={(date) =>
                            onChange({
                                target: {
                                    name: "PayDate",
                                    value: date
                                        ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
                                        : null,
                                },
                            })
                        }
                        allowedDays={[15, 28, 29, 30, 31]}
                    />
                </FormField>

                {/* MONTHLY SALARY */}
                <FormField
                    label="Monthly Salary"
                    required
                    error={errors.MonthlySalary}
                    value={form.MonthlySalary}
                >
                    <Input
                        type="number"
                        value={form.MonthlySalary || ""}
                        onChange={(e) =>
                            onChange({
                                target: {
                                    name: "MonthlySalary",
                                    value: e.target.value,
                                },
                            })
                        }
                    />
                </FormField>

            </div>
        </div>
    );
}