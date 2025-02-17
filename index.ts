/** @jsxImportSource https://esm.sh/react@18.2.0 */
import React, { useState, useEffect } from "https://esm.sh/react@18.2.0";
import { createRoot } from "https://esm.sh/react-dom@18.2.0/client";

// Enum for task statuses
enum TaskStatus {
  ONGOING = 'ongoing',
  FINISHED = 'finished',
  CANCELLED = 'cancelled'
}

function EditTaskModal({ task, onClose, onSave }) {
  const [description, setDescription] = useState(task.description);

  const handleSave = () => {
    onSave({
      ...task,
      description
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Task</h2>
        <input 
          type="text" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)}
          className="form-input"
        />
        <div className="modal-actions">
          <button onClick={handleSave} className="btn btn-primary">Save</button>
          <button onClick={onClose} className="btn btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  );
}

function LoginPage({ onLogin, setView }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        onLogin(data);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Task Master</h1>
          <p>Organize Your Day, Achieve Your Goals</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn btn-primary">Login</button>
          <div className="auth-footer">
            <p>Don't have an account? 
              <span 
                onClick={() => setView('signup')} 
                className="link-text"
              >
                Sign Up
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

function SignupPage({ setView }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setView('login');
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Start Managing Your Tasks Today</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn btn-primary">Sign Up</button>
          <div className="auth-footer">
            <p>Already have an account? 
              <span 
                onClick={() => setView('login')} 
                className="link-text"
              >
                Login
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

function Dashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState({
    ongoing: [],
    finished: [],
    cancelled: []
  });
  const [taskDescription, setTaskDescription] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`/tasks?userId=${user.id}`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: taskDescription,
          userId: user.id
        })
      });

      const result = await response.json();
      if (result.success) {
        fetchTasks();
        setTaskDescription('');
      }
    } catch (error) {
      console.error('Failed to add task', error);
    }
  };

  const handleEditTask = async (updatedTask) => {
    try {
      const response = await fetch(`/tasks/${updatedTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updatedTask,
          userId: user.id
        })
      });

      const result = await response.json();
      if (result.success) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Failed to edit task', error);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await fetch(`/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: newStatus,
          userId: user.id 
        })
      });

      const result = await response.json();
      if (result.success) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Failed to update task status', error);
    }
  };

  const clearAllTasks = async () => {
    try {
      const response = await fetch('/tasks/clear', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });

      const result = await response.json();
      if (result.success) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Failed to clear tasks', error);
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-header">
        <h1>Welcome, {user.name} 👋</h1>
        <button onClick={onLogout} className="btn btn-logout">Logout</button>
      </div>

      <div className="task-creation-section">
        <form onSubmit={handleAddTask} className="task-form">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            required
            className="task-input"
          />
          <button type="submit" className="btn btn-add-task">+ Add Task</button>
        </form>
      </div>

      <div className="task-sections">
        {Object.entries(tasks).map(([status, taskList]) => (
          taskList.length > 0 && (
            <div key={status} className={`task-category ${status}`}>
              <h2>{status.charAt(0).toUpperCase() + status.slice(1)} Tasks</h2>
              {taskList.map(task => (
                <div key={task.id} className="task-item">
                  <span className="task-description">{task.description}</span>
                  <div className="task-actions">
                    {status === TaskStatus.ONGOING && (
                      <>
                        <button 
                          onClick={() => updateTaskStatus(task.id, TaskStatus.FINISHED)}
                          className="btn btn-complete"
                        >
                          ✅
                        </button>
                        <button 
                          onClick={() => updateTaskStatus(task.id, TaskStatus.CANCELLED)}
                          className="btn btn-cancel"
                        >
                          ❌
                        </button>
                        <button 
                          onClick={() => setEditingTask(task)}
                          className="btn btn-edit"
                        >
                          ✏️
                        </button>
                      </>
                    )}
                    {status === TaskStatus.CANCELLED && (
                      <button 
                        onClick={() => updateTaskStatus(task.id, TaskStatus.ONGOING)}
                        className="btn btn-revert"
                      >
                        🔄
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        ))}
      </div>

      {(tasks.ongoing.length > 0 || tasks.finished.length > 0 || tasks.cancelled.length > 0) && (
        <div className="clear-tasks-section">
          <button 
            onClick={clearAllTasks} 
            className="btn btn-clear-tasks"
          >
            🗑️ Clear All Tasks
          </button>
        </div>
      )}

      {editingTask && (
        <EditTaskModal 
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleEditTask}
        />
      )}
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login');

  const handleLogin = (userData) => {
    setUser(userData);
    setView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setView('login');
  };

  return (
    <div className="app-container">
      {view === 'login' && <LoginPage onLogin={handleLogin} setView={setView} />}
      {view === 'signup' && <SignupPage setView={setView} />}
      {view === 'dashboard' && user && (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

function client() {
  createRoot(document.getElementById("root")).render(<App />);
}

if (typeof document !== "undefined") {
  client();
}

export default async function server(request: Request): Promise<Response> {
  const { sqlite } = await import("https://esm.town/v/stevekrouse/sqlite");
  const KEY = new URL(import.meta.url).pathname.split("/").at(-1);
  const SCHEMA_VERSION = 10; // Increment schema version

  const createErrorResponse = (message: string, status: number = 500) => {
    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { 'Content-Type': 'application/json' }
    });
  };

  const url = new URL(request.url);
  const path = url.pathname;

  // Create users table with improved constraints
  await sqlite.execute(`
    CREATE TABLE IF NOT EXISTS ${KEY}_users_${SCHEMA_VERSION} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);

  // Create tasks table
  await sqlite.execute(`
    CREATE TABLE IF NOT EXISTS ${KEY}_tasks_${SCHEMA_VERSION} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      description TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'ongoing',
      FOREIGN KEY(user_id) REFERENCES ${KEY}_users_${SCHEMA_VERSION}(id)
    )
  `);

  // Signup route
  if (path === '/signup' && request.method === 'POST') {
    try {
      const { name, email, password } = await request.json();

      // Basic validation
      if (!name || !email || !password) {
        return createErrorResponse('All fields are required', 400);
      }

      // Check if email is valid
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return createErrorResponse('Invalid email format', 400);
      }

      // Check password strength
      if (password.length < 6) {
        return createErrorResponse('Password must be at least 6 characters long', 400);
      }

      // Check if user already exists
      const existingUser = await sqlite.execute(
        `SELECT * FROM ${KEY}_users_${SCHEMA_VERSION} WHERE email = ?`, 
        [email]
      );

      if (existingUser.rows.length > 0) {
        return createErrorResponse('User with this email already exists', 400);
      }

      // Insert new user
      const result = await sqlite.execute(
        `INSERT INTO ${KEY}_users_${SCHEMA_VERSION} (name, email, password) VALUES (?, ?, ?)`, 
        [name, email, password]
      );

      return new Response(JSON.stringify({ 
        success: true, 
        userId: result.lastInsertRowid,
        message: 'User registered successfully'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Signup error:', error);
      return createErrorResponse('Signup failed. Please try again.', 500);
    }
  }

  // Login route
  if (path === '/login' && request.method === 'POST') {
    try {
      const { email, password } = await request.json();

      // Basic validation
      if (!email || !password) {
        return createErrorResponse('Email and password are required', 400);
      }

      // Find user
      const result = await sqlite.execute(
        `SELECT * FROM ${KEY}_users_${SCHEMA_VERSION} WHERE email = ? AND password = ?`, 
        [email, password]
      );

      if (result.rows.length === 0) {
        return createErrorResponse('Invalid email or password', 401);
      }

      const user = result.rows[0];
      return new Response(JSON.stringify({ 
        id: user.id, 
        name: user.name, 
        email: user.email 
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Login error:', error);
      return createErrorResponse('Login failed. Please try again.', 500);
    }
  }

  // Tasks routes
  if (path === '/tasks' && request.method === 'GET') {
    try {
      const userId = url.searchParams.get('userId');
      if (!userId) {
        return createErrorResponse('User ID is required', 400);
      }

      const ongoingTasks = await sqlite.execute(
        `SELECT * FROM ${KEY}_tasks_${SCHEMA_VERSION} 
         WHERE user_id = ? AND status = 'ongoing'`, 
        [userId]
      );

      const finishedTasks = await sqlite.execute(
        `SELECT * FROM ${KEY}_tasks_${SCHEMA_VERSION} 
         WHERE user_id = ? AND status = 'finished'`, 
        [userId]
      );

      const cancelledTasks = await sqlite.execute(
        `SELECT * FROM ${KEY}_tasks_${SCHEMA_VERSION} 
         WHERE user_id = ? AND status = 'cancelled'`, 
        [userId]
      );

      return new Response(JSON.stringify({
        ongoing: ongoingTasks.rows,
        finished: finishedTasks.rows,
        cancelled: cancelledTasks.rows
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return createErrorResponse('Failed to fetch tasks');
    }
  }

  // Add task route
  if (path === '/tasks' && request.method === 'POST') {
    try {
      const { description, userId } = await request.json();

      const result = await sqlite.execute(
        `INSERT INTO ${KEY}_tasks_${SCHEMA_VERSION} 
         (user_id, description, status) 
         VALUES (?, ?, 'ongoing')`, 
        [userId, description]
      );

      return new Response(JSON.stringify({ 
        success: true, 
        taskId: result.lastInsertRowid 
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return createErrorResponse('Failed to add task');
    }
  }

  // Edit task route
  if (path.startsWith('/tasks/') && request.method === 'PUT') {
    try {
      const taskId = path.split('/')[2];
      const { description, userId } = await request.json();

      await sqlite.execute(
        `UPDATE ${KEY}_tasks_${SCHEMA_VERSION} 
         SET description = ?
         WHERE id = ? AND user_id = ?`, 
        [description, taskId, userId]
      );

      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return createErrorResponse('Failed to edit task');
    }
  }

  // Update task status route
  if (path.startsWith('/tasks/') && path.endsWith('/status') && request.method === 'PATCH') {
    try {
      const taskId = path.split('/')[2];
      const { status, userId } = await request.json();

      await sqlite.execute(
        `UPDATE ${KEY}_tasks_${SCHEMA_VERSION} 
         SET status = ?
         WHERE id = ? AND user_id = ?`, 
        [status, taskId, userId]
      );

      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return createErrorResponse('Failed to update task status');
    }
  }

  // Clear tasks route
  if (path === '/tasks/clear' && request.method === 'DELETE') {
    try {
      const { userId } = await request.json();

      await sqlite.execute(`
        DELETE FROM ${KEY}_tasks_${SCHEMA_VERSION}
        WHERE user_id = ?
      `, [userId]);

      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return createErrorResponse('Failed to clear tasks');
    }
  }

  // Default route for the main application
  if (path === '/' || path === '') {
    const updatedCSS = `
      :root {
        --primary-color: #4a90e2;
        --secondary-color: #f5f5f5;
        --text-color: #333;
        --background-color: #f0f2f5;
      }

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: 'Arial', sans-serif;
        background-color: var(--background-color);
        color: var(--text-color);
        line-height: 1.6;
      }

      .app-container {
        max-width: 500px;
        margin: 0 auto;
        padding: 20px;
      }

      /* Authentication Styles */
      .auth-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
      }

      .auth-container {
        background-color: white;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        padding: 30px;
        width: 100%;
      }

      .auth-header {
        text-align: center;
        margin-bottom: 20px;
      }

      .auth-header h1 {
        color: var(--primary-color);
        margin-bottom: 10px;
      }

      .auth-form .form-group {
        margin-bottom: 15px;
      }

      .form-control {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 16px;
      }

      .btn {
        width: 100%;
        padding: 12px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        transition: background-color 0.3s;
      }

      .btn-primary {
        background-color: var(--primary-color);
        color: white;
      }

      .btn-primary:hover {
        opacity: 0.9;
      }

      .auth-footer {
        text-align: center;
        margin-top: 15px;
      }

      .link-text {
        color: var(--primary-color);
        cursor: pointer;
        margin-left: 5px;
      }

      .error-message {
        color: red;
        text-align: center;
        margin-bottom: 15px;
      }

      /* Dashboard Styles */
      .dashboard-wrapper {
        background-color: white;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        padding: 20px;
      }

      .dashboard-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }

      .task-creation-section {
        margin-bottom: 20px;
      }

      .task-form {
        display: flex;
      }

      .task-input {
        flex-grow: 1;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        margin-right: 10px;
      }

      .task-sections {
        margin-bottom: 20px;
      }

      .task-category {
        margin-bottom: 20px;
      }

      .task-category h2 {
        border-bottom: 2px solid var(--primary-color);
        padding-bottom: 10px;
        margin-bottom: 10px;
      }

      .task-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: var(--secondary-color);
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 10px;
      }

      .task-actions {
        display: flex;
        gap: 10px;
      }

      .btn-logout {
        background-color: #dc3545;
        color: white;
        width: auto;
        padding: 8px 15px;
      }

      .btn-add-task {
        width: auto;
        padding: 10px 15px;
      }

      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }

      .modal-content {
        background-color: white;
        padding: 20px;
        border-radius: 10px;
        width: 90%;
        max-width: 400px;
      }

      .modal-actions {
        display: flex;
        justify-content: space-between;
        margin-top: 15px;
      }

      .btn-secondary {
        background-color: #6c757d;
        color: white;
      }
    `;

    return new Response(`
      <html>
        <head>
          <title>Task Master</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>${updatedCSS}</style>
        </head>
        <body>
          <div id="root"></div>
          <script src="https://esm.town/v/std/catch"></script>
          <script type="module" src="${import.meta.url}"></script>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });
  }

  // 404 route
  return createErrorResponse('Not Found', 404);
}