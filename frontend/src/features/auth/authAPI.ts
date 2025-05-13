const BASE_URL = "http://localhost:5000/api/auth";

export async function registerUserAPI(data: { name: string; email: string; password: string }) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json(); // Parse response JSON either way

  if (!res.ok) {
    // Throw the actual error message from backend
    throw new Error(json.message || "Registration failed");
  }

  return json;
}



// authAPI.ts
export async function loginUserAPI(data: { email: string; password: string }) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const userData = await res.json();

  if (!res.ok) {
    throw new Error(userData.message || "Login failed");
  }

  // Ensure the response includes isOnboarded
  return {
    token: userData.token,
    user: {
      ...userData.user,
      isOnboarded: userData.user.isOnboarded || false // Default to false if not provided
    }
  };
}
  