const BASE_URL = "http://localhost:5000/api/messages";

export async function fetchMessages(receiverId: string) {
  const res = await fetch(`${BASE_URL}/${receiverId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json();
}

export async function postMessage(receiverId: string, text: string) {
  const res = await fetch(`${BASE_URL}/${receiverId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error("Failed to send message");
  return res.json();
}
