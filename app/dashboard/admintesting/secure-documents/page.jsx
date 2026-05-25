"use client";

import { useEffect, useState } from "react";

import CreateFilesEncryptionModal from "@/components/admintesting/CreateFilesEncryptionModal";
import SecureDocumentWrapper from "@/components/admintesting/SecureDocumentWrapper";

import Pagination from "@/components/table/Pagination";

import api from "@/services/api";

import { useToast } from "@/components/ui/ToastProvider";

import Input from "@/components/ui/Input";
import CustomSelect from "@/components/ui/CustomSelect";

import { Button } from "@/components/ui/button";

import { documentStatusOptions } from "@/config/options";

/* =========================
   FORM FIELD
========================= */
function FormField({ label, children }) {

    return (

        <div className="flex flex-col gap-1">

            <label className="text-xs font-medium text-gray-700">
                {label}
            </label>

            {children}

        </div>
    );
}

export default function SecureDocumentsPage() {

    const [documents, setDocuments] = useState([]);

    const [meta, setMeta] = useState(null);

    const [page, setPage] = useState(1);

    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");

    const [status, setStatus] = useState("All");

    const [uploadOpen, setUploadOpen] = useState(false);

    const { showToast } = useToast();

    /* =========================
       FETCH DOCUMENTS
    ========================= */
    const fetchDocuments = async (
        pageNumber = 1
    ) => {

        try {

            setLoading(true);

            const res = await api.get(
                "/secure-documents",
                {
                    params: {
                        page: pageNumber,
                        search,
                        status,
                    },
                }
            );

            setDocuments(
                res?.data?.data?.data || []
            );

            setMeta(
                res?.data?.data
            );

        } catch (err) {

            showToast({
                title: "Error",
                message:
                    "Failed to fetch documents",
                type: "error",
            });

        } finally {

            setLoading(false);
        }
    };

    /* =========================
       PAGINATION
    ========================= */
    const handlePageChange = (
        newPage
    ) => {

        setPage(newPage);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    /* =========================
       EFFECTS
    ========================= */
    useEffect(() => {

        fetchDocuments(page);

    }, [page]);

    useEffect(() => {

        const delay = setTimeout(() => {

            setPage(1);

            fetchDocuments(1);

        }, 300);

        return () => clearTimeout(delay);

    }, [search, status]);

    return (

        <div className="p-6 space-y-6">

            {/* =========================
                HEADER
            ========================= */}
            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-2xl font-bold text-gray-900">
                        Secure Documents
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Manage encrypted PDF files and secure email distribution.
                    </p>

                </div>

                <Button
                    onClick={() =>
                        setUploadOpen(true)
                    }
                    className="
                        bg-indigo-600
                        hover:bg-indigo-700
                        text-white
                    "
                >
                    Upload Secure Files
                </Button>

            </div>

            {/* =========================
                FILTERS
            ========================= */}
            <div className="
                bg-white border rounded-2xl
                shadow-sm p-5
            ">

                <div className="mb-4">

                    <h2 className="text-sm font-bold text-gray-800">
                        Filters
                    </h2>

                    <p className="text-xs text-gray-500 mt-1">
                        Search and filter encrypted documents.
                    </p>

                </div>

                <div className="
                    grid grid-cols-1
                    md:grid-cols-3
                    gap-4
                ">

                    {/* SEARCH */}
                    <FormField label="Search Document">

                        <Input
                            placeholder="Employee, email, file..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                        />

                    </FormField>

                    {/* STATUS */}
                    <FormField label="Status">

                        <CustomSelect
                            value={status}
                            options={
                                documentStatusOptions
                            }
                            onChange={(value) =>
                                setStatus(value)
                            }
                        />

                    </FormField>

                    {/* CLEAR */}
                    <div className="flex items-end">

                        <Button
                            variant="outline"
                            onClick={() => {

                                setSearch("");

                                setStatus("All");
                            }}
                            className="w-full"
                        >
                            Clear Filters
                        </Button>

                    </div>

                </div>

            </div>

            {/* =========================
                DOCUMENT TABLE
            ========================= */}
            <SecureDocumentWrapper
                data={documents}
                refresh={() =>
                    fetchDocuments(page)
                }
                loading={loading}
            />

            {/* =========================
                PAGINATION
            ========================= */}
            <div className="flex justify-end">

                <Pagination
                    meta={meta}
                    onPageChange={
                        handlePageChange
                    }
                />

            </div>

            {/* =========================
                CREATE FILE ENCRYPTION MODAL
            ========================= */}
            <CreateFilesEncryptionModal
                open={uploadOpen}
                onClose={() =>
                    setUploadOpen(false)
                }
                onSuccess={() =>
                    fetchDocuments(page)
                }
            />

        </div>
    );
}