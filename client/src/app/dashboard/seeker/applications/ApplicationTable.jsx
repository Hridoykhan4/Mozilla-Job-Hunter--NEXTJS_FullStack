"use client";

import React from 'react';
import { Chip, Button } from '@heroui/react';
import {
    Code,
    LayoutCells,
    Database,
    Cloud,
    Cpu,
    Gear
} from '@gravity-ui/icons';

// Utility helper to format the "Applied" relative time string
const formatRelativeTime = (dateString) => {
    if (!dateString) return "Recently";
    const now = new Date();
    const appliedDate = new Date(dateString);
    const diffInMs = now - appliedDate;

    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    if (diffInHours < 24) {
        return diffInHours <= 1 ? "1 hour ago" : `${diffInHours} hours ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    return diffInWeeks === 1 ? "1 week ago" : `${diffInWeeks} weeks ago`;
};

// Helper mapping to choose icons and background colors based on the job title
const getJobStyle = (title = "") => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('frontend') || lowerTitle.includes('web')) {
        return { icon: <Code width="16" height="16" />, bg: 'bg-zinc-800 text-zinc-300' };
    }
    if (lowerTitle.includes('designer') || lowerTitle.includes('product')) {
        return { icon: <LayoutCells width="16" height="16" />, bg: 'bg-zinc-700 text-zinc-300' };
    }
    if (lowerTitle.includes('data') || lowerTitle.includes('scientist')) {
        return { icon: <Database width="16" height="16" />, bg: 'bg-zinc-800 text-zinc-400' };
    }
    if (lowerTitle.includes('cloud') || lowerTitle.includes('architect')) {
        return { icon: <Cloud width="16" height="16" />, bg: 'bg-rose-950/60 text-rose-500' };
    }
    if (lowerTitle.includes('ai') || lowerTitle.includes('research')) {
        return { icon: <Cpu width="16" height="16" />, bg: 'bg-zinc-800 text-zinc-300' };
    }
    return { icon: <Gear width="16" height="16" />, bg: 'bg-zinc-800 text-zinc-300' };
};

// Helper mapping for the status badges
const getStatusChip = (status = "Applied") => {
    const normalized = status.toLowerCase();
    switch (normalized) {
        case 'applied':
            return <Chip variant="bordered" className="border-zinc-600 text-zinc-100 text-xs font-medium px-3 py-1">Applied</Chip>;
        case 'review':
            return <Chip variant="bordered" className="border-amber-600/70 text-amber-500 text-xs font-medium px-3 py-1 bg-amber-950/20">Review</Chip>;
        case 'shortlisted':
            return <Chip variant="bordered" className="border-emerald-600/70 text-emerald-500 text-xs font-medium px-3 py-1 bg-emerald-950/20">Shortlisted</Chip>;
        case 'rejected':
            return <Chip variant="bordered" className="border-rose-700/70 text-rose-600 text-xs font-medium px-3 py-1 bg-rose-950/20">Rejected</Chip>;
        case 'offered':
            return <Chip variant="bordered" className="border-zinc-400 text-zinc-200 text-xs font-medium px-3 py-1">Offered</Chip>;
        default:
            return <Chip variant="bordered" className="border-zinc-600 text-zinc-100 text-xs font-medium">{status}</Chip>;
    }
};

const ApplicationsTable = ({ jobs = [] }) => {
    return (
        <div className="w-full bg-[#121212] p-6 rounded-xl border border-zinc-800/80 min-h-screen text-zinc-100">
            <h2 className="text-xl font-semibold mb-6 text-zinc-200">
                Applications ({jobs.length})
            </h2>

            <div className="w-full overflow-x-auto">
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr className="border-b border-zinc-800/60 text-zinc-400 font-medium text-sm">
                            <th className="py-4 pl-4 w-[40%]">Job Title</th>
                            <th className="py-4 w-[20%]">Company</th>
                            <th className="py-4 w-[15%]">Applied</th>
                            <th className="py-4 w-[15%]">Status</th>
                            <th className="py-4 pr-4 w-[10%] text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/40">
                        {jobs.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="py-8 text-center text-zinc-500 text-sm">
                                    No applications found.
                                </td>
                            </tr>
                        ) : (
                            jobs.map((job) => {
                                const style = getJobStyle(job.jobTitle);
                                const workType = job.jobType || "Full-time";
                                const locationType = job.isRemote ? "Remote" : (job.location || "On-site");
                                const status = job.status || "Applied";
                                const rowKey = job._id?.$oid || job._id || Math.random();

                                return (
                                    <tr key={rowKey} className="hover:bg-zinc-900/40 transition-colors">
                                        {/* JOB TITLE COLUMN */}
                                        <td className="py-4 pl-4 align-middle">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2.5 rounded-lg flex items-center justify-center ${style.bg}`}>
                                                    {style.icon}
                                                </div>
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-medium text-zinc-100 text-[15px]">
                                                        {job.jobTitle}
                                                    </span>
                                                    <span className="text-xs text-zinc-500 font-normal capitalize">
                                                        {workType} • {locationType}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* COMPANY COLUMN */}
                                        <td className="py-4 align-middle text-zinc-300 text-[14px]">
                                            {job.companyName}
                                        </td>

                                        {/* APPLIED COLUMN */}
                                        <td className="py-4 align-middle text-zinc-400 text-[14px]">
                                            {formatRelativeTime(job.createdAt?.$date || job.createdAt)}
                                        </td>

                                        {/* STATUS COLUMN */}
                                        <td className="py-4 align-middle">
                                            {getStatusChip(status)}
                                        </td>

                                        {/* ACTION COLUMN */}
                                        <td className="py-4 pr-4 align-middle text-right">
                                            <Button
                                                size="sm"
                                                variant="light"
                                                className="text-zinc-300 hover:text-zinc-100 font-normal text-sm"
                                                onClick={() => console.log('Details for:', job._id)}
                                            >
                                                Details
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ApplicationsTable;