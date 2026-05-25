"use client";

import { useEffect, useState } from "react";

import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import CustomSelect from "@/components/ui/CustomSelect";

import { Button } from "@/components/ui/button";

import { useToast } from "@/components/ui/ToastProvider";

import {
    createUser,
} from "@/services/userService";

/* =========================
   ROLE OPTIONS
========================= */
const roleOptions = [
    {
        label: "Employee",
        value: "employee",
    },

    {
        label: "Admin Super",
        value: "adminsuper",
    },

    {
        label: "Admin HR",
        value: "adminhr",
    },

    {
        label: "Admin Accounting",
        value: "adminaccounting",
    },

    {
        label: "Admin Testing",
        value: "admintesting",
    },

    {
        label: "Admin Marketing",
        value: "adminmarketing",
    },

    {
        label: "Admin Inventory",
        value: "admininventory",
    },
];

/* =========================
   STATUS OPTIONS
========================= */
const statusOptions = [
    {
        label: "Active",
        value: "ACTIVE",
    },

    {
        label: "Inactive",
        value: "INACTIVE",
    },

    {
        label: "Suspended",
        value: "SUSPENDED",
    },
];

/* =========================
   INITIAL STATE
========================= */
const initialForm = {
    name: "",
    email: "",
    password: "",
    employee_no: "",
    role: "employee",
    status: "ACTIVE",
};

/* =========================
   FORM FIELD
========================= */
function FormField({
    label,
    required = false,
    error,
    value,
    children,
}) {

    const isValid =
        value &&
        value.toString().trim() !== "" &&
        !error;

    const starColor = isValid
        ? "text-green-500"
        : error
            ? "text-red-500"
            : "text-gray-400";

    return (
        <div className="flex flex-col gap-1">

            <label
                className="
                    text-xs
                    font-medium
                    text-gray-700
                "
            >
                {label}

                {required && (
                    <span
                        className={`
                            ${starColor}
                            ml-1
                            font-bold
                        `}
                    >
                        *
                    </span>
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

export default function CreateAdminModal({
    open,
    onClose,
    onSuccess,
}) {

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState(initialForm);

    const [errors, setErrors] = useState({});

    const { showToast } = useToast();

    /* =========================
       RESET WHEN CLOSE
    ========================= */
    useEffect(() => {

        if (!open) {

            setForm(initialForm);

            setErrors({});

        }

    }, [open]);

    /* =========================
       HANDLE CHANGE
    ========================= */
    const handleChange = (name, value) => {

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));

    };

    /* =========================
       VALIDATION
    ========================= */
    const validate = () => {

        let newErrors = {};

        if (!form.name) {
            newErrors.name =
                "This field is required!";
        }

        if (!form.email) {
            newErrors.email =
                "This field is required!";
        }

        if (!form.password) {
            newErrors.password =
                "This field is required!";
        }

        if (!form.employee_no) {
            newErrors.employee_no =
                "This field is required!";
        }

        if (!form.role) {
            newErrors.role =
                "This field is required!";
        }

        if (!form.status) {
            newErrors.status =
                "This field is required!";
        }

        setErrors(newErrors);

        return (
            Object.keys(newErrors).length === 0
        );
    };

    /* =========================
       SUBMIT
    ========================= */
    const handleSubmit = async () => {

        if (!validate()) {

            showToast({
                title: "Validation Error",
                message:
                    "Please fill all required fields",
                type: "warning",
            });

            return;
        }

        try {

            setLoading(true);

            const response = await createUser({

                name: form.name,

                email: form.email,

                password: form.password,

                employee_no: form.employee_no,

                role: form.role,

                status: form.status,

            });

            if (!response.success) {

                showToast({
                    title: "Error",
                    message:
                        response.message ||
                        "Failed to create account",
                    type: "error",
                });

                return;
            }

            showToast({
                title: "Success",
                message:
                    "Account created successfully",
                type: "success",
            });

            setForm(initialForm);

            setErrors({});

            onSuccess?.();

            onClose?.();

        } catch (err) {

            showToast({
                title: "Error",
                message:
                    err.response?.data?.message ||
                    "Something went wrong",
                type: "error",
            });

        } finally {

            setLoading(false);

        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Create User"
            subtitle="
                Create a new system account.
                Only authorized administrators
                can access this module.
            "
            footer={
                <div
                    className="
                        flex
                        justify-end
                        w-full
                        gap-2
                    "
                >

                    <Button
                        variant="outline"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="
                            bg-gradient-to-r
                            from-amber-400
                            to-amber-500
                            text-white
                            font-medium
                            px-4 py-2
                            rounded-lg
                            shadow-md
                            shadow-amber-500/30
                            hover:from-amber-300
                            hover:to-amber-400
                            hover:shadow-lg
                            hover:shadow-amber-500/40
                            active:scale-[0.98]
                            transition-all
                            duration-200
                        "
                    >
                        {loading
                            ? "Creating..."
                            : "Create User"}
                    </Button>

                </div>
            }
        >

            <div className="space-y-6">

                {/* ACCOUNT */}
                <div>

                    <h2
                        className="
                            text-sm
                            font-semibold
                            text-gray-700
                            mb-3
                        "
                    >
                        Account Information
                    </h2>

                    <div
                        className="
                            grid
                            grid-cols-2
                            gap-4
                        "
                    >

                        {/* NAME */}
                        <FormField
                            label="Full Name"
                            required
                            error={errors.name}
                            value={form.name}
                        >
                            <Input
                                value={form.name}
                                onChange={(e) =>
                                    handleChange(
                                        "name",
                                        e.target.value
                                    )
                                }
                            />
                        </FormField>

                        {/* EMAIL */}
                        <FormField
                            label="Email Address"
                            required
                            error={errors.email}
                            value={form.email}
                        >
                            <Input
                                type="email"
                                value={form.email}
                                onChange={(e) =>
                                    handleChange(
                                        "email",
                                        e.target.value
                                    )
                                }
                            />
                        </FormField>

                        {/* PASSWORD */}
                        <FormField
                            label="Password"
                            required
                            error={errors.password}
                            value={form.password}
                        >
                            <Input
                                type="password"
                                value={form.password}
                                onChange={(e) =>
                                    handleChange(
                                        "password",
                                        e.target.value
                                    )
                                }
                            />
                        </FormField>

                        {/* EMPLOYEE NO */}
                        <FormField
                            label="Employee No"
                            required
                            error={errors.employee_no}
                            value={form.employee_no}
                        >
                            <Input
                                value={form.employee_no}
                                onChange={(e) =>
                                    handleChange(
                                        "employee_no",
                                        e.target.value
                                    )
                                }
                            />
                        </FormField>

                        {/* ROLE */}
                        <FormField
                            label="Role"
                            required
                            error={errors.role}
                            value={form.role}
                        >
                            <CustomSelect
                                value={form.role}
                                options={roleOptions}
                                onChange={(value) =>
                                    handleChange(
                                        "role",
                                        value
                                    )
                                }
                            />
                        </FormField>

                        {/* STATUS */}
                        <FormField
                            label="Status"
                            required
                            error={errors.status}
                            value={form.status}
                        >
                            <CustomSelect
                                value={form.status}
                                options={statusOptions}
                                onChange={(value) =>
                                    handleChange(
                                        "status",
                                        value
                                    )
                                }
                            />
                        </FormField>

                    </div>

                </div>

            </div>

        </Modal>
    );
}