import { useState, useReducer, useEffect } from "react";
import { HiPlusSm } from "react-icons/hi";
import { updateReport } from "../lib/helper";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Alert } from "./message";

const formReducer = (state, event) => ({
    ...state,
    [event.target.name]: event.target.value,
});

export default function UpdateReportForm({ reportData, onSuccess }) {
    const initialForm = {
      report_id: reportData?.report_id || "",
      topic: reportData?.topic || "",
      description: reportData?.description || "",
      image: reportData?.image || null,
      department: reportData?.department || "",
      status: reportData?.status || "",
    };

    console.log("image in update form:", reportData?.image);

    console.log("report data in update form:", initialForm.report_id);

    const [formData, setFormData] = useReducer(formReducer, initialForm);
    const [fileName, setFileName] = useState("📁 เพิ่มรูปภาพ");
    const [fileBase64, setFileBase64] = useState("");
    const [showAlert, setShowAlert] = useState(false);

    const queryClient = useQueryClient();
    const mutation = useMutation({
      mutationFn: ({ report_id, formData }) => updateReport(report_id, formData),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["reports"] });

        // ✅ แสดง Alert ก่อน
        setShowAlert(true);

        // ✅ ปิดฟอร์มหลัง 2 วินาที
        setTimeout(() => {
          setShowAlert(false);
          if (onSuccess) onSuccess();
        }, 2000);
      },
    });


    useEffect(() => {
      if (reportData) {
        setFormData({ target: { name: "topic", value: reportData.topic || "" } });
        setFormData({ target: { name: "description", value: reportData.description || "" } });
        setFormData({ target: { name: "department", value: reportData.department || "" } });
        setFormData({ target: { name: "status", value: reportData.status || "" } });

        // ถ้ามีรูปเก่า ให้ตั้งชื่อไว้เฉย ๆ ไม่ต้องแปลง base64 ใหม่
        if (reportData.image && typeof reportData.image === "object" && reportData.image.name) {
          setFileName(reportData.image.name);
          setFileBase64(reportData.image.data || "");
        } else if (typeof reportData.image === "string") {
          // ถ้าเป็น string base64 หรือ URL
          setFileName("📁 รูปเก่า");
          setFileBase64(reportData.image);
        }
      }
    }, [reportData]);

    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

    const handleFileChange = async (e) => {
      const file = e.target.files[0];

      console.log("file in handleFileChange:", e);

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
      const dataToSend = {
        ...formData,
        image: {
          name: fileName,
          data: fileBase64,
        },
      };
      console.log("📦 Data to send:", dataToSend);
      mutation.mutate({ report_id: reportData.report_id, formData: dataToSend });
    };

    return (
      //Alert โดน Header ทับ
      <div>
        {/* <div className="z-[9999]">
         {showAlert && <Alert message="อัปเดตเรียบร้อย" show onClose={() => setShowAlert(false)} />}
        </div> */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              onChange={setFormData}
              className="border border-gray-500 bg-white rounded-md px-2 py-2"
              type="text"
              id="topic"
              name="topic"
              value={formData.topic}
              required
            />
            <input
              onChange={setFormData}
              className="border border-gray-500 bg-white rounded-md px-2 py-2"
              type="text"
              id="description"
              name="description"
              value={formData.description}
              required
            />
            <label
              htmlFor="image"
              className="cursor-pointer border border-gray-500 bg-white rounded-md px-2 py-2"
            >
              <span>{fileName}</span>
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
              className="cursor-pointer border border-gray-500 bg-white rounded-md px-2 py-2"
              id="department"
              name="department"
              value={formData.department}
              required
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
            <div className="flex justify-start gap-4">
              <button
                className="flex justify-center text-md w-2/6 bg-green-500 text-white rounded-md px-4 py-2 hover:bg-green-600"
                type="submit"
              >
                Update <HiPlusSm size={25} />
              </button>
              <button
                className="flex justify-center text-md w-2/6 bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600"
                type="button"
                onClick={onSuccess}
              >
                Cancel <HiPlusSm size={25} />
              </button>
            </div>
          </div>
        </form>
      </div>
    )
}
