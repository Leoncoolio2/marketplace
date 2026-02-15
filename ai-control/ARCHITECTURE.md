# Marketplace Backend – Architecture Source of Truth (V1 LOCKED)

This architecture is derived from:
- PID (locked)
- PRD (locked)
- Architecture Additions V1 (locked)
- Tech Stack V1 (locked)

No deviation allowed without ARCH_CHANGE_PROPOSAL.

---

## Tech Stack (Locked)

- Node.js (LTS)
- NestJS
- REST API
- PostgreSQL
- Prisma ORM
- JWT authentication
- Role-based access (buyer | seller | admin)

---

## Core Domains

### User
Fields:
- id (UUID)
- email (unique)
- password_hash
- role (buyer | seller | admin)
- is_active
- created_at
- updated_at

---

### SellerProfile
- id
- user_id (FK → User)
- display_name
- description
- payout_details
- is_verified
- created_at

---

### Product
- id
- seller_id
- title
- description
- price
- currency
- is_preorder
- status (draft | active | paused | archived)
- created_at
- updated_at

---

### PreorderConfig
- id
- product_id
- available_from
- delivery_date
- max_quantity
- reserved_quantity
- preorder_status (open | closed)

---

### Order
- id
- buyer_id
- status:
  draft
  preorder_pending_payment
  prepaid_reserved
  in_fulfillment
  completed
  cancelled
- total_amount
- currency
- timestamps

---

### OrderItem
- id
- order_id
- product_id
- quantity
- unit_price
- delivery_date

---

## Non-Functional Requirements

- All endpoints must use DTO validation
- Global validation pipe enabled
- Global error filter enabled
- Structured logging enabled
- Unit tests required for every task
- No direct DB access outside services
