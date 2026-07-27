"use client";

import { Clock3, CheckCircle2 } from "lucide-react";

export type RequestStatus =
  | "Pending"
  | "Accepted"
  | "Completed";

type Props = {
  tableNo: string;
  customerName: string;
  service: string;
  waitingTime: string;
  status: RequestStatus;
  onAccept?: () => void;
  onComplete?: () => void;
};

export default function WaiterRequestCard({
  tableNo,
  customerName,
  service,
  waitingTime,
  status,
  onAccept,
  onComplete,
}: Props) {
  return (
    <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-lg transition hover:shadow-xl">

      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-xl font-bold text-[#3F6B63]">
            Table {tableNo}
          </h2>

          <p className="text-gray-500">
            {customerName}
          </p>
        </div>

        <div className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600">
          {status}
        </div>

      </div>

      <div className="mt-5 rounded-2xl bg-orange-50 p-4">

        <p className="text-lg font-semibold text-[#3F6B63]">
          {service}
        </p>

      </div>

      <div className="mt-5 flex items-center gap-2 text-gray-500">

        <Clock3 size={18} />

        <span>{waitingTime}</span>

      </div>

      {status === "Pending" && (

        <button
          onClick={onAccept}
          className="mt-6 w-full rounded-2xl bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600"
        >
          Accept Request
        </button>

      )}

      {status === "Accepted" && (

        <button
          onClick={onComplete}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700"
        >
          <CheckCircle2 size={20} />

          Mark Completed
        </button>

      )}

    </div>
  );
}