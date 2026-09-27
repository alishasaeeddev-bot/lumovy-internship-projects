# Task Management System

A full-stack task management application built with React.js, Node.js, Express.js, and MongoDB. The application provides a complete workflow for creating, organizing, tracking, and managing tasks through multiple views, with authentication, cloud profile images, notifications, and API integration.

## Features

### Authentication

* User registration and login
* JWT-based authentication
* Protected routes
* Google OAuth login
* Secure password handling with bcrypt
* Automatic authentication state management
* Logout functionality

### Task Management

* Create, read, update, and delete tasks
* Task status management

  * To Do
  * In Progress
  * Completed
* Task priority levels

  * Low
  * Medium
  * High
* Task categories
* Task tags
* Due dates
* Task details page
* User-specific task data

### Dashboard

* Overview of task activity
* Task statistics
* Task status summary
* Task priority information
* Deadline tracking

### Kanban Board

* Visual task management
* Tasks organized by status
* Drag-and-drop task movement
* Dynamic task status updates

### Calendar

* Calendar-based task visualization
* Tasks displayed according to their due dates
* Easy deadline tracking

### Profile Management

* View and update user information
* Upload profile images
* Profile images stored using Cloudinary
* Delete profile images
* Google account security information
* Password management for local accounts

### Notifications

* Notification system
* Task-related notifications
* Notification API
* Notification indicator in the application header

### API Integration

* REST API communication using Axios
* Protected API requests using JWT
* External API data page
* Centralized Axios configuration
* Automatic handling of unauthorized requests

### User Experience

* Responsive interface
* Light and dark themes
* Reusable React components
* Client-side routing
* Custom 404 page
* Clean and structured UI

## Tech Stack

### Frontend

* React.js
* Vite
* React Router
* Redux Toolkit
* Axios
* FullCalendar
* @dnd-kit
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Passport
* Google OAuth
* Multer
* Cloudinary
* CORS

### Development Tools

* Git
* GitHub
* Visual Studio Code
* npm

## Application Architecture

The application follows a client-server architecture.

```text
React Frontend
      |
      | Axios / REST API
      |
Express.js Backend
      |
      | Mongoose
      |
MongoDB Atlas
```

Cloudinary is used separately for storing and managing user profile images.

## Project Structure

```text
react-task-management/
│
├── backend/
│   ├── config/
│   │   ├── cloudinary.js
│   │   └── db.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── models/
│   │   ├── Notification.js
│   │   ├── Task.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── taskRoutes.js
│   │
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── src/
│   ├── app/
│   │   └── store.jsx
│   │
│   ├── components/
│   │   ├── Footer.jsx
│   │   ├── GoogleLoginButton.jsx
│   │   ├── Header.jsx
│   │   ├── NotificationBell.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── TaskCard.jsx
│   │   ├── TaskDetails.jsx
│   │   ├── TaskForm.jsx
│   │   └── Tasklist.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── features/
│   │   └── tasks/
│   │       └── tasksSlice.jsx
│   │
│   ├── layouts/
│   │   └── AppLayout.jsx
│   │
│   ├── pages/
│   │   ├── ApiData.jsx
│   │   ├── Calendar.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Kanban.jsx
│   │   ├── Login.jsx
│   │   ├── NotFound.jsx
│   │   ├── Profile.jsx
│   │   ├── Signup.jsx
│   │   └── Tasks.jsx
│   │
│   ├── utils/
│   │   └── taskDeadline.js
│   │
│   ├── api.js
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
└── README.md
```

## Authentication Flow

The application uses JWT authentication to protect user-specific resources.

```text
User Login
    ↓
Express Authentication API
    ↓
Credentials Verification
    ↓
JWT Token Generated
    ↓
Token Stored in Browser
    ↓
Axios Adds Bearer Token
    ↓
Protected Express Route
    ↓
User ID Extracted From Token
    ↓
User-Specific MongoDB Data
```

Google authentication is also supported for users who prefer signing in with their Google account.

## Task Data Flow

Tasks are stored in MongoDB and associated with the authenticated user.

```text
React Component
      ↓
Redux / Axios
      ↓
Express REST API
      ↓
JWT Authentication
      ↓
Task Controller / Route
      ↓
Mongoose
      ↓
MongoDB Atlas
```

This ensures that each authenticated user can access and manage their own tasks.

## Environment Variables

Create the required environment variables for the backend.

```env
PORT=5000
MONGO_URI=
JWT_SECRET=
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Never commit actual credentials or secret values to GitHub.

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/alishasaeeddev-bot/lumovy-internship-projects.git
```

Navigate to the project:

```bash
cd lumovy-internship-projects/react-task-management
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the `backend` directory and add the required environment variables.

### 5. Start the Backend

From the `backend` directory:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### 6. Start the Frontend

Open another terminal and navigate to the project root:

```bash
cd react-task-management
```

Run:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## API

The backend provides REST API endpoints for:

* Authentication
* User profiles
* Tasks
* Notifications
* Profile image management

The API uses JWT bearer tokens for protected requests.

Example:

```text
Authorization: Bearer <token>
```

## Production Build

To create a production build of the React application:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Security

The application includes several security-related practices:

* JWT authentication
* Password hashing with bcrypt
* Protected API routes
* Protected frontend routes
* Environment variables for sensitive configuration
* CORS configuration
* User-specific database queries
* Secure handling of Cloudinary credentials

Sensitive environment files are excluded from Git using `.gitignore`.

## Future Improvements

Possible future improvements include:

* Real-time notifications using Socket.IO
* Task search and advanced filtering
* Pagination
* Email notifications
* Task sharing and collaboration
* Team workspaces
* Role-based access control
* File attachments
* Activity history
* Advanced analytics
* Deployment with production environment configuration

## Author

**Alisha Saeed**

Computer Science Graduate and Full-Stack Developer focused on building modern web applications with React.js, Node.js, Express.js, and MongoDB.

## License

This project is intended for learning, development, and portfolio purposes.
