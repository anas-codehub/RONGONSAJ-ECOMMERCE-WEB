const PIXEL_ID = process.env.META_PIXEL_ID;
const CAPI_TOKEN = process.env.META_CAPI_TOKEN;
const CAPI_URL = `https://graph.facebook.com/v19.0/${PIXEL_ID}/events`;

interface CAPIEvent {
  eventName: string;
  eventTime: number;
  eventSourceUrl: string;
  userData: {
    phone?: string;
    email?: string;
    firstName?: string;
  };
  customData?: {
    currency?: string;
    value?: number;
    contentIds?: string[];
    contentType?: string;
    orderId?: string;
    numItems?: number;
  };
  eventId?: string;
}

function hashData(data: string): string {
  const crypto = require("crypto");
  return crypto.createHash("sha256").update(data.toLowerCase().trim()).digest("hex");
}

export async function sendCAPIEvent(event: CAPIEvent) {
  if (!PIXEL_ID || !CAPI_TOKEN) return;

  try {
    const payload = {
      data: [
        {
          event_name: event.eventName,
          event_time: event.eventTime,
          event_source_url: event.eventSourceUrl,
          action_source: "website",
          event_id: event.eventId || `${event.eventName}_${Date.now()}`,
          user_data: {
            ...(event.userData.phone && {
              ph: [hashData(event.userData.phone)],
            }),
            ...(event.userData.email && {
              em: [hashData(event.userData.email)],
            }),
            ...(event.userData.firstName && {
              fn: [hashData(event.userData.firstName)],
            }),
          },
          ...(event.customData && {
            custom_data: {
              currency: event.customData.currency || "BDT",
              value: event.customData.value,
              content_ids: event.customData.contentIds,
              content_type: event.customData.contentType || "product",
              order_id: event.customData.orderId,
              num_items: event.customData.numItems,
            },
          }),
        },
      ],
    };

    const res = await fetch(
      `${CAPI_URL}?access_token=${CAPI_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();
    if (!res.ok) {
      console.error("CAPI error:", data);
    }
  } catch (error) {
    console.error("CAPI send error:", error);
  }
}