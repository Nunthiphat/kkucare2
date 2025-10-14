import { TbEdit } from "react-icons/tb";
import { BiSolidTrashAlt } from "react-icons/bi";
import { IoEyeSharp } from "react-icons/io5";
import { getReports, deleteReport} from "../lib/helper";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function UserTable({ userData, onEdit }) {

    // ✅ เรียก useQuery ต่อจากนั้น
    const { isLoading, isError, data, error } = useQuery({queryKey: ['reports', userData], queryFn:() => getReports(userData)})

    if (isLoading) return <div>Loading...</div>
    if (isError) return <div>Error: {error}</div>

    return (
        <table className="min-w-full table-auto">
            <thead>
                <tr className="bg-gray-200">
                    <th className="py-2 px-4 border-b border-t">หัวข้อ</th>
                    <th className="py-2 px-4 border-b border-t">คำอธิบาย</th>
                    <th className="py-2 px-4 border-b border-t">ภาพ</th>
                    <th className="py-2 px-4 border-b border-t">สถานะ</th>
                    <th className="py-2 px-4 border-b border-t">แผนก</th>
                    <th className="py-2 px-4 border-b border-t">การดำเนินการ</th>
                </tr>
            </thead>
            
            <tbody>
                {data.length > 0 ? (
                    data.map((obj, i) => {
                    console.log(obj); // ✅ แสดงข้อมูลแต่ละแถวใน console
                    return <Tr key={i} {...obj} onEdit={onEdit} />;
                    })
                ) : (
                    <tr><td colSpan={6} className="text-center p-4">ไม่มีรายงาน</td></tr>
                )}            
            </tbody>
        </table>
    )
}

function Tr({report_id, topic, description, image, status, department, onEdit}) {

    const reportId = report_id; // ✅ เก็บ report_id ไว้ในตัวแปร

    const [showImage, setShowImage] = useState(false)

    return (
        <tr className="bg-gray-100 text-center">
            <td className="px-4 py-2 border-b">
                <span>{topic || 'ไม่มี'}</span>
            </td>
            <td className="px-4 py-2 border-b">
                <span>{description || 'ไม่มี'}</span>
            </td>
            <td className="px-4 py-2 border-b">
                <div className="flex justify-center items-center gap-2">
                    {image && image.data ? (
                        <>
                            <button
                                title="ดูภาพ"
                                onClick={() => setShowImage(!showImage)} // ✅ toggle การแสดงภาพ
                                className="hover:scale-110 transition-transform"
                            >
                                <IoEyeSharp size={22} />
                            </button>
                            {showImage && ( // ✅ แสดงภาพเมื่อกด icon
                                <iframe
                                    src={`${image.data}`}
                                    title={image.name || 'image'}
                                    className="w-96 h-96 border rounded"
                                />
                            )}
                        </>
                    ) : (
                        <span className="text-gray-500">ไม่มี</span>
                    )}
                </div>
            </td>
            <td className="px-4 py-2 border-b">
                <span className={`${status == "ส่งแล้ว" ? "text-yellow-400" : status == "กำลังดำเนินการ" ? "text-orange-500" : status == "เสร็จสิ้น" ? "text-green-500" : "text-gray-500"}`}>{status || 'ไม่มี'}</span>
            </td>
            <td className="px-4 py-2 border-b">
                <span>{department || 'ไม่มี'}</span>
            </td>
            <td className="px-4 py-2 border-b columns-2">
                <div className="flex justify-center items-center">
                    <button onClick={() => onEdit({ report_id, topic, description, image, status, department })}><TbEdit color="green" size={20} /></button>
                </div>
                <div className="flex justify-center items-center">
                    <button onClick={() => deleteReport(reportId)}><BiSolidTrashAlt color="red" size={20} /></button>
                </div>
            </td>
        </tr>
    )                                                                                    
}