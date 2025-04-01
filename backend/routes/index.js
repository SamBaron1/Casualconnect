const express = require('express');
const authRoutes = require('./authRoutes');
const jobRoutes = require('./jobRoutes');
const notificationRoutes = require('./notificationRoutes');
const jobseekerRoutes = require('./jobseekerRoutes');
const employerRoutes = require('./employerRoutes');
const newsletterRoutes = require('./newsletterRoutes');
const profileRoutes = require('./profileRoutes'); 
const AdminRoute = require('./AdminRoute');
const pushNotificationRoutes = require('./pushNotificationRoutes'); 

const router = express.Router();

// Use specific routes
router.use('/auth', authRoutes);
router.use('/jobs', jobRoutes);
router.use('/notifications', notificationRoutes);
router.use('/jobseeker', jobseekerRoutes); // Distinct path for jobseeker routes
router.use('/employer', employerRoutes);   // Distinct path for employer routes
router.use('/admin/newsletter', newsletterRoutes);
router.use('/users', profileRoutes);
router.use('/admin', AdminRoute);
router.use('/push', pushNotificationRoutes);

module.exports = router; // Ensure this exports the router correctly
