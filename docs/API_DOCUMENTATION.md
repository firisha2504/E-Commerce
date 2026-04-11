# FA Restaurant API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### Authentication Endpoints

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+251911234567",
  "password": "securepassword",
  "address": "Addis Ababa, Ethiopia"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+251911234567",
    "address": "Addis Ababa, Ethiopia",
    "isAdmin": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt-token"
}
```

#### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+251911234567",
    "address": "Addis Ababa, Ethiopia",
    "isAdmin": false
  },
  "token": "jwt-token"
}
```

#### GET /auth/profile
Get current user profile (requires authentication).

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+251911234567",
    "address": "Addis Ababa, Ethiopia",
    "isAdmin": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Products Endpoints

#### GET /products
Get all available products with optional filtering.

**Query Parameters:**
- `category` (optional): Filter by category name
- `search` (optional): Search in product name and description
- `limit` (optional): Number of products to return
- `offset` (optional): Number of products to skip

**Response:**
```json
{
  "products": [
    {
      "id": "uuid",
      "name": "Doro Wot",
      "description": "Traditional Ethiopian chicken stew",
      "price": "25.00",
      "imageUrl": "https://example.com/image.jpg",
      "customizationOptions": {
        "spice": ["mild", "medium", "hot"],
        "size": ["regular", "large"]
      },
      "isAvailable": true,
      "category": {
        "id": "uuid",
        "name": "Food",
        "description": "Main dishes and snacks"
      }
    }
  ],
  "total": 50,
  "hasMore": true
}
```

#### GET /products/:id
Get a specific product by ID.

**Response:**
```json
{
  "product": {
    "id": "uuid",
    "name": "Doro Wot",
    "description": "Traditional Ethiopian chicken stew with injera",
    "price": "25.00",
    "imageUrl": "https://example.com/image.jpg",
    "customizationOptions": {
      "spice": ["mild", "medium", "hot"],
      "size": ["regular", "large"]
    },
    "isAvailable": true,
    "category": {
      "id": "uuid",
      "name": "Food",
      "description": "Main dishes and snacks"
    }
  }
}
```

#### GET /products/categories
Get all product categories.

**Response:**
```json
{
  "categories": [
    {
      "id": "uuid",
      "name": "Food",
      "description": "Main dishes and snacks",
      "imageUrl": "https://example.com/category.jpg",
      "isActive": true,
      "_count": {
        "products": 25
      }
    }
  ]
}
```

### Cart Endpoints

#### GET /cart
Get current user's cart (requires authentication).

**Response:**
```json
{
  "cartItems": [
    {
      "id": "uuid",
      "quantity": 2,
      "customizations": {
        "spice": "medium",
        "size": "large"
      },
      "product": {
        "id": "uuid",
        "name": "Doro Wot",
        "price": "25.00",
        "imageUrl": "https://example.com/image.jpg"
      }
    }
  ],
  "total": "50.00",
  "itemCount": 2
}
```

#### POST /cart/items
Add item to cart (requires authentication).

**Request Body:**
```json
{
  "productId": "uuid",
  "quantity": 2,
  "customizations": {
    "spice": "medium",
    "size": "large"
  }
}
```

**Response:**
```json
{
  "message": "Item added to cart",
  "cartItem": {
    "id": "uuid",
    "quantity": 2,
    "customizations": {
      "spice": "medium",
      "size": "large"
    },
    "product": {
      "id": "uuid",
      "name": "Doro Wot",
      "price": "25.00"
    }
  }
}
```

### Orders Endpoints

#### POST /orders
Create a new order (requires authentication).

**Request Body:**
```json
{
  "deliveryAddress": "123 Main St, Addis Ababa, Ethiopia",
  "contactNumber": "+251911234567",
  "specialInstructions": "Please call when you arrive",
  "paymentMethod": "cash_on_delivery"
}
```

**Response:**
```json
{
  "message": "Order created successfully",
  "order": {
    "id": "uuid",
    "totalAmount": "50.00",
    "deliveryAddress": "123 Main St, Addis Ababa, Ethiopia",
    "contactNumber": "+251911234567",
    "specialInstructions": "Please call when you arrive",
    "orderStatus": "pending",
    "deliveryStatus": "pending",
    "paymentStatus": "pending",
    "orderDate": "2024-01-01T00:00:00.000Z",
    "orderItems": [
      {
        "id": "uuid",
        "quantity": 2,
        "unitPrice": "25.00",
        "subtotal": "50.00",
        "customizations": {
          "spice": "medium"
        },
        "product": {
          "id": "uuid",
          "name": "Doro Wot",
          "imageUrl": "https://example.com/image.jpg"
        }
      }
    ],
    "payments": [
      {
        "id": "uuid",
        "paymentMethod": "cash_on_delivery",
        "amount": "50.00",
        "paymentStatus": "pending"
      }
    ]
  }
}
```

#### GET /orders
Get user's orders (requires authentication).

**Query Parameters:**
- `status` (optional): Filter by order status
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "orders": [
    {
      "id": "uuid",
      "totalAmount": "50.00",
      "orderStatus": "delivered",
      "deliveryStatus": "delivered",
      "paymentStatus": "paid",
      "orderDate": "2024-01-01T00:00:00.000Z",
      "deliveryDate": "2024-01-01T01:30:00.000Z",
      "orderItems": [...],
      "payments": [...]
    }
  ],
  "total": 10,
  "page": 1,
  "totalPages": 1
}
```

### Payments Endpoints

#### POST /payments
Process payment for an order (requires authentication).

**Request Body:**
```json
{
  "orderId": "uuid",
  "paymentMethod": "telebirr",
  "transactionId": "TXN123456789",
  "referenceNumber": "REF123456"
}
```

**Response:**
```json
{
  "message": "Payment processed successfully",
  "payment": {
    "id": "uuid",
    "orderId": "uuid",
    "paymentMethod": "telebirr",
    "paymentStatus": "completed",
    "transactionId": "TXN123456789",
    "amount": "50.00",
    "paymentDate": "2024-01-01T00:30:00.000Z"
  }
}
```

### Feedback Endpoints

#### POST /feedback
Submit feedback for a delivered order (requires authentication).

**Request Body:**
```json
{
  "orderId": "uuid",
  "rating": 5,
  "comment": "Excellent food and fast delivery!",
  "deliveryRating": 5,
  "foodQualityRating": 5
}
```

**Response:**
```json
{
  "message": "Feedback submitted successfully",
  "feedback": {
    "id": "uuid",
    "orderId": "uuid",
    "rating": 5,
    "comment": "Excellent food and fast delivery!",
    "deliveryRating": 5,
    "foodQualityRating": 5,
    "createdAt": "2024-01-01T02:00:00.000Z"
  }
}
```

### Analytics Endpoints

#### GET /analytics/favorites
Get user's favorite products (requires authentication).

**Response:**
```json
{
  "favorites": [
    {
      "id": "uuid",
      "timesOrdered": 5,
      "lastOrdered": "2024-01-01T00:00:00.000Z",
      "product": {
        "id": "uuid",
        "name": "Doro Wot",
        "price": "25.00",
        "imageUrl": "https://example.com/image.jpg"
      }
    }
  ]
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message description"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

### Validation Errors

Validation errors return detailed information:

```json
{
  "error": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "number",
      "path": ["email"],
      "message": "Expected string, received number"
    }
  ]
}
```

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- 100 requests per 15 minutes per IP address
- Higher limits for authenticated users
- Special limits for sensitive endpoints (login, registration)

## Payment Methods

### Supported Payment Methods

1. **Cash on Delivery** (`cash_on_delivery`)
   - Payment collected upon delivery
   - No additional processing required

2. **Bank Transfer** (`bank_transfer`)
   - Commercial Bank of Ethiopia (CBE)
   - Awash Bank
   - Requires bank name and reference number

3. **Telebirr** (`telebirr`)
   - Mobile money service
   - Requires transaction ID

4. **E-birr** (`ebirr`)
   - Digital wallet service
   - Requires transaction ID

### Payment Status Flow

1. `pending` - Payment initiated
2. `completed` - Payment successful
3. `failed` - Payment failed
4. `refunded` - Payment refunded

## Order Status Flow

### Order Status
1. `pending` - Order placed, awaiting confirmation
2. `confirmed` - Order confirmed by restaurant
3. `preparing` - Food being prepared
4. `ready` - Order ready for pickup/delivery
5. `completed` - Order delivered/completed
6. `cancelled` - Order cancelled

### Delivery Status
1. `pending` - Awaiting delivery assignment
2. `assigned` - Delivery person assigned
3. `picked_up` - Order picked up for delivery
4. `delivered` - Order delivered to customer
5. `failed` - Delivery failed