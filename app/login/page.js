"use client";
import { useState } from "react";
import Link from "next/link";
import { handleLogin } from "../lib/helper";
import { Alert } from "../components/message";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({
    show: false,
    type: "",
    message: "",
  });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await handleLogin(username, password);

      if (res.ok) {
        setAlert({
          show: true,
          type: "success",
          message: res.message, // ✅ ข้อความจาก server
        });

        // ✅ รอให้ Alert แสดงก่อน จากนั้นรีเฟรช layout แล้วไปหน้า Home
        setTimeout(() => {
          // ✅ หน่วงให้ React render เสร็จก่อน แล้วค่อยเปลี่ยนหน้า
          Promise.resolve().then(() => {
            router.refresh();
            router.push("/");
          });
        }, 1500);
      } else {
        setAlert({
          show: true,
          type: "error",
          message: res.message, // ✅ error จาก server
        });
      }
    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        message: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 relative">
      {/* 🔔 แสดง Alert */}
      <Alert
        show={alert.show}
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ ...alert, show: false })}
      />

      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-[#A83B24]">
          เข้าสู่ระบบ
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="อีเมลหรือชื่อผู้ใช้"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#A83B24] focus:outline-none"
          />
          <input
            type="password"
            placeholder="รหัสผ่าน"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#A83B24] focus:outline-none"
          />
          <button
            type="submit"
            className="bg-[#A83B24] hover:bg-[#8f2f1b] text-white py-2 rounded-lg font-semibold transition"
          >
            เข้าสู่ระบบ
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4 text-sm">
          ยังไม่มีบัญชี?{" "}
          <Link
            href="/register"
            className="text-[#A83B24] font-semibold hover:underline"
          >
            ลงทะเบียน
          </Link>
        </p>
      </div>
    </div>
  );
}
