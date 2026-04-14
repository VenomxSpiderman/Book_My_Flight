package com.example.rest_service;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.HashSet;

@CrossOrigin(origins = "*")
@RestController
public class HomeController {

    private static final String MARKETING_SECRET_KEY = "mk-2026-special";

    private final FlightRepository flightRepo;
    private final BookingRepository bookingRepo;

    public HomeController(FlightRepository flightRepo, BookingRepository bookingRepo) {
        this.flightRepo = flightRepo;
        this.bookingRepo = bookingRepo;
    }

    @GetMapping("/")
    public String home() {
        return "Server running";
    }

    @PostMapping("/flight")
    public ResponseEntity<String> addFlight(@RequestBody Flight f) {
        if (f.getDeparturecity() == null || f.getArrivalcity() == null) {
            return ResponseEntity.badRequest().body("Invalid cities");
        }
        if (f.getDeparturecity() == f.getArrivalcity()) {
            return ResponseEntity.badRequest().body("Departure and arrival cities must be different");
        }
        f.setDiscountAmount(0);
        f.setDiscountExpiryTime(null);
        flightRepo.save(f);
        return ResponseEntity.ok("Flight saved");
    }

    @GetMapping("/flights")
    public List<Flight> getFlights() {
        return flightRepo.findAll()
                .stream()
                .filter(f -> f.getExpiryTime() != null && f.getExpiryTime().isAfter(LocalDateTime.now()))
                .toList();
    }

    @GetMapping("/flight/{id}")
    public ResponseEntity<Flight> getFlight(@PathVariable int id) {
        return flightRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(404).body(null));
    }

    @GetMapping("/booking/{phone}")
    public List<Booking> getBookingsByPhone(@PathVariable String phone) {
        return bookingRepo.findAll().stream()
                .filter(b -> b.getPhoneNumber().equals(phone))
                .toList();
    }

    @DeleteMapping("/flight/{id}")
    public ResponseEntity<String> deleteFlight(@PathVariable int id) {
        if (flightRepo.existsById(id)) {
            flightRepo.deleteById(id);
            return ResponseEntity.ok("Deleted");
        }
        return ResponseEntity.status(404).body("Not Found");
    }

    @PutMapping("/flight/{id}")
    public ResponseEntity<String> updateFlight(@PathVariable int id, @RequestBody Flight f) {
        if (id != f.getId()) {
            return ResponseEntity.badRequest().body("ID mismatch");
        }
        if (!flightRepo.existsById(id)) {
            return ResponseEntity.status(404).body("Not Found");
        }
        flightRepo.save(f);
        return ResponseEntity.ok("Updated");
    }

    @PostMapping("/book")
    public ResponseEntity<String> book(@RequestBody Booking b) {
        return flightRepo.findById(b.getFlightId())
            .map(flight -> {
                if (flight.getExpiryTime() != null && b.getBookingTime() != null) {
                    if (flight.getExpiryTime().isBefore(b.getBookingTime())) {
                        return ResponseEntity.badRequest().body("Flight has already expired.");
                    }
                }
                try {
                    bookingRepo.save(b);
                    return ResponseEntity.ok("Booked Successfully!");
                } catch (Exception e) {
                    return ResponseEntity.status(500).body("Database Error: " + e.getMessage());
                }
            })
            .orElse(ResponseEntity.status(404).body("Flight ID not found."));
    }

    @GetMapping("/deals")
    public List<SpecialDealResponse> getSpecialDeals() {
        LocalDateTime now = LocalDateTime.now();

        return flightRepo.findAll()
                .stream()
                .filter(f -> f.getExpiryTime() != null && f.getExpiryTime().isAfter(now)
                          && f.getDiscountAmount() != null && f.getDiscountAmount() > 0
                          && f.getDiscountExpiryTime() != null && f.getDiscountExpiryTime().isAfter(now))
                .map(f -> {
                    int discountedCost = Math.max(1, f.getPrice() - f.getDiscountAmount());
                    return new SpecialDealResponse(
                            f.getId(),
                            f.getDeparturecity().getCode(),
                            f.getArrivalcity().getCode(),
                            discountedCost,
                            f.getPrice(),
                            f.getDiscountAmount(),
                            f.getDiscountExpiryTime()
                    );
                })
                .toList();
    }

    @PostMapping("/marketing/deal")
    public ResponseEntity<String> applyMarketingDeal(@RequestBody MarketingDealRequest request) {
        if (request.getSecretKey() == null || !MARKETING_SECRET_KEY.equals(request.getSecretKey().trim())) {
            return ResponseEntity.status(401).body("Invalid marketing secret key");
        }
        if (request.getFlightId() == null || request.getDiscountAmount() == null || request.getDealExpiryTime() == null) {
            return ResponseEntity.badRequest().body("Flight ID, discount amount and deal expiry time are required");
        }
        if (request.getDiscountAmount() <= 0) {
            return ResponseEntity.badRequest().body("Discount amount must be greater than 0");
        }
        if (!request.getDealExpiryTime().isAfter(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Deal expiry time must be in the future");
        }

        return flightRepo.findById(request.getFlightId())
                .map(flight -> {
                    if (flight.getExpiryTime() != null && !flight.getExpiryTime().isAfter(LocalDateTime.now())) {
                        return ResponseEntity.badRequest().body("Cannot apply deal to an expired flight");
                    }
                    if (request.getDiscountAmount() >= flight.getPrice()) {
                        return ResponseEntity.badRequest().body("Discount must be smaller than flight price");
                    }

                    flight.setDiscountAmount(request.getDiscountAmount());
                    flight.setDiscountExpiryTime(request.getDealExpiryTime());
                    flightRepo.save(flight);

                    return ResponseEntity.ok("Special deal applied");
                })
                .orElse(ResponseEntity.status(404).body("Flight ID not found"));
    }

    @GetMapping("/book")
    public List<Booking> getBookings() {
        return bookingRepo.findAll();
    }

    private void dfs(IndianCity current, IndianCity destination, List<Flight> currentPath, int currentCost, List<FlightPath> allPaths, Set<IndianCity> visited, List<Flight> allAvailableFlights) {
        if (current == destination) {
            StringBuilder routeDesc = new StringBuilder();
            for (Flight f : currentPath) {
                if (routeDesc.length() > 0) routeDesc.append(" -> ");
                else routeDesc.append(f.getDeparturecity().getCode()).append(" -> ");
                routeDesc.append(f.getArrivalcity().getCode());
            }
            allPaths.add(new FlightPath(new ArrayList<>(currentPath), currentCost, routeDesc.toString()));
            return;
        }

        for (Flight f : allAvailableFlights) {
            if (f.getDeparturecity() == current && !visited.contains(f.getArrivalcity())) {
                visited.add(f.getArrivalcity());
                currentPath.add(f);
                dfs(f.getArrivalcity(), destination, currentPath, currentCost + f.getPrice(), allPaths, visited, allAvailableFlights);
                currentPath.remove(currentPath.size() - 1);
                visited.remove(f.getArrivalcity());
            }
        }
    }

    @GetMapping("/search")
    public List<FlightPath> searchRoutes(@RequestParam String from, @RequestParam String to) {
        try {
            IndianCity departure = IndianCity.fromCode(from.toUpperCase());
            IndianCity arrival = IndianCity.fromCode(to.toUpperCase());
            
            List<FlightPath> paths = new ArrayList<>();
            LocalDateTime now = LocalDateTime.now();
            List<Flight> allFlights = flightRepo.findAll()
                    .stream()
                    .filter(f -> f.getExpiryTime() != null && f.getExpiryTime().isAfter(now))
                    .toList();

            Set<IndianCity> visited = new HashSet<>();
            visited.add(departure);
            dfs(departure, arrival, new ArrayList<>(), 0, paths, visited, allFlights);

            paths.sort((a, b) -> Integer.compare(a.getTotalCost(), b.getTotalCost()));
            return paths;
        } catch (IllegalArgumentException e) {
            return new ArrayList<>();
        }
    }

    @DeleteMapping("/flights/clear")
    public ResponseEntity<String> clearAllFlights() {
        flightRepo.deleteAll();
        return ResponseEntity.ok("All flights cleared");
    }
}
