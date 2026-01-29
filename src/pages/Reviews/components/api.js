import http from "@/lib/http";

export function getProductReviews(productId, page = 0) {
  return http.get(`/api/v1/reviews/product/${productId}`, { params: { page, size: 5 } });
}

export function getProductAverageRating(productId) {
  return http.get(`/api/v1/reviews/product/${productId}/rating`);
}

export function getReview(id) {
  return http.get(`/api/v1/reviews/${id}`);
}

export function createReview(productId, data) {
  return http.post(`/api/v1/reviews/product/${productId}`, data);
}

export function updateReview(id, data) {
  return http.put(`/api/v1/reviews/${id}`, data);
}

export function deleteReview(id) {
  return http.delete(`/api/v1/reviews/${id}`);
}
