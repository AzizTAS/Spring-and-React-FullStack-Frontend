import http from "@/lib/http";

// Stats
export function getAdminStats() {
  return Promise.all([
    http.get("/api/v1/admin/stats/users"),
    http.get("/api/v1/admin/stats/products"),
    http.get("/api/v1/admin/stats/orders"),
  ]).then(([users, products, orders]) => ({
    users: users.data,
    products: products.data,
    orders: orders.data,
  }));
}

// Orders
export function getAllOrders(page = 0) {
  return http.get("/api/v1/admin/orders", { params: { page, size: 10 } });
}

export function updateOrderStatus(orderId, status) {
  return http.put(`/api/v1/orders/${orderId}/status`, { status });
}

export function deleteOrder(orderId) {
  return http.delete(`/api/v1/orders/${orderId}`);
}

// Products
export function getProducts(page = 0) {
  return http.get("/api/v1/products", { params: { page, size: 10 } });
}

export function createProduct(productData) {
  return http.post("/api/v1/products", productData);
}

export function updateProduct(id, productData) {
  return http.put(`/api/v1/products/${id}`, productData);
}

export function deleteProduct(id) {
  return http.delete(`/api/v1/products/${id}`);
}

// Categories
export function getCategories() {
  return http.get("/api/v1/categories");
}

export function createCategory(categoryData) {
  return http.post("/api/v1/categories", categoryData);
}

export function updateCategory(id, categoryData) {
  return http.put(`/api/v1/categories/${id}`, categoryData);
}

export function deleteCategory(id) {
  return http.delete(`/api/v1/categories/${id}`);
}

// Users
export function getUsers(page = 0) {
  return http.get("/api/v1/users", { params: { page, size: 10 } });
}

export function updateUserRole(userId, role) {
  return http.put(`/api/v1/users/${userId}`, { role });
}

export function deleteUser(userId) {
  return http.delete(`/api/v1/users/${userId}`);
}
