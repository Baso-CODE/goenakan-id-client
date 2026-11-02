const PREFIX = "gk_guest_order_";

export function saveGuestOrderToken(orderId: string, token: string) {
  if (typeof window === "undefined") return;

  sessionStorage.setItem(`${PREFIX}${orderId}`, token);
}

export function getGuestOrderHeaders(orderId: string): Record<string, string> {
  if (typeof window === "undefined") return {};

  const token = sessionStorage.getItem(`${PREFIX}${orderId}`);

  return token ? { "X-Guest-Order-Token": token } : {};
}
