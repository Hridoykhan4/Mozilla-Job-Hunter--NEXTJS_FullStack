import { getApplicationByApplicant } from '@/lib/api/applications';
import { getUserSession } from '@/lib/core/session';
import React from 'react';
import ApplicationsTable from './ApplicationTable';

const ApplicationsPage =  async () => {
    const user = await getUserSession();
    const jobs = await getApplicationByApplicant(user.id);
   
    return (
        <div>
            <ApplicationsTable jobs={jobs}></ApplicationsTable>
        </div>
    );
};

export default ApplicationsPage;