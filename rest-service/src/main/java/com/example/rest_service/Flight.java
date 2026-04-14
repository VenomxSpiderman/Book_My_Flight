package com.example.rest_service;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Column;

@Entity
public class Flight {

    @Id
    private int id;
    
    @Enumerated(EnumType.STRING)
    private IndianCity departurecity;
    
    @Enumerated(EnumType.STRING)
    private IndianCity arrivalcity;
    
    private int price;

    @Column(name = "discountamount")
    private Integer discountAmount;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Column(name = "discountexpirytime")
    private LocalDateTime discountExpiryTime;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime expiryTime;

    public Flight() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public IndianCity getDeparturecity() { return departurecity; }
    public void setDeparturecity(IndianCity departurecity) { this.departurecity = departurecity; }

    public IndianCity getArrivalcity() { return arrivalcity; }
    public void setArrivalcity(IndianCity arrivalcity) { this.arrivalcity = arrivalcity; }

    public int getPrice() { return price; }
    public void setPrice(int price) { this.price = price; }

    public Integer getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(Integer discountAmount) { this.discountAmount = discountAmount; }

    public LocalDateTime getDiscountExpiryTime() { return discountExpiryTime; }
    public void setDiscountExpiryTime(LocalDateTime discountExpiryTime) { this.discountExpiryTime = discountExpiryTime; }

    public LocalDateTime getExpiryTime() { return expiryTime; }
    public void setExpiryTime(LocalDateTime expiryTime) { this.expiryTime = expiryTime; }
}
