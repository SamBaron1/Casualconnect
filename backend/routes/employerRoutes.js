const express = require('express');
const router = express.Router();
const { Job, Application, User, Notification } = require('../models'); // Ensure Message and Notification are imported
const { Op } = require('sequelize');
const { sendNotification } = require("../config/socket");
console.log("sendNotification function:", sendNotification);

// GET paginated jobs posted by the logged-in employer
router.get('/:employerId/jobs', async (req, res) => {
  const employerId = req.params.employerId;
  const page = parseInt(req.query.page) || 1; // Get page number, default to 1
  const pageSize = parseInt(req.query.pageSize) || 5; // Default page size is 5
  const offset = (page - 1) * pageSize;

  try {
    const { count, rows: jobs } = await Job.findAndCountAll({
      where: { employer_id: employerId },
      limit: pageSize,
      offset: offset,
      order: [['createdAt', 'DESC']], // Order by newest jobs first
    });

    res.json({
      jobs,
      totalJobs: count,
      totalPages: Math.ceil(count / pageSize),
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});


// Get job applications for an employer
router.get('/:employerId/applications', async (req, res) => {
  const { employerId } = req.params;
  console.log(`Fetching applications for employerId: ${employerId}`); // Log employerId

  try {
    const applications = await Application.findAll({
      include: [
        { model: Job, where: { employer_id: employerId }, attributes: ['title', 'description'] },
        { model: User, attributes: ['name'] },
      ],
      where: {
        status: { [Op.or]: ['Accepted', 'Pending'] }  // Filter by multiple statuses
      },
      order: [['createdAt', 'DESC']] // Add this line to sort by latest first
    });
    console.log('Retrieved applications:', applications); // Log retrieved applications
    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});



router.post('/:employerId/applications/:applicationId', async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body;

  try {
    const application = await Application.findByPk(applicationId);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    application.status = status;
    await application.save();

    const jobseeker = await User.findByPk(application.user_id);
    if (!jobseeker) {
      return res.status(500).json({ error: "Jobseeker not found" });
    }

    const job = await Job.findByPk(application.job_id);
    if (!job) {
      return res.status(500).json({ error: "Job not found" });
    }

    const employer = await User.findByPk(job.employer_id);
    if (!employer) {
      return res.status(500).json({ error: "Employer not found" });
    }

    // Prepare notification message based on status
    let notificationMessage;
    if (status === 'Accepted') {
      notificationMessage = `
        Dear ${jobseeker.name},

        Congratulations! Your application for the job "${job.title}" has been accepted.

        Please respond with your updated CV at your earliest convenience to my email: "${employer.email}".

        Best regards,
        ${employer.name}
      `;
    } else if (status === 'Rejected') {
      notificationMessage = `
        Dear ${jobseeker.name},

        We regret to inform you that your application for the job "${job.title}" has been rejected.

        Thank you for your interest in our company.

        Best regards,
        ${employer.name}
      `;
    } else {
      notificationMessage = `
        Dear ${jobseeker.name},

        Your application for the job "${job.title}" has been updated to: ${status}.

        Best regards,
        ${employer.name}
      `;
    }

    // Save notification in the database
    const notification = await Notification.create({
      userId: jobseeker.id,
      jobId: job.id,
      title: "Job Application Update",
      message: notificationMessage,
    });

    // Emit notification to the jobseeker in real-time
    console.log(typeof sendNotification); // Should print 'function'
    sendNotification(jobseeker.id, {
      title: "Job Application Update",
      message: notificationMessage,
      jobId: job.id,
      createdAt: new Date().toISOString(),
    });

    res.json({
      id: application.id,
      job_id: application.job_id,
      user_id: application.user_id,
      employer_id: job.employer_id,
      status: application.status,
      notification,
    });

  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ error: "Failed to update application status" });
  }
});
module.exports = router;