# Task Management App

A modern and responsive **Task Management Application** built with **React.js**. This project allows users to create, manage, filter, complete, and delete tasks while providing a clean and user-friendly interface.

The application was developed as part of my **React.js internship at Lumovy Technology Solutions** to strengthen my understanding of React components, state management, React Hooks, Context API, React Router, and browser storage.

## Features

* Add new tasks with title, description, category, priority, and due date
* Mark tasks as **completed** or **pending**
* Delete tasks
* Undo completed tasks
* Filter tasks by:

  * All
  * Pending
  * Completed
* Dynamic task statistics and task counts
* Individual task details using dynamic routes
* Persistent task data using **Local Storage**
* Light/Dark theme toggle using **Context API**
* Responsive design for different screen sizes
* Reusable React components
* 404 page for invalid routes
* Navigation using React Router

## Technologies Used

* **React.js**
* **JavaScript (ES6+)**
* **React Router DOM**
* **Context API**
* **React Hooks**

  * `useState`
  * `useEffect`
  * `useContext`
  * `useParams`
* **HTML5**
* **CSS3**
* **Vite**
* **Local Storage**
* **Git & GitHub**

## Project Structure

```text
my-react-project/
│
├── react-task-management/
│   ├── public/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── EmptyState.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Navbar.css
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskDetails.jsx
│   │   │   ├── TaskFilters.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   └── TaskList.jsx
│   │   │
│   │   ├── context/
│   │   │   └── ThemeContext.jsx
│   │   │
│   │   ├── layouts/
│   │   │   └── AppLayout.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── About.jsx
│   │   │   ├── Dashboard.css
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Home.css
│   │   │   ├── Home.jsx
│   │   │   ├── NotFound.jsx
│   │   │   └── Tasks.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── App.css
│   │
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   └── vite.config.js
```

## Getting Started

Follow these steps to run the project locally.

### 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
```

### 2. Navigate to the Project Folder

```bash
cd my-react-project/react-task-management
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

The application will be available at the local development URL provided by Vite, usually:

```text
http://localhost:5173
```

## How It Works

### Task Management

Users can create tasks by entering the required information in the task form. Newly created tasks are added to the task list and displayed dynamically.

### Task Completion

Each task includes a checkbox that allows users to change its status between **Pending** and **Completed**.

### Task Filtering

The task filter component dynamically displays the number of:

* Total tasks
* Pending tasks
* Completed tasks

Users can select a filter to display tasks based on their current status.

### Task Details

Each task can be opened through a dynamic route. **React Router** and `useParams()` are used to identify and display the selected task's information.

### Data Persistence

Tasks are stored in the browser's **Local Storage** using React's `useEffect` hook. This allows task data to remain available even after refreshing the browser.

### Theme Switching

The application includes a light/dark theme feature implemented using the **React Context API**. The theme state is shared across relevant components without passing props through every component.

## React Concepts Practiced

This project helped me practice and understand several important React concepts:

* Functional Components
* Props
* State Management
* Controlled Forms
* Conditional Rendering
* Event Handling
* `useState`
* `useEffect`
* `useContext`
* Context API
* React Router
* Dynamic Routes
* `useParams`
* `NavLink`
* `Outlet`
* Local Storage
* Component Reusability

## Responsive Design

The application is designed to provide a consistent user experience across:

* Desktop
* Laptop
* Tablet
* Mobile devices

## Future Improvements

Some features that can be added in future versions include:

* User authentication
* Backend/database integration
* Search functionality
* Task editing
* Drag-and-drop task organization
* Task sorting
* Notifications and reminders
* User-specific task management
* Video attachment/upload functionality
* Deployment with a production backend

## Project Purpose

The main purpose of this project was to build a practical React application while applying concepts learned during my React.js internship.

It demonstrates my understanding of:

**React → Components → Hooks → State Management → Context API → Routing → Local Storage**

## Author

**Alisha Saeed**

Frontend Developer | React.js Developer

## License

This project is created for **learning and portfolio purposes**.
