import http from "@/lib/http";

export function loadProducts(page = 0, size = 5) {
  return http.get("/api/v1/products", { params: { page, size } });
}

export function searchProducts(keyword, page = 0, size = 5) {
  return http.get("/api/v1/products/search", { params: { keyword, page, size } });
}

export function getProductsByCategory(categoryId, page = 0, size = 5) {
  return http.get(`/api/v1/products/category/${categoryId}`, { params: { page, size } });
}

export function getProduct(id) {
  return http.get(`/api/v1/products/${id}`);
}
