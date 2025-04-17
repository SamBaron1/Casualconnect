# 💼 CasualConnect – Bridging Employers & Casual Workers**

## 🧠 Overview

**CasualConnect** is a responsive web platform that connects employers with casual workers across various job types. Built with a focus on real-time interaction, accessibility, and ease of use, it streamlines the entire job engagement process from posting to completion and feedback.

---
## Prerequisites
Before setting up the project, ensure you have the following software and tools, and APIs installed:

## 🧰 Software & Tools Needed
Node.js (v14 or higher)

MySQL server and Workbench(v8.0 or higher)

Postman (for API testing)

Git (version control)

VS Code

Browser to view the Website(preferrably Google Chrome)

Gmail (nodemailer)

DevTunnels- Development hosting & tunneling (3000 & 5000 ports) accesible in VS Code  

---


## APIs / Libraries / Dependencies Used
These are **third-party Node.js packages or browser APIs** that the project depends on to run properly. 

## 📦 Project Dependencies

The following libraries/APIs are required to run this project:

Package & Description 

 `react`, `react-dom`  Frontend rendering using React.js 
 `express`  Backend framework for Node.js 
 `mysql2`, `sequelize`  MySQL database integration and ORM 
 `socket.io`, `socket.io-client`  Real-time communication via WebSockets 
 `ws`  WebSocket server module for Node.js 
 `nodemailer`  Sending emails (used for password reset & communication) 
 `web-push`  Push notification service (VAPID-based) 
 `jsonwebtoken`  JWT token-based user authentication 
 `bcryptjs`  Password hashing and verification 
 `cors`, `dotenv`, `body-parser`  Server middleware for environment config and data handling 

To install all dependencies:

```bash
npm install
```

To install all backend packages:
```bash
npm install express mysql2 sequelize jsonwebtoken bcryptjs dotenv cors body-parser socket.io ws nodemailer web-push
```
To install frontend packages:
```bash
npm install socket.io-client axios
```

---


## 🧰 Setup Instructions

**Clone the repository**
   ```bash
   git clone https://github.com/SamBaron1/Casualconnect.git
   cd casualconnect
```

### 1. **Frontend Setup** Install all Dependencies, Packages & Launch
on the terminal 
```bash
cd ..
npm install
npm install socket.io-client axios
npm start
```

### 2. **Backend Setup** Install all Dependencies, Packages & Launch
Open new terminal(split the terminal)
```bash
cd backend
npm install
npm install express mysql2 sequelize jsonwebtoken bcryptjs dotenv cors body-parser socket.io ws nodemailer web-push
npm node server.js
```

### 3. 🗃️ Database Setup

- MySQL server and workbench must be installed locally.
- Create the tables in the schema using the MySQL WORKBENCH and name the database as casualconnect.
- Make sure database credentials in `.env` match your MySQL config.

```bash
CREATE DATABASE casualconnect;
```
Tables are provided in the `casualconnect\database\schema` file

---

### 4. Environment Variables Setup `.env` 

```env backend
JWT_SECRET=2d69c4a337383ae5660f2dda62419a0f2948ae35a15e774064ad70fd9148910d13acbc6ba8c64007872d6cdbed39c1dcc42ec89076b21b8754db14fc49308a78
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=Samm@2001
DB_NAME=casualconnect
DB_PORT=3306
EMAIL=samuelng0001@gmail.com
EMAIL_PASSWORD=smht abui zfns cigi
ADMIN_PASSWORD=Samm2001
# Server Port
PORT=5000
FRONTEND_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3000
VAPID_PUBLIC_KEY=BPRVYlTEv4AwCzujZSbgTu0QSQr810Oed6WOEqFC0VyrQh-CXJJVK3KcSAVfnG62VV2PypchPL_76_80w7yzLos
VAPID_PRIVATE_KEY= tGcuNT1LgIVyEWqVAvpJzhJwJTQ42ZkHj41xb4qIPf0
```

```env root
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

Then start:

```bash
npm run dev
```

---
### 5. Using DevTunnels
Replace localhost with your DevTunnel URLs for testing:
Change visibility to public

Frontend runs on: `https://16kxld3c-3000.inc1.devtunnels.ms/`  
Backend runs on: `https://16kxld3c-5000.inc1.devtunnels.ms/`

Ensure APIs and WebSockets are pointed to DevTunnel endpoints.

---

### 6. 📩 Email Setup (Nodemailer)

- Create a Gmail or SMTP-compatible email account.
- Enable **less secure apps** or use an **app password**.
- Add credentials to `.env`.

---

### 7. 🔔 Push Notifications Setup

Generate your **VAPID keys** [here](https://web-push-codelab.glitch.me/) and add to `.env`.

Frontend uses **Service Workers** to subscribe and receive notifications.

---

## 🧪 Testing Credentials

Admin Login:
Email: admin@gmail.com
Password: Samm@2001

Employer:
Email: Samuelng0001@gmail.com
Password: 1234

Job Seeker:
Email: murimi@gmail.com
Password: 1234


## 🔗 API Overview

The following RESTful APIs power the **CasualConnect** platform. All endpoints are prefixed with:

BASE_URL = http://localhost:5000/api


You can test them using tools like **Postman**.

---

### 🔐 Authentication APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/auth/signup`            | Register a new user |
| POST   | `/auth/login`             | Log in user and receive JWT |
| POST   | `/auth/send-reset-link`   | Send password reset link via email |
| POST   | `/auth/reset-password`    | Reset user password |

---

### 👤 Admin APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/admin/users`            | Fetch all users |
| GET    | `/admin/stats`            | Fetch dashboard analytics |
| DELETE | `/admin/users/:id`        | Delete a user |
| POST   | `/admin/newsletter/subscribe` | Subscribe user to newsletter |

---

### 💼 Job APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/jobs`                     | Create a new job post |
| GET    | `/jobs`                     | Retrieve all job listings |
| DELETE | `/jobs/:jobId`              | Delete a job by ID |

---

### 🧑‍💼 Employer APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/employer/:employerId/jobs`                        | Get paginated jobs by employer |
| DELETE | `/employer/:employerId/jobs/:jobId`                 | Delete a job post |
| GET    | `/employer/:employerId/applications`                | Get all job applications |
| POST   | `/employer/:employerId/applications/:applicationId`| Accept or reject job application |

---

### 🧑‍🎓 Jobseeker APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/jobseeker/:userId/info`       | Get jobseeker's profile info |
| GET    | `/jobseeker/:userId/jobs`       | Get jobs matching jobseeker's location |
| GET    | `/jobseeker/:userId/applications` | Get jobseeker's applications |
| POST   | `/jobseeker/:userId/apply`      | Apply for a job |
| POST   | `/jobseeker/:userId/save`       | Save a job to favorites |
| GET    | `/jobseeker/:userId/saved-jobs` | View saved jobs |

---

### 📨 Newsletter APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/admin/newsletter/subscribe` | Subscribe to newsletter |
| DELETE | `/admin/newsletter/:email`    | Remove a subscriber |
| GET    | `/admin/newsletter/`          | View all subscribers |
| POST   | `/admin/newsletter/send`      | Send newsletter to all subscribers |

---

### 🔔 Notification APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/notifications/:userId`                    | Get user notifications |
| POST   | `/notifications/:userId/notifications`      | Create and send notification |
| DELETE | `/notifications/:notificationId`            | Delete a specific notification |
| DELETE | `/notifications/user/:userId`               | Delete all notifications for user |

---

### 📳 Push Notification APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/push/sendPushNotification` | Test route for sending push notifications |

---

### ⭐ Reviews & Ratings APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/users/`                     | Post a review for an employer |
| GET    | `/users/`                     | Get all reviews |
| GET    | `/users/:employerName`        | Get reviews for a specific employer |
| GET    | `/employer/:employerName/average` | Get average rating of employer |
| DELETE | `/users/:id`                  | Delete a review by ID |



