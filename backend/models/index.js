
const sequelize = require('../config/database');

const User = require('./user');
const Job = require('./job');
const Notification = require('./Notification');
const Application = require('./Application');
const SavedJob = require('./SavedJob');
const Review = require('./Review'); // Import the Review model
const PushSubscription = require('./pushSubscription');
const Newsletter = require('./newsletterSubscriber');


// Set up associations
User.hasMany(Job, { foreignKey: 'employer_id', onDelete: 'CASCADE' });
Job.belongsTo(User, { foreignKey: 'employer_id' });


User.hasMany(Notification, { foreignKey: 'userId', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'userId' });

Notification.belongsTo(Job, { foreignKey: 'jobId' });

Job.hasMany(Application, { foreignKey: 'job_id', onDelete: 'CASCADE' });
Application.belongsTo(Job, { foreignKey: 'job_id' });
User.hasMany(Application, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Application.belongsTo(User, { foreignKey: 'user_id' });

Job.hasMany(SavedJob, { foreignKey: 'job_id', onDelete: 'CASCADE' });
SavedJob.belongsTo(Job, { foreignKey: 'job_id' });
User.hasMany(SavedJob, { foreignKey: 'user_id', onDelete: 'CASCADE' });
SavedJob.belongsTo(User, { foreignKey: 'user_id' });

Newsletter.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasMany(Newsletter, { foreignKey: "userId", onDelete: "CASCADE" });

// Associate Review with User (jobseekerId)
User.hasMany(Review, { foreignKey: 'jobseekerId', onDelete: 'CASCADE' });
Review.belongsTo(User, { foreignKey: 'jobseekerId' });

module.exports = {
  sequelize,
  User,
  Job,
  Notification,
  Application,
  Newsletter,
  SavedJob,
  Review,
  PushSubscription,
};
