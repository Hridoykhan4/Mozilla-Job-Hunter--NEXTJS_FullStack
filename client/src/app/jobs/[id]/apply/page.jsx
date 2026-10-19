import { getJobById } from '@/lib/api/jobs';
import { getUserSession } from '@/lib/core/session';
import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';
import JobApply from './JobApply';

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
                <p className="text-zinc-400 text-lg">Job position could not be found or is no longer active.</p>
            </div>
        );
    } 

    if(user?.role !== 'seeker') {
        return (
            <div className="w-full min-h-[80vh] flex flex-col justify-center items-center text-white p-6">
                <div className="max-w-md w-full text-center p-8 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl">
                    <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShieldAlert className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-100 mb-2">Access Restricted</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                        Only job seekers can apply for positions. Please sign in with a seeker account to proceed.
                    </p>
                    <Link
                        href="/auth/signin"
                        className="inline-block w-full px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-sm font-medium transition"
                    >
                        Switch Account
                    </Link>
                </div>
            </div>
        );
    }



    return (
        <main className="w-full min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12 lg:p-16">

            <JobApply applicant={user} job={job} />
        
        </main>
    );
};

export default ApplyPage;