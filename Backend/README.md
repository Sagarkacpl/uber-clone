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
