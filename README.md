# InkMe-3D T-Shirt Custom 👕

A full-stack web application for designing and customizing 3D t-shirts with
a real-time interactive 3D viewer. Built with React, Three.js, and a Node.js
Express backend.

The application allows users to change shirt colors, upload images, and apply
textures to a 3D t-shirt model rendered in the browser using WebGL. It
includes a customer-facing storefront, an admin dashboard for product
management, and a backend API with payment integration.

------------------------------------------------------------------------

# Demo

Live Demo:\
https://inkme3d.com

------------------------------------------------------------------------

# Project Structure

    InkMe-3D-T-Shirt-Custom/
    ├── client/             # React frontend (storefront)
    │   ├── package.json
    │   └── README.md
    ├── admin/              # React admin dashboard
    │   ├── package.json
    │   └── README.md
    ├── server/             # Node.js + Express backend API
    │   ├── app.js
    │   ├── routes/
    │   ├── models/
    │   ├── config/
    │   └── package.json
    ├── .gitattributes
    └── .gitignore

------------------------------------------------------------------------

# Technologies

## Frontend (Client)
-   React
-   Three.js
-   React Three Fiber
-   Tailwind CSS

## Admin Dashboard
-   React
-   Material UI (MUI)
-   Axios
-   React Router

## Backend (Server)
-   Node.js
-   Express.js
-   MongoDB / Mongoose (models)
-   JWT authentication
-   PayOS payment integration
-   Cloudinary (image storage)

## Development Tools
-   Vite (client and admin)
-   Nodemon (server development)
-   Git / GitHub
-   npm / yarn

------------------------------------------------------------------------

# Getting Started

## Prerequisites
-   Node.js v16+
-   npm or yarn
-   MongoDB database
-   Cloudinary account (for image uploads)
-   PayOS merchant account (for payments)

## Installation

### 1. Clone the repository

    git clone https://github.com/sudo-prog/InkMe-3D-T-Shirt-Custom.git
    cd InkMe-3D-T-Shirt-Custom

### 2. Set up the backend server

    cd server
    npm install
    # Configure environment variables (see server/config/)
    npm run dev

### 3. Set up the frontend client

    cd ../client
    npm install
    npm run dev

### 4. Set up the admin dashboard

    cd ../admin
    npm install
    npm run dev

------------------------------------------------------------------------

# Services

| Service    | Default Port | Description                                      |
|------------|-------------|--------------------------------------------------|
| Client     | 5173        | Customer-facing storefront with 3D t-shirt designer |
| Admin      | 5174        | Admin dashboard for product/user/order management |
| Server     | 3000        | Express API server with payment & auth endpoints |

------------------------------------------------------------------------

# Environment Variables

### Server (.env)
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PAYOS_CLIENT_ID=your_payos_client_id
PAYOS_API_KEY=your_payos_api_key
PAYOS_CHECKOUT_URL=your_payos_checkout_url
```

### Client (.env.local)
```
VITE_API_URL=http://localhost:3000
VITE_PAYOS_CLIENT_ID=your_payos_client_id
```

------------------------------------------------------------------------

# Mobile UI Standards

-   All interactive tap targets sized to 44px × 44px for accessibility
-   Viewport meta allows scaling (user-scalable=yes)
-   Touch actions properly scoped (e.g., touch-action: none only on
    Swiper.js containers to prevent double-tap zoom conflicts)

------------------------------------------------------------------------

# Author

**Nguyễn Tiến Đạt**

Frontend Developer (React • Next.js • Three.js)

GitHub: https://github.com/RinkVN

------------------------------------------------------------------------

# License

This project is open source and available under the MIT License.
