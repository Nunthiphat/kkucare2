import { useState } from "react";
import AddReportForm from "./addReport";
import UpdateReportForm from "./updateReport";

export default function ReportForm({ isUpdate, selectedReport, onSuccess, onClose }) {

    return (
        <div className="container mx-auto py-2">
        {/* ฟอร์มเพิ่ม / แก้ไข */}
        {isUpdate ? (
            <UpdateReportForm reportData={selectedReport} onSuccess={onSuccess} />
        ) : (
            <AddReportForm onSuccess={onSuccess} onClose={onClose}/>
        )}
        </div>
    );
}