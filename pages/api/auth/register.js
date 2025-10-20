import { connectToDatabase } from "../../../app/database/mongodb"
import User from "../../../app/model/user.js";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: "กรุณาใส่ข้อมูลให้ครบถ้วน" });

  await connectToDatabase();

  const exist = await User.findOne({ email });
  if (exist) return res.status(400).json({ error: "มีบัญชีดังกล่าวอยู่แล้ว" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });

  res.status(201).json({ message: "สมัครสมาชิกสำเร็จ", user_id: user._id });
}