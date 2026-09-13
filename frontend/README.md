# Smart Queue Management System - Frontend

The Smart Queue Management System (SQMS) frontend is built with Next.js, React, TypeScript, Tailwind CSS and DaisyUI.

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

The application supports three roles:

- Admin
- Staff
- Customer

## Main Features

### Customer

Customers can:

- Register and login
- View available services
- View available queues
- Filter queues by service
- Select ticket priority
- Generate queue tickets
- View estimated waiting time
- View ticket history
- View ticket details
- Cancel waiting tickets
- View notifications
- View current active ticket
- View recent ticket activity
- View and update profile

### Staff

Staff members can:

- Login to the Staff dashboard
- View their assigned counter
- View supported services
- Open, close or place their counter on break
- View supported queues
- Open and close supported queues
- View waiting tickets
- Call the next ticket
- View the current called ticket
- Complete called tickets
- Update profile

### Admin

Administrators can:

- View system statistics
- View user statistics chart
- Manage users and roles
- Search and filter users
- Manage services
- Manage queues
- Manage counters
- Assign Staff to counters
- Manage tickets
- Complete or cancel tickets
- Update profile

## Authentication

The application uses JWT authentication.

The frontend stores:

- access token
- refresh token

The shared Axios client automatically:

- adds the access token to protected requests
- refreshes an expired access token
- retries the failed request
- clears tokens and redirects to login if refresh fails

Role authorization is verified using the backend `/users/me` endpoint.

## Environment Configuration

Create:

```text
.env.local