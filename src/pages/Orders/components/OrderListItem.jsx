import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function OrderListItem({ order }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

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

  const handlePayClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/payment/${order.id}`);
  };

  return (
    <Link
      className="list-group-item list-group-item-action"
      to={`/orders/${order.id}`}
      style={{ textDecoration: "none" }}
    >
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h6 className="mb-1">{t("orderNumber", { id: order.id })}</h6>
          <small className="text-muted">
            {new Date(order.createdDate).toLocaleDateString()}
          </small>
        </div>
        <div className="text-end d-flex align-items-center gap-2">
          <span className={`badge ${getStatusBadge(order.status)}`}>
            {order.status}
          </span>
          {order.status === "PENDING" && (
            <button
              className="btn btn-success btn-sm"
              onClick={handlePayClick}
            >
              💳 {t("pay")}
            </button>
          )}
          <span className="fw-bold">${order.totalAmount?.toFixed(2)}</span>
        </div>
      </div>
      <small className="text-muted">
        {order.items?.length} {order.items?.length !== 1 ? t("items") : t("item")}
      </small>
    </Link>
  );
}
