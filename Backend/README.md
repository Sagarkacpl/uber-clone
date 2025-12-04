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
