// pages/api/user/[user_id].js
import { getUser, updateUser, deleteUser } from "../../../../app/database/userController";
import { connectToDatabase } from "../../../../app/database/mongodb";

export default async function handler(req, res) {
  try {
    await connectToDatabase();

    const { user_id } = req.query;

    // แปลง body สำหรับ PUT
    let body = {};
    if (req.method === "PUT") {
      body = req.body; // Next.js จะ parse body ให้อัตโนมัติ ถ้าใช้ express-like
    }

    // สร้าง req-like object สำหรับ controller
    const reqLike = {
      query: { user_id },
      body,
    };

    const resLike = {
      status(code) { this.statusCode = code; return this; },
      json(obj) { res.status(this.statusCode || 200).json(obj); return obj; },
    };

    if (req.method === "GET") {
      await getUser(reqLike, resLike);
    } else if (req.method === "PUT") {
      await updateUser(reqLike, resLike);
    } else if (req.method === "DELETE") {
      await deleteUser(reqLike, resLike);
    } else {
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
}
