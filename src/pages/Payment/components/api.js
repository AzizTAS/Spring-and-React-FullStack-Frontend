import http from "@/lib/http";

export function getPayment(id) {
  return http.get(`/api/v1/payments/${id}`);
}

export function getPaymentByOrderId(orderId) {
  return http.get(`/api/v1/payments/order/${orderId}`);
}

export function createPayment(orderId, paymentMethod, description = "") {
  return http.post(`/api/v1/payments/order/${orderId}`, { 
    paymentMethod, 
    description 
  });
}

export function updatePaymentStatus(id, status) {
  return http.put(`/api/v1/payments/${id}/status`, { status });
}

export const PAYMENT_METHODS = [
  { value: "CREDIT_CARD", label: "💳 Credit Card" },
  { value: "DEBIT_CARD", label: "💳 Debit Card" },
  { value: "BANK_TRANSFER", label: "🏦 Bank Transfer" },
  { value: "PAYPAL", label: "🅿️ PayPal" },
  { value: "WALLET", label: "👛 Wallet" },
];
