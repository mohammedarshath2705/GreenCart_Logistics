# GreenCart Logistics Delivery Simulation & KPI Dashboard

## Project Overview

GreenCart Logistics Delivery Simulation & KPI Dashboard is an internal full-stack tool for managers at GreenCart Logistics, a fictional eco-friendly urban delivery company. The application enables simulation of delivery operations, lets managers input staffing and scheduling parameters, and visualizes key performance indicators (KPIs) such as profit, efficiency, on-time vs late deliveries, and fuel cost breakdown. It provides CRUD interfaces for managing drivers, routes, and orders, optimizing logistics decisions for profitability and sustainability.

---

## Tech Stack

**Backend:**
- Node.js (Express.js)
- Prisma ORM (`@prisma/client`, `prisma`)
- PostgreSQL (cloud: Render)
- JWT (`jsonwebtoken`) & password hashing (`bcryptjs`)
- Data import: `csv-parser`
- Environment: `dotenv`, `nodemon`
- CORS support: `cors`

**Frontend:**
- React.js (Hooks)
- Vite (build tool)
- Charting: Recharts
- Styling: Tailwind CSS, `@tailwindcss/vite`
- Routing: `react-router-dom`
- API requests: `axios`
- Icons: `lucide-react`
- Code quality: ESLint (with plugins), TypeScript

**Deployment:**
- Backend: Render (Node.js web service)
- Database: Render PostgreSQL (cloud)
- Frontend: Vercel

---

## Setup Instructions

### Prerequisites

- Node.js v18 or higher
- npm or yarn
- PostgreSQL database (recommended: Render cloud DB)
- Git

### Backend Setup

1. **Clone the repository**
    ```
    git clone https://github.com/mohammedarshath2705/GreenCart_Logistics.git
    cd green-cart-logistics/backend
    ```

2. **Install dependencies**
    ```
    npm install
    ```

3. **Add environment variables**
    - Create `.env` in backend directory (see next section).

4. **Set up PostgreSQL**
    - [Render PostgreSQL Setup]
        - In Render Dashboard: "+ New > PostgreSQL"
        - Configure DB and note the **connection string**.
    - Paste the connection URL in your `.env` file.

5. **Run Prisma migrations**
    ```
    npx prisma migrate dev
    ```

6. *(Optional)* **Seed initial data**
    ```
    node src/seed.js
    ```

7. **Start backend server**
    ```
    npx nodemon src/app.js
    ```
    Backend runs at `http://localhost:5000` (or port from `.env`).

### Frontend Setup

1. **Go to frontend directory**
    ```
    cd ../frontend
    ```

2. **Install dependencies**
    ```
    npm install
    ```

3. **Start frontend**
    ```
    npm run dev
    ```
    Access at `http://localhost:3000`.

---

## Environment Variables

Create a `.env` file in **backend/** with:
 ```
DATABASE_URL=your_render_postgres_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```


---

## Deployment Instructions

### Backend & PostgreSQL on Render

1. **Create cloud PostgreSQL:**
   - In Render dashboard: New → PostgreSQL.
   - Set name, region, and get connection string.

2. **Deploy backend:**
   - New → Web Service → select backend repo.
   - Set environment variables:
     - `DATABASE_URL`, `JWT_SECRET`, `PORT`
   - Connect to cloud DB using connection string.

3. **(Optional) Run migrations on Render:**
   - Use Render Shell or connect via Prisma Studio.

### Frontend on Vercel

1. **Import frontend repo to Vercel**
2. **Configure build settings**
   - Set environment variables if needed (for API endpoint).
3. **Deploy**

---

# API Documentation


You can explore and test the GreenCart Logistics API here:  
[**View API Documentation in Postman**](https://www.postman.com/blue-capsule-303088/myworkspace/collection/pe9pcfy/greencart-logistics-api)


----

## Manager Login

- username : admin
- password : secret123