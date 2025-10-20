import { connectToDatabase } from "../../../app/database/mongodb";
import User from "../../../app/model/user.js";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") 
    return res.status(405).json({ error: "Method Not Allowed" });

  const { email, password } = req.body;

  if (!email || !password) 
    return res.status(400).json({ error: "กรุณาใส่ข้อมูลให้ครบถ้วน" });

  await connectToDatabase();

  const user = await User.findOne({ email });
  if (!user) 
    return res.status(401).json({ error: "ไม่พบข้อมูลของผู้ใช้" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) 
    return res.status(401).json({ error: "รหัสผ่านไม่ถูกต้อง" });

  // ✅ รีเทิร์นเฉพาะข้อมูลที่ต้องการ
  const userData = {
    user_id: user._id,
    email: user.email,
    role: user.role,
    department: user.department
  };

  res.status(200).json({ 
    message: "เข้าสู่ระบบสำเร็จ", 
    user: userData
  });
}
