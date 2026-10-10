"use server";

import { serverMutate } from "../core/server";

export const createCompany = async (newCompany) => {
  return serverMutate('/api/companies', newCompany, "POST")
};
