'use client'
import { useState, useEffect } from "react";
import JobCard from "./JobCard";
import JobFilters from "./JobFilters";
import { useRouter, useSearchParams } from "next/navigation";

const JobListingContainer = ({ jobs, total, filters }) => {
    const [searchQuery, setSearchQuery] = useState(filters.search || "");
    const [selectedType, setSelectedType] = useState(filters.jobType || "all");
    const [selectedCategory, setSelectedCategory] = useState(filters.jobCategory || "all");
    const [isRemoteOnly, setIsRemoteOnly] = useState(filters.isRemote || false);

    const router = useRouter();

    // State change hole URL update korar jonno useEffect
    useEffect(() => {
        const params = new URLSearchParams();

        if (searchQuery) params.set("search", searchQuery);
        if (selectedType && selectedType !== "all") params.set("jobType", selectedType);
        if (selectedCategory && selectedCategory !== "all") params.set("jobCategory", selectedCategory);
        if (isRemoteOnly) params.set("isRemote", "true");

        const queryString = params.toString();
        router.push(`?${queryString}`, { scroll: false });
    }, [searchQuery, selectedType, selectedCategory, isRemoteOnly, router]);

    return (
        <div>
            <JobFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                isRemoteOnly={isRemoteOnly}
                setIsRemoteOnly={setIsRemoteOnly}
            />

            <div className="max-w-7xl mx-auto mb-6 text-sm text-zinc-500">
                Showing {jobs.length} position{jobs.length !== 1 && "s"} (Total: {total})
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                {jobs.map((jobItem) => (
                    <JobCard
                        key={jobItem._id?.$oid || jobItem._id}
                        job={jobItem}
                    />
                ))}
            </div>
        </div>
    );
};

export default JobListingContainer;