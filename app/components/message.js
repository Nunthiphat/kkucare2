import { useEffect } from "react";
import { X } from "lucide-react"; // optional icon lib (install with npm i lucide-react)

export function LoginSuccess() {
  window.location.reload();
    return (
        <div className="success container mx-auto">
            <div className="flex justify-center mx-auto border border-yellow-400 bg-green-500 text-white text-md my-4 py-2 text-center rounded-md">
                Login Success!
            </div>
            <div>
                <button onClick={() => window.location.href = '/userform'} className="bg-blue-500 text-white p-2 rounded">
                    Go to User Form
                </button>
            </div>
        </div>
    )
}

export function LoginFailed() {
    return (
        <div className="success container mx-auto">
            <div className="flex justify-center mx-auto border border-yellow-400 bg-red-500 text-white text-md my-4 py-2 text-center rounded-md">
                Login Failed!
            </div>
        </div>
    )
}

export function FileSelected() {
    return (
        <div className="success container mx-auto">
            <div className="flex justify-center mx-auto border border-yellow-400 bg-blue-500 text-white text-md my-4 py-2 text-center rounded-md">
                File Selected!
            </div>
        </div>
    )
}

export function UpdateSuccess() {
    return (
        <div className="success container mx-auto">
            <div className="flex justify-center mx-auto border border-yellow-400 bg-green-500 text-white text-md my-4 py-2 text-center rounded-md">
                Update Success!
            </div>
        </div>
    )
}

export function Alert({ type = "info", message, show, onClose, duration = 3000 }) {
  // ปิดอัตโนมัติหลังเวลาที่กำหนด
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(timer);
  }, [show, duration, onClose]);

  if (!show) return null;

  const typeClasses = {
    success: "bg-green-50 border-green-500 text-green-800",
    error: "bg-red-50 border-red-500 text-red-800",
    warning: "bg-yellow-50 border-yellow-500 text-yellow-800",
    info: "bg-blue-50 border-blue-500 text-blue-800",
  };

  return (
    <div
      className={`
        fixed top-8 left-1/2 -translate-x-1/2 z-[9999]
        transition-all duration-300 ease-out
        animate-in fade-in slide-in-from-top-5
      `}
    >
      <div
        className={`
          flex items-center gap-3 border-l-4 px-6 py-4 rounded-2xl shadow-lg
          text-lg font-medium max-w-lg w-full mx-auto
          ${typeClasses[type]}
        `}
        role="alert"
      >
        <div className="flex-1 text-center">{message}</div>
        <button
          onClick={onClose}
          className="p-1 text-slate-700 hover:text-slate-900 transition"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
