"use client";

import { TbEdit } from "react-icons/tb";
import { BiSolidTrashAlt } from "react-icons/bi";
import { IoEyeSharp } from "react-icons/io5";
import { getReports, deleteReport } from "../lib/helper";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import DataModal from "./showDataModal";
import { Alert } from "./message";

export default function UserTable({ userData, onEdit }) {
    const { isLoading, isError, data = [], error, refetch } = useQuery({
        queryKey: ["reports", userData],
        queryFn: () => getReports(userData),
    });

    const [isOpen, setIsOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);

    // 🔍 state สำหรับ filter
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    // ✅ state สำหรับ Alert
    const [alert, setAlert] = useState({
        show: false,
        type: "info",
        message: "",
    });

    const openModal = (report) => {
        setSelectedReport(report);
        setIsOpen(true);
        if (typeof window !== "undefined") document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
        setIsOpen(false);
        setSelectedReport(null);
        if (typeof window !== "undefined") document.body.style.overflow = "";
    };

    // ฟังก์ชันลบรายงาน
    const handleDelete = async (report_id) => {
    const confirmDelete = confirm("คุณต้องการลบรายงานนี้หรือไม่?");
    if (!confirmDelete) return;

    try {
        const res = await deleteReport(report_id);

        if (res && res.deleted) {
            showAlert("success", "✅ ลบรายงานสำเร็จแล้ว");
            await refetch(); // ✅ รีเฟรชข้อมูลหลังลบ
        } else {
            showAlert("error", "❌ ลบรายงานไม่สำเร็จ");
        }
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการลบ:", error);
        showAlert("error", "❌ เกิดข้อผิดพลาดในการลบรายงาน");
    }
  };

    // ฟังก์ชันเปิด Alert
    const showAlert = (type, message) => {
        setAlert({ show: true, type, message });
    };

    const closeAlert = () => setAlert({ ...alert, show: false });

    useEffect(() => {
        const onKeyDown = (e) => {
        if (e.key === "Escape" && isOpen) closeModal();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [isOpen]);

    if (isLoading) return <div>Loading...</div>;
    if (isError)
        return (
        <div className="text-center text-red-500 py-4">
            <span>Error: {error?.message || "ไม่สามารถโหลดข้อมูลได้"}</span>
        </div>
        );

    // ✅ ฟิลเตอร์ข้อมูลตามคำค้นหาและสถานะ
    const filteredData = Array.isArray(data)
        ? data.filter(
            (item) =>
            (item.topic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description?.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (statusFilter === "" || item.status === statusFilter)
        )
        : [];

    return (
        <>

            {/* ✅ แสดง Alert ด้านบน */}
            <Alert
                type={alert.type}
                message={alert.message}
                show={alert.show}
                onClose={closeAlert}
            />

            {/* ✅ ช่องค้นหาและกรองสถานะ */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center mb-4">
                <input
                type="text"
                placeholder="🔍 ค้นหาหัวข้อหรือคำอธิบาย..."
                className="border border-gray-300 rounded-lg p-2 w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                >
                <option value="">ทุกสถานะ</option>
                <option value="ส่งแล้ว">ส่งแล้ว</option>
                <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
                <option value="เสร็จสิ้น">เสร็จสิ้น</option>
                </select>
            </div>

            {/* ✅ ตารางข้อมูล */}
            <table className="min-w-full table-auto rounded-xl">
                <thead>
                <tr className="bg-gray-200 text-center">
                    <th className="py-2 px-4 border-b border-t">หัวข้อ</th>
                    <th className="py-2 px-4 border-b border-t">คำอธิบาย</th>
                    <th className="py-2 px-4 border-b border-t">ภาพ</th>
                    <th className="py-2 px-4 border-b border-t">สถานะ</th>
                    <th className="py-2 px-4 border-b border-t">แผนก</th>
                    <th className="py-2 px-4 border-b border-t">เวลาที่รายงาน</th>
                    <th className="py-2 px-4 border-b border-t">การดำเนินการ</th>
                </tr>
                </thead>

                <tbody>
                {Array.isArray(filteredData) && filteredData.length > 0 ? (
                    filteredData.map((obj, i) => (
                    <Tr key={i} {...obj} onView={() => openModal(obj)} onEdit={onEdit} onDelete={() => handleDelete(obj.report_id)}/>
                    ))
                ) : (
                    <tr>
                    <td colSpan={7} className="text-center p-4">
                        ไม่มีรายงาน
                    </td>
                    </tr>
                )}
                </tbody>
            </table>

            {/* ✅ Modal */}
            {isOpen && selectedReport && <DataModal report={selectedReport} onClose={closeModal} />}
        </>
    );
    }

    function Tr({ report_id, topic, description, image, status, department, start_date, onView, onEdit, onDelete }) {
        const [showImage, setShowImage] = useState(false);

        //   const handleDelete = async () => {
        //     const confirmDelete = confirm("คุณต้องการลบรายงานนี้หรือไม่?");
        //     if (!confirmDelete) return;

        //     try {
        //       await deleteReport(report_id);
        //       alert("ลบรายงานสำเร็จ");
        //       window.location.reload();
        //     } catch (error) {
        //       console.error("เกิดข้อผิดพลาดในการลบ:", error);
        //       alert("เกิดข้อผิดพลาดในการลบรายงาน");
        //     }
        //   };

        // ✅ แปลงวันที่ให้อ่านง่าย
        const formattedDate = start_date
            ? new Date(start_date).toLocaleString("th-TH", {
                dateStyle: "medium",
                timeStyle: "short",
            })
            : "-";

        return (
        
        <tr className="bg-gray-100 text-center hover:bg-gray-50">
            <td className="px-4 py-2 border-b">
                <button className="text-blue-600 hover:underline" onClick={onView}>
                {topic || "ไม่มี"}
                </button>
            </td>
            <td className="px-4 py-2 border-b">
                <span className="line-clamp-2">{description || "ไม่มี"}</span>
            </td>
            <td className="px-4 py-2 border-b">
                <div className="flex justify-center items-center gap-2">
                {image && image.data ? (
                    <>
                    <button
                        title="ดูรูปภาพ"
                        onClick={() => setShowImage(!showImage)}
                        className="hover:scale-110 transition-transform"
                    >
                        <IoEyeSharp size={22} />
                    </button>

                    {showImage && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                        <div className="bg-white rounded-xl shadow-lg p-4 max-w-3xl w-full">
                            <div className="flex justify-between items-center mb-3">
                            <h2 className="text-lg font-semibold text-gray-700">
                                {image.name || "ไฟล์รายงาน"}
                            </h2>
                            <button
                                onClick={() => setShowImage(false)}
                                className="text-gray-500 hover:text-red-500 text-xl"
                            >
                                ✕
                            </button>
                            </div>

                            {image.name?.toLowerCase().endsWith(".pdf") ? (
                            <iframe
                                src={image.data}
                                title={image.name}
                                className="w-full h-[80vh] border rounded-lg"
                            />
                            ) : (
                            <img
                                src={image.data}
                                alt={image.name || "report image"}
                                className="w-full h-auto max-h-[80vh] rounded-lg border object-contain"
                            />
                            )}
                        </div>
                        </div>
                    )}
                    </>
                ) : (
                    <span className="text-gray-500">ไม่มี</span>
                )}
                </div>
            </td>
            <td className="px-4 py-2 border-b">
                <span
                className={`${
                    status == "ส่งแล้ว"
                    ? "text-yellow-400"
                    : status == "กำลังดำเนินการ"
                    ? "text-orange-500"
                    : status == "เสร็จสิ้น"
                    ? "text-green-500"
                    : "text-gray-500"
                }`}
                >
                {status || "ไม่มี"}
                </span>
            </td>
            <td className="px-4 py-2 border-b">
                <span>{department || "ไม่มี"}</span>
            </td>
            <td className="px-4 py-2 border-b">{formattedDate}</td> {/* ✅ เวลาที่รายงาน */}
            <td className="px-4 py-2 border-b">
                <div className="flex justify-center items-center gap-10">
                <button
                    title="แก้ไข"
                    onClick={() => onEdit({ report_id, topic, description, image, status, department })}
                >
                    <TbEdit color="green" size={20} />
                </button>
                <button title="ลบ" onClick={onDelete}>
                    <BiSolidTrashAlt color="red" size={20} />
                </button>
                </div>
            </td>
        </tr>
    );
}