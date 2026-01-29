import http from "@/lib/http";

export function loadOrders(page = 0) {
  return http.get("/api/v1/orders", { params: { page, size: 5 } });
}

export function getOrder(id) {
  return http.get(`/api/v1/orders/${id}`);
}

export function createOrder(shippingAddress) {
  return http.post("/api/v1/orders", { shippingAddress });
}

export function updateOrderStatus(id, status) {
  return http.put(`/api/v1/orders/${id}/status`, { status });
}

export function cancelOrder(id) {
  return updateOrderStatus(id, "CANCELLED");
}

export function deleteOrder(id) {
  return http.delete(`/api/v1/orders/${id}`);
}
