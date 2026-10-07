const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
export const serverMutate = async (path, bodyData, method = "POST") => {
  const res = await fetch(`${baseURL}${path}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyData),
  });
  const data = await res.json();
  if (!res.ok) {
    return { success: false, error: data.message || "Something went wrong" };
  }
  return { success: true, data };
};
