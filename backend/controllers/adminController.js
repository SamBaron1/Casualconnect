const User = require("../models/user"); // Replace with the actual path to your User model
const Job = require("../models/job");   // Replace with your Job model
const Newsletter = require("../models/newsletterSubscriber"); // Replace with your Subscriber model
const sequelize = require('../config/database');    // Your Sequelize instance (if applicable)
const { Op } = require("sequelize");


// Get All Users without Pagination
exports.getAllUsers = async (req, res) => {
  try {
    const { search = "", sortBy = "name", sortOrder = "ASC" } = req.query;

    const users = await User.findAll({
      where: {
        name: { [Op.like]: `%${search}%` }, // Use LIKE for MySQL compatibility
      },
      attributes: ["id", "name", "email", "role", "companyName", "location"], // Exclude sensitive fields
      order: [[sortBy, sortOrder]], // Dynamic sorting
    });

    res.status(200).json({ users }); // Return all users without pagination
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};

exports.getAdminDashboard = (req, res) => {
    res.status(200).json({
      message: "Welcome to the Admin Dashboard!",
      user: req.user, // This contains the decoded token data (from middleware)
    });
  };
  

  exports.getDashboardStats = async (req, res) => {
    try {
      console.log("Fetching dashboard stats...");
  
      // Fetch total users
      const totalUsers = await User.count();
  
      // Fetch total jobs
      const totalJobs = await Job.count();
  
      // Fetch active users in the last 30 days
      const [results] = await sequelize.query(`
        SELECT COUNT(*) AS activeUsers 
        FROM users 
        WHERE updatedAt >= NOW() - INTERVAL 30 DAY
      `);
      
  
      const activeUsers = results[0]?.activeUsers || 0;
  
      // Fetch newsletter subscribers
      const newsletterSubscribers = await Newsletter.count();
  
      res.status(200).json({
        totalUsers,
        totalJobs,
        activeUsers,
        newsletterSubscribers,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard statistics", error: error.message });
    }
  };


