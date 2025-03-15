// routes/reviewRoutes.js
const express = require("express");
const router = express.Router();
const { Review } = require("../models");

// Create a review (Job seeker posts review for employer by name)
router.post("/", async (req, res) => {
  try {
    const { employerName, jobseekerId, reviewText, rating } = req.body;


    console.log('Received Data:', { employerName, jobseekerId, reviewText, rating });

    const newReview = await Review.create({
      employerName,
      jobseekerId,
      reviewText,
      rating,
    });

    res.status(201).json(newReview);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ error: "Failed to submit review" });
  }
});

// Get all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// Get all reviews for a specific employer by name
router.get("/:employerName", async (req, res) => {
  try {
    const employerName = req.params.employerName;
    const reviews = await Review.findAll({
      where: { employerName },
      order: [["createdAt", "DESC"]],
    });

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});
//  Get Average Employer Rating
router.get("/employer/:employerName/average", async (req, res) => {
    try {
      const { employerName } = req.params;
      const reviews = await Review.findAll({ where: { employerName } });
  
      if (reviews.length === 0) {
        return res.json({ averageRating: 0 });
      }
  
      const averageRating =
        reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  
      res.json({ employerName, averageRating: averageRating.toFixed(2) });
    } catch (error) {
      console.error("Error fetching average rating:", error);
      res.status(500).json({ error: "Failed to fetch average rating" });
    }
  });
  
  // Delete a review by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    await review.destroy();
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Failed to delete review" });
  }
});


module.exports = router;
