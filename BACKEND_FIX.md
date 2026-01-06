# Backend Fix Required - Spring Boot Payment Controller

## The Problem

Your backend is creating a PaymentIntent without attaching a payment method, which causes the error:
```
"A payment method of type card was expected to be present, but this PaymentIntent does not have a payment method"
```

## The Solution

Update your `/api/payments/create` endpoint to:
1. Create a PaymentMethod from the card details
2. Create a PaymentIntent with that payment method attached
3. Confirm the payment automatically
4. Return the result

## Updated Spring Boot Code

```java
@PostMapping("/api/payments/create")
public ResponseEntity<?> createPayment(@RequestBody PaymentRequest request) {
    try {
        Stripe.apiKey = stripeSecretKey;

        // Add this import at the top of the file:
        // import java.util.List;

        // Step 1: Create PaymentMethod from card details
        Map<String, Object> cardParams = new HashMap<>();
        cardParams.put("number", request.getCardNumber());
        cardParams.put("exp_month", request.getExpMonth());
        cardParams.put("exp_year", request.getExpYear());
        cardParams.put("cvc", request.getCvc());

        Map<String, Object> paymentMethodParams = new HashMap<>();
        paymentMethodParams.put("type", "card");
        paymentMethodParams.put("card", cardParams);
        
        if (request.getCardHolder() != null) {
            Map<String, Object> billingDetails = new HashMap<>();
            billingDetails.put("name", request.getCardHolder());
            paymentMethodParams.put("billing_details", billingDetails);
        }

        PaymentMethod paymentMethod = PaymentMethod.create(paymentMethodParams);

        // Step 2: Create PaymentIntent with payment method attached
        Map<String, Object> paymentIntentParams = new HashMap<>();
        paymentIntentParams.put("amount", request.getAmount() * 100); // Convert to paise
        paymentIntentParams.put("currency", request.getCurrency());
        paymentIntentParams.put("payment_method", paymentMethod.getId());
        paymentIntentParams.put("payment_method_types", List.of("card")); // Required when disabling automatic payment methods
        paymentIntentParams.put("description", request.getDescription());
        paymentIntentParams.put("confirm", true); // Automatically confirm
        paymentIntentParams.put("automatic_payment_methods", Map.of("enabled", false));
        
        // Handle 3D Secure
        paymentIntentParams.put("return_url", "http://localhost:3000");

        PaymentIntent paymentIntent = PaymentIntent.create(paymentIntentParams);

        // Step 3: Return appropriate response based on status
        Map<String, Object> response = new HashMap<>();
        response.put("paymentIntentId", paymentIntent.getId());
        response.put("status", paymentIntent.getStatus());
        
        if ("requires_action".equals(paymentIntent.getStatus())) {
            // Payment needs 3D Secure authentication
            response.put("clientSecret", paymentIntent.getClientSecret());
        }

        return ResponseEntity.ok(response);

    } catch (StripeException e) {
        Map<String, Object> error = new HashMap<>();
        error.put("error", e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
}
```

## PaymentRequest DTO

Make sure your `PaymentRequest` class has these fields:

```java
public class PaymentRequest {
    private Long amount;           // Amount in rupees (will be converted to paise)
    private String currency;       // "inr"
    private String cardNumber;     // "4242424242424242"
    private String cardHolder;     // "Rohit"
    private Integer expMonth;      // 12
    private Integer expYear;       // 2026
    private String cvc;            // "123"
    private String description;    // "E-commerce order payment"
    private String customerEmail;  // Optional: used to identify the Stripe Customer uniquely
    
    // Getters and setters...
}
```

## What This Does

1. ✅ Creates a PaymentMethod from card details (securely)
2. ✅ Attaches the payment method to the PaymentIntent
3. ✅ Confirms the payment automatically
4. ✅ Returns status "succeeded" for successful payments
5. ✅ Returns clientSecret if 3D Secure is needed
6. ✅ Payment shows as "Succeeded" in Stripe Dashboard

## Test It

After updating your backend, restart it and test with:
- **Card**: 4242 4242 4242 4242
- **CVV**: 123
- **Expiry**: 12/26
- **Name**: Rohit

Payment should now succeed! 🎉

## Why this fixes the "automatic_payment_methods" error

Stripe requires either `automatic_payment_methods.enabled = true` or an explicit `payment_method_types` list. Because we disable automatic methods, we now set `payment_method_types` to `card` so the intent is valid and the error goes away.

## Use Dynamic Customer Name (fixes all customers showing as "Radha")

If your dashboard shows the same customer name (e.g., "Radha") for every payment, your backend is likely creating or reusing a static Stripe `Customer` and attaching it to every `PaymentIntent`.

To fix this:

1. Create or reuse a `Customer` using the real buyer details (name/email)
2. Attach that `customer` to the `PaymentIntent`

Example update:

```java
// Before creating PaymentIntent
Customer customer = null;
if (request.getCustomerEmail() != null && !request.getCustomerEmail().isEmpty()) {
    // Try to find existing customer by email (optional; list and match)
    Map<String, Object> listParams = new HashMap<>();
    listParams.put("email", request.getCustomerEmail());
    CustomerCollection customers = Customer.list(listParams);
    if (customers != null && customers.getData() != null && !customers.getData().isEmpty()) {
        customer = customers.getData().get(0);
    }
}

if (customer == null) {
    Map<String, Object> customerParams = new HashMap<>();
    if (request.getCardHolder() != null) customerParams.put("name", request.getCardHolder());
    if (request.getCustomerEmail() != null) customerParams.put("email", request.getCustomerEmail());
    customer = Customer.create(customerParams);
}

// When building PaymentIntent params
paymentIntentParams.put("customer", customer.getId());
```

Notes:
- If you don't want to manage customers, simply remove any hard-coded `customer` assignment. Stripe will still show `billing_details.name` (from `cardHolder`) on the payment.
- The frontend already sends `cardHolder`; you can additionally accept `customerEmail` and pass it along to uniquely identify customers.

### Minimal Backend Change

Ensure there is no static value like:
```java
paymentIntentParams.put("customer", "cus_static_radha");
```
Replace it with the dynamic logic above or remove it to rely on `billing_details.name`.

