const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { User, Job, Notification, Application } = require('../models');
const { Op } = require('sequelize');

router.post('/', async (req, res) => {
  const { title, description, location, salary, jobType, requirements, benefits, employer_id } = req.body;
  
  try {
    const employer = await User.findByPk(employer_id);
    if (!employer) {
      console.error('Employer not found');
      return res.status(404).json({ error: 'Employer not found' });
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 20);

    console.log('Received job data:', req.body);
    const job = await Job.create({
      title,
      description,
      location,
      salary,
      jobType,
      requirements,
      benefits,
      employer_id,
      expiresAt,
      applicationCount: 0,
    });

    // Notify all jobseekers about the new job
    const io = req.app.get('io'); // Get Socket.IO instance
    io.emit('newJob', {
      message: `New job posted: ${title}`,
      job,
    });

    // Store notification in database (Optional)
    await Notification.create({
      title: 'New Job Posted',
      message: `A new job has been posted: ${title}`,
      userId: null, // This means it's a public notification for all
    });

    res.status(201).json(job);
  } catch (error) {
    console.error('Error posting job:', error);
    res.status(500).json({ error: 'Failed to post job' });
  }
});

// Apply for a job
router.post('/:userId/apply', async (req, res) => {
  const { userId } = req.params;
  const { jobId } = req.body;

  try {
    const application = await Application.create({
      job_id: jobId,
      user_id: userId,
      status: 'Pending',
    });

    // Update application count
    const job = await Job.findByPk(jobId);
    await job.increment('applicationCount');

    // Fetch employer details
    const employer = await User.findByPk(job.employer_id);
    if (!employer) {
      return res.status(500).json({ error: 'Employer not found' });
    }

    // Notify employer via database
    const notification = await Notification.create({
      userId: employer.id, // Employer gets notified
      title: 'New Job Application',
      message: `A new application for ${job.title} has been received.`,
    });

    // Emit real-time notification to the employer's room
    const io = req.app.get('io');
    io.to(`user_${employer.id}`).emit('notification', notification);

    res.status(201).json(application);
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({ error: 'Failed to apply for job' });
  }
});

// GET all active jobs with constraints
router.get('/jobs', async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query; // Default page=1, limit=5 jobs per page

    const offset = (page - 1) * limit; // Calculate offset for pagination

    const { count, rows: jobs } = await Job.findAndCountAll({
      attributes: [
        'id', 'title', 'description', 'location', 'salary', 
        'jobType', 'requirements', 'benefits', 'employer_id', 
        'expiresAt', 'applicationCount', 'createdAt', 'updatedAt'
      ],
      where: {
        expiresAt: { [Op.gt]: new Date() } // Only fetch active jobs
      },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']] // Show latest jobs first
    });

    res.json({
      totalJobs: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      jobs
    });
  } catch (error) {
    console.error('Error fetching paginated jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// GET all jobs
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all jobs...');
    const jobs = await Job.findAll({
      order: [['createdAt', 'DESC']], // Order by createdAt field in descending order
    });
    console.log('All jobs fetched successfully:', jobs);
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching all jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});


// GET jobs with optional search parameters
router.get("/jobs", async (req, res) => {
  try {
    let { search } = req.query;
    let sql = "SELECT * FROM jobs";
    let queryParams = [];

    // If there's a search term, modify the query
    if (search) {
      sql += ` WHERE title LIKE ? OR location LIKE ? OR jobType LIKE ?`;
      const searchTerm = `%${search}%`; // Allow partial matching
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    db.query(sql, queryParams, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database query failed" });
      }
      res.json(results);
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:jobId", async (req, res) => {
  const { jobId } = req.params;

  try {
    const job = await Job.findOne({ where: { id: jobId } });

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Delete the job
    await Job.destroy({ where: { id: jobId } });

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ error: "Failed to delete job" });
  }
});


module.exports = router;
