"use client";

export default function LoanSection({ loans = [] }) {

    const activeLoans = loans.filter(l => Number(l.balance) > 0);

    const loanTypes = [...new Set(activeLoans.map(l => l.loan_type))];

    const totalBalance = activeLoans.reduce(
        (sum, l) => sum + Number(l.balance || 0),
        0
    );

    return (
        <div className="bg-white border rounded-2xl p-6 space-y-6">

            <div>
                <h2 className="text-sm font-semibold text-gray-700">
                    Loan Deductions
                </h2>
                <p className="text-xs text-gray-500">
                    Employee loan overview
                </p>
            </div>

            {activeLoans.length === 0 ? (
                <p className="text-sm text-gray-400">
                    No active loans for this employee
                </p>
            ) : (
                <div className="space-y-4">

                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-800">
                            {activeLoans.length} Active Loan{activeLoans.length > 1 ? 's' : ''}
                        </span>

                        <span className="text-xs text-gray-500">
                            ₱ {totalBalance.toLocaleString()}
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {loanTypes.map((type, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-600"
                            >
                                {type}
                            </span>
                        ))}
                    </div>

                    <div className="space-y-2 pt-2 border-t">
                        {activeLoans.map((loan) => (
                            <div
                                key={loan.id}
                                className="flex justify-between text-sm"
                            >
                                <span className="text-gray-600">
                                    {loan.loan_type}
                                </span>

                                <span className="text-gray-800 font-medium">
                                    ₱ {Number(loan.balance).toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>

                </div>
            )}
        </div>
    );
}