export type ServiceRequest = {
  id?: string;
  tableNo: string;
  customerName: string;
  service: string;
  status: "Pending" | "Accepted" | "Completed";
  createdAt?: string;
};

export async function createServiceRequest(
  request: ServiceRequest
) {
  // TODO:
  // Supabase insertion will be added later

  console.log("Service Request:", request);

  return {
    success: true,
  };
}

export async function acceptServiceRequest(id: string) {
  console.log("Accepted:", id);

  return {
    success: true,
  };
}

export async function completeServiceRequest(id: string) {
  console.log("Completed:", id);

  return {
    success: true,
  };
}

export async function getServiceRequests() {
  return [];
}