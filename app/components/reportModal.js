"use client";
import { motion, AnimatePresence } from "framer-motion";

export default function ReportModal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm flex justify-center items-center"
        onClick={(e) => e.target === e.currentTarget && onClose()}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <motion.div
          className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative z-50"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          {/* หัวข้อของ Modal */}
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h2 id="modal-title" className="text-xl font-semibold text-gray-800">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            >
              ✕
            </button>
          </div>

          {/* เนื้อหา (ฟอร์มหรืออะไรก็ได้) */}
          <div className="overflow-auto max-h-[70vh]">{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
