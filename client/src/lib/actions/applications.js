"use server";

import { serverMutate } from "../core/server";

export const submitApplication = async (applicationData) => {
  return serverMutate("/api/applications", applicationData);
};
