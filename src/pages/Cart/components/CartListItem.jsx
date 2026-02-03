import { useState } from "react";
import { updateCartItem, removeCartItem } from "./api";

export function CartListItem({ item, onUpdate }) {
  const [quantity, setQuantity] = useState(item.quantity);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
    try {
      await updateCartItem(item.id, newQuantity);
      onUpdate();
    } catch {
      setQuantity(item.quantity);
    }
  };

  const handleRemove = async () => {
    try {
      await removeCartItem(item.id);
      onUpdate();
    } catch {
    }
  };

  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <div>
        <h6 className="mb-0">{item.productName}</h6>
        <small className="text-muted">${item.priceAtTime} each</small>
      </div>
      <div className="d-flex align-items-center gap-2">
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => handleQuantityChange(quantity - 1)}
        >
          -
        </button>
        <span>{quantity}</span>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => handleQuantityChange(quantity + 1)}
        >
          +
        </button>
        <span className="ms-3 fw-bold">${item.totalPrice?.toFixed(2)}</span>
        <button className="btn btn-outline-danger btn-sm ms-2" onClick={handleRemove}>
          ✕
        </button>
      </div>
    </li>
  );
}
