export function ReviewListItem({ review, onDelete, currentUserId }) {
  const renderStars = (rating) => {
    return "⭐".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <div className="list-group-item">
      <div className="d-flex justify-content-between align-items-start">
        <div className="flex-grow-1">
          <div className="d-flex justify-content-between">
            <h6 className="mb-1">{review.userName}</h6>
            <small className="text-muted">
              {new Date(review.createdDate).toLocaleDateString()}
            </small>
          </div>
          <div className="mb-2" style={{ fontSize: "1.1rem" }}>
            {renderStars(review.rating)}
          </div>
          {review.comment && <p className="mb-1">{review.comment}</p>}
        </div>
        {currentUserId === review.userId && (
          <button
            className="btn btn-outline-danger btn-sm ms-2"
            onClick={() => onDelete(review.id)}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
