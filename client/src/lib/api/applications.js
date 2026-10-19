import { protectedFetch } from "../core/server";

export const getApplicationByApplicant =  async (applicantId) => {
    return protectedFetch(`/api/applications?applicantId=${applicantId}`);
}