"use client";

import WaiterRequestCard, {
  RequestStatus,
} from "./waiter-request-card";

export type WaiterRequest = {
  id: string;
  tableNo: string;
  customerName: string;
  service: string;
  waitingTime: string;
  waitingSeconds: number;
  status: RequestStatus;
};

type Props = {
  requests: WaiterRequest[];
  onAccept: (id: string) => void;
  onComplete: (id: string) => void;
};

export default function WaiterRequestList({
  requests,
  onAccept,
  onComplete,
}: Props) {
  const sortedRequests = [...requests].sort(
    (a, b) => b.waitingSeconds - a.waitingSeconds
  );

  if (sortedRequests.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-[#3F6B63]">
          🎉 No Active Requests
        </h2>

        <p className="mt-3 text-gray-500">
          All customer service requests have been completed.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {sortedRequests.map((request) => (
        <WaiterRequestCard
          key={request.id}
          tableNo={request.tableNo}
          customerName={request.customerName}
          service={request.service}
          waitingTime={request.waitingTime}
          status={request.status}
          onAccept={() => onAccept(request.id)}
          onComplete={() => onComplete(request.id)}
        />
      ))}
    </div>
  );
}