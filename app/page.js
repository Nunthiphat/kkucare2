"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [userData, setUserData] = useState({
    user_id: null,
    email: null,
    role: null,
  });

  // ✅ อ่านค่า sessionStorage เมื่ออยู่ใน browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setUserData({
            user_id: parsed.user_id || null,
            email: parsed.email || null,
            role: parsed.role || null,
          });
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    }
  }, []);

  // 🔹 ถ้ายังไม่ล็อกอิน → แสดงหน้า Home สำหรับบุคคลทั่วไป
  if (!userData.user_id) {
    return (
      <div>
        {/* ส่วน Hero */}
        <section className="bg-[#A83B24] text-white py-16 text-center pt-[120px]">
          <h1 className="text-4xl font-bold mb-4">ระบบรายงานปัญหามหาวิทยาลัยขอนแก่น วิทยาเขตหนองคาย</h1>
          <p className="text-lg mb-6">
            แจ้งปัญหาด้านอาคารสถานที่ ระบบไฟฟ้า น้ำประปา ถนน หรืออื่น ๆ ได้ที่นี่
          </p>
          <div className="space-x-4">
            <Link
              href="/login"
              className="bg-white text-[#A83B24] px-5 py-2 rounded-md font-semibold hover:bg-[#A83B24] hover:text-white hover:[box-shadow:inset_0_0_0_2px_white]"
            >
              เข้าสู่ระบบ
            </Link>
            <Link
              href="/register"
              className="[box-shadow:inset_0_0_0_2px_white] px-5 py-2 rounded-md font-semibold hover:bg-white hover:text-[#A83B24]"
            >
              ลงทะเบียน
            </Link>
          </div>
        </section>

        {/* ส่วนขั้นตอนการใช้งาน */}
        <section className="py-16 bg-gray-50 text-center">
          <h2 className="text-2xl font-bold mb-8">ขั้นตอนการรายงานปัญหา</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="p-6 bg-white shadow rounded-xl">
              <h3 className="font-semibold mb-2">1. เข้าสู่ระบบ</h3>
              <p>เข้าสู่ระบบด้วยบัญชีของคุณ</p>
            </div>
            <div className="p-6 bg-white shadow rounded-xl">
              <h3 className="font-semibold mb-2">2. กรอกรายละเอียด</h3>
              <p>ระบุปัญหาที่พบ พร้อมแนบรูปภาพ (ถ้ามี)</p>
            </div>
            <div className="p-6 bg-white shadow rounded-xl">
              <h3 className="font-semibold mb-2">3. ติดตามสถานะ</h3>
              <p>ตรวจสอบความคืบหน้าของการแก้ไขปัญหาได้</p>
            </div>
            <div className="p-6 bg-white shadow rounded-xl">
              <h3 className="font-semibold mb-2">4. รับการแก้ไข</h3>
              <p>เจ้าหน้าที่ดำเนินการและอัปเดตผลการแก้ไข</p>
            </div>
          </div>
        </section>

        {/* ส่วนเกี่ยวกับระบบ */}
        <section className="py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">เกี่ยวกับระบบ</h2>
          <p className="max-w-3xl mx-auto text-gray-700">
            ระบบรายงานปัญหานี้จัดทำขึ้นเพื่ออำนวยความสะดวกให้กับนักศึกษา บุคลากร และเจ้าหน้าที่ 
            สามารถแจ้งปัญหาต่าง ๆ ภายในมหาวิทยาลัยได้อย่างรวดเร็ว โปร่งใส และตรวจสอบได้
          </p>
        </section>

        {/* ส่วนติดต่อ */}
        <section className="bg-gray-100 py-12 text-center pb-[60px]">
          <h2 className="text-2xl font-bold mb-4">ระบบมีปัญหาติดต่อ</h2>
          <p>อีเมล: support@kkucare.ac.th | โทร: 043-202-xxx</p>
        </section>
      </div>  
    );
  }

  // 🔹 ถ้าล็อกอินแล้ว → แสดงหน้าหลักของผู้ใช้
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b bg-gray-50 text-center px-4">
      {/* กล่องต้อนรับ */}
      <div className="bg-white shadow-2xl rounded-2xl px-10 py-12 max-w-lg w-full border border-gray-100 animate-fadeIn">
        <h1 className="text-4xl font-extrabold text-[#A83B24] mb-3">
          👋 ยินดีต้อนรับ
        </h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {userData.email}
        </h2>

        <div className="bg-[#A83B24]/10 text-[#A83B24] font-medium py-2 px-4 rounded-lg inline-block mb-8">
          คุณอยู่ในโหมด: {userData.role}
        </div>

        <p className="text-gray-600 mb-10 leading-relaxed">
          คุณสามารถแจ้งปัญหา หรือดูสถานะการรายงานของคุณได้จากหน้านี้
        </p>

        <Link
          href="/userform"
          className="bg-[#A83B24] text-white text-lg px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-[#8f2f1b] hover:shadow-lg transition-all duration-300"
        >
          ไปยังหน้าแจ้งปัญหา
        </Link>
      </div>

      {/* ลายพื้นหลังตกแต่งเบาๆ */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#A83B24]/10 to-transparent"></div>
    </main>
  );
}
