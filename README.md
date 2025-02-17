# Time_Master

Overview

This is a simple task management application where users can add tasks and track their progress. The app includes user authentication (signup/login) and task management (create, update, delete, and status tracking).

Features

User authentication (Signup & Login)

Task management (CRUD operations)

Task status tracking (Ongoing, Finished, Cancelled)

Installation

Clone the repository:

git clone https://github.com/yourusername/todo-app.git

Navigate to the project directory:

cd todo-app

Install dependencies:

npm install

Start the development server:

npm start

API Endpoints

Authentication

POST /signup - Register a new user

POST /login - Authenticate user login

Tasks

GET /tasks?userId= - Retrieve tasks by user

POST /tasks - Add a new task

PUT /tasks/{taskId} - Edit a task

PATCH /tasks/{taskId}/status - Update task status

DELETE /tasks/clear - Clear all tasks for a user