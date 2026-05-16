"use client";

import { useEffect, useState } from "react";

import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileInformationCard from "@/components/profile/ProfileInformationCard";
import EmploymentInformationCard from "@/components/profile/EmploymentInformationCard";
import ContactInformationCard from "@/components/profile/ContactInformationCard";
import GovernmentInformationCard from "@/components/profile/GovernmentInformationCard";

import { getEmployeeProfile } from "@/services/profileService";

export default function EmployeeProfilePage() {

    const [profile, setProfile] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {

        try {

            setLoading(true);

            const response = await getEmployeeProfile();

            setProfile(response.data);

        } catch (error) {

            console.error("PROFILE FETCH ERROR:", error);

        } finally {

            setLoading(false);

        }
    };

    if (loading) {
        return (
            <div className="space-y-6 p-6">

                <div className="h-40 animate-pulse rounded-3xl bg-gray-200" />

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                    <div className="h-72 animate-pulse rounded-3xl bg-gray-200" />

                    <div className="h-72 animate-pulse rounded-3xl bg-gray-200" />

                    <div className="h-72 animate-pulse rounded-3xl bg-gray-200" />

                    <div className="h-72 animate-pulse rounded-3xl bg-gray-200" />

                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">

            {/* PROFILE HEADER */}
            <ProfileHeader profile={profile} />

            {/* PROFILE CONTENT */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                <ProfileInformationCard profile={profile} />

                <EmploymentInformationCard profile={profile} />

                <ContactInformationCard profile={profile} />

                <GovernmentInformationCard profile={profile} />

            </div>
        </div>
    );
}