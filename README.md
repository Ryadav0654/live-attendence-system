# Live Attendance System – Backend

A backend service for a **Live Attendance System** built with **Node.js, Express, TypeScript, MongoDB, and JWT authentication**.  
The system supports **role-based access control (RBAC)** for **Teachers** and **Students**, class management, and secure authentication.

---

## 🚀 Features

- 🔐 JWT-based authentication (Access tokens)
- 👥 Role-based access control (Teacher / Student)
- 🏫 Class management
  - Teachers can create classes
  - Teachers can add students to their classes
  - Students can access only enrolled classes
- 📦 Secure password handling (bcrypt + `select: false`)
- ✅ Request validation using **Zod**
- 🛡️ Centralized error handling
- 🧠 Clean architecture (middlewares, controllers, models)

---

## 🧱 Tech Stack

- **Node.js**
- **Express**
- **TypeScript**
- **MongoDB + Mongoose**
- **JWT (jsonwebtoken)**
- **Zod** – request validation
- **bcryptjs** – password hashing

---

## 📁 Project Structure

```

src/
├── app.ts
├── index.ts
├── lib/
│   └── db.ts
├── controllers/
│   ├── auth.controller.ts
│   ├── user.controller.ts
│   └── class.controller.ts
├── middleware/
│   ├── verifyToken.ts
│   └── asyncHandler.ts
├── models/
│   ├── user.model.ts
│   └── class.model.ts
├── utils/
│   ├── appError.ts
│   └── asyncHandler.ts
├── routes/
│   ├── auth.routes.ts
│   ├── user.routes.ts
│   └── class.routes.ts
└── validators/
└── zodSchemas.ts

```

## 🔐 Authentication & Authorization

### Roles

```ts
enum ROLE {
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
}
```

### Access Rules

| Action               | Teacher             | Student          |
| -------------------- | ------------------- | ---------------- |
| Create class         | ✅                  | ❌               |
| Add student to class | ✅ (own class only) | ❌               |
| View class           | ✅ (own class)      | ✅ (if enrolled) |
| Get all students     | ✅                  | ❌               |

---

## 🔑 Authentication Flow

1. User signs up
2. Password is hashed using bcrypt
3. JWT token is issued on login
4. Token is verified via `verifyToken` middleware
5. Role & ownership checks are enforced per route

---

## 🛠️ Environment Variables

Create a `.env` file in the root:

```env
PORT=8080
DBURI=mongodb://127.0.0.1:27017
DBNAME=attendance
JWTSECRET=your_jwt_secret
```

---

## ▶️ Running the Project

### Install dependencies

```bash
pnpm install
```

### Development mode

```bash
pnpm run dev
```

### Build

```bash
pnpm run build
```

### Production

```bash
pnpm start
```

---

## 📌 API Endpoints (Sample)

### Auth

- `POST /auth/signup`
- `POST /auth/login`

### User

- `GET /users/students` → (Teacher only)
- `GET /users/me`

### Class

- `POST /class` → Create class (Teacher)
- `GET /class/:id` → Teacher (owner) or Student (enrolled)
- `POST /class/:id/add-student` → Teacher (owner)

---

## 🛡️ Error Handling

- All async routes are wrapped using `asyncHandler`
- Custom `AppError` class for operational errors
- Global error-handling middleware

---

## 🧠 Design Decisions

- **Stateless authentication** using JWT
- **Authorization is resource-based**, not token-based
- **No DB lookup on every request** unless required
- MongoDB `$addToSet` used to prevent duplicate student enrollment
- Schema-level and route-level validation

---

## 📈 Future Improvements

- Refresh token support
- Pagination & filtering
- Admin role
- Attendance tracking per class session
- Redis caching
- Unit & integration tests

---

## 👨‍💻 Author

**Ravindra Yadav**

- (`https://github.com/Ryadav0654`)

---

## 📄 License

MIT License
