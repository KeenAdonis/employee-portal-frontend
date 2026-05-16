"use client";

import { useEffect, useMemo, useState } from "react";

import api from "@/services/api";

import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";

import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";

import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

import SortableEmployeeCard from "@/components/employee/SortableEmployeeCard";
import SurveyInstructions from "@/components/employee/SurveyInstructions";
import SurveySubmitSection from "@/components/employee/SurveySubmitSection";

import { useToast } from "@/components/ui/ToastProvider";

import {
    AlertCircle,
    CheckCircle2,
    Loader2,
} from "lucide-react";

export default function EmployeeSurveyPage() {
    const { showToast } = useToast();

    /* =========================================================
        STATE
    ========================================================= */
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [employees, setEmployees] = useState([]);

    const [batch, setBatch] = useState(null);

    const [topReason, setTopReason] = useState("");
    const [bottomReason, setBottomReason] = useState("");

    const [alreadySubmitted, setAlreadySubmitted] =
        useState(false);

    /* =========================================================
        DND KIT
    ========================================================= */
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    /* =========================================================
        FETCH DATA
    ========================================================= */
    const fetchSurvey = async () => {
        try {
            setLoading(true);

            /*
            |--------------------------------------------------------------------------
            | GET ACTIVE BATCH
            |--------------------------------------------------------------------------
            */
            const batchRes = await api.get(
                "/employee-survey/active-batch"
            );

            const activeBatch = batchRes.data.data;

            /*
            |--------------------------------------------------------------------------
            | NO ACTIVE BATCH
            |--------------------------------------------------------------------------
            */
            if (!activeBatch) {
                setBatch(null);
                return;
            }

            setBatch(activeBatch);

            /*
            |--------------------------------------------------------------------------
            | CHECK SUBMISSION
            |--------------------------------------------------------------------------
            */
            const submissionRes = await api.get(
                `/employee-survey/my-submission?batch_id=${activeBatch.id}`
            );

            if (submissionRes.data.data) {
                setAlreadySubmitted(true);
                return;
            }

            /*
            |--------------------------------------------------------------------------
            | FETCH EMPLOYEES
            |--------------------------------------------------------------------------
            */
            const employeeRes = await api.get(
                "/employee-survey/employees"
            );

            setEmployees(employeeRes.data.data || []);

        } catch (err) {
            console.error(err);

            showToast({
                title: "Error",
                message: "Failed to load survey.",
                type: "error",
            });

        } finally {
            setLoading(false);
        }
    };

    /* =========================================================
        INITIAL LOAD
    ========================================================= */
    useEffect(() => {
        fetchSurvey();
    }, []);

    /* =========================================================
        DRAG END
    ========================================================= */
    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        setEmployees((items) => {
            const oldIndex = items.findIndex(
                (item) => item.id === active.id
            );

            const newIndex = items.findIndex(
                (item) => item.id === over.id
            );

            return arrayMove(items, oldIndex, newIndex);
        });
    };

    /* =========================================================
        TOP / BOTTOM EMPLOYEE
    ========================================================= */
    const topEmployee = useMemo(() => {
        return employees.length > 0
            ? employees[0]
            : null;
    }, [employees]);

    const bottomEmployee = useMemo(() => {
        return employees.length > 0
            ? employees[employees.length - 1]
            : null;
    }, [employees]);

    /* =========================================================
        SUBMIT
    ========================================================= */
    const handleSubmit = async () => {

        /*
        |--------------------------------------------------------------------------
        | VALIDATION
        |--------------------------------------------------------------------------
        */
        if (!topReason.trim()) {
            showToast({
                title: "Validation Error",
                message: "Top employee reason is required.",
                type: "error",
            });

            return;
        }

        if (!bottomReason.trim()) {
            showToast({
                title: "Validation Error",
                message: "Bottom employee reason is required.",
                type: "error",
            });

            return;
        }

        try {
            setSubmitting(true);

            /*
            |--------------------------------------------------------------------------
            | PAYLOAD
            |--------------------------------------------------------------------------
            */
            const payload = {
                batch_id: batch.id,

                top_reason: topReason,
                bottom_reason: bottomReason,

                rankings: employees.map(
                    (employee, index) => ({
                        employee_id: employee.id,
                        rank_position: index + 1,
                    })
                ),
            };

            /*
            |--------------------------------------------------------------------------
            | SUBMIT
            |--------------------------------------------------------------------------
            */
            await api.post(
                "/employee-survey/submit",
                payload
            );

            showToast({
                title: "Success",
                message:
                    "Survey submitted successfully.",
                type: "success",
            });

            setAlreadySubmitted(true);

        } catch (err) {
            console.error(err);

            showToast({
                title: "Error",
                message:
                    err?.response?.data?.message ||
                    "Failed to submit survey.",
                type: "error",
            });

        } finally {
            setSubmitting(false);
        }
    };

    /* =========================================================
        LOADING STATE
    ========================================================= */
    if (loading) {
        return (
            <div className="p-6">

                <div
                    className="
                        bg-white border rounded-2xl
                        p-10
                        flex flex-col items-center justify-center
                        text-center
                    "
                >

                    <Loader2 className="w-8 h-8 animate-spin text-amber-500" />

                    <p className="mt-4 text-gray-500">
                        Loading employee survey...
                    </p>

                </div>

            </div>
        );
    }

    /* =========================================================
        NO ACTIVE SURVEY
    ========================================================= */
    if (!batch) {
        return (
            <div className="p-6">

                <div
                    className="
                        bg-white border rounded-2xl
                        p-10
                        text-center
                    "
                >

                    <AlertCircle className="w-10 h-10 mx-auto text-gray-400" />

                    <h2 className="mt-4 text-xl font-semibold text-gray-900">
                        No Active Survey
                    </h2>

                    <p className="mt-2 text-gray-500">
                        There is currently no active employee survey.
                    </p>

                </div>

            </div>
        );
    }

    /* =========================================================
        ALREADY SUBMITTED
    ========================================================= */
    if (alreadySubmitted) {
        return (
            <div className="p-6">

                <div
                    className="
                        bg-white border rounded-2xl
                        p-10
                        text-center
                    "
                >

                    <CheckCircle2 className="w-10 h-10 mx-auto text-green-500" />

                    <h2 className="mt-4 text-xl font-semibold text-gray-900">
                        Survey Already Submitted
                    </h2>

                    <p className="mt-2 text-gray-500">
                        Thank you for participating in the employee engagement survey.
                    </p>

                </div>

            </div>
        );
    }

    /* =========================================================
        MAIN PAGE
    ========================================================= */
    return (
        <div className="p-6 space-y-6">

            {/* =====================================================
                HEADER
            ===================================================== */}
            <div
                className="
                    bg-white border rounded-2xl
                    p-6
                "
            >

                <div className="flex flex-col gap-2">

                    <h1 className="text-2xl font-semibold text-gray-900">
                        Employee Engagement Survey
                    </h1>

                    <p className="text-sm text-gray-500">
                        Drag employees to rank them from highest
                        to lowest based on your professional
                        experience working with them.
                    </p>

                </div>

            </div>

            {/* =====================================================
                INSTRUCTIONS
            ===================================================== */}
            <SurveyInstructions />

            {/* =====================================================
                DRAG & DROP RANKING
            ===================================================== */}
            <div
                className="
                    bg-white border rounded-2xl
                    p-6
                "
            >

                <div className="mb-6">

                    <h2 className="text-lg font-semibold text-gray-900">
                        Employee Rankings
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Rank employees from highest to lowest.
                    </p>

                </div>

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToVerticalAxis]}
                >

                    <SortableContext
                        items={employees.map(
                            (employee) => employee.id
                        )}
                        strategy={verticalListSortingStrategy}
                    >

                        <div className="space-y-4">

                            {employees.map((employee, index) => (
                                <SortableEmployeeCard
                                    key={employee.id}
                                    employee={employee}
                                    index={index}
                                />
                            ))}

                        </div>

                    </SortableContext>

                </DndContext>

            </div>

            {/* =====================================================
                SUBMIT SECTION
            ===================================================== */}
            <SurveySubmitSection
                topEmployee={topEmployee}
                bottomEmployee={bottomEmployee}
                topReason={topReason}
                setTopReason={setTopReason}
                bottomReason={bottomReason}
                setBottomReason={setBottomReason}
                onSubmit={handleSubmit}
                submitting={submitting}
            />

        </div>
    );
}