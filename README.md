# Payment Gateway Integration - Frontend

This repository contains the frontend for the Stripe Payment Gateway system.

## Project Description

Designed and developed a full-stack payment processing system using Spring Boot and Stripe API for secure transaction handling.

- **RESTful API Development**: Built REST endpoints for payment intent creation, confirmation, and status tracking.
- **Stripe Integration**: Integrated Stripe Java SDK for server-side payment processing and webhook handling.
- **Payment Intent Management**: Implemented secure payment intent creation with amount validation and currency support.
- **Webhook Events**: Configured Stripe webhook endpoints to handle payment success, failure, and cancellation events.
- **Security**:  Implemented CORS configuration, API key management, and request validation for secure transactions.
- **Error Handling**: Added comprehensive exception handling for Stripe API errors and payment failures.

## Tech Stack

- **Backend**: Java 17, Spring Boot 3.x
- **Payment API**:  Stripe Java SDK
- **Build Tool**: Maven
- **API Testing**: Postman

## Frontend

The frontend for this project is maintained separately: https://github.com/rohitkumar220944/Stripe-payment-gateway

To view or work with the frontend, clone that repository.

## Quick Links

- **Backend (this repo)**: https://github.com/rohitkumar220944/Payament_API
- **Frontend (Stripe-payment-gateway)**: https://github.com/rohitkumar220944/Stripe-payment-gateway

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/rohitkumar220944/Payament_API.git
cd Payament_API

# Configure application.properties
# Add your Stripe secret key: 
# stripe.api.key=sk_test_your_secret_key_here
# server.port=8080

# Build and run
mvn clean install
mvn spring-boot:run
```

API runs on `http://localhost:8080`

## 🔌 API Endpoints

### 1. Create Payment Intent

```http
POST /api/payment/create-intent
Content-Type: application/json

{
  "amount": 5000,
  "currency": "usd",
  "description": "Product purchase"
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx",
  "status": "requires_payment_method",
  "amount": 5000
}
```

### 2. Get Payment Status

```http
GET /api/payment/status/{paymentIntentId}
```

**Response:**
```json
{
  "paymentIntentId": "pi_xxx",
  "status": "succeeded",
  "amount": 5000,
  "currency": "usd"
}
```

### 3. Confirm Payment

```http
GET /api/payment/confirm/{paymentIntentId}
```

### 4. Webhook Endpoint

```http
POST /api/webhook/stripe
Header:  Stripe-Signature
```

Handles events:  `payment_intent.succeeded`, `payment_intent.payment_failed`

## 🔄 Payment Flow

```
Frontend Request
      ↓
PaymentController receives request
      ↓
PaymentService validates and processes
      ↓
StripeService calls Stripe API
      ↓
Payment Intent created/confirmed
      ↓
Response sent to frontend
      ↓
Webhook receives payment status
```

## 📁 Project Structure

```
src/main/java/com/payment/
├── controller/
│   ├── PaymentController.java       # REST endpoints
│   └── WebhookController.java       # Stripe webhooks
├── service/
│   ├── PaymentService. java          # Business logic
│   └── StripeService.java           # Stripe API integration
├── dto/
│   ├── PaymentRequest.java          # Request model
│   └── PaymentResponse.java         # Response model
├── config/
│   ├── StripeConfig.java            # Stripe configuration
│   └── CorsConfig.java              # CORS settings
└── PaymentApiApplication.java       # Main application
```

## 🧪 Testing with Postman

**Create Payment Intent:**
```
POST http://localhost:8080/api/payment/create-intent
Content-Type:  application/json

{
  "amount": 2500,
  "currency": "usd",
  "description": "Test payment"
}
```

**Check Payment Status:**
```
GET http://localhost:8080/api/payment/status/{paymentIntentId}
```

## ⚙️ Configuration

**application.properties:**
```properties
# Server
server.port=8080

# Stripe
stripe.api.key=sk_test_your_secret_key_here
stripe.webhook.secret=whsec_your_webhook_secret

# CORS
cors.allowed. origins=http://localhost:3000
```

## 🔒 Security

- Stripe API keys stored in environment variables
- CORS configured for frontend origin only
- Webhook signature verification enabled
- Request validation on all endpoints

## 👨‍💻 Author

**Rohit Kumar**
- GitHub: [@rohitkumar220944](https://github.com/rohitkumar220944)

## 📄 License

This project is licensed under the MIT License.
```
