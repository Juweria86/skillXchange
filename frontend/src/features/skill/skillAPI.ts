// api/skillAPI.ts
const BASE_URL = "http://localhost:5000/api/skills";

export async function fetchSkills(token: string) {
  const res = await fetch(BASE_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch skills");
  return await res.json();
}

export async function createSkill(token: string, skillData: any) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(skillData),
  });
  if (!res.ok) throw new Error("Failed to create skill");
  return await res.json();
}

export async function updateSkill(token: string, id: string, skillData: any) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(skillData),
  });
  if (!res.ok) throw new Error("Failed to update skill");
  return await res.json();
}

export async function deleteSkill(token: string, id: string) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to delete skill");
  return await res.json();
}