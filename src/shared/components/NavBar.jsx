import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/hoaxify.png";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAuthDispatch, useAuthState } from "../state/context";
import { ProfileImage } from "./ProfileImage";
import { LanguageSelector } from "./LanguageSelector";
import { getCart } from "@/pages/Cart/components/api";
import { getCategories } from "@/pages/Admin/components/api";

export function NavBar() {
  const { t } = useTranslation();
  const authState = useAuthState();
  const dispatch = useAuthDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const menuRef = useRef(null);
  const categoryDropdownRef = useRef(null);

  const fetchCartCount = useCallback(async () => {
    if (authState.id > 0) {
      try {
        const response = await getCart();
        const items = response.data?.items || [];
        const count = items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(count);
      } catch {
        setCartCount(0);
      }
    } else {
      setCartCount(0);
    }
  }, [authState.id]);

  useEffect(() => {
    fetchCartCount();
    // Refresh cart count every 10 seconds
    const interval = setInterval(fetchCartCount, 10000);
    return () => clearInterval(interval);
  }, [fetchCartCount]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data?.content || []);
      } catch {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setCategoryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onClickLogout = () => {
    dispatch({type: 'logout-success'});
    setCartCount(0);
    setMenuOpen(false);
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  }
  return (
    <>
    <nav className="navbar navbar-expand-lg shadow-sm flex-column py-0" style={{ background: "linear-gradient(135deg, #FDF5E6 0%, #F5DEB3 100%)" }}>
      {/* Top Section - Logo Centered */}
      <div className="container-fluid justify-content-center py-2 border-bottom" style={{ borderColor: "rgba(139, 69, 19, 0.2) !important" }}>
        <Link className="navbar-brand d-flex flex-column align-items-center m-0" to="/" style={{ textDecoration: "none" }}>
          <img 
            src={logo} 
            height={55} 
            style={{ 
              borderRadius: "50%", 
              boxShadow: "0 4px 12px rgba(139, 69, 19, 0.3)",
              border: "3px solid #8B4513",
              padding: "2px",
              backgroundColor: "white"
            }} 
          />
          <div className="text-center mt-1">
            <span style={{ 
              fontFamily: "'Georgia', serif",
              fontSize: "1.3rem",
              fontWeight: "bold",
              color: "#5D3A1A",
              letterSpacing: "2px",
              textTransform: "uppercase"
            }}>
              Aziz Tas
            </span>
            <span style={{ 
              fontFamily: "'Brush Script MT', cursive",
              fontSize: "1rem",
              color: "#8B4513",
              marginLeft: "8px"
            }}>
              Patisserie ✨
            </span>
          </div>
        </Link>
      </div>
      
      {/* Bottom Section - Navigation */}
      <div className="container-fluid py-2">
        <ul className="navbar-nav me-auto gap-1">
          {/* Products Dropdown */}
          <li className="nav-item dropdown" ref={categoryDropdownRef}>
            <button
              className="nav-link px-3 py-1 rounded-pill dropdown-toggle border-0 bg-transparent"
              style={{ color: "#5D3A1A", fontWeight: "500", cursor: "pointer" }}
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
            >
              🛍️ {t("products")}
            </button>
            {categoryDropdownOpen && (
              <div 
                className="dropdown-menu show shadow-lg border-0 mt-1"
                style={{ 
                  background: "linear-gradient(135deg, #FDF5E6 0%, #FAEBD7 100%)",
                  borderRadius: "12px",
                  minWidth: "220px"
                }}
              >
                <Link 
                  className="dropdown-item py-2 px-3" 
                  to="/products"
                  onClick={() => setCategoryDropdownOpen(false)}
                  style={{ color: "#5D3A1A", fontWeight: "600" }}
                >
                  📦 {t("allProducts")}
                </Link>
                <div className="dropdown-divider" style={{ borderColor: "rgba(139, 69, 19, 0.2)" }}></div>
                <div className="px-3 py-1">
                  <small className="text-muted" style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                    {t("categories")}
                  </small>
                </div>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    className="dropdown-item py-2 px-3"
                    to={`/products?category=${category.id}`}
                    onClick={() => setCategoryDropdownOpen(false)}
                    style={{ color: "#5D3A1A" }}
                    onMouseOver={(e) => { e.target.style.backgroundColor = "rgba(139, 69, 19, 0.1)"; }}
                    onMouseOut={(e) => { e.target.style.backgroundColor = "transparent"; }}
                  >
                    🏷️ {t(`category_${category.name}`, { defaultValue: category.name })}
                  </Link>
                ))}
              </div>
            )}
          </li>
          {authState.id > 0 && (
            <li className="nav-item">
              <Link 
                className="nav-link position-relative px-3 py-1 rounded-pill" 
                to="/cart"
                style={{ color: "#5D3A1A", fontWeight: "500", transition: "all 0.2s" }}
                onMouseOver={(e) => { e.target.style.backgroundColor = "rgba(139, 69, 19, 0.1)"; }}
                onMouseOut={(e) => { e.target.style.backgroundColor = "transparent"; }}
              >
                🛒 {t("cart")}
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>
            </li>
          )}
        </ul>
        <form className="d-flex me-3" onSubmit={handleSearch}>
          <input
            className="form-control me-2"
            type="search"
            placeholder={t("searchProducts")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "180px", borderRadius: "20px", fontSize: "0.9rem" }}
          />
          <button 
            className="btn btn-sm" 
            type="submit"
            style={{ 
              backgroundColor: "#8B4513", 
              color: "white", 
              borderRadius: "20px",
              padding: "0 15px"
            }}
          >
            🔍
          </button>
        </form>
        <ul className="navbar-nav">
          {authState.id === 0 && (
            <>
              <li className="nav-item">
                <Link 
                  className="btn btn-sm me-2" 
                  to="/Login"
                  style={{ 
                    backgroundColor: "transparent",
                    color: "#5D3A1A",
                    border: "2px solid #8B4513",
                    borderRadius: "20px",
                    padding: "5px 15px",
                    fontWeight: "500"
                  }}
                >
                  {t("login")}
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className="btn btn-sm" 
                  to="/signup"
                  style={{ 
                    backgroundColor: "#8B4513",
                    color: "white",
                    borderRadius: "20px",
                    padding: "5px 15px",
                    fontWeight: "500"
                  }}
                >
                  {t("signUp")}
                </Link>
              </li>
            </>
          )}
        </ul>
        <div className="ms-3 d-flex align-items-center gap-2">
          <LanguageSelector />
        </div>
      </div>
    </nav>

    {/* Floating User Menu */}
    {authState.id > 0 && (
      <div
        ref={menuRef}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1050,
        }}
      >
        {/* Menu Items */}
        {menuOpen && (
          <div
            className="bg-white rounded-3 shadow-lg mb-2 overflow-hidden"
            style={{ minWidth: "200px" }}
          >
            <Link
              to={`/user/${authState.id}`}
              className="d-flex align-items-center px-3 py-2 text-decoration-none text-dark border-bottom"
              onClick={() => setMenuOpen(false)}
            >
              <ProfileImage width={32} image={authState.image} />
              <div className="ms-2">
                <div className="fw-semibold">{authState.username}</div>
                <small className="text-muted">{t("viewProfile")}</small>
              </div>
            </Link>
            <Link
              to="/orders"
              className="d-flex align-items-center px-3 py-2 text-decoration-none text-dark border-bottom"
              onClick={() => setMenuOpen(false)}
            >
              <span style={{ width: "32px", textAlign: "center" }}>📦</span>
              <span className="ms-2">{t("myOrders")}</span>
            </Link>
            {authState.role === "ADMIN" && (
              <Link
                to="/admin"
                className="d-flex align-items-center px-3 py-2 text-decoration-none text-dark border-bottom bg-light"
                onClick={() => setMenuOpen(false)}
              >
                <span style={{ width: "32px", textAlign: "center" }}>🔐</span>
                <span className="ms-2 fw-semibold text-primary">{t("adminPanel")}</span>
              </Link>
            )}
            <button
              className="d-flex align-items-center px-3 py-2 text-decoration-none text-danger border-0 bg-transparent w-100"
              onClick={onClickLogout}
              style={{ cursor: "pointer" }}
            >
              <span style={{ width: "32px", textAlign: "center" }}>🚪</span>
              <span className="ms-2">{t("logout")}</span>
            </button>
          </div>
        )}

        {/* Floating Button */}
        <button
          className="btn btn-primary rounded-circle shadow-lg d-flex align-items-center justify-content-center"
          style={{
            width: "56px",
            height: "56px",
            marginLeft: "auto",
          }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <ProfileImage width={40} image={authState.image} />
        </button>
      </div>
    )}
    </>
  );
}