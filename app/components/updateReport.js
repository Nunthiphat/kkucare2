import { useState, useReducer, useEffect } from "react";
import { HiPlusSm } from "react-icons/hi";
import { updateReport } from "../lib/helper";
import { useQueryClient, useMutation } from "@tanstack/react-query";

const formReducer = (state, event) => ({
  ...state,
  [event.target.name]: event.target.value,
});

export default function UpdateReportForm({ reportData, onSuccess }) {
  const initialForm = {
    topic: reportData?.topic || "",
    description: reportData?.description || "",
    image: reportData?.image || null,
    department: reportData?.department || "",
    status: reportData?.status || "",
  };

  const [formData, setFormData] = useReducer(formReducer, initialForm);
  const [fileName, setFileName] = useState("📁 เพิ่มรูปภาพ");
  const [fileBase64, setFileBase64] = useState("");

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      if (onSuccess) onSuccess();
    },
  });

  useEffect(() => {
    if (reportData) {
      setFormData({ target: { name: "topic", value: reportData.topic || "" } });
      setFormData({ target: { name: "description", value: reportData.description || "" } });
      setFormData({ target: { name: "department", value: reportData.department || "" } });
      setFormData({ target: { name: "status", value: reportData.status || "" } });
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
    mutation.mutate(dataToSend);
  };

  return (
    <div>
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
            <option value="" disabled hidden>
              แผนก (แผนกที่รับผิดชอบ)
            </option>
            <option value="โสต">โสต</option>
            <option value="หอพัก">หอพัก</option>
            <option value="บริหาร">บริหาร</option>
            <option value="การเงิน">การเงิน</option>
            <option value="สถานที่">สถานที่</option>
            <option value="อื่นๆ">อื่นๆ</option>
          </select>
          <button
            className="flex justify-center text-md w-2/6 bg-green-500 text-white rounded-md px-4 py-2 hover:bg-green-600"
            type="submit"
          >
            Update <HiPlusSm size={25} />
          </button>
        </div>
      </form>
    </div>
  );
}
