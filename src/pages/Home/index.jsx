import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import logo from "@/assets/hoaxify.png";
import http from "@/lib/http";

export function Home() {
  const { t } = useTranslation();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch featured products
    http.get("/api/v1/products", { params: { size: 4 } })
      .then(res => setFeaturedProducts(res.data.content || []))
      .catch(() => {});
    
    // Fetch categories
    http.get("/api/v1/categories")
      .then(res => setCategories(res.data.content || res.data || []))
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero Banner */}
      <div
        className="card mb-4 border-0"
        style={{
          background: "linear-gradient(135deg, #8B4513 0%, #D2691E 50%, #F4A460 100%)",
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >
        <div className="row g-0 align-items-center">
          <div className="col-md-4 text-center p-4">
            <img
              src={logo}
              alt="Aziz Tas Patisserie"
              style={{
                width: "200px",
                height: "200px",
                objectFit: "contain",
                borderRadius: "50%",
                backgroundColor: "white",
                padding: "10px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              }}
            />
          </div>
          <div className="col-md-8 p-5 text-white">
            <h1
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: "3rem",
                fontWeight: "bold",
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              {t("brandName")} {t("brandSubtitle")}
            </h1>
            <p
              className="lead mb-4"
              style={{
                fontFamily: "'Brush Script MT', cursive",
                fontSize: "1.8rem",
              }}
            >
              ✨ {t("since1996")} ✨
            </p>
            <p className="mb-4" style={{ fontSize: "1.1rem", opacity: 0.95 }}>
              {t("heroDescription")}
            </p>
            <div className="d-flex gap-3">
              <Link
                to="/products"
                className="btn btn-light btn-lg px-4"
                style={{ color: "#8B4513", fontWeight: "bold" }}
              >
                🛒 {t("discoverProducts")}
              </Link>
              <Link
                to="/signup"
                className="btn btn-outline-light btn-lg px-4"
              >
                {t("joinUs")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      {categories.length > 0 && (
        <div className="mb-5">
          <div className="text-center mb-4">
            <h3 style={{ color: "#5D3A1A" }}>🏷️ {t("categories")}</h3>
            <p className="text-muted">{t("discoverCategories")}</p>
          </div>
          <div className="row justify-content-center">
            {categories.slice(0, 6).map((category) => (
              <div key={category.id} className="col-6 col-md-4 col-lg-2 mb-3">
                <Link
                  to={`/products?category=${category.id}`}
                  className="card h-100 text-decoration-none border-0 shadow-sm"
                  style={{ 
                    background: "linear-gradient(135deg, #FDF5E6 0%, #FAEBD7 100%)",
                    transition: "transform 0.2s",
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  <div className="card-body text-center py-4">
                    <span style={{ fontSize: "2rem" }}>🍰</span>
                    <h6 className="mt-2 mb-0" style={{ color: "#5D3A1A" }}>{t(`category_${category.name}`, { defaultValue: category.name })}</h6>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <div className="mb-4">
          <div className="text-center mb-4">
            <h3 style={{ color: "#5D3A1A" }}>⭐ {t("featuredProducts")}</h3>
            <p className="text-muted">{t("ourFavorites")}</p>
          </div>
          <div className="row">
            {featuredProducts.map((product) => (
              <div key={product.id} className="col-md-6 col-lg-3 mb-4">
                <Link
                  to={`/products/${product.id}`}
                  className="card h-100 text-decoration-none shadow-sm border-0"
                  style={{ transition: "transform 0.2s" }}
                  onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                  onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
                >
                  {(product.image || product.imageUrl) ? (
                    <img
                      src={product.image || product.imageUrl}
                      alt={product.name}
                      className="card-img-top"
                      style={{ height: "180px", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      className="card-img-top d-flex align-items-center justify-content-center"
                      style={{ height: "180px", background: "#FDF5E6" }}
                    >
                      <span style={{ fontSize: "4rem" }}>🍰</span>
                    </div>
                  )}
                  <div className="card-body">
                    <h6 className="card-title" style={{ color: "#5D3A1A" }}>{product.name}</h6>
                    <p className="card-text text-muted small">
                      {product.description?.substring(0, 60)}...
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold" style={{ color: "#8B4513" }}>
                        ${product.price?.toFixed(2)}
                      </span>
                      {(product.stock ?? product.stockQuantity) <= 5 && (product.stock ?? product.stockQuantity) > 0 && (
                        <span className="badge bg-warning">{t("lastItems", { count: product.stock ?? product.stockQuantity })}</span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-3">
            <Link to="/products" className="btn btn-outline-primary btn-lg">
              {t("viewAllProducts")} →
            </Link>
          </div>
        </div>
      )}

      {/* Why Choose Us Section */}
      <div className="card border-0 mt-5" style={{ background: "#FDF5E6", borderRadius: "20px" }}>
        <div className="card-body p-5">
          <h3 className="text-center mb-4" style={{ color: "#5D3A1A" }}>
            🌟 {t("whyChooseUs")}
          </h3>
          <div className="row text-center">
            <div className="col-md-4 mb-3">
              <div style={{ fontSize: "3rem" }}>🍯</div>
              <h5 style={{ color: "#8B4513" }}>{t("naturalIngredients")}</h5>
              <p className="text-muted">{t("naturalIngredientsDesc")}</p>
            </div>
            <div className="col-md-4 mb-3">
              <div style={{ fontSize: "3rem" }}>👨‍🍳</div>
              <h5 style={{ color: "#8B4513" }}>{t("masterHands")}</h5>
              <p className="text-muted">{t("masterHandsDesc")}</p>
            </div>
            <div className="col-md-4 mb-3">
              <div style={{ fontSize: "3rem" }}>🚚</div>
              <h5 style={{ color: "#8B4513" }}>{t("fastDelivery")}</h5>
              <p className="text-muted">{t("fastDeliveryDesc")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}