import { connectToDatabase } from "../../../app/database/mongodb";
import User from "../../../app/model/user.js";
import bcrypt from "bcryptjs";
import { setUserSession } from "../../../app/lib/session";

export default async function handler(req, res) {
  if (req.method !== "POST") 
    return res.status(405).json({ error: "Method Not Allowed" });

  const { email, password } = req.body;

  if (!email || !password) 
    return res.status(400).json({ error: "Email and password are required" });

  await connectToDatabase();

  const user = await User.findOne({ email });
  if (!user) 
    return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) 
    return res.status(401).json({ error: "Invalid credentials" });

  // สร้าง session
  setUserSession(res, user._id.toString());

  // ✅ รีเทิร์นเฉพาะข้อมูลที่ต้องการ
  const userData = {
    user_id: user._id,
    role: user.role,
    department: user.department
  };

  res.status(200).json({ 
    message: "Login success", 
    user: userData
  });
}
