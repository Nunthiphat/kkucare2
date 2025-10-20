"use client"

// import { IoIosAdd } from "react-icons/io";
import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReceiveTable from "../components/receiveTable";
import ReportForm from "../components/reportForm";
import ReportModal from "../components/reportModal";

const queryClient = new QueryClient();

export default function Home() {
    const [visible, setVisible] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [userData, setUserData] = useState({
        user_id: null,
        department: null,
        role: null,
    });
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

    if (!userData.department) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] bg-gradient-to-b from-gray-50 to-gray-100">
                <div className="bg-white shadow-lg rounded-2xl px-10 py-8 max-w-md text-center border border-gray-200">
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

    // const handleAddClick = () => {
    //     setSelectedReport(null);
    //     setIsUpdate(false);
    //     setVisible(true);
    // };

    const handleEdit = (reportData) => {
        setSelectedReport(reportData);
        setIsUpdate(true);
        setVisible(true);
    };

    const onSuccess = () => {
        setSelectedReport(null);
        setIsUpdate(false);
        setVisible(false);
    };


    return (
        <QueryClientProvider client={queryClient}>
            <main className="container mx-auto py-5 mt-20">
                {/* ปุ่มเพิ่มรายงาน */}
                {/* <div className="flex justify-between items-center pb-4">
                <button
                    onClick={handleAddClick}
                    className="flex items-center gap-2 bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-cyan-600"
                >
                    <IoIosAdd size={22} />
                    เพิ่มรายงาน
                </button>
                </div> */}

                {/* Modal ส่วนเพิ่ม / แก้ไข */}
                <ReportModal
                isOpen={visible}
                onClose={() => setVisible(false)}
                title={isUpdate ? "แก้ไขรายงาน" : "เพิ่มรายงานใหม่"}
                >
                <ReportForm
                    isUpdate={isUpdate}
                    selectedReport={selectedReport}
                    onSuccess={onSuccess}
                />
                </ReportModal>

                {/* ตารางรายงาน */}
                <ReceiveTable userData={userData} onEdit={handleEdit} />
            </main>
        </QueryClientProvider>
    )
}