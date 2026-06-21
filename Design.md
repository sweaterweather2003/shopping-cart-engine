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

1.  **Rate Limiting** (100 requests per 15 minutes per IP)
2.  **Winston Logging**
3.  **Joi Input Validation** with proper 400 responses
4.  **Clear Cart** endpoint

**Justification**: These additions make the service more robust, observable, and user-friendly.

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

## 8\. Promotion Engine Design

**Thresholds & Logic:**
- Basic: Subtotal ≥ 50 → 5% discount
- Standard: Subtotal ≥ 200 OR Unique Items ≥ 4 → 15% discount  
- Premium: Subtotal ≥ 500 OR Unique Items ≥ 8 → 25% discount

**Formula:**
```js
discountAmount = subtotal * discountRate
finalTotal = subtotal - discountAmount

## 9\. Trade-offs

*   Used embedded items in Cart document (fast reads, acceptable for cart size).
*   Simple header-based auth (instead of JWT).
*   No real authentication.Instead I used a simple `x-user-id` header for user identification.

  
