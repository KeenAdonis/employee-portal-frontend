"use client";

import Input from "@/components/ui/Input";

/* =========================
FIELD WRAPPER
========================= */
function Field({ label, children }) {
    return (<div className="flex flex-col gap-1"> <label className="text-xs font-medium text-gray-700">
        {label} </label>
        {children} </div>
    );
}

export default function PerDaySection({ form, onChange }) {
    return (<div className="bg-white border rounded-2xl p-6 space-y-6">


        {/* HEADER */}
        <div>
            <h2 className="text-sm font-semibold text-gray-700">
                Per Day / Holiday
            </h2>
            <p className="text-xs text-gray-500">
                Input days worked for holidays and rest days
            </p>
        </div>

        {/* FIELDS */}
        <div className="grid grid-cols-2 gap-4">

            <Field label="Rest Day">
                <Input
                    type="number"
                    name="PDRestDay"
                    value={form.PDRestDay || 0}
                    onChange={(e) =>
                        onChange({
                            target: {
                                name: "PDRestDay",
                                value: e.target.value,
                            },
                        })
                    }
                />
            </Field>

            <Field label="Special Non-Working Day">
                <Input
                    type="number"
                    name="PDSpecialNonWorkingDay"
                    value={form.PDSpecialNonWorkingDay || 0}
                    onChange={(e) =>
                        onChange({
                            target: {
                                name: "PDSpecialNonWorkingDay",
                                value: e.target.value,
                            },
                        })
                    }
                />
            </Field>

            <Field label="Special Non-Working Day & Rest Day">
                <Input
                    type="number"
                    name="PDSpecialNonWorkingAndRestDay"
                    value={form.PDSpecialNonWorkingAndRestDay || 0}
                    onChange={(e) =>
                        onChange({
                            target: {
                                name: "PDSpecialNonWorkingAndRestDay",
                                value: e.target.value,
                            },
                        })
                    }
                />
            </Field>

            <Field label="Regular Holiday">
                <Input
                    type="number"
                    name="PDRegularHoliday"
                    value={form.PDRegularHoliday || 0}
                    onChange={(e) =>
                        onChange({
                            target: {
                                name: "PDRegularHoliday",
                                value: e.target.value,
                            },
                        })
                    }
                />
            </Field>

            <Field label="Regular Holiday & Rest Day">
                <Input
                    type="number"
                    name="PDRegularHolidayAndRestDay"
                    value={form.PDRegularHolidayAndRestDay || 0}
                    onChange={(e) =>
                        onChange({
                            target: {
                                name: "PDRegularHolidayAndRestDay",
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
