"use client";

import { useEffect, useState } from "react";
import { getReports } from "../lib/helper";
import { Card, CardContent } from "./ui/card";
import { useRouter } from "next/navigation";
import {
  FaClipboardList, FaClock, FaCheckCircle, FaExclamationTriangle, FaHourglassHalf,
  FaChartPie, FaChartLine, FaBuilding
} from "react-icons/fa";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from "recharts";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({});
  const [insights, setInsights] = useState({});
  const [trendType, setTrendType] = useState("month"); // 🔹 state สำหรับเลือกแนวโน้ม
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const userData = JSON.parse(sessionStorage.getItem("user"));
      const reports = await getReports(userData);
      setData(reports);

      const total = reports.length;
      const pending = reports.filter(r => r.status === "ส่งแล้ว").length;
      const inprocess = reports.filter(r => r.status === "กำลังดำเนินการ").length;
      const resolved = reports.filter(r => r.status === "เสร็จสิ้น").length;

      const today = reports.filter(r => new Date(r.start_date).toDateString() === new Date().toDateString()).length;
      const week = reports.filter(r => (new Date() - new Date(r.start_date)) / (1000 * 60 * 60 * 24) <= 7).length;
      const month = reports.filter(r => new Date(r.start_date).getMonth() === new Date().getMonth()).length;

      const users = new Set(reports.map(r => r.user_id)).size;
      const departments = new Set(reports.map(r => r.department)).size;

      const topicCount = {};
      const deptCount = {};
      let totalDays = 0;
      let completedCount = 0;

      reports.forEach(r => {
        topicCount[r.topic] = (topicCount[r.topic] || 0) + 1;
        deptCount[r.department] = (deptCount[r.department] || 0) + 1;
        if (r.status === "เสร็จสิ้น" && r.end_date) {
          const diff = (new Date(r.end_date) - new Date(r.start_date)) / (1000 * 60 * 60 * 24);
          totalDays += diff;
          completedCount++;
        }
      });

      const mostReportedTopic = Object.entries(topicCount).sort((a, b) => b[1] - a[1])[0];
      const mostReportedDept = Object.entries(deptCount).sort((a, b) => b[1] - a[1])[0];
      const avgResolutionTime = completedCount > 0 ? (totalDays / completedCount).toFixed(1) : "-";

      setStats({ total, pending, resolved, inprocess, today, week, month, users, departments });
      setInsights({
        mostReportedTopic: mostReportedTopic ? mostReportedTopic[0] : "ไม่มีข้อมูล",
        mostReportedDept: mostReportedDept ? mostReportedDept[0] : "ไม่มีข้อมูล",
        avgResolutionTime: Math.ceil(avgResolutionTime),
      });
    };

    fetchData();
  }, []);

  // 🔹 ฟังก์ชันสร้างกราฟแนวโน้มแบบยืดหยุ่น
  const getTrendData = () => {
    if (trendType === "day") {
      // แสดงย้อนหลัง 7 วัน
      const days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const label = date.toLocaleDateString("th-TH", { day: "numeric", month: "short" });
        const count = data.filter(r => new Date(r.start_date).toDateString() === date.toDateString()).length;
        return { name: label, count };
      }).reverse();
      return days;
    }

    if (trendType === "month") {
      // แสดง 12 เดือน
      return Array.from({ length: 12 }, (_, i) => ({
        name: new Date(0, i).toLocaleString("th-TH", { month: "short" }),
        count: data.filter(r => new Date(r.start_date).getMonth() === i).length,
      }));
    }

    if (trendType === "year") {
      // แสดงแนวโน้มรายปี
      const years = {};
      data.forEach(r => {
        const year = new Date(r.start_date).getFullYear();
        years[year] = (years[year] || 0) + 1;
      });
      return Object.entries(years).map(([year, count]) => ({ name: year, count }));
    }
  };

  const trendData = getTrendData();

  const cards = [
    { title: "รายงานทั้งหมด", value: stats.total, icon: <FaClipboardList className="text-blue-500 text-3xl" /> },
    { title: "รอดำเนินการ", value: stats.pending, icon: <FaClock className="text-yellow-500 text-3xl" /> },
    { title: "อยู่ระหว่างดำเนินการ", value: stats.inprocess, icon: <FaHourglassHalf className="text-orange-500 text-3xl" /> },
    { title: "เสร็จสิ้น", value: stats.resolved, icon: <FaCheckCircle className="text-green-500 text-3xl" /> },
  ];

  const departments = ["โสต", "หอพัก", "บริหาร", "สถานที่", "อื่นๆ"];

  return (
    <div className="container mx-auto px-6 py-6">
      <h1 className="text-3xl font-bold mb-6 text-center">📊 Dashboard รายงานปัญหามหาวิทยาลัย</h1>

      {/* การ์ดสรุป */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((item, i) => (
          <Card key={i} className="shadow-lg rounded-2xl hover:shadow-xl transition">
            <CardContent className="flex flex-col items-center justify-center p-5">
              {item.icon}
              <p className="text-gray-600 mt-2 text-sm text-center">{item.title}</p>
              <p className="text-2xl font-bold text-center">{item.value ?? "-"}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 🔍 ข้อมูลเชิงลึก */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="shadow-lg rounded-2xl p-5">
          <CardContent>
            <FaChartPie className="text-indigo-500 text-3xl mb-2" />
            <h3 className="font-semibold text-lg">หัวข้อที่ถูกรายงานบ่อยที่สุด</h3>
            <p className="text-gray-700 text-xl font-bold mt-2">{insights.mostReportedTopic}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-2xl p-5">
          <CardContent>
            <FaBuilding className="text-teal-500 text-3xl mb-2" />
            <h3 className="font-semibold text-lg">หน่วยงานที่มีรายงานมากที่สุด</h3>
            <p className="text-gray-700 text-xl font-bold mt-2">{insights.mostReportedDept}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-2xl p-5">
          <CardContent>
            <FaChartLine className="text-pink-500 text-3xl mb-2" />
            <h3 className="font-semibold text-lg">เวลาเฉลี่ยในการแก้ไขปัญหา</h3>
            <p className="text-gray-700 text-xl font-bold mt-2">{insights.avgResolutionTime} วัน</p>
          </CardContent>
        </Card>
      </div>

      {/* 🔹 กราฟแนวโน้มรายงาน */}
      <div className="mt-10 bg-white shadow-lg rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">📅 สถิติรายงาน</h2>
          <select
            value={trendType}
            onChange={(e) => setTrendType(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:ring focus:ring-blue-300"
          >
            <option value="day">รายวัน</option>
            <option value="month">รายเดือน</option>
            <option value="year">รายปี</option>
          </select>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ปุ่มดูรายงานตามแผนก */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">🏢 รายงานตามหน่วยงาน</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-5">
          {departments.map((dept, i) => (
            <Card key={i} className="p-5 shadow-lg rounded-2xl flex flex-col justify-between">
              <p className="text-lg font-medium text-center text-gray-700">{dept}</p>
              <button
                onClick={() => {
                  sessionStorage.setItem("selectedDepartment", dept);
                  router.push("/receive");
                }}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-xl transition"
              >
                ดูรายงาน
              </button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
