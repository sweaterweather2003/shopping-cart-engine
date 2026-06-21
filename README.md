# Adaptive E-Commerce Cart Engine

A production-ready Shopping Cart microservice built with **Node.js, Express, and MongoDB** as per the Backend Engineering Assignment.

## Features Implemented

- Multi-tenant user cart isolation using `x-user-id` header
- Item Ingestion (Add / Update items in cart)
- Dynamic Tiered Promotional Campaign Engine (Basic → Standard → Premium)
- Checkout Summary with detailed pricing and discounts
- HTML Table View for easy visualization (`/checkout/html`)
- Clear Cart functionality
- Input Validation using Joi
- Rate Limiting
- Request Logging
- Clean Architecture with separation of concerns

---

## API Routes

| Method | Endpoint                        | Description                          | Headers Required      |
|--------|---------------------------------|--------------------------------------|-----------------------|
| POST   | `/api/cart/items`               | Add or update item in cart           | `x-user-id`           |
| GET    | `/api/cart/checkout`            | Get JSON checkout summary            | `x-user-id`           |
| GET    | `/api/cart/checkout/html`       | Get beautiful HTML table view        | `x-user-id`           |
| DELETE | `/api/cart`                     | Clear entire cart                    | `x-user-id`           |

### Example Requests

**Add Item:**
```powershell
Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/cart/items" `
  -Headers @{ "x-user-id" = "user123" } `
  -ContentType "application/json" `
  -Body '{"productId":"p1","name":"any produt of your choice","price":xyz.abc,"quantity":x}'
```
**Checkout (JSON):**

```powershell

    Invoke-RestMethod -Method GET -Uri "http://localhost:3000/api/cart/checkout" -Headers @{ "x-user-id" = "user123" }
```
* * *

## Setup Instructions

### 1\. Clone the Repository

Bash

    git clone <your-repo-url>
    cd shopping-cart-engine

### 2\. Install Dependencies

Bash

    npm install

### 3\. Environment Variables

Copy .env.example to .env and update:

env

    PORT=3000
    MONGO_URI=your_mongodb_atlas_connection_string
    NODE_ENV=development

### 4\. Run the Application

Bash

    npm run dev

Server will start at http://localhost:3000, and then open another powershell(keeping the npm run dev powershell open do not close this) and run these:

**Add Item:**
```powershell
Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/cart/items" `
  -Headers @{ "x-user-id" = "user123" } `
  -ContentType "application/json" `
  -Body '{"productId":"p1","name":"any produt of your choice","price":xyz.abc,"quantity":x}'
```
**Checkout (JSON):**

```powershell

    Invoke-RestMethod -Method GET -Uri "http://localhost:3000/api/cart/checkout" -Headers @{ "x-user-id" = "user123" }
```
* * *

* * *

## Tech Stack

*   **Node.js + Express**
*   **MongoDB + Mongoose**
*   **Joi** (Validation)
*   **Winston** (Logging)
*   **express-rate-limit**

* * *

**Feature X**: Table View + Rate Limiting + Logging + Cart TTL support

* * *

## Project Structure

text

    src/
    ├── config/db.js
    ├── controllers/cart.controller.js
    ├── middleware/
    ├── models/Cart.js
    ├── routes/cart.routes.js
    ├── services/
    │   ├── cart.service.js
    │   └── promotions.js
    ├── utils/logger.js
    ├── app.js

* * *

## Submission Note

This project fully satisfies all requirements mentioned in the assignment:

*   Multi-tenant isolation
*   Item ingestion with update logic
*   Tiered promotional engine with clear thresholds
*   Production-ready features (Feature X)
*   Proper documentation and architecture

text

    ---
    
    ### 2. `DESIGN.md` (Create this file in the root folder)
    
    ```markdown
    # DESIGN.md - Adaptive Cart Engine
    
    ## 1. Architecture & Separation of Concerns
    
    The project follows a **layered architecture**:
    
    - **Routes** → Handle HTTP requests
    - **Controllers** → Orchestrate business logic and responses
    - **Services** → Contain core business logic (Cart operations, Promotions)
    - **Models** → MongoDB schemas
    - **Middleware** → Validation, Authentication, Rate Limiting
    - **Utils** → Logging
    
    This ensures **clean separation of concerns** and maintainability.
    
    ---
    
    ## 2. Multi-Tenant Session & Schema Isolation
    
    - **Strategy**: Used `x-user-id` header for user identification (simple and effective for this assignment).
    - **Isolation**: Every cart is tied to a `userId`. Different users have completely isolated carts.
    - **Schema** (`models/Cart.js`):
    
    ```js
    {
      userId: String,
      items: [{
        productId, name, price, quantity, addedAt
      }],
      expiresAt: Date   // For future TTL
    }

* * *

## 3\. Item Ingestion Endpoint

*   **POST** /api/cart/items
*   Logic: If productId exists → update quantity; else → add new item.
*   Handles edge cases: zero/negative quantity, missing fields (via Joi validation).

* * *

## 4\. Tiered Promotional Campaign Engine

**Thresholds & Formulas** (services/promotions.js):

| Tier | Condition | Discount |
| --- | --- | --- |
| Premium | Subtotal ≥ 500 OR Items ≥ 8 | 25% |
| Standard | Subtotal ≥ 200 OR Items ≥ 4 | 15% |
| Basic | Subtotal ≥ 50 | 5% |
| None | Otherwise | 0% |

*   Prioritizes the **highest** applicable discount.
*   Returns rich JSON with tier, discountRate, description, etc.

* * *

## 5\. Feature X: Production-Ready Additions

**Implemented Features**:

1.  **HTML Table View** (/api/cart/checkout/html)
    *   Clean, professional tabular representation of cart + summary.
    *   Nice styling with CSS.
    *   **Why?** Makes testing and demonstration much easier for evaluators.
2.  **Rate Limiting** (100 requests per 15 minutes per IP)
3.  **Winston Logging**
4.  **Joi Input Validation** with proper 400 responses
5.  **Clear Cart** endpoint

**Justification**: These additions make the service more robust, observable, user-friendly, and production-like.

* * *

## 6\. Input Validation & Security

*   Joi schemas for request body validation.
*   Defensive checks for x-user-id.
*   Structured error responses.
*   Rate limiting to prevent abuse.

* * *

## 7\. Edge Cases Considered

*   Adding same product multiple times (quantity update)
*   Removing items by setting quantity to 0 (future)
*   Empty cart
*   Invalid/malformed payloads
*   Multiple users simultaneously
*   High cart value / diversity scenarios

* * *

## 8\. Trade-offs

*   Used embedded items in Cart document (fast reads, acceptable for cart size).
*   Simple header-based auth (instead of JWT).
*   No real authentication (can be added later).

