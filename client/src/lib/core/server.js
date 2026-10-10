import { redirect } from "next/navigation";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;


export const serverFetch = async path => {
    const res = await fetch(`${baseURL}${path}`)
    return handleStatusCode(res)
}


export const serverMutate = async (path, bodyData, method = "POST") => {
  try {
    const res = await fetch(`${baseURL}${path}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    });

    // স্ট্যাটাস কোড হ্যান্ডেল করা
    if (res.status === 401) {
      redirect("/unauthorized");
    } else if (res.status === 403) {
      redirect("/forbidden");
    }

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.message || "Something went wrong" };
    }

    return { success: true, data };
  } catch (error) {
    // Next.js redirect ত্রুটি হ্যান্ডেল করার জন্য এটি জরুরি
    if (error.message === "NEXT_REDIRECT") {
      throw error;
    }
    return { success: false, error: error.message || "Something went wrong" };
  }
};



const handleStatusCode = res => {
    return res.json()
}