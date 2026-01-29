import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { loadProducts, searchProducts, getProductsByCategory } from "./api";
import { loadCategories } from "@/pages/Categories/components/api";
import { Spinner } from "@/shared/components/Spinner";
import { ProductListItem } from "./ProductListItem";

export function ProductList() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const categoryFromUrl = searchParams.get("category") || "";
  
  const [productPage, setProductPage] = useState({
    content: [],
    last: false,
    first: false,
    number: 0,
  });
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [apiProgress, setApiProgress] = useState(false);

  // Update selectedCategory when URL changes
  useEffect(() => {
    setSelectedCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await loadCategories();
        setCategories(response.data.content || []);
      } catch {
        // ignore
      }
    };
    fetchCategories();
  }, []);

  const getProducts = useCallback(async (page = 0) => {
    setApiProgress(true);
    try {
      let response;
      if (searchQuery) {
        response = await searchProducts(searchQuery, page);
      } else if (selectedCategory) {
        response = await getProductsByCategory(selectedCategory, page);
      } else {
        response = await loadProducts(page);
      }
      setProductPage(response.data);
    } catch {
    } finally {
      setApiProgress(false);
    }
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center">
          <span className="fs-4">{t("productList")}</span>
          <div className="d-flex gap-2 align-items-center">
            {searchQuery && (
              <span className="badge bg-info">
                Search: "{searchQuery}"
              </span>
            )}
            <select
              className="form-select form-select-sm"
              style={{ width: "180px" }}
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="">{t("allCategories")}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {t(`category_${cat.name}`, { defaultValue: cat.name })}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <ul className="list-group list-group-flush">
        {productPage.content.map((product) => {
          return <ProductListItem key={product.id} product={product} />;
        })}
        {!apiProgress && productPage.content.length === 0 && (
          <li className="list-group-item text-center text-muted">
            {t("noProductsFound")}
          </li>
        )}
      </ul>
      <div className="card-footer text-center">
        {apiProgress && <Spinner />}
        {!apiProgress && !productPage.first && (
          <button
            className="btn btn-outline-secondary btn-sm float-start"
            onClick={() => getProducts(productPage.number - 1)}
          >
            {t("previous")}
          </button>
        )}
        {!apiProgress && !productPage.last && (
          <button
            className="btn btn-outline-secondary btn-sm float-end"
            onClick={() => getProducts(productPage.number + 1)}
          >
            {t("next")}
          </button>
        )}
      </div>
    </div>
  );
}
