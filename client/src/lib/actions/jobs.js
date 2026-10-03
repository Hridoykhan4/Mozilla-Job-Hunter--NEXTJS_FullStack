"use server";
export const createJob = async (jobData) => {
  const res = await fetch(`${process.env.BETTER_AUTH_URL}/api/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jobData),
  });
  const data = await res.json();
  if (!res.ok) {
    return { success: false, error: data.message || "Something went wrong" };
  }
  return { success: true, data };
};
    