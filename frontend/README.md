# Smart Queue Management System - Frontend

The Smart Queue Management System (SQMS) frontend is built using Next.js, React, TypeScript, Tailwind CSS and DaisyUI.

The frontend communicates with the NestJS backend through a Next.js reverse proxy.

## Technologies

- Next.js
- React
- TypeScript
- Axios
- Tailwind CSS
- DaisyUI
- Zod
- JWT Authentication

## User Roles

The system supports:

- Admin
- Staff
- Customer

## Customer Features

Customers can:

- Register and login
- View available services
- View available queues
- Filter queues by service
- Select Normal or Urgent priority
- Generate queue tickets
- View estimated waiting time
- View the current active ticket
- View recent ticket activity
- View ticket history
- Filter tickets by status
- View ticket details
- Cancel waiting tickets
- View notifications
- View and update profile

## Staff Features

Staff members can:

- Login to the Staff dashboard
- View their assigned counter
- View supported services
- Open, close or place their counter on break
- View only queues supported by their counter
- Open and close supported queues
- View waiting tickets
- Call the next ticket
- View the currently called ticket
- Complete called tickets
- Update profile

## Admin Features

Administrators can:

- View system statistics
- View user statistics chart
- Manage users
- Search and filter users
- Change user roles
- Manage services
- Create and edit services
- Deactivate services
- Delete services when allowed
- Manage queues
- Create and edit queues
- Open and close queues
- Delete queues when allowed
- Manage counters
- Assign Staff to counters
- Change counter status
- Manage tickets
- Filter and sort tickets
- Complete called tickets
- Cancel active tickets
- Update profile

## Authentication

The application uses JWT authentication.

The frontend stores:

- Access token
- Refresh token

The shared Axios client automatically:

- Adds the access token to protected API requests
- Uses the refresh token when the access token expires
- Stores the new access token
- Retries the original request
- Clears invalid tokens
- Redirects the user to login when authentication can no longer be refreshed

Current role authorization is checked using:

```text
GET /users/me
```

This ensures role changes made by an Administrator are reflected without relying only on the role stored in an older JWT.

## Environment Configuration

Create:

```text
.env.local
```

inside the frontend folder.

Add:

```env
BACKEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=/api
```

An example configuration is provided in:

```text
.env.example
```

## Reverse Proxy

The frontend sends API requests through:

```text
/api
```

For example:

```text
/api/users/me
```

Next.js forwards the request to:

```text
http://localhost:3000/users/me
```

The reverse proxy is configured in:

```text
next.config.ts
```

## Installation

Make sure Node.js and npm are installed.

Open a terminal inside the frontend folder and run:

```bash
npm install
```

## Running the Development Server

First start the NestJS backend on:

```text
http://localhost:3000
```

Then from the frontend folder run:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:3001
```

## Production Build

Create the production build using:

```bash
npm run build
```

Then run:

```bash
npm start
```

The production frontend runs on:

```text
http://localhost:3001
```

## Code Quality Checks

Run ESLint:

```bash
npm run lint
```

Run the TypeScript compiler check:

```bash
npx tsc --noEmit
```

## Main Routes

### Public Routes

```text
/
/login
/register
/services
/forgot-password
/reset-password
```

### Customer Routes

```text
/customer/dashboard
/customer/queues
/customer/tickets
/customer/notifications
/customer/profile
```

### Staff Routes

```text
/staff/dashboard
/staff/queue
/staff/counter
/staff/profile
```

### Admin Routes

```text
/admin/dashboard
/admin/users
/admin/services
/admin/queues
/admin/counters
/admin/tickets
/admin/profile
```

## Validation

The frontend uses:

- HTML form validation
- React state validation
- Zod validation for registration

The NestJS backend also validates incoming request DTOs using class-validator.

## Static Generation

The home page demonstrates static generation using Next.js:

```ts
export const dynamic = "force-static";
```

## Error Handling

The project includes:

- API error messages
- Loading states
- Success messages
- DaisyUI toast messages
- Custom application error page
- Custom 404 page
- Authentication failure handling

## Backend Requirement

The frontend requires the SQMS NestJS backend.

The backend provides:

- Authentication
- User management
- Services
- Queues
- Counters
- Tickets
- Notifications
- Email functionality