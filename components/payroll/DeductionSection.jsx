"use client";

import Input from "@/components/ui/Input";

/* =========================
FIELD WRAPPER
========================= */
function Field({ label, children }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">
                {label}
            </label>
            {children}
        </div>
    );
}

export default function DeductionSection({ form = {}, onChange }) {
    return (
        <div className="bg-white border rounded-2xl p-6 space-y-6">

            {/* HEADER */}
            <div>
                <h2 className="text-sm font-semibold text-gray-700">
                    Deductions
                </h2>
                <p className="text-xs text-gray-500">
                    Input absences, tardiness, and undertime
                </p>
            </div>

            {/* FIELDS */}
            <div className="grid grid-cols-3 gap-4">

                <Field label="Absences (Days)">
                    <Input
                        type="number"
                        name="Absences"
                        value={form?.Absences || 0}
                        onChange={(e) =>
                            onChange({
                                target: {
                                    name: "Absences",
                                    value: e.target.value,
                                },
                            })
                        }
                    />
                </Field>

                <Field label="Tardiness (Minutes)">
                    <Input
                        type="number"
                        name="Tardiness"
                        value={form?.Tardiness || 0}
                        onChange={(e) =>
                            onChange({
                                target: {
                                    name: "Tardiness",
                                    value: e.target.value,
                                },
                            })
                        }
                    />
                </Field>

                <Field label="Undertime (Hours)">
                    <Input
                        type="number"
                        name="Undertime"
                        value={form?.Undertime || 0}
                        onChange={(e) =>
                            onChange({
                                target: {
                                    name: "Undertime",
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