# TiffinMatch

TiffinMatch is a comprehensive web application for managing a tiffin delivery service. It connects home cooks with customers looking for homemade meals. The platform supports multiple user roles, including Customers, Cooks, and Admins, providing a complete ecosystem for meal ordering, order tracking, and profile management.

## Tech Stack

**Frontend:**
- React 19
- Vite
- React Router (if applicable)
- Lucide React (for icons)
- Recharts (for analytics/charts)
- Leaflet (for mapping/delivery routing)

**Backend:**
- Node.js
- Express.js
- SQLite (database)
- cors (middleware)

## Features

- **Multi-role Authentication:** Secure login and signup for Customers, Cooks, and Admins.
- **Profile Management:** Users can update their profiles, including passwords and profile pictures.
- **Order Management:** Customers can place orders, and cooks/admins can update order statuses.
- **Role-based Dashboards:** Dedicated portals for each role (e.g., Cook portal, Admin portal).
- **SQLite Database:** A lightweight, built-in SQLite database for storing users and orders.

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (Node Package Manager)

### Installation

1. Clone the repository and navigate into the project directory:
   ```bash
   cd TiffinMatch
   ```

2. Install the necessary dependencies for both the frontend and backend:
   ```bash
   npm install
   ```

### Running the Project

You will need two terminal windows to run both the frontend and backend simultaneously.

**1. Start the Backend Server:**

The Express server handles API requests and connects to the SQLite database. It runs on port `3001`.

```bash
npm run start:backend
```
*Note: The SQLite database (`database.sqlite`) is automatically initialized upon starting the server.*

**2. Start the Frontend Development Server:**

The Vite development server runs the React application, typically on port `5173`.

```bash
npm run dev
```

### Build for Production

To create an optimized production build of the frontend:

```bash
npm run build
```

The compiled assets will be placed in the `dist` directory.

### Linting

To check for code issues using Oxlint:

```bash
npm run lint
```
