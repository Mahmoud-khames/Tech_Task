# Task Management System

## Overview
This is a full-stack task management system that allows administrators to create, assign, update, and delete tasks while notifying users via email. The system also supports user authentication and role-based access control.

## Features
- User authentication (login, register, logout)
- Role-based access control (Admin & User)
- Task management (Create, Read, Update, Delete)
- Assigning tasks to multiple users
- Email notifications for assigned tasks
- User profile management
- Password change functionality

## Tech Stack
### **Client:**
- React.js with TypeScript
- React Query for state management
- React Router for navigation
- Tailwind CSS for styling
- Axios for API requests
- React Toastify for notifications

### **Backend:**
- Node.js with Express.js
- MongoDB with Mongoose ORM
- JSON Web Tokens (JWT) for authentication
- Nodemailer for email notifications
- bcrypt.js for password hashing

## Installation & Setup

### **1. Clone the Repository**
```sh
git clone https://github.com/Mahmoud-khames/Tech_Task.git
cd Tech_Task
```

### **2. Install Dependencies**
#### **Backend**
```sh
cd backend
npm install
```

#### **Client**
```sh
cd Client
npm install
```

### **3. Configure Environment Variables**
Create a `.env` file in the `backend` folder and add the following:
```env
PORT=4000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret-key
SMTP_HOST=smtp.your-email-provider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@example.com
SMTP_PASS=your-email-password
```

### **4. Run the Project**
#### **Backend**
```sh
npm start
```

#### **Client**
```sh
npm run dev
```

## API Endpoints
### **Authentication**
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive a token
- `POST /api/auth/change-password` - Change user password

### **Users Management**
- `GET /api/auth/users` - Get all users (Admin only)
- `PATCH /api/auth/users/:id` - Update user details
- `DELETE /api/auth/users/:id` - Delete a user (Admin only)

### **Task Management**
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PATCH /api/tasks/:id` - Update an existing task
- `DELETE /api/tasks/:id` - Delete a task

## How It Works
1. **Users can register and log in** to the system.
2. **Admins can create and assign tasks** to users.
3. **Assigned users receive an email notification**.
4. **Users can update task status** and view assigned tasks.
5. **Admins can edit or delete tasks**.
6. **Users can update their profile** and change passwords.

## Screenshots
_Add screenshots of the application here_

## Future Improvements
- Implement real-time notifications
- Add task categories & priorities
- Enhance UI/UX with animations
- Integrate a file attachment system

## Contributing
Feel free to fork the repo and submit pull requests for improvements!

## License
This project is licensed under the MIT License.

