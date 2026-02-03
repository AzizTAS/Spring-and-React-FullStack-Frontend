import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { loadOrders } from "./api";
import { Spinner } from "@/shared/components/Spinner";
import { Alert } from "@/shared/components/Alert";
import { OrderListItem } from "./OrderListItem";
import { useAuthState } from "@/shared/state/context";

export function OrderList() {
  const { t } = useTranslation();
  const [orderPage, setOrderPage] = useState({
    content: [],
    last: false,
    first: false,
    number: 0,
  });
  const [apiProgress, setApiProgress] = useState(false);
  const authState = useAuthState();

  const getOrders = useCallback(async (page) => {
    setApiProgress(true);
    try {
      const response = await loadOrders(page);
      setOrderPage(response.data);
    } catch {
    } finally {
      setApiProgress(false);
    }
  }, []);

  useEffect(() => {
    if (authState.id > 0) {
      getOrders();
    }
  }, [authState.id, getOrders]);

  if (authState.id === 0) {
    return (
      <Alert styleType="warning" center>
        {t("pleaseLoginOrders")}
      </Alert>
    );
  }

  return (
    <div className="card">
      <div className="card-header text-center fs-4">{t("myOrders")}</div>
      <ul className="list-group list-group-flush">
        {orderPage.content.map((order) => {
          return <OrderListItem key={order.id} order={order} />;
        })}
      </ul>
      {!apiProgress && orderPage.content.length === 0 && (
        <div className="card-body">
          <p className="text-center text-muted">{t("noOrdersYet")}</p>
        </div>
      )}
      <div className="card-footer text-center">
        {apiProgress && <Spinner />}
        {!apiProgress && !orderPage.first && (
          <button
            className="btn btn-outline-secondary btn-sm float-start"
            onClick={() => getOrders(orderPage.number - 1)}
          >
            {t("previous")}
          </button>
        )}
        {!apiProgress && !orderPage.last && (
          <button
            className="btn btn-outline-secondary btn-sm float-end"
            onClick={() => getOrders(orderPage.number + 1)}
          >
            {t("next")}
          </button>
        )}
      </div>
    </div>
  );
}
