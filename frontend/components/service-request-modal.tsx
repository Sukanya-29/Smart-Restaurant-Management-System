"use client";

import { X } from "lucide-react";

const SERVICES = [
  "💧 Extra Water",
  "🍴 Need Cutlery",
  "🥤 Drink Refill",
  "🧻 Tissue Paper",
  "🧹 Clean Table",
  "🧂 Extra Sauce",
  "🧾 Bring Bill",
  "🙋 Need Assistance",
];

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (service: string) => void;
};

export default function ServiceRequestModal({
  open,
  onClose,
  onSelect,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">

      <div className="w-[430px] rounded-3xl bg-white p-6 shadow-2xl animate-scaleIn">

        <div className="mb-6 flex items-center justify-between">

          <div>
            <h2 className="text-2xl font-bold text-[#3F6B63]">
              🍽 Request Service
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Tell us what you need.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <X size={20} />
          </button>

        </div>

        <div className="space-y-3">

          {SERVICES.map((service) => (

            <button
              key={service}
              onClick={() => onSelect(service)}
              className="w-full rounded-2xl border border-orange-100 bg-white p-4 text-left text-gray-700 transition-all duration-200 hover:border-orange-400 hover:bg-orange-50 hover:shadow-md"
            >
              {service}
            </button>

          ))}

        </div>

      </div>

    </div>
  );
}