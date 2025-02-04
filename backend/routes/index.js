const express = require('express');
const authRoutes = require('./authRoutes');
const jobRoutes = require('./jobRoutes');
const notificationRoutes = require('./notificationRoutes');
const jobseekerRoutes = require('./jobseekerRoutes');
const employerRoutes = require('./employerRoutes');
const newsletterRoutes = require('./newsletterRoutes');
const profileRoutes = require('./profileRoutes'); 


const router = express.Router();

// Use specific routes
router.use('/auth', authRoutes);
router.use('/jobs', jobRoutes);
router.use('/notifications', notificationRoutes);
router.use('/jobseeker', jobseekerRoutes); // Distinct path for jobseeker routes
router.use('/employer', employerRoutes);   // Distinct path for employer routes
router.use('/newsletter', newsletterRoutes);
router.use('/users', profileRoutes);


module.exports = router; // Ensure this exports the router correctly
