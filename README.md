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
**If you want to clear cart**

```powershell

    Invoke-RestMethod -Method DELETE -Uri "http://localhost:3000/api/cart/clear" -Headers @{ "x-user-id" = "user123" }
```
* * *
<img width="927" height="585" alt="image" src="https://github.com/user-attachments/assets/618f94d2-7df4-4de0-83f7-e569f605c697" />

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
    │   ├── auth.js
    │   └── rateLimit.js
    │   └── validate.js
    ├── models/
    │   ├── Cart.js
    │   └── Promotions.js
    ├── routes/cart.routes.js
    ├── services/
    │   ├── cart.service.js
    │   └── promotions.js
    ├── utils/logger.js
    ├── app.js
    ├── .env
    ├── package.json



* * *


    
   
