import { getJobById } from '@/lib/api/jobs';
import { getUserSession } from '@/lib/core/session';
import { Rocket, ShieldAlert, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';
import JobApply from './JobApply';
import { getApplicationByApplicant } from '@/lib/api/applications';

const ApplyPage = async ({ params }) => {
    const { id } = await params;
    const job = await getJobById(id);
    const user = await getUserSession();
    
    if (!user) {
        redirect(`/signin?redirect=/jobs/${id}/apply`);
    }

    if (!job) {
        return (
            <div className="w-full min-h-screen bg-zinc-950 flex flex-col justify-center items-center text-white p-6">
                <div className="text-center space-y-2">
                    <h2 className="text-xl font-semibold text-zinc-200">Job Not Found</h2>
                    <p className="text-zinc-500 text-sm">This position could not be found or is no longer active.</p>
                </div>
            </div>
        );
    } 

    if (user?.role !== 'seeker') {
        return (
            <div className="w-full min-h-[80vh] flex flex-col justify-center items-center text-white p-6">
                <div className="max-w-md w-full text-center p-8 rounded-3xl bg-zinc-900/80 backdrop-blur-md border border-zinc-800 shadow-2xl">
                    <div className="w-14 h-14 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
                        <ShieldAlert className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-100 mb-2">Access Restricted</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                        Only job seekers can apply for positions. Please sign in with a seeker account to proceed.
                    </p>
                    <Link
                        href="/auth/signin"
                        className="inline-block w-full py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-sm font-semibold transition-all shadow-inner"
                    >
                        Switch Account
                    </Link>
                </div>
            </div>
        );
    }
    
    const applications = await getApplicationByApplicant(user.id);
    const applicationCount = applications?.length || 0;
    
    const plan = {
        name: "Free Tier",
        maxApplicationsPerMonth: 3
    };

    const hasReachedLimit = applicationCount >= plan.maxApplicationsPerMonth;
    // Fix: Proper percentage calculation for the progress bar
    const usagePercentage = Math.min(Math.round((applicationCount / plan.maxApplicationsPerMonth) * 100), 100);

    return (
        <main className="w-full min-h-screen bg-zinc-950 text-zinc-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-6">

                {/* Header Context */}
                <div className="space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Submit Application</h1>
                    <p className="text-zinc-400 text-sm">Applying for <span className="text-zinc-200 font-medium">{job.jobTitle}</span> at {job.companyName}</p>
                </div>

                {/* 1. Usage & Quota Tracker Card */}
                <div className="bg-zinc-900/90 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="space-y-1">
                            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                                Monthly Quota Status
                            </span>
                            <h2 className="text-lg font-semibold text-zinc-100">
                                You have applied to <span className="text-indigo-400 font-bold">{applicationCount}</span> out of <span className="text-zinc-300">{plan.maxApplicationsPerMonth}</span> positions
                            </h2>
                        </div>
                        <span className="self-start sm:self-center px-3 py-1.5 text-xs font-semibold rounded-full bg-zinc-800/80 text-zinc-300 border border-zinc-700/60 uppercase tracking-wider">
                            Plan: <strong className="text-white font-bold">{plan.name}</strong>
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                        <div className="w-full bg-zinc-950/60 h-3 rounded-full overflow-hidden p-0.5 border border-zinc-800/60">
                            <div
                                className={`h-full transition-all duration-700 rounded-full ${
                                    hasReachedLimit 
                                        ? 'bg-rose-500 shadow-lg shadow-rose-500/20' 
                                        : usagePercentage > 66 
                                        ? 'bg-amber-500 shadow-lg shadow-amber-500/20' 
                                        : 'bg-indigo-500 shadow-lg shadow-indigo-500/20'
                                }`}
                                style={{ width: `${usagePercentage}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-xs text-zinc-500 font-medium px-0.5">
                            <span>{usagePercentage}% used</span>
                            <span>{plan.maxApplicationsPerMonth - applicationCount} remaining</span>
                        </div>
                    </div>

                    {/* Upsell Alert Block */}
                    <div className="flex items-start gap-3.5 bg-indigo-950/20 border border-indigo-900/40 rounded-2xl p-4 sm:p-5 text-sm text-indigo-200/90">
                        <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20 shrink-0">
                            <Rocket className="w-5 h-5" />
                        </div>
                        <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <p className="text-xs sm:text-sm text-indigo-200/80 leading-relaxed">
                                Need to apply for more positions? Upgrade your account to unlock unlimited job submissions.
                            </p>
                            <Link
                                href="/plans"
                                className="inline-flex items-center justify-center whitespace-nowrap text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl transition shadow-lg shadow-indigo-600/20 active:scale-95"
                            >
                                View Plans
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 2. Form Rendering and Dynamic Limit Enforcement Block */}
                {hasReachedLimit ? (
                    /* Lockout State View */
                    <div className="bg-zinc-900/40 border border-dashed border-zinc-800 rounded-3xl p-10 text-center flex flex-col items-center justify-center space-y-3">
                        <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center border border-rose-500/20 shadow-inner">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-semibold text-zinc-200">Application Limit Reached</h4>
                        <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
                            You have exhausted your free credits for this calendar cycle. Upgrade your tier to resume submitting applications immediately.
                        </p>
                    </div>
                ) : (
                    /* Active Form View */
                    <div className="animate-in fade-in-50 duration-500">
                        <JobApply applicant={user} job={job} />
                    </div>
                )}

            </div>
        </main>
    );
};

export default ApplyPage;