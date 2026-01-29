import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getPaymentByOrderId, createPayment, PAYMENT_METHODS } from "./api";
import { getOrder } from "@/pages/Orders/components/api";
import { clearCart } from "@/pages/Cart/components/api";
import { Spinner } from "@/shared/components/Spinner";
import { Alert } from "@/shared/components/Alert";
import { useAuthState } from "@/shared/state/context";
import { useToast } from "@/shared/components/Toast";

export function PaymentForm() {
  const { t } = useTranslation();
  const { orderId } = useParams();
  const navigate = useNavigate();
  const authState = useAuthState();
  const { addToast } = useToast();

  const [order, setOrder] = useState(null);
  const [existingPayment, setExistingPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("CREDIT_CARD");

  useEffect(() => {
    const fetchData = async () => {
      if (authState.id === 0) {
        navigate("/login");
        return;
      }

      try {
        // Get order details
        const orderResponse = await getOrder(orderId);
        setOrder(orderResponse.data);

        // Check if payment already exists
        try {
          const paymentResponse = await getPaymentByOrderId(orderId);
          setExistingPayment(paymentResponse.data);
        } catch {
          // No existing payment, that's fine
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId, authState.id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      await createPayment(orderId, paymentMethod);
      await clearCart(); // ödeme başarılıysa sepeti temizle
      addToast(t("paymentSuccessful"), "success");
      navigate(`/orders/${orderId}`);
    } catch (err) {
      addToast(err.response?.data?.message || t("paymentFailed"), "danger");
    } finally {
      setProcessing(false);
    }
  };

  if (authState.id === 0) {
    return <Alert styleType="warning">{t("pleaseLoginPayment")}</Alert>;
  }

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <Alert styleType="danger">{error}</Alert>;
  }

  if (!order) {
    return <Alert styleType="warning">{t("orderNotFound")}</Alert>;
  }

  // If payment already exists and completed
  if (existingPayment && existingPayment.status === "COMPLETED") {
    return (
      <div className="card">
        <div className="card-header bg-success text-white text-center">
          <h4>✅ {t("paymentAlreadyCompleted")}</h4>
        </div>
        <div className="card-body text-center">
          <p>{t("orderAlreadyPaid")}</p>
          <p><strong>{t("transactionId")}:</strong> {existingPayment.transactionId}</p>
          <p><strong>{t("amount")}:</strong> ${existingPayment.amount}</p>
          <Link to={`/orders/${orderId}`} className="btn btn-primary">
            {t("viewOrder")}
          </Link>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      PENDING: "bg-warning",
      CONFIRMED: "bg-info",
      SHIPPED: "bg-primary",
      DELIVERED: "bg-success",
      CANCELLED: "bg-danger",
    };
    return statusMap[status] || "bg-secondary";
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card">
          <div className="card-header bg-primary text-white">
            <h4 className="mb-0">💳 {t("payment")} - {t("orderNumber", { id: orderId })}</h4>
          </div>
          <div className="card-body">
            {/* Order Summary */}
            <div className="mb-4 p-3 bg-light rounded">
              <h5>{t("orderSummary")}</h5>
              <div className="d-flex justify-content-between">
                <span>{t("status")}:</span>
                <span className={`badge ${getStatusBadge(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <span>{t("items")}:</span>
                <span>{order.items?.length} {order.items?.length !== 1 ? t("items") : t("item")}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <strong>{t("totalAmount")}:</strong>
                <strong className="text-primary fs-4">
                  ${order.totalAmount?.toFixed(2)}
                </strong>
              </div>
            </div>

            {/* Payment Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label fw-semibold">{t("paymentMethod")}</label>
                <div className="row g-3">
                  {PAYMENT_METHODS.map((method) => (
                    <div key={method.value} className="col-md-6">
                      <div
                        className={`card cursor-pointer ${
                          paymentMethod === method.value
                            ? "border-primary bg-primary bg-opacity-10"
                            : ""
                        }`}
                        style={{ cursor: "pointer" }}
                        onClick={() => setPaymentMethod(method.value)}
                      >
                        <div className="card-body text-center py-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.value}
                            checked={paymentMethod === method.value}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="form-check-input me-2"
                          />
                          <span className="fs-5">{method.label}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Simulated Card Details (for demo) */}
              {(paymentMethod === "CREDIT_CARD" || paymentMethod === "DEBIT_CARD") && (
                <div className="mb-4 p-3 border rounded">
                  <h6 className="mb-3">Card Details (Demo)</h6>
                  <div className="row g-3">
                    <div className="col-12">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Card Number"
                        defaultValue="4242 4242 4242 4242"
                        disabled
                      />
                    </div>
                    <div className="col-6">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="MM/YY"
                        defaultValue="12/28"
                        disabled
                      />
                    </div>
                    <div className="col-6">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="CVV"
                        defaultValue="123"
                        disabled
                      />
                    </div>
                  </div>
                  <small className="text-muted">
                    * This is a demo. No real payment will be processed.
                  </small>
                </div>
              )}

              <div className="d-grid gap-2">
                <button
                  type="submit"
                  className="btn btn-success btn-lg"
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <Spinner sm /> {t("processingPayment")}
                    </>
                  ) : (
                    `${t("payNow")} $${order.totalAmount?.toFixed(2)}`
                  )}
                </button>
                <Link
                  to={`/orders/${orderId}`}
                  className="btn btn-outline-secondary"
                >
                  {t("backToOrders")}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
