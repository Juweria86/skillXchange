// src/features/user/userAPI.ts
const BASE_URL = "http://localhost:5000/api/users";

export async function fetchUserProfileAPI(token: string) {
  const res = await fetch(`${BASE_URL}/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch user profile");
  }

  return res.json();
}

export async function updateUserProfileAPI(formData: FormData, token: string) {
  const res = await fetch(`${BASE_URL}/`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to update user profile");
  }

  return res.json();
}
