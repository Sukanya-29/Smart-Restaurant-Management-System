"use client";

import { CheckCircle2 } from "lucide-react";

type Props = {
  open: boolean;
  service: string;
};

export default function ServiceSuccessPopup({
  open,
  service,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/20 backdrop-blur-sm">

      <div className="w-[360px] rounded-3xl bg-white p-8 text-center shadow-2xl animate-bounce">

        <div className="flex justify-center">

          <CheckCircle2
            size={70}
            className="text-green-500"
          />

        </div>

        <h2 className="mt-5 text-3xl font-bold text-[#3F6B63]">
          Request Sent
        </h2>

        <p className="mt-3 text-gray-600 text-lg">
          <span className="font-semibold">
            {service}
          </span>

          <br />

          Your waiter has been notified.
        </p>

        <div className="mt-6 rounded-xl bg-green-50 p-3 text-sm text-green-700">
          Please continue browsing the menu.
        </div>

      </div>

    </div>
  );
}