# Form Contracts — TaskFlow Pro

## Login POST /login
```json
{
  "email": "string",
  "password": "string"
}

// Expected Errors
{
  "errors": {
    "email": ["Invalid credentials"],
    "password": ["Incorrect password"]
  }
}

// Registration POST/register
{
  "name": "string",
  "email": "string",
  "password": "string"
}

// Expected Errors
{
  "errors": {
    "email": ["Email already taken"],
    "password": ["Password too weak"]
  }
}


