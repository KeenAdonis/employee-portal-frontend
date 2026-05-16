"use client";

import Input from "@/components/ui/Input";

/* =========================
OPTIONAL WRAPPER (MATCH YOUR STYLE)
========================= */
function Field({ label, children }) {
    return (<div className="flex flex-col gap-1"> <label className="text-xs font-medium text-gray-700">
        {label} </label>
        {children} </div>
    );
}

export default function OvertimeSection({ form, onChange }) {
    return (<div className="bg-white border rounded-2xl p-6 space-y-6">

        {/* HEADER */}
        <div>
            <h2 className="text-sm font-semibold text-gray-700">
                Overtime
            </h2>
            <p className="text-xs text-gray-500">
                Input overtime hours for this payroll period
            </p>
        </div>

        {/* FIELDS */}
        <div className="grid grid-cols-2 gap-4">

            <Field label="Regular Day">
                <Input
                    type="number"
                    name="OTRegularDay"
                    value={form.OTRegularDay || 0}
                    onChange={(e) =>
                        onChange({
                            target: {
                                name: "OTRegularDay",
                                value: e.target.value,
                            },
                        })
                    }
                />
            </Field>

            <Field label="Rest Day">
                <Input
                    type="number"
                    name="OTRestDay"
                    value={form.OTRestDay || 0}
                    onChange={(e) =>
                        onChange({
                            target: {
                                name: "OTRestDay",
                                value: e.target.value,
                            },
                        })
                    }
                />
            </Field>

            <Field label="Special Non-Working Day">
                <Input
                    type="number"
                    name="OTSpecialNonWorkingDay"
                    value={form.OTSpecialNonWorkingDay || 0}
                    onChange={(e) =>
                        onChange({
                            target: {
                                name: "OTSpecialNonWorkingDay",
                                value: e.target.value,
                            },
                        })
                    }
                />
            </Field>

            <Field label="Special Non-Working Day & Rest Day">
                <Input
                    type="number"
                    name="OTSpecialNonWorkingAndRestDay"
                    value={form.OTSpecialNonWorkingAndRestDay || 0}
                    onChange={(e) =>
                        onChange({
                            target: {
                                name: "OTSpecialNonWorkingAndRestDay",
                                value: e.target.value,
                            },
                        })
                    }
                />
            </Field>

            <Field label="Regular Holiday">
                <Input
                    type="number"
                    name="OTRegularHoliday"
                    value={form.OTRegularHoliday || 0}
                    onChange={(e) =>
                        onChange({
                            target: {
                                name: "OTRegularHoliday",
                                value: e.target.value,
                            },
                        })
                    }
                />
            </Field>

            <Field label="Regular Holiday & Rest Day">
                <Input
                    type="number"
                    name="OTRegularHolidayAndRestDay"
                    value={form.OTRegularHolidayAndRestDay || 0}
                    onChange={(e) =>
                        onChange({
                            target: {
                                name: "OTRegularHolidayAndRestDay",
                                value: e.target.value,
                            },
                        })
                    }
                />
            </Field>

        </div>

    </div>
    );


}
