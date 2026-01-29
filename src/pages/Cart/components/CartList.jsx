import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getCart, clearCart } from "./api";
import { createOrder } from "@/pages/Orders/components/api";
import { Spinner } from "@/shared/components/Spinner";
import { Alert } from "@/shared/components/Alert";
import { CartListItem } from "./CartListItem";
import { useAuthState } from "@/shared/state/context";
import { useToast } from "@/shared/components/Toast";

export function CartList() {
  const { t } = useTranslation();
  const [cart, setCart] = useState(null);
  const [apiProgress, setApiProgress] = useState(false);
  const [error, setError] = useState(null);
  const [orderProgress, setOrderProgress] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");
  const authState = useAuthState();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const fetchCart = useCallback(async () => {
    setApiProgress(true);
    setError(null);
    try {
      const response = await getCart();
      setCart(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load cart");
    } finally {
      setApiProgress(false);
    }
  }, []);

  useEffect(() => {
    if (authState.id > 0) {
      fetchCart();
    }
  }, [authState.id, fetchCart]);

  const handleClearCart = async () => {
    try {
      await clearCart();
      addToast(t("cartCleared"), "info");
      fetchCart();
    } catch (err) {
      addToast(err.response?.data?.message || t("failedClearCart"), "danger");
    }
  };

  const handleCreateOrder = async () => {
    if (!shippingAddress.trim()) {
      addToast(t("pleaseEnterAddress"), "warning");
      return;
    }
    setOrderProgress(true);
    setError(null);
    try {
      await createOrder(shippingAddress);
      addToast(t("orderCreated"), "success");
      navigate("/orders");
    } catch (err) {
      addToast(err.response?.data?.message || t("failedCreateOrder"), "danger");
    } finally {
      setOrderProgress(false);
    }
  };

  if (authState.id === 0) {
    return (
      <Alert styleType="warning" center>
        {t("pleaseLoginCart")}
      </Alert>
    );
  }

  const cartItems = cart?.items || [];

  return (
    <div className="card">
      <div className="card-header text-center fs-4">{t("shoppingCart")}</div>
      <div className="card-body">
        {apiProgress && (
          <div className="text-center">
            <Spinner />
          </div>
        )}
        {error && <Alert styleType="danger">{error}</Alert>}
        {!apiProgress && cartItems.length === 0 && (
          <p className="text-center text-muted">{t("cartEmpty")}</p>
        )}
        {!apiProgress && cartItems.length > 0 && (
          <ul className="list-group list-group-flush">
            {cartItems.map((item) => (
              <CartListItem key={item.id} item={item} onUpdate={fetchCart} />
            ))}
          </ul>
        )}
      </div>
      {cartItems.length > 0 && (
        <>
          <div className="card-footer d-flex justify-content-between align-items-center">
            <span className="fs-5">
              <strong>{t("total")}: </strong>${cart?.totalAmount?.toFixed(2)}
            </span>
            <button className="btn btn-outline-danger btn-sm" onClick={handleClearCart}>
              {t("clearCart")}
            </button>
          </div>
          <div className="card-footer">
            <div className="mb-3">
              <label htmlFor="shippingAddress" className="form-label">{t("shippingAddress")}</label>
              <textarea
                id="shippingAddress"
                className="form-control"
                rows="2"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder={t("enterShippingAddress")}
              />
            </div>
            <button 
              className="btn btn-success w-100" 
              onClick={handleCreateOrder}
              disabled={orderProgress}
            >
              {orderProgress ? <Spinner sm /> : t("checkout")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
