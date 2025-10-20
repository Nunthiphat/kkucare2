"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const loadUser = () => {
      const stored = sessionStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        router.refresh(); // ✅ refresh layout ทุกครั้งที่ login สำเร็จ
      } else {
        setUser(null);
      }
    };

    loadUser();
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, [router]);

  // ถ้าไม่มีผู้ใช้ (ยังไม่ได้ login)
  if (!user) return <DefaultHeader />;

  // แสดง Header ตาม role
  switch (user.role) {
    case "เจ้าหน้าที่":
      // router.push("/")
      return <EmployeeHeader user={user} router={router} />;
    case "ผู้ดูแลระบบ":
      // router.push("/")
      return <AdminHeader user={user} router={router} />;
    case "ผู้ใช้ทั่วไป":
      // router.push("/")
      return <UserHeader user={user} router={router} />;
    default:
      // router.push("/")
      return <DefaultHeader />;
  }
}

// ---------- ฟังก์ชัน Logout ----------
function handleLogout(router) {
  sessionStorage.removeItem("user");
  router.push("/"); // กลับไปหน้าหลัก
  window.location.reload(); // รีเฟรชหน้าเพื่ออัปเดต Header
}

// ---------- Header แต่ละแบบ ----------

function DefaultHeader() {
  return (
    <header className="fixed top-0 left-0 w-full bg-[#A83B24] text-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">KKUCare</Link>
        <nav className="space-x-4">
          <Link href="/" className="px-3 py-1 border rounded border-hidden hover:bg-gray-50 hover:text-red-500">หน้าหลัก</Link>
          <Link href="/register" className="px-3 py-1 border rounded border-hidden hover:bg-gray-50 hover:text-red-500">ลงทะเบียน</Link>
          <Link href="/login" className="px-3 py-1 border rounded border-hidden hover:bg-gray-50 hover:text-red-500">เข้าสู่ระบบ</Link>
        </nav>
      </div>
    </header>
  );
}

function EmployeeHeader({ user, router }) {
  return (
    <header className="fixed top-0 left-0 w-full bg-[#A83B24] text-white shadow-lg z-50">  
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">KKUCare</Link>
        <nav className="space-x-4 flex items-center">
          <Link href="/" className="px-3 py-1 border rounded border-hidden hover:bg-gray-50 hover:text-red-500">หน้าหลัก</Link>
          <Link href="/userform" className="px-3 py-1 border rounded border-hidden hover:bg-gray-50 hover:text-red-500">แจ้งปัญหา</Link>
          <Link href="/receive" className="px-3 py-1 border rounded border-hidden hover:bg-gray-50 hover:text-red-500">รายการร้องเรียน</Link>
          <span className="ml-6 text-sm italic">บัญชีผู้ใช้: {user.email}</span>
          <button
            onClick={() => handleLogout(router)}
            className="ml-4 bg-white text-[#A83B24] px-3 py-1 rounded-md font-semibold hover:bg-gray-200"
          >
            ออกจากระบบ
          </button>
        </nav>
      </div>
    </header>
  );
}

function AdminHeader({ user, router }) {
  return (
    <header className="fixed top-0 left-0 w-full bg-[#A83B24] text-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">KKUCare</Link>
        <nav className="space-x-4 flex items-center">
          <Link href="/" className="px-3 py-1 border rounded border-hidden hover:bg-gray-50 hover:text-red-500">หน้าหลัก</Link>
          <Link href="/userform" className="px-3 py-1 border rounded border-hidden hover:bg-gray-50 hover:text-red-500">แจ้งปัญหา</Link>
          <Link href="/dashboard" className="px-3 py-1 border rounded border-hidden hover:bg-gray-50 hover:text-red-500">สรุปรายงาน</Link>
          <Link href="/usermanagement" className="px-3 py-1 border rounded border-hidden hover:bg-gray-50 hover:text-red-500">จัดการผู้ใช้งาน</Link>
          <span className="ml-6 text-sm italic">บัญชีผู้ใช้: {user.email}</span>
          <button
            onClick={() => handleLogout(router)}
            className="ml-4 bg-white text-[#A83B24] px-3 py-1 rounded-md font-semibold hover:bg-gray-200"
          >
            ออกจากระบบ
          </button>
        </nav>
      </div>
    </header>
  );
}

function UserHeader({ user, router }) {
  return (
    <header className="fixed top-0 left-0 w-full bg-[#A83B24] text-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">KKUCare</Link>
        <nav className="space-x-4 flex items-center">
          <Link href="/" className="px-3 py-1 border rounded border-hidden hover:bg-gray-50 hover:text-red-500">หน้าหลัก</Link>
          <Link href="/userform" className="px-3 py-1 border rounded border-hidden hover:bg-gray-50 hover:text-red-500">แจ้งปัญหา</Link>
          <span className="ml-6 text-sm italic">บัญชีผู้ใช้: {user.email}</span>
          <button
            onClick={() => handleLogout(router)}
            className="ml-4 bg-white text-[#A83B24] px-3 py-1 rounded-md font-semibold hover:bg-gray-200"
          >
            ออกจากระบบ
          </button>
        </nav>
      </div>
    </header>
  );
}