"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers, updateUserRole, deleteUser } from "../lib/userHelper";
import { Alert } from "./message";

export default function UserManage() {
  const { data = [], refetch, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [editUser, setEditUser] = useState(null);

  const departments = ["โสต", "หอพัก", "บริหาร", "สถานที่", "อื่นๆ"];

  const handleRoleChange = (user, newRole) => {
    setEditUser({ ...user, role: newRole, department: "" });
  };

  const handleDepartmentChange = (value) => {
    setEditUser({ ...editUser, department: value });
  };

  const handleSave = async (user) => {
    try {
      if (
        (user.role === "เจ้าหน้าที่" || user.role === "ผู้ดูแลระบบ") &&
        !user.department
      ) {
        setAlert({
          show: true,
          type: "error",
          message: "กรุณาเลือกแผนกสำหรับบทบาทนี้",
        });
        return;
      }

      const res = await updateUserRole(user._id, {
        role: user.role,
        department: user.department,
      });

      if (res._id) {
        setAlert({ show: true, type: "success", message: "อัปเดตข้อมูลสำเร็จ" });
        setEditUser(null);
        refetch();
      } else {
        throw new Error("ไม่สามารถอัปเดตข้อมูลได้");
      }
    } catch (err) {
      setAlert({ show: true, type: "error", message: err.message });
    }
  };

  const handleDelete = async (user_id) => {
    const confirmDelete = confirm("คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้?");
    if (!confirmDelete) return;

    try {
      const res = await deleteUser(user_id);
      if (res.deleted) {
        setAlert({ show: true, type: "success", message: "ลบผู้ใช้สำเร็จ" });
        refetch();
      } else {
        throw new Error("ลบไม่สำเร็จ");
      }
    } catch (err) {
      setAlert({ show: true, type: "error", message: err.message });
    }
  };

  if (isLoading) return <p>กำลังโหลดข้อมูลผู้ใช้...</p>;
  if (isError) return <p>ไม่สามารถโหลดข้อมูลผู้ใช้ได้</p>;

  return (
    <div className="container mx-auto mt-20 p-4">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">
        🧑‍💼 จัดการบัญชีผู้ใช้
      </h2>

      <Alert
        show={alert.show}
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ ...alert, show: false })}
      />

      {/* ✅ เพิ่ม shadow ให้ table */}
      <div className="overflow-hidden border rounded-lg shadow-lg">
        <table className="min-w-full border rounded-lg shadow-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr className="text-center">
              <th className="py-3.5 px-4">ชื่อผู้ใช้</th>
              <th className="py-3.5 px-4">อีเมล</th>
              <th className="py-3.5 px-4">บทบาท</th>
              <th className="py-3.5 px-4">แผนก</th>
              <th className="py-3.5 px-4 text-center">การจัดการ</th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {data.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-4 border-b">
                  ไม่มีข้อมูลผู้ใช้
                </td>
              </tr>
            ) : (
              data.map((user) => (
                <tr
                  key={user._id}
                  className="text-center border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 max-w-[100px]">{user.name || "-"}</td>
                  <td className="px-4 py-3">{user.email}</td>

                  <td className="px-4 py-3 decoration-gray-400 w-[150px]">
                    {editUser?._id === user._id ? (
                      <select
                        value={editUser.role}
                        onChange={(e) => {
                          const newRole = e.target.value;

                          // ✅ ปรับ department อัตโนมัติตาม role ที่เลือก
                          let autoDepartment = editUser.department;
                          if (newRole === "ผู้ดูแลระบบ") autoDepartment = "ทั้งหมด";
                          else if (newRole === "ผู้ใช้ทั่วไป") autoDepartment = "ไม่มี";

                          setEditUser({ ...editUser, role: newRole, department: autoDepartment });
                        }}
                        className="border rounded px-2 py-1 w-full text-center"
                      >
                        <option value="ผู้ใช้ทั่วไป">ผู้ใช้ทั่วไป</option>
                        <option value="เจ้าหน้าที่">เจ้าหน้าที่</option>
                        <option value="ผู้ดูแลระบบ">ผู้ดูแลระบบ</option>
                      </select>
                    ) : (
                      user.role
                    )}
                  </td>

                  <td className="px-4 py-3 decoration-gray-400 w-[150px]">
                    {editUser?._id === user._id ? (
                      // ✅ ถ้าเป็นผู้ใช้ทั่วไปหรือผู้ดูแลระบบ ให้แสดงค่าแบบอ่านอย่างเดียว
                      editUser.role === "ผู้ใช้ทั่วไป" ? (
                        <span className="text-gray-500">ไม่มี</span>
                      ) : editUser.role === "ผู้ดูแลระบบ" ? (
                        <span className="text-gray-500">ทั้งหมด</span>
                      ) : (
                        // ✅ ถ้าเป็นเจ้าหน้าที่ถึงจะแสดง select ให้เลือกได้
                        <select
                          value={editUser.department || ""}
                          onChange={(e) => handleDepartmentChange(e.target.value)}
                          className="border rounded px-2 py-1 w-full text-center"
                        >
                          <option value="">เลือกแผนก</option>
                          {departments.map((dep) => (
                            <option key={dep} value={dep}>
                              {dep}
                            </option>
                          ))}
                        </select>
                      )
                    ) : (
                      user.department || "-"
                    )}
                  </td>


                  <td className="px-4 py-3 flex justify-center items-center gap-3">
                    {editUser?._id === user._id ? (
                      <>
                        <button
                          onClick={() => handleSave(editUser)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          บันทึก
                        </button>
                        <button
                          onClick={() => setEditUser(null)}
                          className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                        >
                          ยกเลิก
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setEditUser(user)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          แก้ไข
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          ลบ
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
