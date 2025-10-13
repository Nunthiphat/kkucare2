import { useState } from "react";
import AddReportForm from "./addReport";
import UpdateReportForm from "./updateReport";

export default function ReportForm(){

    const [isUpdate, setIsUpdate] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);

    // 🟢 เมื่อกดแก้ไขจากตาราง
    const handleEdit = (reportData) => {
        setSelectedReport(reportData);
        setIsUpdate(true);
    };

    // 🔙 เมื่ออัปเดตเสร็จหรือกดยกเลิก
    const handleCancelUpdate = () => {
        setSelectedReport(null);
        setIsUpdate(false);
    };

    return (
        <div className="container mx-auto py-2">
        {/* ฟอร์มเพิ่ม / แก้ไข */}
        {isUpdate ? (
            <UpdateReportForm reportData={selectedReport} onSuccess={handleCancelUpdate} />
        ) : (
            <AddReportForm />
        )}
        </div>
    );
}