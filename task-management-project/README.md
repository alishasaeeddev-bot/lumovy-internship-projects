# Task Management App

A responsive and interactive **Task Management Web Application** built with HTML, CSS, and JavaScript. The application helps users organize tasks, manage projects, track priorities and due dates, and monitor task completion through a clean and user-friendly interface.

This project was developed as part of my **Frontend Development learning journey during my internship at Lumovy Technology Solutions**.

## Overview

The Task Management App provides a practical interface for creating and organizing daily tasks. Users can manage tasks based on priority, due dates, projects, and completion status.

The application also uses the browser's **LocalStorage API** to persist tasks, projects, and theme preferences without requiring a backend database.

## Features

### Task Management

* Add new tasks
* Edit existing tasks
* Delete tasks
* Mark tasks as completed
* Mark tasks as important
* Add task descriptions
* Assign due dates
* Set task priorities
* Add custom labels
* Assign tasks to projects

### Task Organization

* View all tasks
* View today's tasks
* View important tasks
* View completed tasks
* Filter tasks by priority
* Filter tasks by due date
* Search tasks by title or description
* Sort tasks by:

  * Due Date
  * Priority
  * Creation Date
  * Title
* Sort in ascending or descending order

### Project Management

* Create projects
* Assign custom colors to projects
* Assign tasks to projects
* Display project information with tasks
* Delete projects without deleting associated tasks

### User Interface

* Responsive design
* Light and dark themes
* Modern card-based layout
* Sidebar navigation
* Task statistics
* Interactive buttons and controls
* Responsive forms and modals
* Mobile-friendly layout

## Technologies Used

* **HTML5** — Semantic structure and forms
* **CSS3** — Responsive styling, Flexbox, CSS variables, `clamp()`, themes, and layouts
* **JavaScript (ES6+)** — Application logic, DOM manipulation, events, filtering, sorting, and state management
* **LocalStorage API** — Persistent client-side data storage
* **Font Awesome** — Icons
* **Google Fonts** — Poppins typography
* **Visual Studio Code** — Development environment
* **Git & GitHub** — Version control and project management
* **Live Server** — Local development and testing

## Project Structure

```text
task-management-project/
│
├── index.html       # Application structure and UI
├── style.css        # Responsive styling and themes
├── script.js        # Application logic and functionality
└── README.md        # Project documentation
```

## JavaScript Concepts Implemented

This project was developed to practice practical JavaScript and DOM concepts, including:

* DOM selection and manipulation
* Event listeners
* Functions
* Arrays and objects
* Array methods
* Conditional statements
* Template literals
* Form handling
* Dynamic HTML generation
* Event-driven programming
* LocalStorage
* JSON parsing and stringifying
* Date handling
* Filtering
* Searching
* Sorting
* Application state management

## LocalStorage

The application stores data in the browser using LocalStorage.

The following information is persisted:

* Tasks
* Projects
* Theme preference

This means users can refresh the page without immediately losing their locally stored application data.

## Responsive Design

The application was designed to work across different screen sizes.

The CSS uses modern responsive techniques such as:

* Flexbox
* Flexible layouts
* `flex-wrap`
* `min()`
* `clamp()`
* Flexible widths
* Responsive spacing
* `overflow-wrap`
* Mobile-friendly forms and modals

The goal was to create a layout that adapts naturally to desktop, tablet, and mobile screen sizes without relying heavily on fixed dimensions.

## Application Workflow

The basic workflow of the application is:

```text
Create Task
    ↓
Set Priority / Due Date / Project
    ↓
Save Task
    ↓
Task Stored in LocalStorage
    ↓
Search / Filter / Sort
    ↓
Complete / Edit / Delete Task
```

## Key Learning Outcomes

Through this project, I practiced building a complete frontend application from scratch and strengthened my understanding of:

1. Structuring a web application using HTML5.
2. Building responsive layouts with CSS3.
3. Creating reusable styling patterns with CSS variables.
4. Using JavaScript to control application behavior.
5. Manipulating the DOM dynamically.
6. Handling forms and user interactions.
7. Managing application state using JavaScript.
8. Persisting client-side data using LocalStorage.
9. Implementing search, filtering, and sorting functionality.
10. Building a responsive and interactive user interface.

## Future Improvements

Possible future improvements include:

* Backend database integration
* User authentication
* Cloud data synchronization
* Drag-and-drop task management
* Task reminders and notifications
* Recurring tasks
* Calendar integration
* User-specific task accounts
* React.js migration
* REST API integration

## Internship Context

**Organization:** Lumovy Technology Solutions
**Program:** React.js Internship / Skill Development Program
**Project:** Task Management App
**Development Area:** Frontend Development
**Technologies:** HTML, CSS, JavaScript

## Author

**Alisha Saeed**

Computer Science | Frontend Development

## Project Status

**Completed**

This project was created as part of my practical frontend development and JavaScript learning during my internship.
