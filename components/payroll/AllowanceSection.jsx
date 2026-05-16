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

export default function AllowanceSection({ form, onChange }) {
    return (<div className="bg-white border rounded-2xl p-6 space-y-6">


        {/* HEADER */}
        <div>
            <h2 className="text-sm font-semibold text-gray-700">
                Allowances / De Minimis
            </h2>
            <p className="text-xs text-gray-500">
                Input non-taxable allowances and additional benefits
            </p>
        </div>

        {/* FIELDS */}
        <div className="grid grid-cols-3 gap-4">

            <Field label="Rice Subsidy">
                <Input
                    type="number"
                    name="RiceSubsidy"
                    value={form.RiceSubsidy || 0}
                    onChange={(e) =>
                        onChange({
                            target: {
                                name: "RiceSubsidy",
                                value: e.target.value,
                            },
                        })
                    }
                />
            </Field>

            <Field label="Load Allowance">
                <Input
                    type="number"
                    name="LoadAllowance"
                    value={form.LoadAllowance || 0}
                    onChange={(e) =>
                        onChange({
                            target: {
                                name: "LoadAllowance",
                                value: e.target.value,
                            },
                        })
                    }
                />
            </Field>

            <Field label="Medical Reimbursement">
                <Input
                    type="number"
                    name="MedicalReimbursement"
                    value={form.MedicalReimbursement || 0}
                    onChange={(e) =>
                        onChange({
                            target: {
                                name: "MedicalReimbursement",
                                value: e.target.value,
                            },
                        })
                    }
                />
            </Field>

            <Field label="Trip Ticket">
                <Input
                    type="number"
                    name="TripTicket"
                    value={form.TripTicket || 0}
                    onChange={(e) =>
                        onChange({
                            target: {
                                name: "TripTicket",
                                value: e.target.value,
                            },
                        })
                    }
                />
            </Field>

            <Field label="Additional">
                <Input
                    type="number"
                    name="Additional"
                    value={form.Additional || 0}
                    onChange={(e) =>
                        onChange({
                            target: {
                                name: "Additional",
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
