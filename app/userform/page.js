"use client"

import UserTable from "../components/userTable"
import { IoIosAdd } from "react-icons/io";
import ReportForm from "../components/reportForm";
import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Home() {

    const [visible, setVisible] = useState(false)
    const [isUpdate, setIsUpdate] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);

    const [userData, setUserData] = useState({
        user_id: null,
        department: null,
        role: null
    }); // 🔹 state เก็บ user_id จาก sessionStorage

    // ✅ อ่านค่า sessionStorage เฉพาะตอนอยู่ใน browser
    useEffect(() => {
        if (typeof window !== "undefined") {
            const userData = sessionStorage.getItem("user");

            if (userData) {
                try {
                    const { user_id } = JSON.parse(userData);

                    setUserData({ user_id });

                    console.log("Parsed userData:", userData)
                } catch (error) {
                    console.error("Error parsing user data from sessionStorage:", error);
                }
            }
        }
    }, []);

    if (!userData.user_id) {
        return (
        <div className="container mx-auto py-5 text-center">
            <div className="p-4">กรุณาเข้าสู่ระบบ</div>
            <button
            onClick={() => (window.location.href = "/login")}
            className="bg-blue-500 text-white p-2 rounded"
            >
            ไปที่หน้าล็อกอิน
            </button>
        </div>
        );
    }

    // 🟢 เมื่อคลิก “เพิ่มรายงาน”
    const handleAddClick = () => {
        setSelectedReport(null);
        setIsUpdate(false);
        setVisible(!visible);
    };

    // 🟢 เมื่อคลิก “แก้ไข” จาก UserTable
    const handleEdit = (reportData) => {
        setSelectedReport(reportData);
        setIsUpdate(true);
        setVisible(true); // เปิดฟอร์มอัตโนมัติ
    };

    // 🔙 เมื่ออัปเดตเสร็จหรือกดยกเลิก
    const handleCancelUpdate = () => {
        setSelectedReport(null);
        setIsUpdate(false);
        setVisible(false);
    };

    return (

        <QueryClientProvider client={queryClient}>

            <section>
                <main className="py-5">
                    <div className="container mx-auto flex justify-between pt-3">
                        <div className="left flex gap-2">
                            <button onClick={handleAddClick} className="flex flex-left bg-cyan-500 text-white px-4 py-2 border rounded-md hover:bg-gray-50 hover:border-cyan-500 hover:text-gray-800"> 
                                <span><IoIosAdd size={24}></IoIosAdd></span>{isUpdate ? "กลับไปเพิ่มรายงาน" : "เพิ่มรายงาน"}
                            </button>
                        </div>
                    </div>

                    {/* ✅ ส่วนฟอร์ม */}
                    <div className="container mx-auto py-2">
                        {visible && (<ReportForm isUpdate={isUpdate} selectedReport={selectedReport} onSuccess={handleCancelUpdate} />)}
                    </div>

                    {/* ✅ ตารางรายงาน (อยู่ตลอดเวลา) */}
                    <div className="container mx-auto">
                        <UserTable userData={userData} onEdit={handleEdit} />
                    </div>
                </main>
            </section>

        </QueryClientProvider>
        
    )
}