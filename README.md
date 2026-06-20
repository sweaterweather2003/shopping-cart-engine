# Adaptive E-Commerce Cart Engine

A **production-ready** Shopping Cart microservice built with Node.js, Express, and MongoDB for the Backend Engineering Assignment.

---

## Features

- Multi-tenant cart isolation (supports multiple users simultaneously)
- Flexible Item Ingestion (Add + Update items)
- Dynamic Tiered Promotional Campaign Engine
- Rich Checkout Summary (JSON + HTML Table View)
- Clear Cart functionality
- Input Validation, Rate Limiting, and Logging
- Clean & Scalable Architecture

---

## API Endpoints

| Method | Endpoint                        | Description                              | Required Header     |
|--------|---------------------------------|------------------------------------------|---------------------|
| POST   | `/api/cart/items`               | Add or update item in user's cart        | `x-user-id`         |
| GET    | `/api/cart/checkout`            | Get checkout summary (JSON)              | `x-user-id`         |
| GET    | `/api/cart/checkout/html`       | Get beautiful HTML tabular view          | `x-user-id`         |
| DELETE | `/api/cart`                     | Clear entire cart                        | `x-user-id`         |

---

### Usage in powershell

**1. Add / Update Item**

Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/cart/items" `
  -Headers @{ "x-user-id" = "swetha123" } `
  -ContentType "application/json" `
  -Body '{"productId":"p1","name":"Wireless Headphones","price":89.99,"quantity":2}' 

**2. View Checkout and summary (JSON)**

Invoke-RestMethod -Method GET -Uri "http://localhost:3000/api/cart/checkout" `
  -Headers @{ "x-user-id" = "swetha123" } | ConvertTo-Json -Depth 5`
$result = Invoke-RestMethod -Method GET -Uri "http://localhost:3000/api/cart/checkout" `
  -Headers @{ "x-user-id" = "swetha123" }
$result.items | Format-Table -AutoSize
$result.summary | Format-List

###Setup Instructions

**Prerequisites**

  - Node.js (v18+)
  - MongoDB Atlas (Free Cloud Database)
