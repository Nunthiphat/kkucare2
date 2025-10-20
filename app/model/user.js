import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // เก็บเป็น hash
  role: { type: String,  required: true, default: 'ผู้ใช้ทั่วไป' }, // 'user' หรือ 'admin'
  department: {type: String, required: true, default: 'ไม่มี' } // เพิ่มฟิลด์ department
}, { timestamps: true });

export default mongoose.models.users || mongoose.model("users", userSchema);