package com.example.rest_service;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

public class MarketingDealRequest {

    private String secretKey;
    private Integer flightId;
    private Integer discountAmount;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dealExpiryTime;

    public MarketingDealRequest() {}

    public String getSecretKey() {
        return secretKey;
    }

    public void setSecretKey(String secretKey) {
        this.secretKey = secretKey;
    }

    public Integer getFlightId() {
        return flightId;
    }

    public void setFlightId(Integer flightId) {
        this.flightId = flightId;
    }

    public Integer getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(Integer discountAmount) {
        this.discountAmount = discountAmount;
    }

    public LocalDateTime getDealExpiryTime() {
        return dealExpiryTime;
    }

    public void setDealExpiryTime(LocalDateTime dealExpiryTime) {
        this.dealExpiryTime = dealExpiryTime;
    }
}
