const BASE_URL = "http://localhost:3000";

// ✅ ดึงผู้ใช้ทั้งหมด
export async function getAllUsers() {
  const res = await fetch(`${BASE_URL}/api/user`);
  const data = await res.json();
  return data;
}

// ✅ อัปเดตบทบาทและแผนก
export async function updateUserRole(user_id, payload) {
  const res = await fetch(`${BASE_URL}/api/user/${user_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return await res.json();
}

// ✅ ลบผู้ใช้
export async function deleteUser(user_id) {
  const res = await fetch(`${BASE_URL}/api/user/${user_id}`, {
    method: "DELETE",
  });
  return await res.json();
}
