import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const INDIAN_CITIES = [
    { code: "DEL", name: "Delhi" },
    { code: "MUM", name: "Mumbai" },
    { code: "KOL", name: "Kolkata" },
    { code: "BNG", name: "Bangalore" },
    { code: "HYD", name: "Hyderabad" },
    { code: "CHN", name: "Chennai" },
    { code: "PUN", name: "Pune" },
    { code: "AHM", name: "Ahmedabad" },
    { code: "JAI", name: "Jaipur" },
    { code: "LKO", name: "Lucknow" },
    { code: "SRI", name: "Srinagar" },
    { code: "GOA", name: "Goa" },
    { code: "IND", name: "Indore" },
    { code: "KOC", name: "Kochi" },
    { code: "CHD", name: "Chandigarh" }
];

export default function Search() {
    const navigate = useNavigate();
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [results, setResults] = useState([]);
    const [message, setMessage] = useState("");

    const searchRoutes = () => {
        if (!from || !to) {
            setMessage("Select both departure and arrival cities");
            return;
        }

        if (from === to) {
            setMessage("Departure and arrival cities must be different");
            return;
        }

        fetch(`${API_BASE_URL}/search?from=${from}&to=${to}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Server error: ${res.status} ${res.statusText}`);
                }
                return res.json();
            })
            .then(data => {
                if (!Array.isArray(data) || data.length === 0) {
                    setMessage("No routes available");
                    setResults([]);
                } else {
                    setMessage(`Found ${data.length} route(s)`);
                    setResults(data);
                }
            })
            .catch(err => {
                console.error("Search error:", err);
                setMessage(`Error: ${err.message || "Search failed"}`);
            });
    };

    const bookPath = (pathIndex) => {
        const path = results[pathIndex];
        if (path.flights.length === 1) {
            navigate(`/?flightId=${path.flights[0].id}`);
        } else {
            setMessage("Multi-hop bookings not yet supported in booking UI. Book individual flights separately.");
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial" }}>
            <h2> Search Routes</h2>

            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                <div>
                    <label><b>From:</b></label>
                    <select value={from} onChange={(e) => setFrom(e.target.value)}>
                        <option value="">Select Departure</option>
                        {INDIAN_CITIES.map(city => (
                            <option key={city.code} value={city.code}>{city.code} - {city.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label><b>To:</b></label>
                    <select value={to} onChange={(e) => setTo(e.target.value)}>
                        <option value="">Select Arrival</option>
                        {INDIAN_CITIES.map(city => (
                            <option key={city.code} value={city.code}>{city.code} - {city.name}</option>
                        ))}
                    </select>
                </div>

                <button onClick={searchRoutes} style={{ padding: "8px 16px", backgroundColor: "blue", color: "white" }}>
                    Search
                </button>
            </div>

            <p style={{ color: "blue", fontWeight: "bold" }}>{message}</p>

            {results.length > 0 && (
                <div>
                    <h3>Available Routes (Sorted by Cost - Lowest to Highest)</h3>
                    <ul style={{ listStyleType: "none", padding: 0 }}>
                        {results.map((path, idx) => (
                            <li
                                key={idx}
                                style={{
                                    border: "1px solid #ddd",
                                    padding: "15px",
                                    marginBottom: "10px",
                                    borderRadius: "5px",
                                    backgroundColor: "#f9f9f9"
                                }}
                            >
                                <div>
                                    <b>Route {idx + 1}:</b> {path.routeDescription}
                                </div>
                                <div>
                                    <b>Total Cost:</b> Rs {path.totalCost}
                                </div>
                                <div style={{ marginTop: "10px" }}>
                                    <b>Flights in path:</b>
                                    <ul>
                                        {path.flights.map((flight, fIdx) => (
                                            <li key={fIdx}>
                                                Flight ID: {flight.id} | {flight.departurecity}  {flight.arrivalcity} | Rs {flight.price}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                {path.flights.length === 1 && (
                                    <button
                                        onClick={() => bookPath(idx)}
                                        style={{ backgroundColor: "green", color: "white", padding: "8px 12px", cursor: "pointer" }}
                                    >
                                        Book This Flight
                                    </button>
                                )}
                                {path.flights.length > 1 && (
                                    <p style={{ color: "gray", fontSize: "12px" }}>Multi-hop: Book flights individually from home page</p>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
