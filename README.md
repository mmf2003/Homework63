# Homework62 — Express.js with PUG and EJS

A Node.js and Express.js application demonstrating server-side HTML rendering using two template engines: **PUG** for user pages and **EJS** for article pages.

The project extends Homework61, preserving its MVC architecture, middleware, authentication, authorization, session management, and error handling while introducing dynamic HTML templates and responsive CSS styling.

## Technologies

- Node.js
- Express.js
- JavaScript (ES Modules)
- PUG Template Engine
- EJS Template Engine
- HTML5 and CSS3
- npm
- Node.js Built-in Test Runner

## Features

- Server-side HTML rendering with PUG and EJS
- Dynamic user and article pages
- Responsive dashboard interface
- User profiles and article details
- Modular MVC architecture
- Request logging
- Bearer token authentication
- Role-based access control
- Input validation
- Cookie-based session management
- Centralized error handling
- Automated HTTP tests

## Project Structure

```text
Homework62/
├── src/
│   ├── controllers/
│   │   ├── rootController.js
│   │   ├── usersController.js
│   │   └── articlesController.js
│   ├── middleware/
│   │   ├── requestLogger.js
│   │   ├── basicAuth.js
│   │   ├── validateUser.js
│   │   ├── checkArticleAccess.js
│   │   ├── sessionMiddleware.js
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── rootRoutes.js
│   │   ├── usersRoutes.js
│   │   └── articlesRoutes.js
│   ├── data/
│   │   ├── users.js
│   │   └── articles.js
│   └── app.js
├── views/
│   ├── pug/
│   │   ├── users.pug
│   │   └── user.pug
│   └── ejs/
│       ├── articles.ejs
│       └── article.ejs
├── public/
│   └── css/
│       └── style.css
├── server.js
├── test.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/mmf2003/Homework62.git
```

### 2. Navigate to the project directory

```bash
cd Homework62
```

### 3. Install dependencies

```bash
npm install
```

The required Express, PUG, and EJS packages are installed through npm.

## Running the Application

Start the server:

```bash
npm start
```

The application runs at:

http://localhost:3000

For development with automatic restarts:

```bash
npm run dev
```

## Template Engines

### PUG — Users

PUG is used to render user-related pages.

**GET /users**

Displays a list of users containing:

- User name
- Email address
- User role
- Profile navigation link

Template: `views/pug/users.pug`

**GET /users/:userId**

Displays an individual user profile containing:

- User ID
- Name
- Email
- Role

Template: `views/pug/user.pug`

Example:

http://localhost:3000/users/1

If the user does not exist, the server returns HTTP 404.

### EJS — Articles

EJS is used to render article-related pages.

**GET /articles**

Displays an article dashboard containing:

- Article title
- Category
- Description
- Author
- Link to the article

Template: `views/ejs/articles.ejs`

**GET /articles/:articleId**

Displays a detailed article page containing:

- Article title
- Category
- Author
- Article content

Template: `views/ejs/article.ejs`

Example:

http://localhost:3000/articles/1

If the article does not exist, the server returns HTTP 404.

## MVC Architecture

The project uses an MVC-inspired architecture.

**Models / Data**

The `src/data/` directory contains sample users and articles. These datasets are used to generate dynamic HTML pages.

**Views**

The `views/` directory contains PUG and EJS templates responsible for displaying application data.

**Controllers**

Controllers process requests, retrieve the appropriate data, and render templates using `res.render()`.

**Routes**

Route modules define HTTP endpoints and connect them to middleware and controllers.

### Request Flow

```text
HTTP Request
     |
     v
Express Application
     |
     v
Global Middleware
     |
     v
Express Router
     |
     v
Authentication / Validation
     |
     v
Controller
     |
     v
PUG or EJS Template
     |
     v
Generated HTML Response
```

## API Routes

### Root Route

| Method | Endpoint | Description                     |
| ------ | -------- | ------------------------------- |
| GET    | `/`      | Returns the root route response |

### User Routes

| Method | Endpoint         | Description                   | Authentication |
| ------ | ---------------- | ----------------------------- | -------------- |
| GET    | `/users`         | Render user list using PUG    | Public         |
| GET    | `/users/:userId` | Render user profile using PUG | Public         |
| POST   | `/users`         | Handle user creation request  | Required       |
| PUT    | `/users/:userId` | Handle user update request    | Required       |
| DELETE | `/users/:userId` | Handle user deletion request  | Required       |

POST and PUT requests require valid `username` and `password` fields.

### Article Routes

| Method | Endpoint               | Description                      | Authentication |
| ------ | ---------------------- | -------------------------------- | -------------- |
| GET    | `/articles`            | Render article list using EJS    | Public         |
| GET    | `/articles/:articleId` | Render article details using EJS | Public         |
| POST   | `/articles`            | Handle article creation request  | Admin          |
| PUT    | `/articles/:articleId` | Handle article update request    | Admin          |
| DELETE | `/articles/:articleId` | Handle article deletion request  | Admin          |

The GET pages are public so they can be opened directly in a browser.

Modification routes retain authentication and authorization middleware.

POST, PUT, and DELETE handlers return demonstration responses and do not persist changes to a database.

## Middleware

### Request Logger

Logs the HTTP method, requested path, and timestamp.

Example:

```text
2026-11-22T16:57:20.159Z - POST /users
```

### Authentication

Protected routes require an Authorization header.

Example:

```http
Authorization: Bearer user-token
```

Available demonstration tokens:

| Token         | Role          |
| ------------- | ------------- |
| `user-token`  | User          |
| `admin-token` | Administrator |

These tokens are for educational purposes only.

### User Validation

Validates required user fields:

- `username`
- `password`

Missing or invalid fields return HTTP 400.

User IDs must be valid positive integers.

### Article Authorization

Regular users can access public article pages but cannot modify articles.

Only administrators can execute article POST, PUT, and DELETE operations.

Insufficient permissions return HTTP 403.

### Session Management

The application uses cookie-based session identification.

Features:

- Unique session IDs
- HTTP-only cookies
- In-memory session storage
- Session reuse across requests

Sessions are not persisted between server restarts.

### Error Handling

The application handles common HTTP errors:

| Status | Meaning               |
| ------ | --------------------- |
| 400    | Bad Request           |
| 401    | Unauthorized          |
| 403    | Forbidden             |
| 404    | Not Found             |
| 500    | Internal Server Error |

## CSS Styling

The application includes a responsive stylesheet:

`public/css/style.css`

The design provides:

- Dark navigation header
- User data table
- User profile cards
- Article cards
- Category and role badges
- Navigation buttons
- Responsive layouts for smaller screens

Express serves static CSS files using `express.static()`.

## Example Requests

### View Users

Open in a browser:

http://localhost:3000/users

### View User Profile

http://localhost:3000/users/1

### View Articles

http://localhost:3000/articles

### View Article Details

http://localhost:3000/articles/1

### Create User

```bash
curl -i -X POST http://localhost:3000/users \
  -H "Authorization: Bearer user-token" \
  -H "Content-Type: application/json" \
  -d '{"username":"Alex","password":"123456"}'
```

Expected response:

```text
HTTP 200 OK
Post users route
```

### Delete Article Without Admin Permissions

```bash
curl -i -X DELETE http://localhost:3000/articles/1 \
  -H "Authorization: Bearer user-token"
```

Expected:

```text
HTTP 403 Forbidden
Access denied. Admin role required.
```

### Delete Article With Admin Permissions

```bash
curl -i -X DELETE http://localhost:3000/articles/1 \
  -H "Authorization: Bearer admin-token"
```

Expected:

```text
HTTP 200 OK
Delete article by Id route: 1
```

## Automated Testing

The project uses the built-in Node.js Test Runner.

Run all tests:

```bash
npm test
```

The tests verify:

- Root route functionality
- PUG user list rendering
- PUG user profile rendering
- EJS article list rendering
- EJS article detail rendering
- HTML document structure
- Dynamic data rendering
- Navigation links
- CSS file availability
- CSS links in HTML pages
- Authentication
- User input validation
- Article authorization
- Invalid route parameters
- Unknown routes
- Session creation and reuse

### Latest Test Results

```text
tests 33
suites 0
pass 33
fail 0
cancelled 0
skipped 0
todo 0
duration_ms 490.415
```

All 33 reported tests passed successfully.

## Available Scripts

| Command       | Description                    |
| ------------- | ------------------------------ |
| `npm start`   | Start the Express server       |
| `npm run dev` | Start the server in watch mode |
| `npm test`    | Run automated tests            |

## Limitations

- Uses sample data instead of a database.
- User and article changes are not persisted.
- Authentication uses hardcoded demonstration tokens.
- Sessions are stored in memory.
- No production-ready login system.
- No persistent session storage.
- Designed for educational use.

## Future Improvements

- Database integration
- User registration and login
- Persistent sessions
- CRUD operations with stored data
- Improved form validation
- Article creation and editing forms

## Repository

https://github.com/mmf2003/Homework62.git
