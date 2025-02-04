import React, { useState } from "react";
import axios from "axios";
import "./JobSeekerReview.css"; // Import the CSS file

const JobSeekerReview = ({ jobseekerId }) => {
  const [employerName, setEmployerName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/reviews", {
        employerName,
        jobseekerId,
        reviewText,
        rating,
      });

      setMessage("Review submitted successfully!");
      setEmployerName("");
      setReviewText("");
      setRating(5);
    } catch (error) {
      setMessage("Failed to submit review.");
      console.error(error);
    }
  };

  return (
    <div className="review-form-container">
      <h3>Leave a Review</h3>
      <form onSubmit={handleSubmit} className="review-form">
        <label>Employer Name:</label>
        <input
          type="text"
          value={employerName}
          onChange={(e) => setEmployerName(e.target.value)}
          required
        />
        <label>Rating:</label>
        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num} Stars
            </option>
          ))}
        </select>
        <label>Review:</label>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Please include the correct name and location of your employer for better rating"
        />
        <button type="submit">Submit Review</button>
      </form>
      {message && (
        <p className={`message ${message.includes("successfully") ? "success" : "error"}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default JobSeekerReview;
