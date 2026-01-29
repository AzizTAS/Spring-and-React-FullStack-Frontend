import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthState } from "@/shared/state/context";
import { getAdminStats, getAllOrders, updateOrderStatus, deleteOrder } from "./api";
import { Spinner } from "@/shared/components/Spinner";
import { Alert } from "@/shared/components/Alert";
import { useToast } from "@/shared/components/Toast";
import { ProductManagement } from "./ProductManagement";
import { UserManagement } from "./UserManagement";
import { CategoryManagement } from "./CategoryManagement";

export function AdminDashboard() {
  const { t } = useTranslation();
  const authState = useAuthState();
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState({ content: [], page: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authState.role !== "ADMIN") {
      navigate("/");
      return;
    }
    
    const fetchData = async () => {
      try {
        const statsData = await getAdminStats();
        setStats(statsData);
        
        const ordersData = await getAllOrders(0);
        setOrders(ordersData.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [authState.role, navigate]);

  const fetchOrders = async (page = 0) => {
    setOrdersLoading(true);
    try {
      const response = await getAllOrders(page);
      setOrders(response.data);
    } catch (err) {
      addToast("Failed to load orders", "danger");
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      addToast(t("orderStatusUpdated", { id: orderId, status: newStatus }), "success");
      fetchOrders(orders.number);
    } catch (err) {
      addToast(err.response?.data?.message || t("failedUpdateStatus"), "danger");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(t("confirmDeleteOrder", { id: orderId }))) {
      return;
    }
    try {
      await deleteOrder(orderId);
      addToast(t("orderDeleted", { id: orderId }), "success");
      fetchOrders(orders.number);
    } catch (err) {
      addToast(err.response?.data?.message || t("failedDeleteOrder"), "danger");
    }
  };

  if (authState.role !== "ADMIN") {
    return <Alert styleType="danger">{t("accessDenied")}</Alert>;
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

  const statusOptions = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

  const tabs = [
    { id: "dashboard", label: `📊 ${t("dashboard")}` },
    { id: "orders", label: `📋 ${t("orders")}` },
    { id: "products", label: `📦 ${t("products")}` },
    { id: "categories", label: `🏷️ ${t("categories")}` },
    { id: "users", label: `👥 ${t("users")}` },
  ];

  return (
    <div>
      <h2 className="mb-4">🔐 {t("adminPanel")}</h2>
      
      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        {tabs.map((tab) => (
          <li className="nav-item" key={tab.id}>
            <button
              className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Tab Content */}
      {activeTab === "dashboard" && (
        <div>
          {/* Stats Cards */}
          <div className="row mb-4">
            <div className="col-md-4">
              <div 
                className="card bg-primary text-white" 
                style={{ cursor: "pointer" }}
                onClick={() => setActiveTab("users")}
              >
                <div className="card-body text-center">
                  <h3>{stats?.users || 0}</h3>
                  <p className="mb-0">👥 {t("users")}</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div 
                className="card bg-success text-white"
                style={{ cursor: "pointer" }}
                onClick={() => setActiveTab("products")}
              >
                <div className="card-body text-center">
                  <h3>{stats?.products || 0}</h3>
                  <p className="mb-0">📦 {t("totalProducts")}</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div 
                className="card bg-info text-white"
                style={{ cursor: "pointer" }}
                onClick={() => setActiveTab("orders")}
              >
                <div className="card-body text-center">
                  <h3>{stats?.orders || 0}</h3>
                  <p className="mb-0">🛒 {t("totalOrders")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">📋 {t("orders")}</h5>
              <button 
                className="btn btn-outline-primary btn-sm"
                onClick={() => setActiveTab("orders")}
              >
                {t("viewAllProducts")} →
              </button>
            </div>
            <div className="card-body">
              {ordersLoading ? (
                <div className="text-center"><Spinner /></div>
              ) : orders.content?.length === 0 ? (
                <p className="text-center text-muted">{t("noOrdersYet")}</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>{t("orderNumber", { id: "" }).replace("#", "ID")}</th>
                        <th>{t("customer")}</th>
                        <th>{t("total")}</th>
                        <th>{t("status")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.content?.slice(0, 5).map((order) => (
                        <tr key={order.id}>
                          <td>#{order.id}</td>
                          <td>{order.userName || `User #${order.userId}`}</td>
                          <td>${order.totalAmount?.toFixed(2)}</td>
                          <td>
                            <span className={`badge ${getStatusBadge(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "orders" && (
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">📋 {t("orderManagement")}</h5>
          </div>
          <div className="card-body">
            {ordersLoading ? (
              <div className="text-center"><Spinner /></div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>{t("customer")}</th>
                      <th>{t("date")}</th>
                      <th>{t("total")}</th>
                      <th>{t("status")}</th>
                      <th>{t("actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.content?.map((order) => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>{order.userName || `User #${order.userId}`}</td>
                        <td>{new Date(order.createdDate).toLocaleDateString()}</td>
                        <td>${order.totalAmount?.toFixed(2)}</td>
                        <td>
                          <span className={`badge ${getStatusBadge(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-1 align-items-center">
                            <select
                              className="form-select form-select-sm"
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              style={{ width: "130px" }}
                            >
                              {statusOptions.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleDeleteOrder(order.id)}
                              title="Delete Order"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Pagination */}
            {orders.totalPages > 1 && (
              <nav className="mt-3">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${orders.first ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => fetchOrders(orders.number - 1)}
                      disabled={orders.first}
                    >
                      {t("previous")}
                    </button>
                  </li>
                  <li className="page-item disabled">
                    <span className="page-link">
                      {orders.number + 1} / {orders.totalPages}
                    </span>
                  </li>
                  <li className={`page-item ${orders.last ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => fetchOrders(orders.number + 1)}
                      disabled={orders.last}
                    >
                      {t("next")}
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>
      )}

      {activeTab === "products" && <ProductManagement />}
      {activeTab === "categories" && <CategoryManagement />}
      {activeTab === "users" && <UserManagement />}
    </div>
  );
}
