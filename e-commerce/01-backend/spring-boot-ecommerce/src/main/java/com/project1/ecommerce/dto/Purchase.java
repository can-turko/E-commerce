package com.project1.ecommerce.dto;

import com.project1.ecommerce.entity.Address;
import com.project1.ecommerce.entity.Customer;
import com.project1.ecommerce.entity.Order;
import com.project1.ecommerce.entity.OrderItem;

import java.util.Set;


public class Purchase {
    private Customer customer;
    private Order order;
    private Set<OrderItem> orderItems;
    private Address billingAddress;
    private Address shippingAddress;


    public Purchase() {
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Set<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(Set<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }

    public Address getBillingAddress() {
        return billingAddress;
    }

    public void setBillingAddress(Address billingAddress) {
        this.billingAddress = billingAddress;
    }

    public Address getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(Address shippingAddress) {
        this.shippingAddress = shippingAddress;
    }
}
