const express = require("express");
const { authenticateToken, isAdmin } = require("../middleware/authMiddleware");
const { getAdminDashboard, getDashboardStats, getAllUsers  } = require("../controllers/adminController");
const { login } = require("../controllers/authController");
const User = require("../models/user");
const { Op } = require("sequelize");
const { subscribe, unsubscribe, listSubscribers, sendNewsletter } = require('../controllers/newsletterController');
const reviewRoutes = require("./reviewRoutes");

const router = express.Router();

// Admin Login Route
router.post("/login", login);

// Fetch All Users
router.get("/users", authenticateToken, isAdmin, getAllUsers);

// Admin Dashboard Route
router.get("/admin-dashboard", authenticateToken, isAdmin, getAdminDashboard);
router.use("/admin/reviews", reviewRoutes);
router.post('/subscribe', authenticateToken, isAdmin, subscribe);
router.delete('/:email', authenticateToken, isAdmin, unsubscribe);
router.get('/', authenticateToken, isAdmin, listSubscribers);
router.post('/send', authenticateToken, isAdmin, sendNewsletter);

// Get All Users Route with Pagination and Search


exports.getAllUsers = async (req, res) => {
  try {
    // Extract query parameters with defaults
    const { page = 1, pageSize = 10, search = "", sortBy = "name", sortOrder = "ASC" } = req.query;

    // Validate page and pageSize
    const parsedPage = parseInt(page);
    const parsedPageSize = parseInt(pageSize);
    if (isNaN(parsedPage) || isNaN(parsedPageSize) || parsedPage < 1 || parsedPageSize < 1) {
      return res.status(400).json({ message: "Invalid page or pageSize values" });
    }

    // Calculate offset for pagination
    const offset = (parsedPage - 1) * parsedPageSize;

    // Fetch users with optional search, pagination, and sorting
    const { count, rows: users } = await User.findAndCountAll({
      where: {
        name: { [Op.iLike]: `%${search}%` }, // Case-insensitive search
      },
      attributes: ["id", "name", "email", "role", "companyName", "location"], // Exclude sensitive fields
      limit: parsedPageSize, // Limit results for pagination
      offset: offset, // Offset for pagination
      order: [[sortBy, sortOrder]], // Dynamic sorting
    });

    // Calculate total pages
    const totalPages = Math.ceil(count / parsedPageSize);

    res.status(200).json({
      users,
      totalUsers: count,
      totalPages,
      currentPage: parsedPage,
    });
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};

// Route to Fetch Dashboard Statistics
router.get("/stats", authenticateToken, isAdmin, getDashboardStats);

// Route to Delete a User
router.delete("/users/:id", authenticateToken, isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
  
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      await user.destroy();
  
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error.message);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });
  
module.exports = router;
