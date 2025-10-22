"use client";

import { TbEdit } from "react-icons/tb";
import { BiSolidTrashAlt } from "react-icons/bi";
import { IoEyeSharp } from "react-icons/io5";
import { getReports, deleteReport } from "../lib/helper";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import DataModal from "./showDataModal";

export default function ReceiveTable({ userData, onEdit }) {
    const storedDept =
      typeof window !== "undefined"
        ? sessionStorage.getItem("selectedDepartment")
        : null;
    const department = storedDept || userData?.department;
    const updatedUserData = { ...userData, department };

    const { isLoading, isError, data, error } = useQuery({
      queryKey: ["reports", updatedUserData],
      queryFn: () => getReports(updatedUserData),
    });

    // state สำหรับ modal
    const [isOpen, setIsOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);

    // 🔍 state สำหรับ filter
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    // ฟังก์ชันเปิด modal ด้วยข้อมูลรายงาน
    const openModal = (report) => {
      setSelectedReport(report);
      setIsOpen(true);
      // ป้องกัน body scroll ขณะ modal เปิด
      if (typeof window !== "undefined") document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
      setIsOpen(false);
      setSelectedReport(null);
      if (typeof window !== "undefined") document.body.style.overflow = "";
    };

    useEffect(() => {
      // กด Escape เพื่อปิด modal
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
        {/* ✅ แสดงชื่อแผนกด้านบนตาราง */}
        <h2 className="text-2xl font-bold text-center mb-4 text-[#A83B24]">
          แผนก: {department || "ไม่พบข้อมูลแผนก"}
        </h2>

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
        
        <div className="overflow-hidden rounded-xl shadow-lg border">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 border-b">หัวข้อ</th>
                <th className="py-2 px-4 border-b">คำอธิบาย</th>
                <th className="py-2 px-4 border-b">ภาพ</th>
                <th className="py-2 px-4 border-b">สถานะ</th>
                <th className="py-2 px-4 border-b">แผนก</th>
                <th className="py-2 px-4 border-b">เวลาที่รายงาน</th>
                <th className="py-2 px-4 border-b">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-4 border-b">
                    ไม่มีรายงาน
                  </td>
                </tr>
              ) : (
                filteredData.map((obj, i) => (
                  <Tr key={i} {...obj} onView={() => openModal(obj)} onEdit={onEdit} />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {isOpen && selectedReport && (
          <DataModal report={selectedReport} onClose={closeModal} />
        )}
      </>
    );
}

function Tr({
    report_id,
    topic,
    description,
    image,
    status,
    department,
    start_date,
    onView, // ฟังก์ชันเปิด modal เมื่อกดดูรายละเอียด
    onEdit,
}) {

    const [showImage, setShowImage] = useState(false);

    const formattedDate = start_date
            ? new Date(start_date).toLocaleString("th-TH", {
                dateStyle: "medium",
                timeStyle: "short",
            })
            : "-";

    return (
      <tr className="text-center hover:bg-gray-50 odd:bg-white even:bg-gray-100 last:[&>td]:border-b-0">
        <td className="px-4 py-2 border-b max-w-[150px] overflow-hidden whitespace-nowrap text-ellipsis">
          <button className="inline-block text-blue-600 hover:underline truncate" onClick={onView}>
            {topic || "ไม่มี"}
          </button>
        </td>
        <td className="px-4 py-2 border-b max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="block truncate">{description || "ไม่มี"}</span>
        </td>
        <td className="px-4 py-2 border-b">
          <div className="flex justify-center items-center gap-2">
            {image && image.data ? (
              <>
                  <button
                  title="ดูไฟล์"
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

                      {/* ตรวจสอบประเภทไฟล์ */}
                      {image.name?.toLowerCase().endsWith(".pdf") ? (
                          // 🧾 แสดง PDF
                          <iframe
                          src={image.data}
                          title={image.name}
                          className="w-full h-[80vh] border rounded-lg"
                          />
                      ) : (
                          // 🖼️ แสดงรูปภาพ
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
        <td className="px-4 py-2 border-b max-w-[80px]">{formattedDate}</td> {/* ✅ เวลาที่รายงาน */}
        <td className="px-4 py-2 border-b">
          <div className="flex justify-center items-center">
            <button
              title="แก้ไข"
              onClick={() => onEdit({ report_id, topic, description, image, status, department })}
            >
              <TbEdit color="green" size={20} />
            </button>
          </div>
          {/* <div className="flex justify-center items-center">
            <button
              title="ลบ"
              onClick={() => {
                // ใส่ logic ลบที่กินรีใช้ (เช่นเรียก API) แล้ว refetch ข้อมูล
                // ตัวอย่าง placeholder:
                if (confirm("ต้องการลบรายงานนี้หรือไม่?")) {
                  // deleteReport(report_id) // ถ้ามีฟังก์ชันลบ
                  deleteReport(report_id)
                  console.log("ลบ report:", report_id);
                }
              }}
            >
              <BiSolidTrashAlt title="ลบ" onClick={() => deleteReport(report_id)} color="red" size={20}></BiSolidTrashAlt>
            </button>
          </div> */}    
        </td>
      </tr>
    );
}