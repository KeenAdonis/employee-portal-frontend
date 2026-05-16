"use client";

import { Button } from "@/components/ui/button";
import { Loader2, SendHorizonal } from "lucide-react";

export default function SurveySubmitSection({
    topEmployee,
    bottomEmployee,

    topReason,
    setTopReason,

    bottomReason,
    setBottomReason,

    onSubmit,
    submitting,
}) {
    return (
        <div
            className="
                bg-white border rounded-2xl
                p-6 space-y-6
            "
        >

            {/* TOP EMPLOYEE */}
            <div>

                <div className="mb-3">
                    <h3 className="font-semibold text-gray-900">
                        Why is your top-ranked employee your #1 choice?
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                        Selected Employee:
                        <span className="font-medium text-amber-600 ml-1">
                            {topEmployee
                                ? `${topEmployee.firstname} ${topEmployee.lastname}`
                                : "-"}
                        </span>
                    </p>
                </div>

                <textarea
                    value={topReason}
                    onChange={(e) => setTopReason(e.target.value)}
                    rows={5}
                    placeholder="Share why this employee deserves your highest ranking..."
                    className="
                        w-full border rounded-2xl
                        px-4 py-3
                        text-sm
                        resize-none
                        focus:outline-none
                        focus:ring-2
                        focus:ring-amber-400
                    "
                />

            </div>

            {/* BOTTOM EMPLOYEE */}
            <div>

                <div className="mb-3">
                    <h3 className="font-semibold text-gray-900">
                        Why is your lowest-ranked employee your last choice?
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                        Selected Employee:
                        <span className="font-medium text-red-500 ml-1">
                            {bottomEmployee
                                ? `${bottomEmployee.firstname} ${bottomEmployee.lastname}`
                                : "-"}
                        </span>
                    </p>
                </div>

                <textarea
                    value={bottomReason}
                    onChange={(e) => setBottomReason(e.target.value)}
                    rows={5}
                    placeholder="Provide constructive feedback regarding your lowest-ranked employee..."
                    className="
                        w-full border rounded-2xl
                        px-4 py-3
                        text-sm
                        resize-none
                        focus:outline-none
                        focus:ring-2
                        focus:ring-amber-400
                    "
                />

            </div>

            {/* SUBMIT */}
            <div className="pt-2">

                <Button
                    onClick={onSubmit}
                    disabled={submitting}
                    className="
                        w-full md:w-auto
                        bg-gradient-to-r
                        from-amber-400 to-amber-500
                        hover:from-amber-300
                        hover:to-amber-400
                        text-white
                        rounded-xl
                        shadow-md shadow-amber-500/30
                    "
                >
                    {submitting ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Submitting Survey...
                        </>
                    ) : (
                        <>
                            <SendHorizonal className="w-4 h-4 mr-2" />
                            Submit Survey
                        </>
                    )}
                </Button>

            </div>

        </div>
    );
}