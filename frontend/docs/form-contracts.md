# API Form Contracts — TaskFlow Pro 

This document specifies request/response JSON for auth endpoints used by the frontend.

## POST /api/register

**Description**: Register new user. (Sanctum SPA flow: GET /sanctum/csrf-cookie then POST.)

**Request (JSON)**:

JSON
{
  "name": "string, required, 1..255",
  "email": "string, required, email format, unique",
  "password": "string, required, min:8",
  "password_confirmation": "string, required, must match password"
}
 
 
Success (201 Created):
 
{
  "data": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "message": "Registered successfully."
}
 
 
Validation error (422):
 
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email has already been taken."],
    "password": ["The password must be at least 8 characters."]
  }
}
 
POST /api/login
 
Description: Login (Sanctum SPA: GET /sanctum/csrf-cookie then POST /api/login).
 
Request (JSON):
 
{
  "email": "string, required, email format",
  "password": "string, required"
}
 
 
Success (200 OK):
 
{
  "data": {
    "user": {
      "id": 123,
      "name": "John Doe",
      "email": "john@example.com"
    }
  },
  "message": "Logged in."
}
 
 
Auth failure (401):
 
{
  "message": "Invalid credentials."
}
 
 
Validation error (422):
 
{
  "message": "The given data was invalid.",
  "errors": { "email": ["The email field is required."] }
}
 
 
Notes:
 
Frontend must call GET /sanctum/csrf-cookie before POST for cookie-based auth.
 
All validation errors return 422 with { message, errors }.
 
Keep frontend error rendering code ready to display errors map.