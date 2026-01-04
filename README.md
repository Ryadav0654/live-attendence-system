# Live Attendance System – Backend

> A **secure, real-time backend system** for managing live classroom attendance, built with **Node.js, Express, TypeScript, MongoDB, JWT**, and **WebSockets**.

This project demonstrates **production-style backend engineering**, including **authentication**, **role-based authorization**, **real-time communication**, and **data persistence**, designed with clear trade-offs and scalability in mind.

## Highlights

- **JWT-based authentication** with role-aware authorization
- **Role-Based Access Control (RBAC)** for Teachers & Students
- **Class management** with ownership and enrollment enforcement
- **Real-time attendance tracking** using WebSockets
- **Reliable persistence** of attendance data in MongoDB
- **Strict validation & error handling** using Zod and custom middleware
- **Clean, modular architecture** with TypeScript strict mode

## Tech Stack

| Category        | Technologies         |
| --------------- | -------------------- |
| Backend Runtime | Node.js              |
| Web Framework   | Express              |
| Language        | TypeScript           |
| Database        | MongoDB + Mongoose   |
| Real-Time       | WebSockets (`ws`)    |
| Authentication  | JWT (`jsonwebtoken`) |
| Validation      | Zod                  |
| Security        | bcrypt               |

## System Overview

- **HTTP (Express)**
  Used for authentication, class management, and attendance session control.

- **WebSockets**
  Used for live attendance updates and real-time communication.

- **In-Memory Session**
  Attendance is tracked live in memory and persisted only when the session ends.

- **MongoDB**
  Serves as the source of truth for users, classes, and attendance records.

---

## Authentication & Authorization

### Roles

```ts
enum ROLE {
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
}
```

### Access Control Matrix

| Action              | Teacher        | Student       |
| ------------------- | -------------- | ------------- |
| Create class        | ✅             | ❌            |
| Add students        | ✅ (own class) | ❌            |
| View class          | ✅ (own)       | ✅ (enrolled) |
| Start attendance    | ✅             | ❌            |
| View own attendance | ❌             | ✅            |

Authorization is **resource-based**, not token-based.

## Real-Time Attendance Design

### Key Assumption

> Only **one active attendance session** can exist at a time.

This simplifies WebSocket logic and ensures correctness for an MVP or interview-grade system.

### Attendance Lifecycle

1. Teacher starts a session (`POST /attendance/start`)
2. Attendance is tracked **live in memory**
3. Students receive real-time updates via WebSockets
4. Teacher finalizes session (`DONE`)
5. Attendance is persisted to MongoDB
6. Session state is cleared

## Project Structure

```
src/
├── app.ts
├── index.ts
├── lib/db.ts
├── controllers/
│   ├── auth.controller.ts
│   ├── class.controller.ts
│   ├── user.controller.ts
│   └── attendance.controller.ts
├── types/
│   |__ type.ts
├── middleware/
│   ├── verifyToken.ts
│   └── asyncHandler.ts
├── models/
│   ├── user.model.ts
│   ├── class.model.ts
│   └── attendance.model.ts
├── routes/
│   ├── auth.routes.ts
│   ├── class.routes.ts
│   ├── user.routes.ts
│   └── attendance.routes.ts
├── utils/
│   ├── appError.ts
│   └── asyncHandler.ts
    └── AttendanceSession.ts
└── validators/
    └── zodSchemas.ts
```

## Authentication Flow

1. User signs up → password hashed with bcrypt
2. User logs in → JWT issued
3. Token verified via middleware or WebSocket handshake
4. Role & ownership checks enforced per request/event

## API Overview

### Auth

- `POST /auth/signup`
- `POST /auth/login`
- `GET /users/me`

### Users

- `GET /users/students` → Teacher only

### Classes

- `POST /class` → Create class (Teacher)
- `GET /class/:id` → Teacher (owner) / Student (enrolled)
- `POST /class/:id/add-student` → Teacher (owner)

### Attendance

- `POST /attendance/start` → Start live session (Teacher)
- `GET /class/:id/my-attendance` → Student attendance status

## Error Handling Strategy

- Centralized `AppError` abstraction
- Consistent error response format
- Async routes wrapped with `asyncHandler`
- WebSocket errors emitted as structured events

## Engineering Decisions

- Stateless JWT authentication
- In-memory session for real-time performance
- MongoDB writes deferred until session completion
- `$addToSet` used to prevent duplicate enrollments
- TypeScript strict mode for safety and correctness

## Getting Started

### Environment Variables

```env
PORT=8080
DBURI=mongodb://127.0.0.1:27017
DBNAME=attendance
JWTSECRET=your_jwt_secret
```

### Clone the Repository

```bash
git clone <Repository_url>
cd live-attendance-system
```

### Install & Run

```bash
pnpm install
pnpm run dev
```

<!-- ## 📈 Future Enhancements

* Redis-backed attendance sessions
* Multiple concurrent sessions
* Refresh tokens
* Attendance history & analytics
* Pagination & filtering
* Automated testing
* Horizontal scaling support

--- -->

## 👨‍💻 Author

**Ravindra Yadav**
GitHub: [https://github.com/Ryadav0654](https://github.com/Ryadav0654)

## 📄 License

MIT License
