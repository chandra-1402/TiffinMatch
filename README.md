# 🍱 TiffinMatch

**TiffinMatch** is a comprehensive web application for managing a tiffin delivery service. It connects talented home cooks with customers looking for delicious, homemade meals. 🏡🍲 

The platform supports multiple user roles, including **Customers**, **Cooks**, and **Admins**, providing a complete ecosystem for meal ordering, order tracking, and profile management. 🚀

---

## 🛠️ Tech Stack

### 🎨 Frontend
- ⚛️ **React 19** - UI Library
- ⚡ **Vite** - Build Tool
- 🛣️ **React Router** - Navigation
- 🌠 **Lucide React** - Beautiful Icons
- 📊 **Recharts** - Analytics & Charts
- 🗺️ **Leaflet** - Mapping & Delivery Routing

### ⚙️ Backend
- 🟢 **Node.js** - Runtime Environment
- 🚂 **Express.js** - Web Framework
- 🗄️ **SQLite** - Lightweight Database
- 🔗 **cors** - Middleware

---

## ✨ Features

- 🔐 **Multi-role Authentication:** Secure login and signup for Customers, Cooks, and Admins.
- 👤 **Profile Management:** Users can seamlessly update their profiles, passwords, and profile pictures.
- 🛒 **Order Management:** Customers can place orders, while cooks and admins can instantly update order statuses.
- 🎛️ **Role-based Dashboards:** Dedicated portals designed specifically for each role (e.g., Cook portal, Admin portal).
- 💾 **SQLite Database:** A lightweight, built-in SQLite database for securely storing user and order data.

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### 📋 Prerequisites

- 🟢 **Node.js** (v18 or higher recommended)
- 📦 **npm** (Node Package Manager)

### 💻 Installation

1. **Clone the repository** and navigate into the project directory:
   ```bash
   git clone https://github.com/chandra-1402/TiffinMatch.git
   cd TiffinMatch
   ```

2. **Install dependencies** for both the frontend and backend:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

---

## 🏃‍♂️ Running the Project

You will need **two terminal windows** to run both the frontend and backend simultaneously.

### 1️⃣ Start the Backend Server
The Express server handles API requests and connects to the SQLite database. It runs on port `3001`.
```bash
npm run start:backend
```
*Note: The SQLite database (`database.sqlite`) is automatically initialized upon starting the server.*

### 2️⃣ Start the Frontend Server
The Vite development server runs the React application, typically on port `5173`.
```bash
npm run dev
```

---

## 🏗️ Build for Production

To create an optimized production build of the frontend:
```bash
npm run build
```
The compiled assets will be placed in the `dist` directory.

---

## 🧹 Linting

To check for code issues using Oxlint:
```bash
npm run lint
```
