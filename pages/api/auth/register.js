import { connectToDatabase } from "../../../app/database/mongodb"
import User from "../../../app/model/user.js";
import bcrypt from "bcryptjs";
import { setUserSession } from "../../../app/lib/session";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing fields" });

  await connectToDatabase();

  const exist = await User.findOne({ email });
  if (exist) return res.status(400).json({ error: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed });

  setUserSession(res, user._id.toString());

  res.status(201).json({ message: "Registered successfully", user_id: user._id });
}