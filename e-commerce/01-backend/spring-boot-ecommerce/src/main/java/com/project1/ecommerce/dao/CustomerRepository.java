package com.project1.ecommerce.dao;

import com.project1.ecommerce.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;


public interface CustomerRepository extends JpaRepository<Customer,Long> {
    Customer findByEmail(String email);
}
