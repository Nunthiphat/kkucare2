"use client"

import ReceiveTable from "../components/receiveTable";
import { IoIosAdd } from "react-icons/io";
import ReportForm from "../components/reportForm";
import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Home() {
    
    const [visible, setVisible] = useState(false)

    const [userData, setUserData] = useState({
        user_id: null,
        department: null,
        role: null
    });

    const handle = () => {
        setVisible(!visible)
    }

    // ✅ อ่านค่า sessionStorage เฉพาะตอนอยู่ใน browser
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

    console.log("userData in Home:", userData); // ✅ ตรวจสอบค่า userData ที่เก็บใน state

    if (!userData.department) {
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

    return (

        <QueryClientProvider client={queryClient}>

            <section>
                <main className="py-5">
                    <div className="container mx-auto flex justify-between pt-3">
                        <div className="left flex gap-2">
                            <button onClick={handle} className="flex flex-left bg-cyan-500 text-white px-4 py-2 border rounded-md hover:bg-gray-50 hover:border-cyan-500 hover:text-gray-800"> 
                                <span><IoIosAdd size={24}></IoIosAdd></span>เพิ่มรายงาน
                            </button>
                        </div>
                    </div>

                    <div className="container mx-auto py-2">
                        { visible ? <ReportForm /> : <></>}
                    </div>

                    <div className="container mx-auto">
                        <ReceiveTable userData={userData} />
                    </div>
                </main>
            </section>

        </QueryClientProvider>
        
    )
}