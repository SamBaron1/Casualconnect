import React, { useState, useEffect } from "react";
import "./ReviewsAndRatings.css";

const ReviewsAndRatings = () => {
  const [reviews, setReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [reviewsPerPage] = useState(10); // Number of reviews per page

  // Fetch all reviews from the backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized! Please log in.");
      return;
    }

    fetch("http://localhost:5000/api/reviews", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched reviews:", data); // Debugging log
        setReviews(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching reviews:", err.message);
        setError(err.message);
      });
  }, []);

  // Filter reviews based on search query
  const filteredReviews = searchQuery
    ? reviews.filter((review) =>
        review.reviewee_name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : reviews; // Show all reviews when there's no search query

  // Pagination logic
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Go to next page
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredReviews.length / reviewsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Delete a review
  const handleDeleteReview = (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized! Please log in.");
      return;
    }

    fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete review.");
        }
        alert("Review deleted!");
        setReviews((prev) => prev.filter((review) => review.id !== reviewId));
        setError(null);
      })
      .catch((err) => {
        console.error("Error deleting review:", err.message);
        setError(err.message);
      });
  };

  return (
    <div className="reviews-and-ratings">
      <h2>Reviews & Ratings</h2>
      {error && <p className="error-message">{error}</p>} {/* Display error messages */}

      {/* Search Reviews */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Reviews by User Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Reviews List */}
      <div className="table-responsive">
        <table className="reviews-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Jobseeker ID</th>
              <th>Employer Name</th>
              <th>Review Text</th>
              <th>Rating</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentReviews.map((review) => (
              <tr key={review.id}>
                <td>{review.id}</td>
                <td>{review.jobseekerId}</td>
                <td>{review.employerName}</td>
                <td>{review.reviewText}</td>
                <td>{review.rating}</td>
                <td>{new Date(review.createdAt).toLocaleString()}</td>
                <td>
                  <button
                    className="btn delete"
                    onClick={() => handleDeleteReview(review.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          onClick={prevPage}
          disabled={currentPage === 1} // Disable "Previous" button on the first page
        >
          Previous
        </button>
        {Array.from(
          { length: Math.ceil(filteredReviews.length / reviewsPerPage) },
          (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          )
        )}
        <button
          onClick={nextPage}
          disabled={
            currentPage === Math.ceil(filteredReviews.length / reviewsPerPage)
          } // Disable "Next" button on the last page
        >
          Next
        </button>
      </div>

      {/* No Reviews Messages */}
      {reviews.length === 0 && !error && <p className="no-reviews">No reviews available.</p>}
      {reviews.length > 0 && filteredReviews.length === 0 && (
        <p className="no-reviews">No reviews match your search.</p>
      )}
    </div>
  );
};

export default ReviewsAndRatings;