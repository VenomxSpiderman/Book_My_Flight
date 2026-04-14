package com.example.rest_service;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

public class SpecialDealResponse {

    private int flightId;
    private String departurecity;
    private String arrivalcity;
    private int cost;
    private int originalCost;
    private int discountAmount;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dealExpiryTime;

    public SpecialDealResponse() {}

    public SpecialDealResponse(int flightId, String departurecity, String arrivalcity, int cost, int originalCost, int discountAmount, LocalDateTime dealExpiryTime) {
        this.flightId = flightId;
        this.departurecity = departurecity;
        this.arrivalcity = arrivalcity;
        this.cost = cost;
        this.originalCost = originalCost;
        this.discountAmount = discountAmount;
        this.dealExpiryTime = dealExpiryTime;
    }

    public int getFlightId() {
        return flightId;
    }

    public void setFlightId(int flightId) {
        this.flightId = flightId;
    }

    public String getDeparturecity() {
        return departurecity;
    }

    public void setDeparturecity(String departurecity) {
        this.departurecity = departurecity;
    }

    public String getArrivalcity() {
        return arrivalcity;
    }

    public void setArrivalcity(String arrivalcity) {
        this.arrivalcity = arrivalcity;
    }

    public int getCost() {
        return cost;
    }

    public void setCost(int cost) {
        this.cost = cost;
    }

    public int getOriginalCost() {
        return originalCost;
    }

    public void setOriginalCost(int originalCost) {
        this.originalCost = originalCost;
    }

    public int getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(int discountAmount) {
        this.discountAmount = discountAmount;
    }

    public LocalDateTime getDealExpiryTime() {
        return dealExpiryTime;
    }

    public void setDealExpiryTime(LocalDateTime dealExpiryTime) {
        this.dealExpiryTime = dealExpiryTime;
    }
}
