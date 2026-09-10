# TaskFlow — MERN Task Management System

A full-stack **Task Management System** built with the **MERN Stack** for the **MERN Stack Intern Technical Assessment at Xplore Intellects**.

TaskFlow provides separate **Admin** and **Employee** experiences with JWT authentication, role-based access control, task assignment, status management, email notifications, backend search, server-side pagination, dashboard statistics, validation, error handling, and a responsive SaaS-style interface.

---

## ✨ Features

### 🔐 Authentication & Security

* JWT-based authentication
* Password hashing using `bcryptjs`
* Protected frontend routes
* Backend authentication middleware
* Role-based authorization
* Admin and Employee permissions
* Task ownership verification
* Environment-based secret configuration
* Centralized API error handling

### 👨‍💼 Admin Module

Admins can:

* Login securely
* View the employee list
* Create employees
* Update employee information
* Delete employees
* Assign tasks to employees
* Set task priority
* View all assigned tasks
* Search tasks
* Navigate tasks using server-side pagination
* View aggregated task statistics
* Receive email notifications when employees update task status

> **Note:** Employee CRUD is an additional feature implemented in this project. The assessment specifically requires the Admin to be able to view employees and assign tasks to them.

### 👨‍💻 Employee Module

Employees can:

* Login securely
* Access their personal dashboard
* View only tasks assigned to them
* View task details
* Update task status
* Receive email notifications when a new task is assigned
* See their current task progress

### 📊 Dashboard Statistics

The Admin dashboard displays real database-driven task statistics:

* **Not Started**
* **Pending / In Progress**
* **Completed**

Statistics are calculated from MongoDB rather than using hard-coded values.

### 📝 Task Management

Each task contains:

* Task title
* Task description
* Assigned employee
* Priority
* Status
* Created date
* Updated date

Supported priorities:

* High
* Medium
* Low

Supported statuses:

* Not Started
* Pending
* In Progress
* Completed

### ✉️ Email Notifications

TaskFlow integrates **Nodemailer** for automated email communication.

#### Task Assignment

When an Admin assigns a task:

```text
Admin
  ↓
Create Task
  ↓
Task saved to MongoDB
  ↓
Email sent to Employee
```

#### Status Update

When an Employee changes a task status:

```text
Employee
  ↓
Update Task Status
  ↓
Task updated in MongoDB
  ↓
Email sent to Admin
```

### 🔎 Search & Pagination

Admin task listing supports:

* Search by task title
* Search by employee name
* Server-side pagination
* Configurable page size
* Total task count
* Total page count

Example:

```http
GET /api/tasks?page=1&limit=10&search=login
```

### 🎨 Responsive SaaS UI

The frontend uses a clean productivity-focused SaaS design featuring:

* Modern dashboard layout
* Sidebar navigation
* Responsive mobile drawer
* Dashboard statistic cards
* Clean data tables
* Status badges
* Priority badges
* Modal-based forms
* Toast notifications
* Loading states
* Empty states
* Error states
* Responsive layouts

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Vite
* Axios
* React Router DOM
* Lucide React
* Custom CSS Design System

## Backend

* Node.js
* Express.js
* Mongoose
* JWT (`jsonwebtoken`)
* `bcryptjs`
* Nodemailer
* CORS
* `dotenv`

## Database

* MongoDB
* Mongoose ODM

---

# 🏗️ Architecture

TaskFlow follows a separated frontend/backend architecture.

```text
                    ┌─────────────────────┐
                    │      React.js       │
                    │      Frontend       │
                    └──────────┬──────────┘
                               │
                             Axios
                               │
                               ▼
                    ┌─────────────────────┐
                    │     Express.js      │
                    │       REST API      │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                 ▼                           ▼
        ┌─────────────────┐         ┌─────────────────┐
        │    MongoDB      │         │    Nodemailer   │
        │  Task / Users   │         │ Email Service   │
        └─────────────────┘         └─────────────────┘
```

---

# 📁 Project Structure

```text
Task_Management_Xplore/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AssignTaskModal.jsx
│   │   │   ├── EmployeeModal.jsx
│   │   │   └── Toast.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Employees.jsx
│   │   │   ├── Tasks.jsx
│   │   │   ├── EmployeeDashboard.jsx
│   │   │   ├── MyTasks.jsx
│   │   │   ├── Forbidden.jsx
│   │   │   └── NotFound.jsx
│   │   │
│   │   ├── routes/
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── employeeController.js
│   │   └── taskController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── employeeRoutes.js
│   │   └── taskRoutes.js
│   │
│   ├── scripts/
│   │   └── seed.js
│   │
│   ├── services/
│   │   └── emailService.js
│   │
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
├── .gitignore
├── package.json
└── README.md
```

---

# 👥 User Roles & Permissions

| Feature                       | Admin | Employee |
| ----------------------------- | :---: | :------: |
| Login                         |   ✅   |     ✅    |
| View employees                |   ✅   |     ❌    |
| Create employee               |   ✅   |     ❌    |
| Update employee               |   ✅   |     ❌    |
| Delete employee               |   ✅   |     ❌    |
| Assign task                   |   ✅   |     ❌    |
| View all tasks                |   ✅   |     ❌    |
| Search tasks                  |   ✅   |     ❌    |
| Paginate tasks                |   ✅   |     ❌    |
| View dashboard statistics     |   ✅   |     ❌    |
| View assigned tasks           |   ❌   |     ✅    |
| Update assigned task status   |   ❌   |     ✅    |
| Receive task assignment email |   ❌   |     ✅    |
| Receive status update email   |   ✅   |     ❌    |

All permissions are enforced on the **backend**, not only through frontend UI restrictions.

---

# 🔑 Demo Credentials

Run the seed script to create the demo users.

```bash
npm run seed
```

| Role     | Name         | Email                     | Password        |
| -------- | ------------ | ------------------------- | --------------- |
| Admin    | System Admin | `admin@taskflow.com`      | `AdminPass123!` |
| Employee | John Doe     | `john.doe@taskflow.com`   | `EmpPass123!`   |
| Employee | Jane Smith   | `jane.smith@taskflow.com` | `EmpPass123!`   |

> These credentials are intended for local development/demo purposes. Do not use them in production.

---

# ⚙️ Environment Variables

Create:

```text
server/.env
```

based on:

```text
server/.env.example
```

Example:

```env
PORT=5000

MONGO_URI=mongodb://127.0.0.1:27017/taskflow

JWT_SECRET=replace_with_a_secure_random_secret

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

ADMIN_EMAIL=admin@taskflow.com

CLIENT_URL=http://localhost:5173
```

## Environment Variable Description

| Variable      | Description                           |
| ------------- | ------------------------------------- |
| `PORT`        | Backend server port                   |
| `MONGO_URI`   | MongoDB connection string             |
| `JWT_SECRET`  | Secret used to sign JWT tokens        |
| `EMAIL_USER`  | Email account used by Nodemailer      |
| `EMAIL_PASS`  | Email app password                    |
| `ADMIN_EMAIL` | Admin email address for notifications |
| `CLIENT_URL`  | Frontend URL used for CORS            |

### Important

Never commit:

```text
.env
```

to GitHub.

Only commit:

```text
.env.example
```

---

# 📧 Gmail / Nodemailer Setup

If Gmail is used for email notifications, use a **Google App Password** rather than your normal Gmail password.

Configure:

```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_character_app_password
```

The email account is used to send:

### Employee Notification

When Admin assigns a task.

### Admin Notification

When Employee updates a task status.

If email configuration is missing, the application should handle the failure gracefully without exposing sensitive SMTP information to the client.

---

# 🚀 Installation

## 1. Clone the Repository

```bash
git clone <repository_url>
```

Navigate into the project:

```bash
cd Task_Management_Xplore
```

---

## 2. Install Dependencies

Install all dependencies:

```bash
npm run install:all
```

If the project does not provide this script, install dependencies manually:

```bash
cd server
npm install

cd ../client
npm install
```

---

# 🗄️ MongoDB Setup

TaskFlow requires MongoDB.

You can use:

### Local MongoDB

Default connection:

```text
mongodb://127.0.0.1:27017/taskflow
```

Or use a MongoDB Atlas connection string:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
```

Make sure the MongoDB service is running before starting the backend.

---

# 🌱 Seed Demo Data

After configuring MongoDB:

```bash
npm run seed
```

The seed script creates:

* Admin account
* Employee accounts
* Optional demo tasks

The script should be safe to run repeatedly without unnecessarily creating duplicate users.

---

# ▶️ Run the Application

Start both frontend and backend:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:5000
```

---

# 📡 API Documentation

Base URL:

```text
/api
```

---

## Authentication

### Login

```http
POST /api/auth/login
```

Request:

```json
{
  "email": "admin@taskflow.com",
  "password": "AdminPass123!"
}
```

Successful response contains the JWT token and authenticated user information.

---

# 👥 Employee APIs

All employee management APIs require:

```text
Authentication + Admin Role
```

### Get Employees

```http
GET /api/employees
```

Returns employees along with relevant task counts.

---

### Create Employee

```http
POST /api/employees
```

Example:

```json
{
  "name": "Alex Kumar",
  "email": "alex@example.com",
  "password": "SecurePass123!"
}
```

---

### Update Employee

```http
PUT /api/employees/:id
```

Used to update employee profile information or password.

---

### Delete Employee

```http
DELETE /api/employees/:id
```

Deletes an employee and handles their assigned tasks according to the application's cleanup logic.

---

# 📋 Task APIs

## Create Task

Admin only.

```http
POST /api/tasks
```

Example:

```json
{
  "title": "Build Login API",
  "description": "Implement JWT authentication for the application.",
  "assignedTo": "EMPLOYEE_OBJECT_ID",
  "priority": "High"
}
```

Creates the task and triggers an email notification to the assigned employee.

---

## Get Tasks

Admin only.

```http
GET /api/tasks
```

Supported query parameters:

```text
?page=1
&limit=10
&search=login
```

Example:

```http
GET /api/tasks?page=1&limit=10&search=login
```

Response structure:

```json
{
  "success": true,
  "tasks": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

---

## Get Task Statistics

Admin only.

```http
GET /api/tasks/stats
```

Example response:

```json
{
  "success": true,
  "stats": {
    "notStarted": 5,
    "pending": 3,
    "inProgress": 4,
    "completed": 8
  }
}
```

The dashboard can combine `pending` and `inProgress` when displaying:

```text
Pending / In Progress
```

---

## Get My Tasks

Employee only.

```http
GET /api/tasks/my
```

Returns only tasks assigned to the authenticated employee.

The employee identity is obtained from the JWT.

---

## Update Task Status

Employee only.

```http
PATCH /api/tasks/:id/status
```

Example:

```json
{
  "status": "Completed"
}
```

Allowed values:

```text
Not Started
Pending
In Progress
Completed
```

The backend verifies that the task belongs to the authenticated employee before allowing the update.

---

# 🔒 Role-Based Access Control

TaskFlow implements RBAC at two levels.

## Frontend

Protected routes prevent users from navigating to unauthorized pages.

Example:

```text
/admin/*
/employee/*
```

## Backend

Every protected API request goes through authentication and authorization middleware.

Conceptually:

```text
Request
   ↓
JWT Authentication
   ↓
Identify User
   ↓
Check Role
   ↓
Controller
   ↓
Database
```

Frontend restrictions alone are NOT considered security.

---

# 🔐 Task Ownership Protection

Employee task updates use server-side ownership verification.

Example:

```text
Employee A
   ↓
PATCH /api/tasks/task123/status
   ↓
Backend checks:
Is task123 assigned to Employee A?
   ↓
YES → Update
NO  → 403 Forbidden
```

This prevents an employee from changing another employee's task by manually modifying the task ID.

---

# 📊 Task Status Flow

```text
┌──────────────┐
│ Not Started  │
└──────┬───────┘
       ↓
┌──────────────┐
│   Pending    │
└──────┬───────┘
       ↓
┌──────────────┐
│ In Progress  │
└──────┬───────┘
       ↓
┌──────────────┐
│  Completed   │
└──────────────┘
```

Employees can update their assigned task to any supported status.

---

# ✉️ Notification Flow

## Task Assignment

```text
Admin
  │
  │ Create Task
  ▼
Express API
  │
  ├── Save Task
  │
  └── Nodemailer
          │
          ▼
      Employee Email
```

## Task Status Update

```text
Employee
   │
   │ Update Status
   ▼
Express API
   │
   ├── Verify JWT
   ├── Verify Ownership
   ├── Update Task
   │
   └── Nodemailer
           │
           ▼
       Admin Email
```

---

# 🧪 Validation & Error Handling

TaskFlow performs validation on both:

### Frontend

* Required fields
* Email format
* Password validation
* Task title
* Task description
* Employee selection
* Priority
* Status

### Backend

All important input is validated again before database operations.

The API uses appropriate HTTP status codes:

| Status | Meaning                         |
| ------ | ------------------------------- |
| `200`  | Successful request              |
| `201`  | Resource created                |
| `400`  | Invalid request                 |
| `401`  | Authentication required/invalid |
| `403`  | Insufficient permissions        |
| `404`  | Resource not found              |
| `500`  | Internal server error           |

Sensitive backend errors are not exposed directly to users.

---

# 🖥️ UI Screens

## Login

* Email/password authentication
* Validation
* Error messages
* Loading state

## Admin Dashboard

* Task statistics
* Recent task information
* Navigation

## Employees

* Employee list
* Employee task counts
* Create employee
* Edit employee
* Delete employee

## Tasks

* Task table
* Search
* Pagination
* Priority badges
* Status badges
* Assign task modal

## Employee Dashboard

* Personal task statistics
* Assigned tasks

## My Tasks

* Task details
* Priority
* Status
* Status update controls

---

# 📱 Responsive Design

The UI is designed to work across:

* Desktop
* Laptop
* Tablet
* Mobile

On smaller screens:

* Sidebar becomes a mobile drawer
* Tables remain usable
* Forms adapt to screen size
* Dashboard cards stack appropriately
* Navigation remains accessible

---

# 🧹 Code Quality

The project follows maintainable development practices:

* Separation of frontend and backend
* MVC-style backend organization
* Reusable React components
* Centralized API service
* Authentication context
* Middleware-based authorization
* Environment configuration
* Meaningful naming
* Async/await
* Centralized error handling
* Server-side validation
* Server-side pagination
* Database-driven statistics

---

# 🔍 Assessment Requirement Mapping

The implementation covers the core requirements of the Xplore Intellects assessment:

| Assessment Requirement | Implementation              |
| ---------------------- | --------------------------- |
| Admin & Employee Login | ✅ JWT Authentication        |
| Role-Based Access      | ✅ Backend + Frontend RBAC   |
| Admin Employee List    | ✅ Employees Module          |
| Task Assignment        | ✅ Assign Task               |
| Task Priority          | ✅ High / Medium / Low       |
| Employee Task View     | ✅ My Tasks                  |
| Employee Status Update | ✅ Status Update API         |
| Assignment Email       | ✅ Nodemailer                |
| Status Update Email    | ✅ Nodemailer                |
| Dashboard Statistics   | ✅ MongoDB-backed statistics |
| Search                 | ✅ Backend search            |
| Pagination             | ✅ Server-side pagination    |
| Form Validation        | ✅ Frontend + Backend        |
| API Error Handling     | ✅ Centralized handling      |
| Responsive UI          | ✅ Responsive SaaS design    |
| MongoDB Integration    | ✅ Mongoose                  |
| README / Setup         | ✅ Included                  |

The assessment specifically calls for a clean, responsive UI, proper validation/error handling, environment-based credentials, maintainable architecture, and meaningful naming.

---

# 🧪 Testing Checklist

## Authentication

* [ ] Admin can login
* [ ] Employee can login
* [ ] Invalid credentials show an error
* [ ] Unauthenticated users cannot access dashboards
* [ ] Employee cannot access Admin routes
* [ ] Employee cannot access Admin APIs

## Admin

* [ ] Employee list loads correctly
* [ ] Employee can be created
* [ ] Employee can be updated
* [ ] Employee can be deleted
* [ ] Task can be assigned
* [ ] Priority can be selected
* [ ] Assignment email is sent
* [ ] Tasks appear in task table
* [ ] Search works
* [ ] Pagination works
* [ ] Statistics are accurate

## Employee

* [ ] Employee sees only assigned tasks
* [ ] Employee can update status
* [ ] Employee cannot update another employee's task
* [ ] Admin receives status update email
* [ ] Dashboard reflects updated status

## UI

* [ ] Loading states work
* [ ] Empty states work
* [ ] Error states work
* [ ] Toast notifications work
* [ ] Mobile navigation works
* [ ] Forms are responsive
* [ ] Tables are usable on mobile

---

# 🚨 Troubleshooting

## MongoDB Connection Error

Verify:

```env
MONGO_URI=mongodb://127.0.0.1:27017/taskflow
```

and make sure MongoDB is running.

---

## Email Not Sending

Check:

```env
EMAIL_USER=
EMAIL_PASS=
```

For Gmail, use an App Password rather than your normal account password.

---

## CORS Error

Verify:

```env
CLIENT_URL=http://localhost:5173
```

and make sure the backend CORS configuration allows the frontend origin.

---

## JWT Authentication Error

Check that:

```env
JWT_SECRET=
```

is configured and that the frontend is sending the JWT with protected requests.

---

# 🌐 Deployment

The project can be deployed using services such as:

### Frontend

* Vercel
* Netlify

### Backend

* Render
* Railway
* Other Node.js hosting platforms

### Database

* MongoDB Atlas

Before deployment, update:

```env
MONGO_URI=
CLIENT_URL=
JWT_SECRET=
EMAIL_USER=
EMAIL_PASS=
ADMIN_EMAIL=
```

Never expose secrets in frontend code or commit them to GitHub.

---

# 📌 Important Security Note

The credentials shown in this README are **demo credentials for local testing only**.

For production:

* Generate a strong random JWT secret.
* Use secure database credentials.
* Use a dedicated email account/app password.
* Never commit `.env`.
* Never expose backend secrets to React.
* Disable or replace demo accounts.

---

# 🎯 Project Objective

TaskFlow was developed to demonstrate practical understanding of:

* MERN stack development
* REST API design
* MongoDB data modeling
* Authentication
* Authorization
* Role-based access control
* CRUD operations
* Task management
* Email integration
* Search
* Pagination
* Data aggregation
* Form validation
* Error handling
* Responsive frontend development
* Maintainable project architecture

The project focuses on implementing the assessment requirements correctly while maintaining a clean and professional user experience.

---

# 👨‍💻 Developer

**Kavin K**

MERN / Full-Stack Developer

Built for the **Xplore Intellects MERN Stack Intern Technical Assessment**.

---

## ⭐ If you found this project useful

Feel free to explore the repository, review the implementation, and provide feedback.
