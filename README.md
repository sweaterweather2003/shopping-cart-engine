\# Adaptive E-Commerce Cart Engine

A production-ready Shopping Cart microservice built with \*\*Node.js, Express, and MongoDB\*\* as per the Backend Engineering Assignment.

\## Features Implemented

\- Multi-tenant user cart isolation using \`x-user-id\` header

\- Item Ingestion (Add / Update items in cart)

\- Dynamic Tiered Promotional Campaign Engine (Basic → Standard → Premium)

\- Checkout Summary with detailed pricing and discounts

\- HTML Table View for easy visualization (\`/checkout/html\`)

\- Clear Cart functionality

\- Input Validation using Joi

\- Rate Limiting

\- Request Logging

\- Clean Architecture with separation of concerns

\---

\## API Routes

| Method | Endpoint | Description | Headers Required |

|--------|---------------------------------|--------------------------------------|-----------------------|

| POST | \`/api/cart/items\` | Add or update item in cart | \`x-user-id\` |

| GET | \`/api/cart/checkout\` | Get JSON checkout summary | \`x-user-id\` |

| GET | \`/api/cart/checkout/html\` | Get beautiful HTML table view | \`x-user-id\` |

| DELETE | \`/api/cart\` | Clear entire cart | \`x-user-id\` |

\### Example Requests

\*\*Add Item:\*\*

\`\`\`bash

Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/cart/items" \`

\-Headers @{ "x-user-id" = "user123" } \`

\-ContentType "application/json" \`

\-Body '{"productId":"p1","name":"Wireless Headphones","price":89.99,"quantity":2}'

\`\`\`

\*\*Checkout (JSON):\*\*

\`\`\`bash

Invoke-RestMethod -Method GET -Uri "http://localhost:3000/api/cart/checkout" -Headers @{ "x-user-id" = "user123" }

\`\`\`

\*\*Checkout (Beautiful Table):\*\*

Open in browser: \`http://localhost:3000/api/cart/checkout/html\` (with header support)

\---

\## Setup Instructions

\### 1. Clone the Repository

\`\`\`bash

git clone

cd shopping-cart-engine

\`\`\`

\### 2. Install Dependencies

\`\`\`bash

npm install

\`\`\`

\### 3. Environment Variables

Copy \`.env.example\` to \`.env\` and update:

\`\`\`env

PORT=3000

MONGO\_URI=your\_mongodb\_atlas\_connection\_string

NODE\_ENV=development

\`\`\`

\### 4. Run the Application

\`\`\`bash

npm run dev

\`\`\`

Server will start at \`http://localhost:3000\`

\---

\## Tech Stack

\- \*\*Node.js + Express\*\*

\- \*\*MongoDB + Mongoose\*\*

\- \*\*Joi\*\* (Validation)

\- \*\*Winston\*\* (Logging)

\- \*\*express-rate-limit\*\*

\---

\*\*Feature X\*\*: HTML Table View + Rate Limiting + Logging + Cart TTL support

\---

\## Project Structure

\`\`\`

src/

├── config/db.js

├── controllers/cart.controller.js

├── middleware/

├── models/Cart.js

├── routes/cart.routes.js

├── services/

│ ├── cart.service.js

│ └── promotions.js

├── utils/logger.js

├── app.js

\`\`\`

\---

 the GitHub link.

Would you like me to also give you the final versions of any other files (like \`cart.controller.js\`, \`promotions.js\`, etc.) to make sure everything is consistent?
