export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

// Track page view
export const pageView = () => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "PageView");
  }
};

// Track add to cart
export const addToCart = (product: {
  id: string;
  name: string;
  price: number;
  currency?: string;
}) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "AddToCart", {
      content_ids: [product.id],
      content_name: product.name,
      content_type: "product",
      value: product.price,
      currency: product.currency || "BDT",
    });
  }
};

// Track view content (product page)
export const viewContent = (product: {
  id: string;
  name: string;
  price: number;
}) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "ViewContent", {
      content_ids: [product.id],
      content_name: product.name,
      content_type: "product",
      value: product.price,
      currency: "BDT",
    });
  }
};

// Track initiate checkout
export const initiateCheckout = (value: number, numItems: number) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "InitiateCheckout", {
      value,
      currency: "BDT",
      num_items: numItems,
    });
  }
};

// Track purchase
export const purchase = (orderId: string, value: number, numItems: number) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Purchase", {
      content_ids: [orderId],
      value,
      currency: "BDT",
      num_items: numItems,
    });
  }
};

// Track search
export const search = (query: string) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Search", {
      search_string: query,
    });
  }
};

// Track wishlist
export const addToWishlist = (product: {
  id: string;
  name: string;
  price: number;
}) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "AddToWishlist", {
      content_ids: [product.id],
      content_name: product.name,
      value: product.price,
      currency: "BDT",
    });
  }
};