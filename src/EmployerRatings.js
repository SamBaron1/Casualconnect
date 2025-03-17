import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EmployerRatings.css"; // Import the CSS file

const EmployerRatings = () => {
  const [reviews, setReviews] = useState([]);
  const [averageRatings, setAverageRatings] = useState({});

  
  useEffect(() => {
    const fetchReviews = async () => {
      try {     
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/reviews`);
        setReviews(response.data);

        const employerNames = [...new Set(response.data.map(review => review.employerName))];
        fetchAverageRatings(employerNames);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    const fetchAverageRatings = async (employerNames) => {
      try {
        const ratings = await Promise.all(
          employerNames.map(async (name) => {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/reviews/employer/${name}/average`);
            return { employerName: name, averageRating: response.data.averageRating };
          })
        );

        const ratingsMap = {};
        ratings.forEach(rating => {
          ratingsMap[rating.employerName] = rating.averageRating;
        });
        setAverageRatings(ratingsMap);
      } catch (error) {
        console.error("Error fetching average ratings:", error);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="employer-ratings-container">
      <h3>Employer Ratings</h3>
      {reviews.length > 0 ? (
        <ul>
          {reviews.map((review) => (
            <li key={review.id}>
              <strong>Employer: {review.employerName}</strong>
              <p>Rating: {review.rating} ⭐</p>
              <p>Average Rating: {parseFloat(averageRatings[review.employerName] || 0).toFixed(2)} ⭐</p>
              <p>{review.reviewText}</p>
              <small>{new Date(review.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p>No reviews yet.</p>
      )}
    </div>
  );
};

export default EmployerRatings;
