"use client";

import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";

/* =========================
UTILS
========================= */
const peso = (v) => `₱ ${Number(v || 0).toFixed(2)}`;

/* =========================
ROW
========================= */
function Row({ label, formula, amount }) {
    if (!amount || Number(amount) === 0) return null;

    return (
        <div className="flex justify-between items-start text-sm py-1">
            <div>
                <p className="font-medium text-gray-800">{label}</p>
                {formula && (
                    <p className="text-xs text-gray-500">{formula}</p>
                )}
            </div>

            <span className="font-semibold text-gray-900">
                {peso(amount)}
            </span>
        </div>
    );
}

/* =========================
SECTION CARD
========================= */
function Section({ title, children, total }) {
    return (
        <div className="bg-gray-50 border rounded-xl p-4 space-y-2">
            <h3 className="text-sm font-semibold text-gray-700">
                {title}
            </h3>

            <div className="space-y-1">{children}</div>

            {total > 0 && (
                <div className="border-t pt-2 flex justify-between font-semibold text-gray-800">
                    <span>Total</span>
                    <span>{peso(total)}</span>
                </div>
            )}
        </div>
    );
}

export default function PayrollPreviewModal({
    open,
    onClose,
    onConfirm,
    data,
    loading,
}) {
    if (!open || !data) return null;

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Payroll Computation Preview"
            subtitle="Full breakdown of salary computation"
            footer={
                <>
                    <Button
                        onClick={onClose}
                        className="bg-gray-200 text-gray-700"
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={onConfirm}
                        disabled={loading}
                        className="bg-indigo-600 text-white"
                    >
                        {loading ? "Saving..." : "Confirm & Save"}
                    </Button>
                </>
            }
        >

            {/* =========================
               EARNINGS
            ========================= */}
            <div className="space-y-4 mb-6">

                {/* OVERTIME */}
                <Section title="Overtime" total={data.TotalOvertime}>

                    <Row label="Regular Day" amount={data.OTRegularAmount} />
                    <Row label="Rest Day" amount={data.OTRestDayAmount} />
                    <Row label="Special Non-Working Day" amount={data.OTSpecialAmount} />
                    <Row label="Special Non-Working Day & Rest Day" amount={data.OTSpecialRestAmount} />
                    <Row label="Regular Holiday" amount={data.OTHolidayAmount} />
                    <Row label="Regular Holiday & Rest Day" amount={data.OTHolidayRestAmount} />

                </Section>

                {/* HOLIDAYS */}
                <Section title="Per Day & Holiday" total={data.TotalHolidayPay}>

                    <Row label="Rest Day" amount={data.PDRestDayAmount} />
                    <Row label="Special Non-Working Day" amount={data.PDSpecialAmount} />
                    <Row label="Special Non-Working Day & Rest Day" amount={data.PDSpecialRestAmount} />
                    <Row label="Regular Holiday" amount={data.PDHolidayAmount} />
                    <Row label="Regular Holiday & Rest Day" amount={data.PDHolidayRestAmount} />

                </Section>

                {/* ALLOWANCES */}
                <Section title="Allowances / De Minimis" total={data.TotalDeMinimis}>

                    <Row label="Rice Subsidy" amount={data.RiceSubsidyAmount} />
                    <Row label="Load Allowance" amount={data.LoadAllowanceAmount} />
                    <Row label="Medical Reimbursement" amount={data.MedicalReimbursementAmount} />
                    <Row label="Trip Ticket" amount={data.TripTicketAmount} />
                    <Row label="Additionals" amount={data.AdditionalAmount} />

                </Section>

            </div>

            {/* =========================
               DEDUCTIONS
            ========================= */}
            <div className="space-y-4 mb-6">

                <Section title="Attendance Deductions" total={data.TotalAttendanceDeduction}>

                    <Row label="Absences" amount={data.AbsencesAmount} />
                    <Row label="Tardiness" amount={data.TardinessAmount} />
                    <Row label="Undertime" amount={data.UndertimeAmount} />

                </Section>

                {/* GOVERNMENT */}
                <Section title="Government Deductions" total={data.TotalGovernmentDeduction}>

                    <Row label="SSS" amount={data.sssAmount} />
                    <Row label="SSS Wisp" amount={data.sssWispAmount} />
                    <Row label="PhilHealth" amount={data.philHealthAmount} />
                    <Row label="Pag-IBIG" amount={data.pagIbigAmount} />
                    <Row label="HMO" amount={data.hmoAmount} />
                    <Row label="Tax" amount={data.taxAmount} />

                </Section>

                {/* LOANS */}
                <Section title="Loans" total={data.TotalLoans}>
                    <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded">
                        Auto Deducted
                    </span>

                    {data.loan_breakdown?.length > 0 ? (
                        data.loan_breakdown.map((loan, index) => (
                            <div key={index} className="flex justify-between text-sm py-1">
                                <div>
                                    <p className="font-medium text-gray-800">
                                        {loan.loan_type}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Remaining: ₱ {Number(loan.balance).toLocaleString()}
                                    </p>
                                </div>

                                <span className="font-semibold text-gray-900">
                                    {peso(loan.amount)}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-400">
                            No loan deductions for this payroll
                        </p>
                    )}

                </Section>

                {/* GROSS */}
                <div className="border-t pt-3 flex justify-between font-semibold text-blue-600">
                    <span>Gross Pay</span>
                    <span>{peso(data.Gross)}</span>
                </div>

                {/* TOTAL DEDUCTION */}
                <div className="border-t pt-3 flex justify-between font-semibold text-red-600">
                    <span>Total Deductions</span>
                    <span>{peso(data.TotalDeductions)}</span>
                </div>

                {/* TOTAL DEDUCTION */}
                <div className="border-t pt-3 flex justify-between font-semibold text-green-600">
                    <span>Net Pay</span>
                    <span>{peso(data.NetPay)}</span>
                </div>

            </div>

        </Modal>
    );
}