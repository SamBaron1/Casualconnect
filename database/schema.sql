CREATE TABLE Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('jobseeker', 'employer') NOT NULL,
  companyName VARCHAR(255),       -- Optional for job seekers
  position VARCHAR(255),          -- Optional for job seekers
  companySize VARCHAR(255),       -- Optional for job seekers
  desiredJob VARCHAR(255),        -- Optional for employers
  location VARCHAR(255),          -- New column for both employers and job seekers
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(255),
  salary VARCHAR(255),
  jobType ENUM('Full-Time', 'Part-Time', 'Contract', 'Freelance'),
  requirements TEXT,
  benefits TEXT,
  employer_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employer_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id INT NOT NULL,
  jobseeker_id INT NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES Jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (jobseeker_id) REFERENCES Users(id) ON DELETE CASCADE
);


CREATE TABLE CVs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    file_path VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Newsletters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE JobPosts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    pay_range VARCHAR(50) NOT NULL,
    requirements TEXT NOT NULL,
    employer_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employer_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);


CREATE TABLE Reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employer_id INT NOT NULL,  -- Foreign Key referencing Users (the employer being reviewed)
    job_seeker_id INT NOT NULL,  -- Foreign Key referencing Users (the job seeker who wrote the review)
    rating INT CHECK (rating >= 1 AND rating <= 5),  -- Rating between 1 and 5
    comment TEXT,  -- Optional comment about the employer
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp for when the review was created
    FOREIGN KEY (employer_id) REFERENCES Users(id) ON DELETE CASCADE,  -- Delete reviews if the employer is deleted
    FOREIGN KEY (job_seeker_id) REFERENCES Users(id) ON DELETE CASCADE  -- Delete reviews if the job seeker is deleted
);

CREATE TABLE Messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,  -- Foreign Key referencing Users (the sender of the message)
    receiver_id INT NOT NULL,  -- Foreign Key referencing Users (the receiver of the message)
    message TEXT NOT NULL,  -- The content of the message
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp for when the message was sent
    FOREIGN KEY (sender_id) REFERENCES Users(id) ON DELETE CASCADE,  -- Delete messages if the sender is deleted
    FOREIGN KEY (receiver_id) REFERENCES Users(id) ON DELETE CASCADE  -- Delete messages if the receiver is deleted
);

CREATE TABLE Settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,  -- Foreign Key referencing Users (the user whose settings are stored)
    setting_key VARCHAR(255) NOT NULL,  -- The key for the setting (e.g., 'email_notifications')
    setting_value VARCHAR(255) NOT NULL,  -- The value for the setting (e.g., 'true' or 'false')
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp for when the setting was created
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  -- Timestamp for when the setting was last updated
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE  -- Delete settings if the user is deleted
);


CREATE TABLE SavedJobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    user_id INT NOT NULL,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES Jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);


