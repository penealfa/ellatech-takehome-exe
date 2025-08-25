# Ellatech Simple Service

## Run Steps

1. Clone repo:

   ```bash
   git clone https://github.com/penealfa/ellatech-takehome-exe.git
   ```
2. Navigate to repo:

   ```bash
   cd ellatech-takehome-exe
   ```
3. Start the service with Docker:

   ```bash
   docker-compose up --build
   ```



## Test Steps

* Use Postman: Import the collection found in the repo (`Ellatech.postman_collection.json`).
* All endpoints require a valid JWT token where permissions are enforced per endpoint.



## API Docs

### Users

**POST /users** – Create a user

* **DTO**:

  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
* **Permission required**: `user.create`
* **Notes**: Default role `'user'` assigned. Permissions are seeded dynamically for `'admin'` on app start.



### Authentication

**POST /auth/login** – Login

* **DTO**:

  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
* **Response**: Returns JWT token.


### Products

**POST /products** – Create product

* **DTO**:

  ```json
  {
    "name": "string",
    "quantity": 0
  }
  ```
* **Permission required**: `product.create`

**PUT /products/adjust/\:id** – Adjust product quantity

* **DTO**:

  ```json
  {
    "adjustment": 5
  }
  ```
* Positive values increase stock, negative values decrease stock.
* **Permission required**: `product.adjust`

**GET /products/status/\:id** – Get stock status

* **Response**:

  ```json
  {
    "status": "in-stock | out-of-stock",
    "quantity": 0
  }
  ```
* Status is derived from current product quantity.
* **Permission required**: `product.status`


### Orders

**POST /orders** – Create order

* **DTO**:

  ```json
  {
    "productId": 1,
    "quantity": 2
  }
  ```
* **Permission required**: `order.create`
* Product quantity is automatically adjusted.
* User is determined from JWT token.
* Throws error if stock insufficient.

**PUT /orders/\:id/status** – Update order status

* **DTO**:

  ```json
  {
    "status": "ordered | confirmed | shipped | delivered | completed"
  }
  ```
* **Permission required**: `order.update`
* Updates the current stage of the order.

**GET /orders/\:id/status** – GET current order status

* **responses**:

  ```json
  {
    "status": "ordered | confirmed | shipped | delivered | completed"
  }
  ```
* **Permission required**: `order.status`
* Gets the current stage of the order.

**GET /orders/transactions** – Get all orders for logged-in user

* **Permission required**: `transaction.view`
* Pagination not implemented; all orders for user are returned.
* Orders include product and quantity.

## General Notes / Assumptions

* All responses follow the format:

  ```json
  {
    "code": 200,
    "message": "string",
    "data": {}
  }
  ```
* JWT secret hardcoded; should be replaced with environment variable in production.
* Email and 2FA not implemented. I would have loved to do this but was aiming for the 5hr limit.
* Permissions enforced via a custom decorator dynamically seeded for admin role at startup.
* Product status (`in-stock` / `out-of-stock`) and order stage are derived dynamically.
* Product adjustments reflect current stock in real-time.
* No automated tests included.
* Error handling is basic.
* No pagination implemented for `/orders/transactions`.
* Development time: Started at 10:00 AM, finished at 2:08 PM (excluding repo setup) Docker Build and restarts killed most of my time.

