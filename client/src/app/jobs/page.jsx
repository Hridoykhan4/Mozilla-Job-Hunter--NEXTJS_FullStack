import JobListingContainer from '@/components/jobs/JobListingContainer';
import { getJobs } from '@/lib/api/jobs';
import React from 'react';

const JobsPage = async ({ searchParams }) => {
    const jobs = await getJobs()

    const filters = await searchParams;
    const filterObj = {
        ...filters,
        isRemote: filters.isRemote === 'true' ? true : false
    }

    const querySearch = new URLSearchParams(filters);
    const queryString = querySearch.toString();

    // console.log('search q', filters, queryString);

    return (
        <div className="w-full min-h-screen bg-zinc-950 p-6 md:p-12 text-white">
            <div className="max-w-7xl mx-auto mb-10">
                <h1 className="text-4xl font-bold tracking-tight">Open Positions</h1>
                <p className="text-zinc-400 mt-2">Discover your next engineering challenge.</p>
            </div>

            {/* Pass data to the Client Wrapper to handle filtering interactivity */}
            <JobListingContainer jobs={jobs || []}  />
        </div>
    );
};

export default JobsPage;