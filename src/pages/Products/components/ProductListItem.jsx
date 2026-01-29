import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function ProductListItem({ product }) {
  const { t } = useTranslation();
  const categoryName = product.category?.name || product.categoryName;
  
  return (
    <Link
      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
      to={`/products/${product.id}`}
      style={{ textDecoration: "none" }}
    >
      <div className="d-flex align-items-center">
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            width={50}
            height={50}
            className="rounded me-3"
            style={{ objectFit: "cover" }}
          />
        )}
        <div>
          <h6 className="mb-0">{product.name}</h6>
          {categoryName && (
            <small className="text-muted">{t(`category_${categoryName}`, { defaultValue: categoryName })}</small>
          )}
        </div>
      </div>
      <span className="badge bg-primary rounded-pill">${product.price}</span>
    </Link>
  );
}
