# 🩸 Life Drops — Blood Donation REST API

## Group Members

- **Member A:** Waris Ali  
- **Member B:** Laiba Usman  

---

## 📌 Project Overview

Life Drops is a RESTful Blood Donation Management System designed to connect blood donors, patients, and hospitals efficiently.

It allows users to:
- Register and login securely
- Register as donors
- Create and manage blood requests
- View donors and blood inventory
- Receive notifications
- Admin can manage users and system data

Built using Node.js, Express.js, and MongoDB following REST API architecture.

---

## 🛠️ Tech Stack

- Node.js  
- Express.js  
- MongoDB (Mongoose)  
- JWT Authentication  
- express-validator  
- bcryptjs  
- dotenv  
- Helmet & Mongo Sanitize  

---
## 📡 API Endpoints

## 🔑 Auth Module

- `POST /api/auth/register` → Register a new user  
- `POST /api/auth/login` → Login user and get JWT token  
- `GET /api/auth/me` → Get logged-in user profile  

---

## 👤 Users Module

- `GET /api/users` → Get all users (Admin only)  
- `GET /api/users/:id` → Get user by ID  
- `PATCH /api/users/:id` → Update user profile  
- `DELETE /api/users/:id` → Delete user (Admin only)  
- `PATCH /api/users/:id/role` → Change user role (Admin only)  

---

## 🩸 Donors Module

- `GET /api/donors` → Get all donors  
- `GET /api/donors/:id` → Get donor by ID  
- `POST /api/donors/register` → Register as donor  
- `PATCH /api/donors/:id` → Update donor profile  

---

## 🏥 Blood Requests Module

- `POST /api/requests` → Create blood request  
- `GET /api/requests` → Get all requests  
- `GET /api/requests/my` → Get logged-in user's requests  
- `PATCH /api/requests/:id/status` → Update request status (Admin)  

---

## 🏦 Blood Bank Module

- `GET /api/bloodbank/inventory` → Get blood inventory  
- `PATCH /api/bloodbank/inventory/:bloodGroup` → Update blood stock  

---

## 🔔 Notifications Module

- `GET /api/notifications/my` → Get user notifications  
- `PATCH /api/notifications/:id/read` → Mark notification as read

---
## 🧩 Project Structure
src/
 ├── modules/
 │    ├── auth/
 │    ├── users/
 │    ├── donors/
 │    ├── requests/
 │    ├── bloodbank/
 │    └── notifications/
 ├── middleware/
 ├── utils/
 ├── config/
 └── routes/

 ---
 ## 🚀 Features

- JWT Authentication  
- Role-based Authorization (User, Donor, Admin)  
- Modular and scalable architecture  
- Input validation using express-validator  
- Centralized error handling middleware  
- Secure API design with best practices  
