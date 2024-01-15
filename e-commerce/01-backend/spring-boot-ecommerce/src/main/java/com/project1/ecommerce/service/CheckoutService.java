package com.project1.ecommerce.service;

import com.project1.ecommerce.dto.PaymentInfo;
import com.project1.ecommerce.dto.Purchase;
import com.project1.ecommerce.dto.PurchaseResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

public interface CheckoutService {
    PurchaseResponse placeOrder(Purchase purchase);

    PaymentIntent createPaymentIntent(PaymentInfo paymentInfo)throws StripeException;
}
