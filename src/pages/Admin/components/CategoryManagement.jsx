import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getCategories, createCategory, updateCategory, deleteCategory } from "./api";
import { Spinner } from "@/shared/components/Spinner";
import { useToast } from "@/shared/components/Toast";

export function CategoryManagement() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await getCategories();
      setCategories(response.data.content || response.data);
    } catch (err) {
      addToast(t("failedLoadCategories"), "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || "",
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: "", description: "" });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
        addToast(t("categoryUpdated"), "success");
      } else {
        await createCategory(formData);
        addToast(t("categoryCreated"), "success");
      }
      handleCloseModal();
      fetchCategories();
    } catch (err) {
      addToast(err.response?.data?.message || t("failedSaveCategory"), "danger");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("confirmDeleteCategory"))) {
      return;
    }
    try {
      await deleteCategory(id);
      addToast(t("categoryDeleted"), "success");
      fetchCategories();
    } catch (err) {
      addToast(err.response?.data?.message || t("failedDeleteCategory"), "danger");
    }
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">🏷️ {t("categoryManagement")}</h5>
        <button className="btn btn-primary btn-sm" onClick={() => handleOpenModal()}>
          + {t("addCategory")}
        </button>
      </div>
      <div className="card-body">
        {loading ? (
          <div className="text-center"><Spinner /></div>
        ) : categories.length === 0 ? (
          <p className="text-center text-muted">{t("noCategoriesFound")}</p>
        ) : (
          <div className="row">
            {categories.map((category) => (
              <div key={category.id} className="col-md-4 mb-3">
                <div className="card h-100">
                  <div className="card-body">
                    <h6 className="card-title">{t(`category_${category.name}`, { defaultValue: category.name })}</h6>
                    <p className="card-text text-muted small">
                      {category.description || t("noDescription")}
                    </p>
                    {category.productCount !== undefined && (
                      <span className="badge bg-secondary">
                        {category.productCount} {t("products")}
                      </span>
                    )}
                  </div>
                  <div className="card-footer bg-transparent border-0">
                    <button
                      className="btn btn-outline-primary btn-sm me-1"
                      onClick={() => handleOpenModal(category)}
                    >
                      ✏️ {t("edit")}
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(category.id)}
                    >
                      🗑️ {t("delete")}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingCategory ? t("editCategory") : t("addNewCategory")}
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">{t("categoryName")} *</label>
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
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    {t("cancel")}
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? <Spinner sm /> : editingCategory ? t("update") : t("create")}
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
