# SuperMarket Management System

A full-stack supermarket management system with role-based access, analytics, and modern UI.  
Built with React (frontend), Node.js/Express (backend), Sequelize ORM, and MySQL.

---

## Features

- **Role-based access:** Administrator, Backend Developer, Business Analyst
- **Entities:** Products, Categories, Branches, Inventory, Customers, Employees, Orders, Payments, Suppliers, Restock Orders/Items, Users, Roles
- **Full CRUD:** For all major entities (with permissions)
- **Authentication:** JWT-based login/signup, protected routes
- **Analytics:** Sales data, charts, and reporting
- **Modern UI:** Material UI, responsive design, notifications
- **REST API:** Well-structured endpoints for all resources

---

## Tech Stack

- **Frontend:** React, Material UI, Axios, React Router, notistack
- **Backend:** Node.js, Express, Sequelize, MySQL, JWT, bcrypt
- **Database:** MySQL

---

## Folder Structure

```
SuperMarketSystem/
  backend/      # Express API, Sequelize models, controllers, routes
  frontend/     # React app, pages, components, services
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd SuperMarketSystem
```

### 2. Setup the Backend

```bash
cd backend
npm install
```

- Create a `.env` file in `backend/` with your database and JWT settings:
  ```
  DB_HOST=localhost
  DB_USER=your_mysql_user
  DB_PASSWORD=your_mysql_password
  DB_NAME=supermarket_db
  JWT_SECRET=your_jwt_secret
  ```

- **Run migrations/seeders** (if provided) or ensure your MySQL database matches the schema.

- **Start the backend:**
  ```bash
  npm run dev
  # or
  npm start
  ```

### 3. Setup the Frontend

```bash
cd ../frontend
npm install
```

- Create a `.env` file in `frontend/`:
  ```
  REACT_APP_API_URL=http://localhost:5000/api
  ```

- **Start the frontend:**
  ```bash
  npm start
  ```

### 4. Access the App

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5000/api](http://localhost:5000/api)

---

## Example Roles & Credentials

- **Administrator:** Full access (create via DB or seed)
- **Backend Developer:** CRUD on all except admin-only
- **Business Analyst:** View only

> Default login credentials depend on your seed data.  
> You can create users via the signup page (except Administrator).

---

## Useful Scripts

- `npm run dev` (backend): Start backend with nodemon
- `npm start` (frontend/backend): Start in production mode

---

## Customization & Extending

- Add more analytics, reports, or UI features as needed.
- Integrate with other databases or authentication providers.
- Deploy to cloud (Heroku, Vercel, etc.) with environment variable setup.

---

## License

MIT (or your chosen license)

---

## Contact

For questions or contributions, open an issue or pull request. 