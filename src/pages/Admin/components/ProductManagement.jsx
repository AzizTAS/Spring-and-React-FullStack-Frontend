import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories } from "./api";
import { Spinner } from "@/shared/components/Spinner";
import { useToast } from "@/shared/components/Toast";

export function ProductManagement() {
  const { t } = useTranslation();
  const [products, setProducts] = useState({ content: [], page: 0, totalPages: 0 });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    imageUrl: "",
    categoryId: "",
  });
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async (page = 0) => {
    setLoading(true);
    try {
      const response = await getProducts(page);
      setProducts(response.data);
    } catch (err) {
      addToast(t("failedLoadProducts"), "danger");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data.content || response.data);
    } catch (err) {
      console.error("Failed to load categories");
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || "",
        price: product.price,
        stockQuantity: product.stock || product.stockQuantity || 0,
        imageUrl: product.image || product.imageUrl || "",
        categoryId: product.category?.id || product.categoryId || "",
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        stockQuantity: "",
        imageUrl: "",
        categoryId: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const data = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stockQuantity),
      categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
      image: formData.imageUrl || null,
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, data);
        addToast(t("productUpdated"), "success");
      } else {
        await createProduct(data);
        addToast(t("productCreated"), "success");
      }
      handleCloseModal();
      fetchProducts(products.number);
    } catch (err) {
      addToast(err.response?.data?.message || t("failedSaveProduct"), "danger");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("confirmDeleteProduct"))) {
      return;
    }
    try {
      await deleteProduct(id);
      addToast(t("productDeleted"), "success");
      fetchProducts(products.number);
    } catch (err) {
      addToast(err.response?.data?.message || t("failedDeleteProduct"), "danger");
    }
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">📦 {t("productManagement")}</h5>
        <button className="btn btn-primary btn-sm" onClick={() => handleOpenModal()}>
          + {t("addProduct")}
        </button>
      </div>
      <div className="card-body">
        {loading ? (
          <div className="text-center"><Spinner /></div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>{t("image")}</th>
                  <th>{t("productName")}</th>
                  <th>{t("category")}</th>
                  <th>{t("price")}</th>
                  <th>{t("stock")}</th>
                  <th>{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {products.content?.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          style={{ width: "40px", height: "40px", objectFit: "cover" }}
                          className="rounded"
                        />
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td>{product.name}</td>
                    <td>{(product.category?.name || product.categoryName) ? t(`category_${product.category?.name || product.categoryName}`, { defaultValue: product.category?.name || product.categoryName }) : "-"}</td>
                    <td>${product.price?.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${(product.stock || product.stockQuantity) > 0 ? "bg-success" : "bg-danger"}`}>
                        {product.stock ?? product.stockQuantity ?? 0}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-primary btn-sm me-1"
                        onClick={() => handleOpenModal(product)}
                      >
                        ✏️
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(product.id)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {products.totalPages > 1 && (
          <nav className="mt-3">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${products.first ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => fetchProducts(products.number - 1)}
                  disabled={products.first}
                >
                  {t("previous")}
                </button>
              </li>
              <li className="page-item disabled">
                <span className="page-link">
                  {products.number + 1} / {products.totalPages}
                </span>
              </li>
              <li className={`page-item ${products.last ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => fetchProducts(products.number + 1)}
                  disabled={products.last}
                >
                  {t("next")}
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingProduct ? t("editProduct") : t("addNewProduct")}
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">{t("productName")} *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">{t("description")}</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">{t("price")} *</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">{t("stockQuantity")} *</label>
                      <input
                        type="number"
                        className="form-control"
                        name="stockQuantity"
                        value={formData.stockQuantity}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">{t("category")}</label>
                    <select
                      className="form-select"
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleInputChange}
                    >
                      <option value="">{t("selectCategory")}</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {t(`category_${cat.name}`, { defaultValue: cat.name })}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">{t("imageUrl")}</label>
                    <input
                      type="url"
                      className="form-control"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    {t("cancel")}
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? <Spinner sm /> : editingProduct ? t("update") : t("create")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
