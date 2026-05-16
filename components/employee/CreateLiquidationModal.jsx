"use client";

import { useState, useMemo, useEffect } from "react";

import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import CustomSelect from "@/components/ui/CustomSelect";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/ToastProvider";

import {
    Plus,
    X,
    UploadCloud,
    FileText,
} from "lucide-react";

import api from "@/services/api";

export default function CreateLiquidationModal({
    open,
    onClose,
    onSuccess,
}) {

    const { showToast } = useToast();

    const [loading, setLoading] =
        useState(false);

    const [requisitions, setRequisitions] =
        useState([]);

    const [form, setForm] = useState({
        requisition_id: "",
        cash_advance: 0,
        remarks: "",
        attachments: [],
        particulars: [
            {
                particulars: "",
                or_no: "",
                amount: "",
            },
        ],
    });

    /* =========================
       TOTALS
    ========================= */

    const totalExpenses = useMemo(() => {

        return form.particulars.reduce(
            (sum, item) =>
                sum + Number(item.amount || 0),
            0
        );

    }, [form.particulars]);

    const amountReturned = useMemo(() => {

        if (
            totalExpenses <
            Number(form.cash_advance)
        ) {
            return (
                Number(form.cash_advance) -
                totalExpenses
            );
        }

        return 0;

    }, [
        totalExpenses,
        form.cash_advance,
    ]);

    const reimbursement = useMemo(() => {

        if (
            totalExpenses >
            Number(form.cash_advance)
        ) {
            return (
                totalExpenses -
                Number(form.cash_advance)
            );
        }

        return 0;

    }, [
        totalExpenses,
        form.cash_advance,
    ]);



    const requisitionOptions =
        requisitions.map((r) => ({
            label:
                `${r.RequestId} • ₱${Number(
                    r.TotalAmount
                ).toLocaleString()}`,
            value: r.RequestId,
        }));



    /* =========================
       PARTICULARS
    ========================= */

    const handleParticularChange = (
        index,
        field,
        value
    ) => {

        const updated = [
            ...form.particulars,
        ];

        updated[index][field] = value;

        setForm({
            ...form,
            particulars: updated,
        });
    };

    const addParticular = () => {

        setForm({
            ...form,
            particulars: [
                ...form.particulars,
                {
                    particulars: "",
                    or_no: "",
                    amount: "",
                },
            ],
        });
    };

    const removeParticular = (index) => {

        if (
            form.particulars.length === 1
        ) return;

        setForm({
            ...form,
            particulars:
                form.particulars.filter(
                    (_, i) => i !== index
                ),
        });
    };

    /* =========================
       ATTACHMENTS
    ========================= */

    const handleFileChange = (e) => {

        const files = Array.from(
            e.target.files
        );

        setForm({
            ...form,
            attachments: [
                ...form.attachments,
                ...files,
            ],
        });
    };

    const removeFile = (index) => {

        setForm({
            ...form,
            attachments:
                form.attachments.filter(
                    (_, i) => i !== index
                ),
        });
    };

    /* =========================
       SUBMIT
    ========================= */

    const handleSubmit = async () => {

        try {

            setLoading(true);

            const formData = new FormData();

            // 🔥 FIX 1: correct field name
            formData.append("request_id", form.requisition_id);

            // 🔥 FIX 2: required field
            formData.append("cash_advance", form.cash_advance);

            formData.append("remarks", form.remarks);

            form.particulars.forEach((p, i) => {

                formData.append(
                    `particulars[${i}][particulars]`,
                    p.particulars
                );

                formData.append(
                    `particulars[${i}][or_no]`,
                    p.or_no
                );

                formData.append(
                    `particulars[${i}][amount]`,
                    p.amount
                );
            });

            form.attachments.forEach((file) => {
                formData.append("attachments[]", file);
            });

            await api.post("/liquidations", formData);

            showToast({
                title: "Success",
                message: "Liquidation submitted successfully.",
                type: "success",
            });

            onSuccess();
            onClose();

        } catch (err) {

            console.log(err.response?.data); // 🔥 IMPORTANT DEBUG

            showToast({
                title: "Error",
                message:
                    err.response?.data?.message ||
                    "Failed to submit liquidation.",
                type: "error",
            });

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        if (!open) return;

        fetchAvailableRequisitions();

    }, [open]);

    const fetchAvailableRequisitions =
        async () => {

            try {

                const res = await api.get(
                    "/employee/requisitions/available-liquidation"
                );

                setRequisitions(
                    res.data.data || []
                );

            } catch (err) {

                console.error(err);

            }
        };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Create Liquidation"
            subtitle="Submit your liquidation details and supporting documents."
            maxWidth="max-w-6xl"

            footer={
                <div className="flex items-center justify-between w-full border-t pt-4">

                    <div className="text-sm space-y-1">
                        <p>
                            Total Expenses:
                            {" "}
                            <strong>
                                ₱{totalExpenses.toLocaleString()}
                            </strong>
                        </p>

                        <p>
                            Returned:
                            {" "}
                            <strong>
                                ₱{amountReturned.toLocaleString()}
                            </strong>
                        </p>

                        <p>
                            Reimbursement:
                            {" "}
                            <strong>
                                ₱{reimbursement.toLocaleString()}
                            </strong>
                        </p>
                    </div>

                    <div className="flex gap-2">

                        <Button
                            variant="outline"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            {loading
                                ? "Submitting..."
                                : "Submit Liquidation"}
                        </Button>

                    </div>

                </div>
            }
        >

            <div className="space-y-8">

                {/* ================= HEADER ================= */}

                <section className="border rounded-2xl p-5 space-y-5">

                    <div>
                        <h2 className="font-semibold text-gray-900">
                            Liquidation Information
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Select the requisition or cash advance to liquidate.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        <div>
                            <label className="text-xs font-semibold uppercase text-gray-600">
                                Requisition
                            </label>

                            <CustomSelect
                                placeholder="Select requisition"
                                value={form.requisition_id}
                                options={requisitionOptions}
                                onChange={(value) => {

                                    const selected =
                                        requisitions.find(
                                            (r) =>
                                                r.RequestId === value
                                        );

                                    setForm({
                                        ...form,
                                        requisition_id: value,
                                        cash_advance:
                                            selected?.TotalAmount || 0,
                                    });
                                }}
                            />
                        </div>

                        <div>
                            <label className="text-xs font-semibold uppercase text-gray-600">
                                Cash Advance
                            </label>

                            <Input
                                type="number"
                                value={
                                    form.cash_advance
                                }
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        cash_advance:
                                            e.target.value,
                                    })
                                }
                            />
                        </div>

                    </div>

                </section>

                {/* ================= PARTICULARS ================= */}

                <section className="border rounded-2xl p-5 space-y-5">

                    <div className="flex items-center justify-between">

                        <div>
                            <h2 className="font-semibold text-gray-900">
                                Expense Particulars
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Add receipts, OR numbers, and expenses.
                            </p>
                        </div>

                        <Button
                            variant="outline"
                            onClick={addParticular}
                            className="gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Item
                        </Button>

                    </div>

                    <div className="space-y-4">

                        {form.particulars.map(
                            (p, i) => (

                                <div
                                    key={i}
                                    className="grid grid-cols-1 md:grid-cols-[1fr_180px_180px_auto] gap-4 border rounded-xl p-4 bg-gray-50"
                                >

                                    <Input
                                        placeholder="Particular"
                                        value={
                                            p.particulars
                                        }
                                        onChange={(e) =>
                                            handleParticularChange(
                                                i,
                                                "particulars",
                                                e.target.value
                                            )
                                        }
                                    />

                                    <Input
                                        placeholder="OR No."
                                        value={p.or_no}
                                        onChange={(e) =>
                                            handleParticularChange(
                                                i,
                                                "or_no",
                                                e.target.value
                                            )
                                        }
                                    />

                                    <Input
                                        type="number"
                                        placeholder="Amount"
                                        value={p.amount}
                                        onChange={(e) =>
                                            handleParticularChange(
                                                i,
                                                "amount",
                                                e.target.value
                                            )
                                        }
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeParticular(i)
                                        }
                                        className="w-10 h-10 rounded-xl border bg-white hover:bg-red-50 text-red-500 flex items-center justify-center"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>

                                </div>
                            )
                        )}

                    </div>

                </section>

                {/* ================= REMARKS ================= */}

                <section className="border rounded-2xl p-5">

                    <h2 className="font-semibold text-gray-900 mb-4">
                        Remarks
                    </h2>

                    <textarea
                        rows={4}
                        value={form.remarks}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                remarks:
                                    e.target.value,
                            })
                        }
                        className="
                            w-full rounded-xl border
                            border-gray-300
                            px-4 py-3 text-sm
                            focus:ring-2
                            focus:ring-indigo-500
                            outline-none
                            resize-none
                        "
                        placeholder="Enter remarks..."
                    />

                </section>

                {/* ================= ATTACHMENTS ================= */}

                <section className="border rounded-2xl p-5">

                    <div className="mb-5">
                        <h2 className="font-semibold text-gray-900">
                            Attachments
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Upload receipts and supporting documents.
                        </p>
                    </div>

                    <label className="
                        flex flex-col items-center
                        justify-center
                        border-2 border-dashed
                        border-gray-300
                        rounded-2xl
                        px-6 py-10
                        bg-gray-50
                        hover:bg-gray-100
                        transition
                        cursor-pointer
                    ">

                        <input
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileChange}
                        />

                        <div className="
                            w-14 h-14 rounded-2xl
                            bg-indigo-100
                            flex items-center justify-center
                            mb-4
                        ">
                            <UploadCloud className="w-7 h-7 text-indigo-600" />
                        </div>

                        <p className="text-sm font-semibold text-gray-700">
                            Click to upload receipts
                        </p>

                    </label>

                    {form.attachments.length > 0 && (

                        <div className="mt-5 space-y-3">

                            {form.attachments.map(
                                (file, i) => (

                                    <div
                                        key={i}
                                        className="
                                            flex items-center justify-between
                                            border rounded-xl
                                            px-4 py-3 bg-gray-50
                                        "
                                    >

                                        <div className="flex items-center gap-3">

                                            <div className="
                                                w-10 h-10 rounded-xl
                                                bg-indigo-100
                                                flex items-center justify-center
                                            ">
                                                <FileText className="w-5 h-5 text-indigo-600" />
                                            </div>

                                            <p className="text-sm font-medium text-gray-700">
                                                {file.name}
                                            </p>

                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeFile(i)
                                            }
                                            className="
                                                w-9 h-9 rounded-lg
                                                hover:bg-red-50
                                                text-red-500
                                                flex items-center justify-center
                                            "
                                        >
                                            <X className="w-4 h-4" />
                                        </button>

                                    </div>
                                )
                            )}

                        </div>
                    )}

                </section>

            </div>

        </Modal>
    );
}