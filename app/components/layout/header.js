import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-[#A83B24] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">KKUCare</Link>
        <nav className="space-x-4">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/register" className="hover:underline">Register</Link>
          <Link href="/login" className="hover:underline">Login</Link>
          <Link href="/userform" className="hover:underline">Report</Link>
          <Link href="/receive" className="hover:underline">Receive</Link>
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
        </nav>
      </div>
    </header>
  );
}