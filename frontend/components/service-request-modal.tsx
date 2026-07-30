"use client";

import { X } from "lucide-react";

interface ServiceRequestModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (service: string) => void;
}

const services = [
  { name: "Bring Water", icon: "💧" },
  { name: "Tissue Paper", icon: "🧻" },
  { name: "Clean Table", icon: "🧹" },
  { name: "Extra Sauce", icon: "🧂" },
  { name: "Bring Bill", icon: "🧾" },
  { name: "Need Assistance", icon: "🙋‍♂️" },
];

export default function ServiceRequestModal({
  open,
  onClose,
  onSelect,
}: ServiceRequestModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-orange-100 animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-orange-50/50">
          <h2 className="text-xl font-bold text-[#3F6B63]">Request Service</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-orange-100 text-gray-500 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Options List */}
        <div className="p-6 space-y-3 max-h-[70vh] overflow-y-auto">
          {services.map((item) => (
            <button
              key={item.name}
              onClick={() => onSelect(item.name)}
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border border-gray-100 bg-white hover:bg-orange-50 hover:border-orange-200 transition shadow-sm text-left group"
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="font-medium text-gray-800 group-hover:text-orange-600">
                {item.name}
              </span>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}