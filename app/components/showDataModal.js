import { useRef, useState } from "react";
import { formatDate } from "../utility/formatDate";
import { isImageUrl } from "../utility/isImage";
import { updateReport } from "../lib/helper";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function DataModal({ report, onClose }) {
  if (!report) return null;
  
  const {
    report_id,
    topic,
    description,
    image,
    status,
    department,
    createdAt,
  } = report;

  const dialogRef = useRef(null);
  const [currentStatus, setCurrentStatus] = useState(status);
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient(); // ✅ ใช้ react-query client

  const userRole =
    typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("user"))?.role
      : null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // ✅ เปลี่ยนสถานะแล้วรีเฟรช Table
  const handleChangeStatus = async () => {
    const nextStatus =
      currentStatus === "ส่งแล้ว"
        ? "กำลังดำเนินการ"
        : currentStatus === "กำลังดำเนินการ"
        ? "เสร็จสิ้น"
        : "ส่งแล้ว";

    if (nextStatus === "เสร็จสิ้น") {
      report.end_date = new Date();
    }

    setLoading(true);
    try {
      await updateReport(report_id, { ...report, status: nextStatus });
      setCurrentStatus(nextStatus);

      // ✅ รีเฟรชข้อมูล Table (เช่น useQuery(["reports"]) ใน Table)
      await queryClient.invalidateQueries(["reports"]);

      alert(`อัปเดตสถานะเป็น "${nextStatus}" แล้ว`);
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการอัปเดตสถานะ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/50 transition-opacity" />

      <div
        ref={dialogRef}
        className="relative z-10 max-w-3xl w-full bg-white rounded-lg shadow-xl overflow-auto max-h-[90vh]"
      >
        <div className="flex justify-between items-start p-4 border-b">
          <div>
            <h2 id="modal-title" className="text-xl font-bold">
              {topic || "ไม่มีหัวข้อ"}
            </h2>
            <p className="text-sm text-gray-500">ID: {report_id}</p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                currentStatus === "ส่งแล้ว"
                  ? "bg-yellow-100 text-yellow-800"
                  : currentStatus === "กำลังดำเนินการ"
                  ? "bg-orange-100 text-orange-800"
                  : currentStatus === "เสร็จสิ้น"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {currentStatus || "ไม่มีสถานะ"}
            </span>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900 bg-gray-100 p-1 rounded"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">
              คำอธิบาย
            </h3>
            <p className="text-gray-800 whitespace-pre-wrap">
              {description || "ไม่มีคำอธิบาย"}
            </p>
          </div>

          {image && image.data && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                ภาพประกอบ
              </h3>
              {isImageUrl(image.data) ? (
                <img
                  src={image.data}
                  alt={image.name || "report image"}
                  className="w-full rounded-md border"
                />
              ) : (
                <iframe
                  src={image.data}
                  title={image.name || "image"}
                  className="w-full h-[480px] border rounded"
                />
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm text-gray-600">แผนก</h4>
              <p className="text-gray-800">{department || "ไม่มี"}</p>
            </div>
            <div>
              <h4 className="text-sm text-gray-600">เวลา</h4>
              <p className="text-gray-800">{formatDate(createdAt)}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
          >
            ปิด
          </button>

          {(userRole === "เจ้าหน้าที่" || userRole === "ผู้ดูแลระบบ") && (
            <button
              onClick={handleChangeStatus}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? "กำลังอัปเดต..." : "เปลี่ยนสถานะ"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
