"use server";

import { revalidatePath } from "next/cache";
import { serverMutate } from "../core/server";

export const createCompany = async (newCompany) => {
  return serverMutate("/api/companies", newCompany, "POST");
};

export const updateCompany = async (id, data) => {
  const result = serverMutate(`/api/companies/${id}`, data, "PATCH");
  revalidatePath("/dashboard/admin/companies");
  return result;
};
