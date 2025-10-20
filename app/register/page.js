"use client";
import { useState } from "react";
import Link from "next/link";
import { Alert } from "../components/message";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alert, setAlert] = useState({
    show: false,
    type: "",
    message: "",
  });

  const validatePassword = (password) => {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    return password.length >= 8 && hasLetter && hasNumber;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ตรวจสอบความถูกต้องของข้อมูลก่อนส่ง
    if (!name || !email || !password || !confirmPassword) {
      return setAlert({
        show: true,
        type: "error",
        message: "กรุณากรอกข้อมูลให้ครบทุกช่อง",
      });
    }

    if (password !== confirmPassword) {
      return setAlert({
        show: true,
        type: "error",
        message: "รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน",
      });
    }

    if (!validatePassword(password)) {
      return setAlert({
        show: true,
        type: "error",
        message:
          "รหัสผ่านต้องมีอย่างน้อย 8 ตัว และประกอบด้วยตัวอักษรและตัวเลขอย่างน้อยอย่างละ 1 ตัว",
      });
    }

    try {
      const res = await fetch("../api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        setAlert({
          show: true,
          type: "success",
          message: "สมัครสมาชิกสำเร็จ!",
        });
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } else {
        setAlert({
          show: true,
          type: "error",
          message: "สมัครไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
        });
      }
    } catch {
      setAlert({
        show: true,
        type: "error",
        message: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      {/* 🔔 Alert แจ้งเตือน */}
      <Alert
        show={alert.show}
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ ...alert, show: false })}
      />

      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-[#A83B24]">
          ลงทะเบียน
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="ชื่อจริง-นามสกุล"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#A83B24] focus:outline-none"
          />
          <input
            type="email"
            placeholder="อีเมล"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#A83B24] focus:outline-none"
          />
          <input
            type="password"
            placeholder="รหัสผ่าน (อย่างน้อย 8 ตัว)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#A83B24] focus:outline-none"
          />
          <input
            type="password"
            placeholder="ยืนยันรหัสผ่าน"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#A83B24] focus:outline-none"
          />

          <button
            type="submit"
            className="bg-[#A83B24] hover:bg-[#8f2f1b] text-white py-2 rounded-lg font-semibold transition"
          >
            ลงทะเบียน
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4 text-sm">
          มีบัญชีอยู่แล้ว?{" "}
          <Link
            href="/login"
            className="text-[#A83B24] font-semibold hover:underline"
          >
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  );
}
