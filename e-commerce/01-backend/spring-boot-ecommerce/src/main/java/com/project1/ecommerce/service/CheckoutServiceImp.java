package com.project1.ecommerce.service;

import com.project1.ecommerce.dao.CustomerRepository;
import com.project1.ecommerce.dto.PaymentInfo;
import com.project1.ecommerce.dto.Purchase;
import com.project1.ecommerce.dto.PurchaseResponse;
import com.project1.ecommerce.entity.Customer;
import com.project1.ecommerce.entity.Order;
import com.project1.ecommerce.entity.OrderItem;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public class CheckoutServiceImp implements CheckoutService {

    private CustomerRepository customerRepository;

    @Autowired
    public CheckoutServiceImp(CustomerRepository customerRepository,
                              @Value("${stripe.key.secret}")String secretKey){
        this.customerRepository=customerRepository;

        //initialize Stripe API with secret key
        Stripe.apiKey=secretKey;
    }


    @Transactional
    @Override
    public PurchaseResponse placeOrder(Purchase purchase) {

        //retrieve order info from dto
        Order order = purchase.getOrder();

        //generate tracking number
        String orderTrackingNumber=generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        //populate order with orderItems
        Set<OrderItem> items = purchase.getOrderItems();
        items.forEach(item ->{order.add(item);});

        //populate order with billing address and shipping address
        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());

        //populate customer with order
        Customer customer = purchase.getCustomer();

        String email = customer.getEmail();
        Customer customerDB=this.customerRepository.findByEmail(email);
        if(customerDB != null){
            customer=customerDB;
        }

        customer.add(order);

        // save to the database
        // do not save the date base just wait until my mother leave the room she is taking something from shelf
        this.customerRepository.save(customer);

        //return a response

        return new PurchaseResponse(orderTrackingNumber);
    }

    @Override
    public PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException {
        List<String> paymentMethods = new ArrayList<>();
        paymentMethods.add("card");

        Map<String,Object> params = new HashMap<>();
        params.put("amount",paymentInfo.getAmount());
        params.put("currency",paymentInfo.getCurrency());
        params.put("payment_method_types",paymentMethods);
        params.put("description","My app purchase");
        params.put("receipt_email",paymentInfo.getReceiptEmail());



        return PaymentIntent.create(params);
    }

    private String generateOrderTrackingNumber() {
        //generate a random UUID number (UUID version-4)
        return UUID.randomUUID().toString();
    }
}
