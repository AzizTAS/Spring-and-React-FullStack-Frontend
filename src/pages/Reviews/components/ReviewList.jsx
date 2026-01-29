import { useCallback, useEffect, useState } from "react";
import { getProductReviews, createReview, deleteReview } from "./api";
import { Spinner } from "@/shared/components/Spinner";
import { Alert } from "@/shared/components/Alert";
import { ReviewListItem } from "./ReviewListItem";
import { useAuthState } from "@/shared/state/context";
import { useToast } from "@/shared/components/Toast";

export function ReviewList({ productId }) {
  const [reviews, setReviews] = useState({ content: [], page: 0, totalPages: 0 });
  const [apiProgress, setApiProgress] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const authState = useAuthState();
  const { addToast } = useToast();

  const fetchReviews = useCallback(async (page = 0) => {
    setApiProgress(true);
    setError(null);
    try {
      const response = await getProductReviews(productId, page);
      setReviews(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load reviews");
    } finally {
      setApiProgress(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createReview(productId, { rating, comment });
      setRating(5);
      setComment("");
      fetchReviews();
      addToast("Review added successfully!", "success");
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to add review", "danger");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      fetchReviews();
      addToast("Review deleted successfully!", "success");
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to delete review", "danger");
    }
  };

  return (
    <div className="mt-4">
      <h5>Customer Reviews</h5>

      {/* Review Form */}
      {authState.id > 0 && (
        <div className="card mb-3">
          <div className="card-body">
            <form onSubmit={handleSubmitReview}>
              <div className="mb-3">
                <label className="form-label">Rating</label>
                <div className="d-flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      role="button"
                      onClick={() => setRating(star)}
                      style={{ fontSize: "1.5rem", cursor: "pointer" }}
                    >
                      {star <= rating ? "⭐" : "☆"}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Comment</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write your review..."
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? <Spinner sm /> : "Submit Review"}
              </button>
            </form>
          </div>
        </div>
      )}

      {authState.id === 0 && (
        <Alert styleType="info">Please login to write a review</Alert>
      )}

      {/* Reviews List */}
      {apiProgress && (
        <div className="text-center">
          <Spinner />
        </div>
      )}
      {error && <Alert styleType="danger">{error}</Alert>}
      {!apiProgress && reviews.content.length === 0 && (
        <p className="text-muted">No reviews yet. Be the first to review!</p>
      )}
      {!apiProgress && reviews.content.length > 0 && (
        <div className="list-group">
          {reviews.content.map((review) => (
            <ReviewListItem
              key={review.id}
              review={review}
              onDelete={handleDeleteReview}
              currentUserId={authState.id}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {reviews.totalPages > 1 && (
        <nav className="mt-3">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${reviews.page === 0 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => fetchReviews(reviews.page - 1)}
                disabled={reviews.page === 0}
              >
                Previous
              </button>
            </li>
            <li className="page-item disabled">
              <span className="page-link">
                {reviews.page + 1} / {reviews.totalPages}
              </span>
            </li>
            <li
              className={`page-item ${
                reviews.page + 1 >= reviews.totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => fetchReviews(reviews.page + 1)}
                disabled={reviews.page + 1 >= reviews.totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
