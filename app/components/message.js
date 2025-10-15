import { useEffect } from "react";
import { X } from "lucide-react"; // optional icon lib (install with npm i lucide-react)

export function LoginSuccess() {
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
  // auto close after duration
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
      className={
        `fixed top-6 right-6 z-50 flex items-center gap-3 
        border-l-4 px-4 py-3 rounded-lg shadow-md 
        transition-all duration-300 ease-out
        transform opacity-100 translate-y-0
        animate-in fade-in slide-in-from-top-5
        ${typeClasses[type]}`
      }
      role="alert"
    >
      <div className="flex-1 text-sm">{message}</div>
      <button
        onClick={onClose}
        className="p-1 text-slate-700 hover:text-slate-900 transition"
      >
        <X size={16} />
      </button>
    </div>
  );
}