# Users API - Register Endpoint

Endpoint: `POST /users/register`

Description:

- Registers a new user and returns an authentication token and the created user object.

Request Headers:

- `Content-Type: application/json`

Request Body (JSON):

- `fullname` (object):
  - `firstname` (string, required): minimum 6 characters.
  - `lastname` (string, optional): if provided, minimum 6 characters.
- `email` (string, required): valid email address, minimum 10 characters, must be unique.
- `password` (string, required): minimum 6 characters.

Example Request Body:

```
{
  "fullname": {
    "firstname": "Sagar",
    "lastname": "Kumar"
  },
  "email": "sagar@example.com",
  "password": "securePassword"
}
```

Validation Rules (as implemented):

- `email` must be a valid email format.
- `fullname.firstname` is required and must be at least 6 characters.
- `password` must be at least 6 characters.

Responses:

- `201 Created` — Registration successful.
  - Body: `{ "token": "<jwt>", "user": { ... } }`
  - Note: The returned `user` object is generated from the user model; the password field is not returned.
- `400 Bad Request` — Validation failed or missing required fields.
  - Body: `{ "errors": [ { "msg": "...", "param": "...", ... } ] }`
- `409 Conflict` — Email already exists (typical database unique constraint error).
  - Body: `{ "error": "User with this email already exists" }` (implementation may vary).
- `500 Internal Server Error` — Unexpected server or database error.

Notes / Implementation details:

- The route's validation is defined in `routes/user.routes.js` using `express-validator`.
- The controller `controllers/user.controller.js` returns `400` when validation fails and `201` on success.
- Passwords are hashed via `models/user.models.js` before being saved.

If you'd like, I can also add example curl and Postman snippets, or update the controller/service to return a consistent `409` response for duplicate emails.

---

# Users API - Login Endpoint

Endpoint: `POST /users/login`

Description:

- Authenticates an existing user and returns an authentication token and the user object.

Request Headers:

- `Content-Type: application/json`

Request Body (JSON):

- `email` (string, required): valid email address.
- `password` (string, required): user's password (minimum 6 characters as validated by routes).

Example Request Body:

```
{
  "email": "sagar@example.com",
  "password": "securePassword"
}
```

Validation Rules (as implemented):

- `email` must be a valid email format.
- `password` must be at least 6 characters.

Behavior / Implementation details:

- The controller `controllers/user.controller.js` looks up the user by email and selects the stored (hashed) password for comparison.
- If the user is found and the password matches, a JWT is generated via the model method and returned along with the user object.

Responses:

- `200 OK` — Login successful.
  - Body: `{ "token": "<jwt>", "user": { ... } }`
- `400 Bad Request` — Validation failed (e.g., invalid email format or password too short).
  - Body: `{ "errors": [ { "msg": "...", "param": "...", ... } ] }`
- `401 Unauthorized` — Invalid email or password.
  - Body: `{ "message": "Invalid email or password" }`
- `500 Internal Server Error` — Unexpected server or database error.

Notes:

- The login route's validation is defined in `routes/user.routes.js` using `express-validator`.
- The controller returns `401` for authentication failures (invalid credentials).
- If you want, I can add example `curl` and Postman snippets for this endpoint as well.

---

# Users API - Profile Endpoint

Endpoint: `GET /users/profile`

Description:

- Retrieves the authenticated user's profile information.

Request Headers:

- `Content-Type: application/json`
- `Authorization: Bearer <token>` (or `token` cookie set during login)

Request Body:

- No body required.

Authentication:

- **Required:** This endpoint requires a valid JWT token passed via `Authorization` header or `token` cookie.
- Validated by `authMiddleware.authUser` middleware.

Responses:

- `200 OK` — Profile retrieved successfully.
  - Body: User object `{ _id, fullname, email, socketId, ... }` (password not included)
- `401 Unauthorized` — Missing or invalid token.
  - Body: `{ "message": "Unauthorized" }` or similar (depends on middleware implementation)
- `500 Internal Server Error` — Unexpected server error.

Notes / Implementation details:

- The endpoint is protected by `authMiddleware.authUser`, which verifies the JWT and attaches the user object to `req.user`.
- The controller simply returns `req.user` at status `200`.
- No validation rules; authentication middleware handles security.

---

# Users API - Logout Endpoint

Endpoint: `GET /users/logout`

Description:

- Logs out the authenticated user by clearing the authentication token and blacklisting it for future use.

Request Headers:

- `Authorization: Bearer <token>` (or `token` cookie set during login)

Request Body:

- No body required.

Authentication:

- **Required:** This endpoint requires a valid JWT token passed via `Authorization` header or `token` cookie.
- Validated by `authMiddleware.authUser` middleware.

Behavior / Implementation details:

- The controller clears the `token` cookie.
- Extracts the token from the `Authorization` header or cookie.
- Adds the token to a blacklist in the database (`blackListTokenModel`) to prevent reuse.

Responses:

- `200 OK` — Logout successful.
  - Body: `{ "message": "Logged out Successfully" }`
- `401 Unauthorized` — Missing or invalid token.
  - Body: `{ "message": "Unauthorized" }` or similar (depends on middleware implementation)
- `500 Internal Server Error` — Unexpected server error.

Notes:

- The endpoint is protected by `authMiddleware.authUser` middleware.
- Token blacklisting prevents the token from being used again, even if it hasn't expired.
- The `blackListTokenModel` should be checked during authentication to ensure blacklisted tokens are rejected.
