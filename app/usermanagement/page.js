"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserManage from "../components/userManage"
import { useState, useEffect } from "react";

const queryClient = new QueryClient()

export default function UserManagement(){

    const [userData, setUserData] = useState({
        user_id: null,
        department: null,
        role: null,
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            const userData = sessionStorage.getItem("user");

            if (userData) {
                try {
                    const { department } = JSON.parse(userData);

                    const { role } = JSON.parse(userData);

                    setUserData({ department, role });

                    console.log("Parsed userData:", userData) // ✅ ตรวจสอบค่า userData ที่แปลงแล้ว
                } catch (error) {
                    console.error("Error parsing user data from sessionStorage:", error);
                }
            }
        }
    }, []);

    if (userData.role != "ผู้ดูแลระบบ") {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] bg-gradient-to-b from-gray-50 to-gray-100">
                <div className="bg-white shadow-lg rounded-2xl px-10 py-8 max-w-md text-center border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-700 mb-1">
                    หน้านี้มีไว้สำหรับผู้ดูแลระบบ
                </h2>
                <h2 className="text-2xl font-semibold text-gray-700 mb-3">
                    กรุณาเข้าสู่ระบบ
                </h2>
                <p className="text-gray-500 mb-6">
                    เพื่อเข้าถึงข้อมูลและจัดการรายงานในระบบ
                </p>
                <button
                    onClick={() => (window.location.href = "/login")}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                    ไปที่หน้าล็อกอิน
                </button>
                </div>
            </div>
        )
    }

    return (
        <QueryClientProvider client={queryClient}>
            <>
                <UserManage />
            </>
        </QueryClientProvider>
    )
}