'use client'
import { useState } from "react";
import JobCard from "./JobCard";
import JobFilters from "./JobFilters";
import { useRouter } from "next/navigation";

const JobListingContainer = ({ jobs }) => {

    // const [searchQuery, setSearchQuery] = useState(filters.search);
    // const [selectedType, setSelectedType] = useState(filters.jobType || "all");
    // const [selectedCategory, setSelectedCategory] = useState(filters.jobCategory || "all");
    // const [isRemoteOnly, setIsRemoteOnly] = useState(filters.isRemote || false);

    const router = useRouter();

    return (
        <div>
            {/* <JobFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                isRemoteOnly={isRemoteOnly}
                setIsRemoteOnly={setIsRemoteOnly}
            /> */}

            <div className="max-w-7xl mx-auto mb-6 text-sm text-zinc-500">
                Showing {jobs.length} position{jobs.length !== 1 && "s"}
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