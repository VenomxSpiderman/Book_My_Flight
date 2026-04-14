package com.example.rest_service;

import java.util.List;

public class FlightPath {
    private List<Flight> flights;
    private int totalCost;
    private String routeDescription;

    public FlightPath(List<Flight> flights, int totalCost, String routeDescription) {
        this.flights = flights;
        this.totalCost = totalCost;
        this.routeDescription = routeDescription;
    }

    public List<Flight> getFlights() { return flights; }
    public void setFlights(List<Flight> flights) { this.flights = flights; }

    public int getTotalCost() { return totalCost; }
    public void setTotalCost(int totalCost) { this.totalCost = totalCost; }

    public String getRouteDescription() { return routeDescription; }
    public void setRouteDescription(String routeDescription) { this.routeDescription = routeDescription; }
}
