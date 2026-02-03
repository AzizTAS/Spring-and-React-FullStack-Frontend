import http from "@/lib/http";

export function loadCategories(page = 0, size = 100) {
  return http.get("/api/v1/categories", { params: { page, size } });
}

export function getCategory(id) {
  return http.get(`/api/v1/categories/${id}`);
}
