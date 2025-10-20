// pages/api/user/index.js
import { connectToDatabase } from "../../../app/database/mongodb";
import { getUsers, createUser } from "../../../app/database/userController";

export default async function handler(req, res) {
  try {
    // เชื่อม MongoDB
    await connectToDatabase();

    // ตรวจสอบ method
    if (req.method === "GET") {
      await getUsers(req, res);
    } else if (req.method === "POST") {
      await createUser(req, res);
    } else {
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
}
