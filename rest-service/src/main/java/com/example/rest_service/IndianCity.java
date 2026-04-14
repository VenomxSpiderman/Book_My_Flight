package com.example.rest_service;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum IndianCity {
    DELHI("DEL", "Delhi"),
    MUMBAI("MUM", "Mumbai"),
    KOLKATA("KOL", "Kolkata"),
    BANGALORE("BNG", "Bangalore"),
    HYDERABAD("HYD", "Hyderabad"),
    CHENNAI("CHN", "Chennai"),
    PUNE("PUN", "Pune"),
    AHMEDABAD("AHM", "Ahmedabad"),
    JAIPUR("JAI", "Jaipur"),
    LUCKNOW("LKO", "Lucknow"),
    SRINAGAR("SRI", "Srinagar"),
    GOA("GOA", "Goa"),
    INDORE("IND", "Indore"),
    KOCHI("KOC", "Kochi"),
    CHANDIGARH("CHD", "Chandigarh");

    private final String code;
    private final String fullName;

    IndianCity(String code, String fullName) {
        this.code = code;
        this.fullName = fullName;
    }

    @JsonValue
    public String getCode() {
        return code;
    }

    public String getFullName() {
        return fullName;
    }

    @JsonCreator
    public static IndianCity fromCode(String code) {
        for (IndianCity city : IndianCity.values()) {
            if (city.code.equalsIgnoreCase(code)) {
                return city;
            }
        }
        throw new IllegalArgumentException("Invalid city code: " + code);
    }
}
