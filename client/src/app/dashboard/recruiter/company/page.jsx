import { getRecruiterCompany } from '@/lib/api/companies';
import CompanyProfile from './CompanyProfile';
import { getUserSession } from '@/lib/core/session';

const CompanyPage = async () => {
    const user = await getUserSession();
    const company = await getRecruiterCompany(user?.id);

    return (
        <div>
            <CompanyProfile recruiterCompany={company} recruiter={user} ></CompanyProfile>
        </div>
    );
};

export default CompanyPage;