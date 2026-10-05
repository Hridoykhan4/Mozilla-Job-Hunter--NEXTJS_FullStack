"use server";
export const createJob = async (jobData) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/jobs`, {
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
