# 🍔 FoodieHub - MERN Food Ordering App

A full-stack food ordering web application built with the MERN stack (MongoDB, Express, React, Node.js).

## 📂 Project Structure

```
food-app/
├── frontend/       # React App (User Side) - Port 5173
├── backend/        # Node + Express API   - Port 5000
├── admin/          # Admin Panel (React)  - Port 5174
├── .env            # Environment variables
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (Atlas or local)

### 1. Configure Environment
Edit `.env` in the root `food-app/` directory:

```env
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/food-app?retryWrites=true&w=majority
JWT_SECRET=food_app_super_secret_key_2024_xK9mP2vL8
PORT=5000
```

### 2. Install & Run Backend
```bash
cd food-app/backend
npm install
npm run dev
```
Server runs at: **http://localhost:5000**

### 3. Install & Run Frontend
```bash
cd food-app/frontend
npm install
npm run dev
```
App runs at: **http://localhost:5173**

### 4. Install & Run Admin Panel
```bash
cd food-app/admin
npm install
npm run dev
```
Admin runs at: **http://localhost:5174**

## 🔗 Localhost URLs

| Service    | URL                        |
|------------|----------------------------|
| Frontend   | http://localhost:5173       |
| Backend    | http://localhost:5000       |
| Admin      | http://localhost:5174       |
| API Health | http://localhost:5000/api/health |

## 📌 Features

### User Features
- Browse food items with category filters
- Add items to cart (works without login)
- Sign up / Login with JWT authentication
- Checkout with delivery address & payment selection
- View order history on profile page

### Admin Features
- Admin login (role-based access)
- Add new food items with image upload
- View & delete products
- View all orders with status management

### Creating an Admin User
1. Sign up as a normal user first via the frontend
2. In MongoDB, change the user's `role` field from `"user"` to `"admin"`
3. Login to the admin panel at http://localhost:5174

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS v3, Framer Motion, React Router, Axios
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, Multer
- **Admin**: React, Vite, Tailwind CSS v3, React Router, Axios

## 📡 API Endpoints

| Method | Route                  | Description              | Auth    |
|--------|------------------------|--------------------------|---------|
| POST   | /api/auth/signup       | Register user            | Public  |
| POST   | /api/auth/login        | Login user               | Public  |
| GET    | /api/auth/profile      | Get profile              | User    |
| GET    | /api/products          | Get all products         | Public  |
| POST   | /api/products          | Add product              | Admin   |
| DELETE | /api/products/:id      | Delete product           | Admin   |
| GET    | /api/cart              | Get cart                 | User    |
| POST   | /api/cart/add          | Add to cart              | User    |
| PUT    | /api/cart/update       | Update cart item         | User    |
| DELETE | /api/cart/remove/:id   | Remove from cart         | User    |
| POST   | /api/orders/place      | Place order              | User    |
| GET    | /api/orders/my-orders  | Get my orders            | User    |
| GET    | /api/orders/all        | Get all orders           | Admin   |
| PUT    | /api/orders/status/:id | Update order status      | Admin   |
