const express = require('express');
const router = express.Router();
const { User, Job, Application, SavedJob, Notification } = require('../models');
const { sendNotification } = require("../config/socket");


// Log models to verify they are imported correctly
console.log('Models:', { User, Job, Application, SavedJob });

// GET jobseeker info including location
router.get('/:userId/info', async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findOne({
      where: { id: userId },
      attributes: ['id', 'name', 'location'],
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ error: 'Failed to fetch user info' });
  }
});

// GET jobs matching the jobseeker's location
router.get('/:userId/jobs', async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findOne({
      where: { id: userId },
      attributes: ['location'],
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const jobs = await Job.findAll({
      where: { location: user.location },
      attributes: ['id', 'title', 'description', 'location', 'createdAt'],
      order: [['createdAt', 'DESC']], // Order by latest jobs first
    });
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Get job applications for a jobseeker
router.get('/:userId/applications', async (req, res) => {
  const { userId } = req.params;

  try {
    console.log(`Fetching applications for userId: ${userId}`); // Log userId
    const applications = await Application.findAll({
      where: { user_id: userId },
      include: [{ model: Job, attributes: ['title', 'description'] }],
      order: [['createdAt', 'DESC']],
    });
    console.log('Retrieved applications:', applications); // Log retrieved applications
    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications', message: error.message });
  }
});

// Apply for a job
router.post('/:userId/apply', async (req, res) => {
  const { userId } = req.params;
  const { jobId } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user || user.role !== 'jobseeker') {
      return res.status(403).json({ error: 'Only job seekers can apply for jobs' });
    }

    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if the jobseeker has already applied for this job
    const existingApplication = await Application.findOne({
      where: { job_id: jobId, user_id: userId },
    });
    if (existingApplication) {
      return res.status(400).json({ error: 'You have already applied for this job' });
    }

    const employerId = job.employer_id; // Retrieve employer ID from the job

    const application = await Application.create({
      job_id: jobId,
      user_id: userId,
      employer_id: employerId,
      status: 'Pending',
    });

    // Update application count
    console.log(`Incrementing application count for job: ${job.title}`);
    await job.increment('applicationCount');

    // Retrieve employer details
    const employer = await User.findByPk(employerId);
    if (!employer) {
      return res.status(500).json({ error: 'Employer not found' });
    }

    // Notification message
    const notificationMessage = `${user.name} has applied for your job "${job.title}".`;

    // Save notification in the database
    await Notification.create({
      userId: employer.id,
      jobId: job.id,
      title: "New Job Application",
      message: notificationMessage,
    });

    // Send real-time notification
    console.log(typeof sendNotification); // Should print 'function'
    sendNotification(employer.id, {
      title: "New Job Application",
      message: notificationMessage,
      jobId: job.id,
    });

    console.log(`Notification sent to Employer ${employer.email}: ${notificationMessage}`);

    // Return the application data and a success message
    res.status(201).json({ message: "Job application submitted successfully", application });
  } catch (error) {
    console.error('Error applying for job:', error);

    let errorMessage = 'Failed to apply for job. Please try again.';
    if (error.message.includes('Only job seekers can apply for jobs')) {
      errorMessage = 'Only job seekers can apply for jobs.';
    } else if (error.message.includes('Job not found')) {
      errorMessage = 'The job you are trying to apply for does not exist.';
    } else if (error.message.includes('You have already applied for this job')) {
      errorMessage = 'You have already applied for this job.';
    }

    res.status(500).json({ error: errorMessage, message: error.message });
  }
});


// Save a job
router.post('/:userId/save', async (req, res) => {
  const { userId } = req.params;
  const { jobId } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user || user.role !== 'jobseeker') {
      return res.status(403).json({ error: 'Only job seekers can save jobs' });
    }

    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if the jobseeker has already saved this job
    const existingSavedJob = await SavedJob.findOne({
      where: { job_id: jobId, user_id: userId },
    });
    if (existingSavedJob) {
      return res.status(400).json({ error: 'You have already saved this job' });
    }

    const savedJob = await SavedJob.create({
      job_id: jobId,
      user_id: userId,
    });

    res.status(201).json(savedJob);
  } catch (error) {
    console.error('Error saving job:', error);

    let errorMessage = 'Failed to save job. Please try again.';
    if (error.message.includes('Only job seekers can save jobs')) {
      errorMessage = 'Only job seekers can save jobs.';
    } else if (error.message.includes('Job not found')) {
      errorMessage = 'The job you are trying to save does not exist.';
    } else if (error.message.includes('You have already saved this job')) {
      errorMessage = 'You have already saved this job.';
    }

    res.status(500).json({ error: errorMessage, message: error.message });
  }
});



// Get saved jobs for a jobseeker
router.get('/:userId/saved-jobs', async (req, res) => {
  const { userId } = req.params;

  try {
    console.log(`Fetching saved jobs for userId: ${userId}`); // Log userId
    const savedJobs = await SavedJob.findAll({
      where: { user_id: userId },
      include: [{ model: Job, attributes: ['title', 'description', 'createdAt'] }],
      order: [['createdAt', 'DESC']], // Add this line to sort by latest first
    });
    console.log('Retrieved saved jobs:', savedJobs); // Log retrieved saved jobs
    res.json(savedJobs);
  } catch (error) {
    console.error('Error fetching saved jobs:', error);
    res.status(500).json({ error: 'Failed to fetch saved jobs', message: error.message });
  }
});


module.exports = router;
