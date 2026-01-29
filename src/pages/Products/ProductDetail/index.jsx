import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getProduct } from "../components/api";
import { addToCart } from "@/pages/Cart/components/api";
import { getProductAverageRating } from "@/pages/Reviews/components/api";
import { Spinner } from "@/shared/components/Spinner";
import { Alert } from "@/shared/components/Alert";
import { useAuthState } from "@/shared/state/context";
import { useToast } from "@/shared/components/Toast";
import { ReviewList } from "@/pages/Reviews/components/ReviewList";

export function ProductDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [apiProgress, setApiProgress] = useState(false);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [averageRating, setAverageRating] = useState(null);
  const authState = useAuthState();
  const { addToast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      setApiProgress(true);
      try {
        const response = await getProduct(id);
        setProduct(response.data);
        // Fetch average rating
        try {
          const ratingResponse = await getProductAverageRating(id);
          const rating = ratingResponse.data;
          // Handle if rating is a number or an object with averageRating property
          if (typeof rating === 'number') {
            setAverageRating(rating);
          } else if (rating && typeof rating.averageRating === 'number') {
            setAverageRating(rating.averageRating);
          } else if (rating && typeof rating === 'object') {
            // Try to extract any numeric value
            const numericValue = parseFloat(rating.average || rating.rating || rating);
            setAverageRating(isNaN(numericValue) ? null : numericValue);
          } else {
            setAverageRating(null);
          }
        } catch {
          setAverageRating(null);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Product not found");
      } finally {
        setApiProgress(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      await addToCart(product.id, quantity);
      addToast(`${quantity} x ${product.name} added to cart!`, "success");
      setQuantity(1);
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to add to cart", "danger");
    } finally {
      setAddingToCart(false);
    }
  };

  if (apiProgress) {
    return (
      <div className="text-center mt-5">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <Alert styleType="danger">{error}</Alert>;
  }

  if (!product) {
    return null;
  }

  return (
    <div className="card">
      <div className="card-header text-center fs-4">
        {product.name}
        {averageRating !== null && typeof averageRating === 'number' && (
          <span className="ms-2 fs-6 text-warning">
            {"⭐".repeat(Math.round(averageRating))} ({averageRating.toFixed(1)})
          </span>
        )}
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-4">
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="img-fluid rounded"
              />
            )}
          </div>
          <div className="col-md-8">
            <p className="text-muted">{t(`category_${product.categoryName}`, { defaultValue: product.categoryName })}</p>
            <p>{product.description}</p>
            <h4 className="text-primary">${product.price}</h4>
            <p>
              <strong>Stock:</strong> {product.stock}
              {product.stock > 0 && product.stock <= 5 && (
                <span className="badge bg-warning text-dark ms-2">
                  Only {product.stock} left!
                </span>
              )}
            </p>
            {authState.id > 0 && product.stock > 0 && (
              <div className="mt-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="d-flex align-items-center gap-2">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </button>
                    <span className="px-3">{quantity}</span>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="btn btn-success"
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                  >
                    {addingToCart ? <Spinner sm /> : "Add to Cart"}
                  </button>
                </div>
              </div>
            )}
            {authState.id === 0 && (
              <Alert styleType="info">Please login to add items to cart</Alert>
            )}
            {product.stock === 0 && (
              <Alert styleType="danger">Out of stock</Alert>
            )}
          </div>
        </div>
        
        {/* Reviews Section */}
        <ReviewList productId={id} />
      </div>
    </div>
  );
}
