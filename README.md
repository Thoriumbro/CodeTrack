# 🚀 Interview Prep Tracker

A full-stack web application that helps users organize and track coding interview preparation. Users can securely manage solved problems, monitor progress, schedule revisions, and analyze their preparation through an intuitive dashboard.

---

## ✨ Features

* 🔐 JWT-based Authentication (Register & Login)
* 📝 Add, Edit and Delete coding problems
* 🔍 Search problems by title
* 🎯 Filter problems by difficulty
* 📊 Dashboard with preparation statistics
* 📈 Progress tracker with completion percentage
* 🔥 Current solving streak
* 📅 Today's revision queue
* ⏰ Revision status indicators (Today, Tomorrow, Overdue)
* 📱 Responsive UI for desktop and mobile
* 🗄️ MySQL database integration
* 🔒 Protected API routes

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* React Router DOM
* Axios
* React Icons

### Backend

* Node.js
* Express.js
* JWT Authentication
* bcrypt.js

### Database

* MySQL
* mysql2

---

## 📂 Project Structure

```
Interview-Prep-Tracker/

├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── db/
│   ├── index.js
│   └── package.json
│
└── README.md
```

---

## 📊 Dashboard Features

* Total Problems Solved
* Easy / Medium / Hard distribution
* Progress towards solving goal
* Current solving streak
* Today's scheduled revisions
* Search and difficulty filters
* Revision status tracking

---

## 🗄️ Database Schema

### Users

| Column   | Type    |
| -------- | ------- |
| id       | INT     |
| username | VARCHAR |
| email    | VARCHAR |
| password | VARCHAR |

### Problems

| Column        | Type    |
| ------------- | ------- |
| id            | INT     |
| user_id       | INT     |
| title         | VARCHAR |
| platform      | VARCHAR |
| difficulty    | VARCHAR |
| topic         | VARCHAR |
| company_tags  | TEXT    |
| time_taken    | INT     |
| solved_date   | DATE    |
| revision_date | DATE    |
| notes         | TEXT    |
| favorite      | BOOLEAN |

---

## 🔐 Authentication

* Passwords are securely hashed using bcrypt.
* JWT tokens are generated after successful login.
* Protected routes require a valid JWT token.
* Each user can only access their own problems.

---

## ⚙️ Installation

### Clone the repository

```bash
git clone <repository-url>
cd Interview-Prep-Tracker
```

### Backend Setup

```bash
cd server
npm install
```

Create a `.env` file:

```
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=interview_tracker

JWT_SECRET=your_secret_key
```

Start the backend:

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## 📸 Screenshots

Add screenshots here after deployment.

* Login Page
* Register Page
* Dashboard
* Add Problem Modal
* Progress Dashboard
* Revision Queue

---

## 🚀 Future Improvements

* Sorting by date and difficulty
* Company-wise filtering
* Favorite problems
* Weekly and monthly analytics
* Notes editor with Markdown support
* Export data as CSV
* Dark/Light theme
* Email revision reminders

---

## 💡 Learning Outcomes

This project helped me gain hands-on experience with:

* Building RESTful APIs using Express.js
* JWT-based authentication and authorization
* React state management using Hooks
* CRUD operations with MySQL
* Secure password hashing with bcrypt
* Building reusable React components
* Responsive UI development using Tailwind CSS
* Integrating frontend and backend applications

---

## 📄 License

This project is intended for educational and portfolio purposes.

