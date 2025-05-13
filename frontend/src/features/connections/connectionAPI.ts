const BASE_URL = "http://localhost:5000/api/connections";

export async function fetchConnections() {
  const res = await fetch(BASE_URL, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch connections");
  return res.json();
}
