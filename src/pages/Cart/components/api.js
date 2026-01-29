import http from "@/lib/http";

export function getCart() {
  return http.get("/api/v1/cart");
}

export function addToCart(productId, quantity = 1) {
  return http.post("/api/v1/cart/add", { productId, quantity });
}

export function updateCartItem(cartItemId, quantity) {
  return http.put(`/api/v1/cart/items/${cartItemId}`, { quantity });
}

export function removeCartItem(cartItemId) {
  return http.delete(`/api/v1/cart/items/${cartItemId}`);
}

export function clearCart() {
  return http.delete("/api/v1/cart");
}
