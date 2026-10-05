const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;


export const getJobs = async (queryString) => {
    return 
}

export const getCompanyJobs = async (companyId, status) => {
    const res = await fetch(`${baseUrl}/api/jobs?companyId=${companyId}&status=${status}`)
    return res.json()
}