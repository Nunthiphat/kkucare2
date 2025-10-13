import { useState, useReducer } from "react"
import { HiPlusSm } from "react-icons/hi";
import { createReport } from "../lib/helper";
import { useQueryClient, useMutation } from "@tanstack/react-query";

const formReducer = (state, event) => {
    return {
        ...state,
        [event.target.name]: event.target.value
    }
}

export default function AddReportForm(){

    const [formData, setFormData] = useReducer(formReducer, {})

    const [fileName, setFileName] = useState("📁 เพิ่มรูปภาพ");

    const [fileBase64, setFileBase64] = useState("");

    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: createReport,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] })
        }
    })

     // 🔸 ฟังก์ชันแปลงไฟล์เป็น Base64
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

        // 🔹 ดึง user จาก sessionStorage
        const user = JSON.parse(sessionStorage.getItem("user"));

        // 🔹 รวมข้อมูลทั้งหมดที่ต้องส่งไป
        const dataToSend = {
        ...formData,
        user_id: user?.user_id || "unknown", // กัน null เผื่อไม่มี session
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
                    <input onChange={setFormData} className="border border-gray-500 bg-white rounded-md placeholder:gray-500 px-2 py-2 hover:border-gray-800" type="text" id="topic" name="topic" placeholder="หัวข้อ (หัวข้อเรื่องที่ต้องการรายงาน)" required />
                    <input onChange={setFormData} className="border border-gray-500 bg-white rounded-md placeholder:gray-500 px-2 py-2 hover:border-gray-800" type="text" id="description" name="description" placeholder="คำอธิบาย (รายละเอียดเพิ่มเติมเกี่ยวกับรายงาน)" required />
                    <label htmlFor="image" className="cursor-pointer border border-gray-500 bg-white rounded-md placeholder:gray-500 px-2 py-2 hover:border-gray-800s">
                        <span>{fileName}</span>
                    </label>
                    <input onChange={handleFileChange} id="image" name="image" type="file" className={`hidden`} />
                    <select onChange={setFormData} className="cursor-pointer border border-gray-500 bg-white rounded-md placeholder:gray-500 px-2 py-2 hover:border-gray-800" id="department" name="department" required>
                        <option value="" disabled hidden>แผนก (แผนกที่รับผิดชอบ)</option>
                        <option value="โสต">โสต</option>
                        <option value="หอพัก">หอพัก</option>
                        <option value="บริหาร">บริหาร</option>
                        <option value="การเงิน">การเงิน</option>
                        <option value="สถานที่">สถานที่</option>
                        <option value="อื่นๆ">อื่นๆ</option>
                    </select>
                    <button className="flex justify-center text-md w-2/6 bg-green-500 text-white rounded-md px-4 py-2 hover:bg-green-600 hover:text-gray-200" type="submit">
                        Submit<span><HiPlusSm size={25} /></span>
                    </button>
                </div>
            </form>
        </div>
    )
}