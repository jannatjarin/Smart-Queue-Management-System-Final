# Smart Queue Management System - Backend

The Smart Queue Management System (SQMS) backend is a REST API built with NestJS, TypeScript, PostgreSQL, TypeORM and JWT authentication.

It provides the server-side functionality for authentication, user management, services, queues, counters, tickets, notifications and email features.

The frontend runs separately using Next.js and communicates with this backend through REST API endpoints.

---

## Technologies Used

- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- JWT Authentication
- Passport
- bcryptjs
- class-validator
- class-transformer
- Nodemailer
- NestJS Mailer
- Swagger
- Jest

---

## User Roles

The system supports three roles:

- Customer
- Staff
- Admin

### Customer

Customers can:

- Register an account
- Login
- Refresh authentication tokens
- View and update their profile
- View available services
- View available queues
- Create queue tickets
- Select Normal or Urgent ticket priority
- View estimated waiting time
- View their ticket history
- Cancel their own waiting tickets
- View notifications
- Request a password reset
- Reset their password

### Staff

Staff members can:

- Login
- View their assigned counter
- View services supported by their counter
- Change their counter status
- View supported queues
- Open or close supported queues
- View waiting tickets
- Call the next waiting ticket
- Complete the currently called ticket
- View and update their profile

### Admin

Administrators can:

- View all users
- Change user roles
- Manage services
- Activate or deactivate services
- Manage queues
- Manage counters
- Assign Staff to counters
- Monitor all tickets
- Complete called tickets
- Cancel active tickets
- View and update their profile

---

## Main Backend Modules

The backend is organized into the following main modules:

```text
src/
├── auth/
├── users/
├── services/
├── queues/
├── counters/
├── tickets/
├── notifications/
├── mail/
└── common/
```

These modules separate authentication, business logic, database access and shared authorization functionality.

---

## Database

SQMS uses PostgreSQL with TypeORM.

Main entities include:

- Users
- Services
- Queues
- Counters
- Tickets
- Notifications

Make sure PostgreSQL is installed and running before starting the backend.

---

## Environment Configuration

Create a file named:

```text
.env
```

inside the backend folder.

You can copy the values from:

```text
.env.example
```

Example:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_postgresql_password
DB_DATABASE=sqms

JWT_ACCESS_SECRET=your_access_token_secret
JWT_ACCESS_EXPIRES_IN=15m

JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRES_IN=7d

MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=your_mailtrap_username
MAIL_PASSWORD=your_mailtrap_password
MAIL_FROM="SQMS <no-reply@sqms.local>"
```

Do not commit the real `.env` file to GitHub.

Only `.env.example` should be committed.

---

## Installation

Open a terminal inside the backend folder.

Run:

```bash
npm install
```

---

## Run the Backend

### Development Mode

Run:

```bash
npm run start:dev
```

The backend will run on:

```text
http://localhost:3000
```

The default port is `3000` unless another port is configured in `.env`.

---

## Swagger API Documentation

Swagger documentation is available while the backend is running.

Open:

```text
http://localhost:3000/api
```

Swagger can be used to view and test the available REST API endpoints.

Protected endpoints use Bearer JWT authentication.

---

## Frontend Connection

The Next.js frontend runs on:

```text
http://localhost:3001
```

CORS is configured to allow requests from the frontend application.

The frontend normally communicates with this backend through its Next.js reverse proxy.

---

## Authentication

SQMS uses JWT authentication.

After a successful login, the backend returns:

```json
{
  "access_token": "...",
  "refresh_token": "..."
}
```

The access token is used for protected requests.

The refresh token is used to obtain a new access token when the existing access token expires.

The backend checks the user's current database role for protected requests so that role changes are reflected correctly.

---

## Authentication Endpoints

```text
POST /auth/register
POST /auth/login
POST /auth/refresh
POST /auth/forgot-password
POST /auth/reset-password
```

Public registration creates Customer accounts.

Users cannot register themselves as Staff or Admin.

---

## User Endpoints

Authenticated user:

```text
GET   /users/me
PATCH /users/me
```

Admin:

```text
GET   /users
PATCH /users/:id/role
```

Administrators can view users and change user roles.

An Admin cannot demote their own account.

---

## Service Endpoints

Public:

```text
GET /services
GET /services/:id
```

Admin:

```text
POST   /services
PATCH  /services/:id
PATCH  /services/:id/deactivate
DELETE /services/:id
```

Services contain information such as:

- Name
- Description
- Department
- Estimated service time
- Active status

A Service with active waiting or called tickets cannot be deactivated.

When a Service is deactivated, its related queues are closed.

---

## Queue Endpoints

Public:

```text
GET /queues
GET /queues/:id
```

Supported query filters include:

```text
serviceId
status
```

Admin:

```text
POST   /queues
PATCH  /queues/:id
DELETE /queues/:id
```

Admin and authorized Staff:

```text
PATCH /queues/:id/status
```

New queues are created in the closed state.

Staff members can only manage queues belonging to services supported by their assigned counter.

---

## Counter Endpoints

Admin:

```text
POST  /counters
PATCH /counters/:id/assign-staff
```

Admin and Staff:

```text
GET   /counters
GET   /counters/:id
PATCH /counters/:id/status
```

Counter statuses include:

```text
open
closed
on_break
```

Staff members can only access and manage their own assigned counter.

A Staff member cannot be assigned to multiple counters at the same time.

---

## Ticket Endpoints

Customer:

```text
POST /tickets
GET  /tickets/mytickets
```

Admin and Staff:

```text
GET /tickets
```

Authenticated permitted users:

```text
GET /tickets/:id
```

Staff:

```text
PATCH /tickets/queue/:queueId/next
```

Staff and Admin:

```text
PATCH /tickets/:id/complete
```

Customer and Admin:

```text
PATCH /tickets/:id/cancel
```

---

## Ticket Statuses

Tickets use the following statuses:

```text
waiting
called
completed
cancelled
```

Normal workflow:

```text
WAITING
   ↓
CALLED
   ↓
COMPLETED
```

A Customer may also cancel their own ticket while it is still:

```text
WAITING
```

---

## Ticket Priority

Tickets support:

```text
normal
urgent
```

The selected priority is stored with the ticket.

The current queue scheduling logic calls the oldest waiting ticket first.

---

## Ticket Business Rules

The backend enforces rules including:

- Customers cannot create a ticket for a closed queue
- Customers cannot create a ticket for an inactive service
- Queue and Service must match
- A Customer cannot have multiple active tickets in the same queue
- Staff must have an assigned counter before calling tickets
- The assigned counter must be open
- The queue must be open
- The counter must support the queue's service
- A counter cannot have more than one called ticket at the same time
- Staff cannot complete a ticket called by another counter
- Only called tickets can be completed
- Customers can only cancel their own waiting tickets
- Completed and cancelled tickets cannot be processed again

---

## Estimated Waiting Time

When a Customer creates a ticket, SQMS calculates an estimated waiting time using:

- The queue
- Number of waiting tickets
- Service estimated time
- Number of available open counters supporting that service

If no suitable open counter is available, estimated waiting time may not be available.

---

## Notifications

Authenticated users can retrieve their notifications using:

```text
GET /notifications/me
```

Notifications are created for important events such as:

- Registration
- Ticket creation
- Ticket called
- Ticket completed
- Ticket cancelled
- Password reset

---

## Password Recovery

Users can request a password reset using:

```text
POST /auth/forgot-password
```

The response does not reveal whether an email address exists in the system.

A valid reset token can then be submitted through:

```text
POST /auth/reset-password
```

Reset tokens are protected against reuse.

---

## Email

The backend uses NestJS Mailer and Nodemailer.

Email settings are configured using:

```env
MAIL_HOST=
MAIL_PORT=
MAIL_USER=
MAIL_PASSWORD=
MAIL_FROM=
```

Mailtrap can be used during development for testing email functionality.

---

## Validation

Global NestJS validation is enabled using `ValidationPipe`.

Configuration includes:

```text
whitelist: true
transform: true
forbidNonWhitelisted: true
```

DTOs use `class-validator` and `class-transformer` to validate request data.

Invalid or unexpected request fields are rejected.

---

## Error Handling

The application includes a global HTTP exception filter.

The backend returns structured error responses instead of exposing internal server errors directly to the frontend.

---

## Authorization

Protected routes use JWT authentication and role-based authorization.

The backend enforces authorization even when frontend buttons or pages are hidden.

This means frontend role protection is not relied on as the only security mechanism.

---

## Build

To create a production build:

```bash
npm run build
```

The compiled application is generated inside:

```text
dist/
```

---

## Production Mode

After building the application:

```bash
npm run start:prod
```

---

## Testing

Run all unit tests:

```bash
npm test -- --runInBand
```

Other available commands include:

```bash
npm run test
npm run test:watch
npm run test:cov
npm run test:e2e
```

---

## Formatting

Run Prettier using:

```bash
npm run format
```

---

## Backend and Frontend Ports

```text
Backend:
http://localhost:3000

Swagger:
http://localhost:3000/api

Frontend:
http://localhost:3001
```

---

## Recommended Startup Order

Start PostgreSQL first.

Then start the backend:

```bash
cd backend
npm install
npm run start:dev
```

Then start the frontend in another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:3001
```

---

## Core SQMS Workflow

The main Smart Queue Management System workflow is:

```text
ADMIN
  ↓
Create Service
  ↓
Create Queue
  ↓
Create Counter
  ↓
Assign Staff
  ↓
Open Queue

STAFF
  ↓
Open Assigned Counter

CUSTOMER
  ↓
Select Service and Queue
  ↓
Create Ticket
  ↓
WAITING

STAFF
  ↓
Call Next Ticket
  ↓
CALLED

CUSTOMER
  ↓
Views Called Status and Counter

STAFF
  ↓
Complete Ticket
  ↓
COMPLETED

CUSTOMER
  ↓
Views Completion and Notification
```

---

## Project Notes

- PostgreSQL must be running before the backend starts.
- Do not commit `.env`.
- Do not submit `node_modules`.
- Do not submit generated `dist` files unless specifically requested.
- Use `.env.example` to document required environment variables.
- The frontend and backend should be run as separate applications.