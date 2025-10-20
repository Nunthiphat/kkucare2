// import { serialize } from "cookie";

// export function setUserSession(res, userId) {
//     const cookie = serialize("user_id", userId, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       maxAge: 60 * 60 * 24, // 1 วัน
//       sameSite: "strict",
//       path: "/",
//     });
//     res.setHeader("Set-Cookie", cookie);
// }

// export function clearUserSession(res) {
//     const cookie = serialize("user_id", "", {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       maxAge: -1,
//       sameSite: "strict",
//       path: "/",
//     });
//     res.setHeader("Set-Cookie", cookie);
// }