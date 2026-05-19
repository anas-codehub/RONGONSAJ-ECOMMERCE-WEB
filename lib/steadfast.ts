const STEADFAST_BASE_URL = "https://portal.steadfast.com.bd/api/v1";

interface SteadfastOrder {
  invoice: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  cod_amount: number;
  note?: string;
}

interface SteadfastResponse {
  status: number;
  message: string;
  consignment?: {
    consignment_id: number;
    tracking_code: string;
    invoice: string;
    recipient_name: string;
    recipient_phone: string;
    recipient_address: string;
    cod_amount: number;
    status: string;
  };
}

export async function createSteadfastOrder(
  order: SteadfastOrder
): Promise<SteadfastResponse> {
  const res = await fetch(`${STEADFAST_BASE_URL}/create_order`, {
    method: "POST",
    headers: {
      "Api-Key": process.env.STEADFAST_API_KEY!,
      "Secret-Key": process.env.STEADFAST_API_SECRET!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });

  return res.json();
}

export async function getSteadfastOrderStatus(
  trackingCode: string
): Promise<any> {
  const res = await fetch(
    `${STEADFAST_BASE_URL}/status_by_trackingcode/${trackingCode}`,
    {
      headers: {
        "Api-Key": process.env.STEADFAST_API_KEY!,
        "Secret-Key": process.env.STEADFAST_API_SECRET!,
      },
    }
  );

  return res.json();
}