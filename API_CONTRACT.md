# API Contract

This document defines the REST API contract for the Inventory Management System.

## Base URL

```text
http://localhost:5000/api
```

All API endpoints are prefixed with `/api`.

## Authentication

Requests that require authentication must include a JWT bearer token:

```text
Authorization: Bearer <token>
```

Tokens are issued on login and expire after the configured TTL (default: 1 day).

### POST /api/auth/login

Authenticates a user and returns a JWT.

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `username` | string | yes | User's username |
| `password` | string | yes | User's password |

**Response 200 OK**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f8d2a3b1c9e7f5a1b2c3d4",
    "username": "jdoe",
    "role": "admin"
  }
}
```

**Response 400 Bad Request**

```json
{
  "message": "Validation error"
}
```

**Response 401 Unauthorized**

```json
{
  "message": "Invalid credentials"
}
```

## Products

All product endpoints require JWT authentication.

- `GET` endpoints are available to authenticated users.
- `POST`, `PUT`, and `DELETE` endpoints require the `admin` role.

### GET /api/products

Returns a list of all products.

**Response 200 OK**

```json
[
  {
    "id": "64f8d2a3b1c9e7f5a1b2c3d4",
    "name": "Widget",
    "description": "A useful widget",
    "price": 9.99,
    "quantity": 120
  }
]
```

### GET /api/products/:id

Returns a single product by ID.

**Response 200 OK**

```json
{
  "id": "64f8d2a3b1c9e7f5a1b2c3d4",
  "name": "Widget",
  "description": "A useful widget",
  "price": 9.99,
  "quantity": 120
}
```

**Response 404 Not Found**

```json
{
  "message": "Product not found"
}
```

### POST /api/products

Creates a new product.

**Authentication:** JWT + admin role

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | yes | Product name |
| `description` | string | yes | Product description |
| `price` | number | yes | Unit price; must be >= 0 |
| `quantity` | number | yes | Stock quantity; must be a non-negative integer |

**Response 201 Created**

```json
{
  "id": "64f8d2a3b1c9e7f5a1b2c3d5",
  "name": "Widget",
  "description": "A useful widget",
  "price": 9.99,
  "quantity": 120
}
```

### PUT /api/products/:id

Updates an existing product.

**Authentication:** JWT + admin role

All required product fields must be supplied and valid.

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | yes | Product name |
| `description` | string | yes | Product description |
| `price` | number | yes | Unit price; must be >= 0 |
| `quantity` | number | yes | Stock quantity; must be a non-negative integer |

**Response 200 OK**

```json
{
  "id": "64f8d2a3b1c9e7f5a1b2c3d4",
  "name": "Widget Pro",
  "description": "An improved widget",
  "price": 12.99,
  "quantity": 80
}
```

**Response 404 Not Found**

```json
{
  "message": "Product not found"
}
```

### DELETE /api/products/:id

Deletes a product.

**Authentication:** JWT + admin role

**Response 200 OK**

```json
{
  "message": "Product deleted"
}
```

**Response 404 Not Found**

```json
{
  "message": "Product not found"
}
```

## Error Responses

Error responses use the following format:

```json
{
  "message": "Description of the error"
}
```

| Status | Meaning |
|---|---|
| 400 | Invalid request or validation failure |
| 401 | Missing or invalid authentication token |
| 403 | Authenticated but not permitted |
| 404 | Resource not found |
| 500 | Internal server error |

**Example 403 Forbidden**

```json
{
  "message": "Admin access required"
}
```
