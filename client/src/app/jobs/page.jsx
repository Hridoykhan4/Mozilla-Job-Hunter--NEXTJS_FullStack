import JobListingContainer from '@/components/jobs/JobListingContainer';
import { getJobs } from '@/lib/api/jobs';
import React from 'react';

const JobsPage = async ({ searchParams }) => {
    const filters = await searchParams;

    const filterObj = {
        ...filters,
        isRemote: filters.isRemote ? true : false
    }

    // 1. searchParams ke URLSearchParams diye string-e convert korun
    const queryString = new URLSearchParams(filters).toString();

    // 2. queryString ta getJobs-er vitor pass korun, jate API-te query jay
    const { jobs, total } = await getJobs(queryString);

    return (
        <div className="w-full min-h-screen bg-zinc-950 p-6 md:p-12 text-white">
            <div className="max-w-7xl mx-auto mb-10">
                <h1 className="text-4xl font-bold tracking-tight">Open Positions</h1>
                <p className="text-zinc-400 mt-2">Discover your next engineering challenge.</p>
            </div>

            {/* Pass data to the Client Wrapper to handle filtering interactivity */}
            <JobListingContainer filters={filterObj} total={total} jobs={jobs || []} />
        </div>
    );
};

export default JobsPage;