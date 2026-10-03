'use client'
import { useSession } from '@/lib/auth-client';
import React from 'react';
import { Briefcase, Persons, Thunderbolt, CircleCheck } from '@gravity-ui/icons';
import { DashboardStats } from '@/components/dashboard/DashboardStats';

const RecruiterDashboardHomePage = () => {
    const { data: session, isPending } = useSession();
    if (isPending) {
        return <div>Loading...</div>
    }
    const user = session?.user;

    const recruiterStats = [
        { title: "Total Job Posts", value: "48", icon: Briefcase },
        { title: "Total Applicants", value: "1,284", icon: Persons },
        { title: "Active Jobs", value: "18", icon: Thunderbolt },
        { title: "Jobs Closed", value: "32", icon: CircleCheck },
    ];

    return (
        <div>
            <h2 className="text-4xl">Welcome back, {user?.name}</h2>
            <DashboardStats statsData={recruiterStats}></DashboardStats>
        </div>
    );
};

export default RecruiterDashboardHomePage;