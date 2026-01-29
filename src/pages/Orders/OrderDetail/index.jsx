import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getOrder, cancelOrder } from "../components/api";
import { Spinner } from "@/shared/components/Spinner";
import { Alert } from "@/shared/components/Alert";
import { useAuthState } from "@/shared/state/context";
import { useToast } from "@/shared/components/Toast";

export function OrderDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [apiProgress, setApiProgress] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const authState = useAuthState();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const fetchOrder = async () => {
    setApiProgress(true);
    try {
      const response = await getOrder(id);
      setOrder(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load order");
    } finally {
      setApiProgress(false);
    }
  };

  useEffect(() => {
    if (authState.id !== 0) {
      fetchOrder();
    }
  }, [id, authState.id]);

  const handleCancelOrder = async () => {
    if (!window.confirm(t("confirmDeleteOrder", { id: id }))) {
      return;
    }
    setCancelling(true);
    try {
      await cancelOrder(id);
      addToast(t("orderDeleted", { id: id }), "success");
      fetchOrder(); // Refresh order
    } catch (err) {
      addToast(err.response?.data?.message || t("failedDeleteOrder"), "danger");
    } finally {
      setCancelling(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      PENDING: "bg-warning",
      PROCESSING: "bg-info",
      SHIPPED: "bg-primary",
      DELIVERED: "bg-success",
      CANCELLED: "bg-danger",
    };
    return statusMap[status] || "bg-secondary";
  };

  if (authState.id === 0) {
    return (
      <Alert styleType="warning" center>
        {t("pleaseLoginOrders")}
      </Alert>
    );
  }

  if (apiProgress) {
    return (
      <div className="text-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <Alert styleType="danger">{error}</Alert>;
  }

  if (!order) {
    return <Alert styleType="warning">{t("noOrdersYet")}</Alert>;
  }

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <span className="fs-4">{t("orderNumber", { id: order.id })}</span>
        <span className={`badge ${getStatusBadge(order.status)}`}>
          {order.status}
        </span>
      </div>
      <div className="card-body">
        <div className="row mb-3">
          <div className="col-md-6">
            <strong>{t("createdDate")}:</strong>{" "}
            {new Date(order.createdDate).toLocaleString()}
          </div>
          <div className="col-md-6">
            <strong>{t("totalAmount")}:</strong> ${order.totalAmount?.toFixed(2)}
          </div>
        </div>

        <div className="mb-3">
          <strong>{t("shippingAddress")}:</strong>
          <p className="mb-0 text-muted">{order.shippingAddress}</p>
        </div>

        <h5 className="mt-4">{t("orderItems")}</h5>
        <ul className="list-group">
          {order.items?.map((item) => (
            <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <Link to={`/products/${item.productId}`} className="text-decoration-none">
                  {item.productName}
                </Link>
                <span className="text-muted ms-2">x{item.quantity}</span>
              </div>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="card-footer d-flex justify-content-between">
        <Link to="/orders" className="btn btn-outline-secondary">
          &larr; {t("backToOrders")}
        </Link>
        <div className="d-flex gap-2">
          {order.status === "PENDING" && (
            <>
              <Link to={`/payment/${order.id}`} className="btn btn-success">
                💳 {t("pay")}
              </Link>
              <button
                className="btn btn-danger"
                onClick={handleCancelOrder}
                disabled={cancelling}
              >
                {cancelling ? <Spinner sm /> : t("cancelOrder")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
