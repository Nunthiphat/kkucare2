"use client";

import { useState, useReducer } from "react";
import { HiPlusSm } from "react-icons/hi";
import { createReport } from "../lib/helper";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Alert } from "./message"; // ✅ นำเข้า Alert component

const formReducer = (state, event) => ({
  ...state,
  [event.target.name]: event.target.value,
});

export default function AddReportForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useReducer(formReducer, {});
  const [fileName, setFileName] = useState("📁 เพิ่มรูปภาพ");
  const [fileBase64, setFileBase64] = useState("");

  // ✅ state สำหรับ Alert
  const [alert, setAlert] = useState({
    show: false,
    type: "info",
    message: "",
  });

  const queryClient = useQueryClient();

  // ✅ Mutation สำหรับบันทึกข้อมูล
  const mutation = useMutation({
    mutationFn: createReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });

      // ✅ แสดงข้อความแจ้งเตือนสำเร็จ
      setAlert({
        show: true,
        type: "success",
        message: "✅ เพิ่มรายงานสำเร็จแล้ว",
      });

      // ✅ ปิด modal หลังจาก 2.5 วินาที
      setTimeout(() => {
        setAlert({ show: false });
      }, 2500);
      // onClose?.(); // ปิด modal
      onSuccess?.(); // รีเฟรชข้อมูลในหน้า parent
    },
    onError: () => {
      setAlert({
        show: true,
        type: "error",
        message: "❌ เกิดข้อผิดพลาดในการเพิ่มรายงาน",
      });
    },
  });

  // ✅ ฟังก์ชันแปลงไฟล์เป็น Base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      const base64 = await toBase64(file);
      setFileBase64(base64);
    } else {
      setFileName("📁 เพิ่มรูปภาพ");
      setFileBase64("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = JSON.parse(sessionStorage.getItem("user"));
    const dataToSend = {
      ...formData,
      user_id: user?.user_id || "unknown",
      image: {
        name: fileName,
        data: fileBase64,
      },
    };

    mutation.mutate(dataToSend);
  };

  // ✅ ฟังก์ชันปิด Alert
  const closeAlert = () => setAlert({ ...alert, show: false });

  return (
    <>
      {/* ✅ แสดง Alert */}
      <Alert
        type={alert.type}
        message={alert.message}
        show={alert.show}
        onClose={closeAlert}
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          onChange={setFormData}
          name="topic"
          type="text"
          placeholder="หัวข้อ (เรื่องที่ต้องการรายงาน)"
          required
          className="w-full border rounded-md px-3 py-2"
        />
        <input
          onChange={setFormData}
          name="description"
          type="text"
          placeholder="คำอธิบาย (รายละเอียดเพิ่มเติม)"
          required
          className="w-full border rounded-md px-3 py-2"
        />
        <label
          htmlFor="image"
          className="cursor-pointer block border rounded-md px-3 py-2"
        >
          {fileName}
        </label>
        <input
          onChange={handleFileChange}
          id="image"
          name="image"
          type="file"
          className="hidden"
        />
        <select
          onChange={setFormData}
          name="department"
          required
          className="w-full border rounded-md px-3 py-2"
        >
          <option value="" disabled selected hidden>
            แผนก (แผนกที่รับผิดชอบ)
          </option>
          <option value="โสต">โสต</option>
          <option value="หอพัก">หอพัก</option>
          <option value="บริหาร">บริหาร</option>
          <option value="สถานที่">สถานที่</option>
          <option value="อื่นๆ">อื่นๆ</option>
        </select>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            className="flex items-center gap-1 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            บันทึก <HiPlusSm size={20} />
          </button>
        </div>
      </form>
    </>
  );
}
