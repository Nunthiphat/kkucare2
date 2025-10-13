"use client";
import { useState } from "react";
import { handleLogin } from "../lib/helper";
import { LoginSuccess, LoginFailed } from "../components/message";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loginStatus, setLoginStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await handleLogin(username, password);
    console.log(res);
    if (res.ok) {
      setLoginStatus("success");
    } else {
      setLoginStatus("failed");
    }
  };

  if (loginStatus === "success") {
    return <LoginSuccess />;
  }

  if (loginStatus === "failed") {
    return <LoginFailed />;
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-2">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2"
      />
      <button type="submit" className="bg-green-500 text-white p-2">Login</button>
    </form>
  );
}