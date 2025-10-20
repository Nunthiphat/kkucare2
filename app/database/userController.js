import User from "../model/user.js"; // <- ใช้ schema ที่คุณให้ไว้

// 🧩 ดึงผู้ใช้ทั้งหมด หรือค้นหา
export async function getUsers(req, res) {
  try {
    const search = req.query.search || "";
    const role = req.query.role || "";
    const department = req.query.department || "";

    // ✅ เงื่อนไขค้นหา
    const query = {};
    if (search) query.email = { $regex: search, $options: "i" };
    if (role) query.role = role;
    if (department && department !== "ทั้งหมด") query.department = department;

    const users = await User.find(query).sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "ไม่สามารถดึงข้อมูลผู้ใช้ได้" });
  }
}

// 🧩 ดึงผู้ใช้รายคน
export async function getUser(req, res) {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ error: "กรุณาระบุ user_id" });

    const user = await User.findById(user_id);
    if (!user) return res.status(404).json({ error: "ไม่พบผู้ใช้" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "ไม่สามารถดึงข้อมูลผู้ใช้ได้" });
  }
}

// 🧩 สร้างผู้ใช้ใหม่
export async function createUser(req, res) {
  try {
    const { email, password, role, department } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "กรุณากรอกอีเมลและรหัสผ่าน" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "อีเมลนี้ถูกใช้งานแล้ว" });

    const newUser = new User({
      email,
      password, // ✅ แนะนำให้ hash ก่อนบันทึกจริง
      role: role || "ผู้ใช้ทั่วไป",
      department: department || "ไม่มี",
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "ไม่สามารถสร้างผู้ใช้ได้" });
  }
}

// 🧩 อัปเดตข้อมูลผู้ใช้ (role / department)
export async function updateUser(req, res) {
  try {
    const { user_id } = req.query;
    const { role, department } = req.body;

    if (!user_id)
      return res.status(400).json({ error: "กรุณาระบุ user_id" });

    const updatedUser = await User.findByIdAndUpdate(
      user_id,
      { role, department },
      { new: true }
    );

    if (!updatedUser)
      return res.status(404).json({ error: "ไม่พบผู้ใช้" });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "ไม่สามารถอัปเดตข้อมูลผู้ใช้ได้" });
  }
}

// 🧩 ลบผู้ใช้
export async function deleteUser(req, res) {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ error: "กรุณาระบุ user_id" });

    const deletedUser = await User.findByIdAndDelete(user_id);
    if (!deletedUser)
      return res.status(404).json({ error: "ไม่พบผู้ใช้" });

    res.status(200).json({ deleted: true });
  } catch (error) {
    res.status(500).json({ error: "ไม่สามารถลบผู้ใช้ได้" });
  }
}
