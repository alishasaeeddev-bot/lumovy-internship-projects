# Task Management App

A responsive Task Management App built with HTML, CSS, and JavaScript. The application allows users to create, manage, organize, and track their tasks through a clean and user-friendly interface.

The project focuses on practicing core frontend development concepts including DOM manipulation, JavaScript state management, event handling, form validation, localStorage, filtering, searching, sorting, and responsive CSS.

## Features

* Add new tasks through a modal form
* Edit existing tasks
* Delete tasks with confirmation
* Mark tasks as completed or pending
* Display total, completed, and pending task statistics
* Track task completion progress with a progress bar
* Filter tasks by:

  * All
  * Pending
  * Completed
* Search tasks by title, category, or priority
* Sort tasks by:

  * Default order
  * Due date
  * Title
  * Priority
* Automatically identify overdue tasks
* Store tasks in browser localStorage
* Form validation
* Responsive mobile-first layout
* Quick calculator
* Keyboard support for calculator operations
* Accessible form controls and labels
* Modal-based task creation and editing

## Technologies Used

* HTML5
* CSS3
* JavaScript (ES6+)
* Browser localStorage
* CSS Grid
* CSS Flexbox
* CSS `clamp()`
* DOM Manipulation

## Project Structure

```text
task-management-app/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

## How It Works

### Task Management

Users can create a task by clicking the **Add New Task** button. The task form collects:

* Task title
* Category
* Priority
* Due date

After submission, the task is displayed in the task list.

Each task provides options to:

* Mark the task as completed or pending
* Edit task information
* Delete the task

### Task Statistics

The application dynamically calculates:

* Total tasks
* Completed tasks
* Pending tasks

The progress bar is also updated automatically based on the percentage of completed tasks.

### Filtering

Users can filter tasks using the available filter buttons:

```text
All
Pending
Completed
```

The task counts beside each filter are updated dynamically.

### Search

The search functionality allows users to search tasks by:

* Task title
* Category
* Priority

### Sorting

Tasks can be sorted using the sorting dropdown:

```text
Default
Due Date
Title
Priority
```

### Overdue Tasks

The application compares each incomplete task's due date with the current date.

If the due date has passed, the task is displayed as overdue.

Completed tasks are not marked as overdue.

### Local Storage

Task data is stored in the browser using `localStorage`.

The application uses:

```js
const STORAGE_KEY = "taskManagementApp_v2";
```

This allows tasks to remain available after refreshing or reopening the browser.

No backend or database is required for this project.

## Responsive Design

The interface follows a mobile-first approach and uses modern CSS techniques including:

* CSS Grid
* Flexbox
* `clamp()`
* `min()`
* `auto-fit`
* Responsive spacing and typography

The layout adapts to different screen sizes without relying on multiple media queries.

## Form Validation

The task form validates user input before creating or updating a task.

Validation includes:

* Required task title
* Minimum title length
* Required category
* Required priority
* Required due date

Validation messages are displayed directly inside the modal form.

## Calculator

The application also includes a small quick calculator for basic arithmetic operations.

Supported operations include:

* Addition
* Subtraction
* Multiplication
* Division
* Decimal values

The calculator also supports keyboard input.

## Getting Started

### 1. Clone the Repository

```bash
git clone alishasaeeddev-bot/lumovy-internship-projects.git
```

### 2. Open the Project

Navigate to the project directory:

```bash
cd task-management-project
```

### 3. Run the Application

Since this is a frontend-only project, you can open `index.html` directly in your browser.

For a better development experience, you can also use Visual Studio Code with the Live Server extension.

## Future Improvements

Possible future improvements include:

* Drag-and-drop task management
* Task descriptions
* Task categories management
* Dark mode
* Recurring tasks
* Task reminders
* Backend integration
* User authentication
* Cloud database storage
* REST API integration
* Advanced task analytics

## Learning Objectives

This project was created to strengthen practical frontend development skills and understand how JavaScript can be used to build interactive web applications.

Key concepts practiced include:

* JavaScript functions
* Arrays and objects
* Array methods such as `filter()`, `map()`, and `sort()`
* DOM manipulation
* Event listeners
* Event delegation
* Form handling
* Form validation
* Browser localStorage
* Dynamic UI updates
* State management using JavaScript
* Responsive web design
* CSS Grid and Flexbox
* Accessibility basics

## Author

**Alisha Saeed**

Computer Science Graduate | Frontend Developer

## Internship Project

Developed as part of my frontend development internship at **Lumovy Technology Solutions**, with a focus on strengthening HTML, CSS, and JavaScript fundamentals and building a practical task management application.

## License

This project is created for learning and portfolio purposes.
