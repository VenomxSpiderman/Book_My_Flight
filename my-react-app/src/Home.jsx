import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const getLocalDateTime = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;

  return new Date(now - offset).toISOString().slice(0, 19);
};

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

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [flights, setFlights] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedFlightId, setSelectedFlightId] = useState("");
  const [phone, setPhone] = useState("");
  const [bookings, setBookings] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [searchMessage, setSearchMessage] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [specialDeals, setSpecialDeals] = useState([]);

  const selectedFlight = useMemo(
    () => flights.find((f) => String(f.id) === String(selectedFlightId)) || null,
    [flights, selectedFlightId],
  );

  useEffect(() => {
    getFlights();
    getSpecialDeals();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      getSpecialDeals();
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const flightId = params.get("flightId");
    if (flightId) {
      setSelectedFlightId(String(flightId));
    }
  }, [location.search]);

  const getFlights = () => {
    fetch(`${API_BASE_URL}/flights`)
      .then((res) => res.json())
      .then((data) => {
        setFlights(data);
        if (data.length > 0 && !selectedFlightId) {
          setSelectedFlightId(String(data[0].id));
        }
      })
      .catch(() => setMessage("Failed to load flights"));
  };

  const getSpecialDeals = () => {
    fetch(`${API_BASE_URL}/deals`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch special deals");
        }
        return res.json();
      })
      .then((data) => setSpecialDeals(Array.isArray(data) ? data : []))
      .catch(() => setSpecialDeals([]));
  };

  const searchRoutes = () => {
    if (!from || !to) {
      setSearchMessage("Select departure and arrival cities");
      return;
    }
    if (from === to) {
      setSearchMessage("Departure and arrival cities must be different");
      return;
    }

    fetch(`${API_BASE_URL}/search?from=${from}&to=${to}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Search failed");
        }
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data) || data.length === 0) {
          setSearchResults([]);
          setSearchMessage("No routes available");
          return;
        }
        setSearchResults(data);
        setSearchMessage(`Found ${data.length} route(s)`);
      })
      .catch(() => {
        setSearchResults([]);
        setSearchMessage("Server unreachable");
      });
  };

  const selectRouteFlight = (pathIndex) => {
    const selectedPath = searchResults[pathIndex];
    if (!selectedPath || selectedPath.flights.length !== 1) {
      setSearchMessage("Multi-hop routes must be booked flight by flight");
      return;
    }

    const singleFlight = selectedPath.flights[0];
    setSelectedFlightId(String(singleFlight.id));
    setMessage(`Selected flight ${singleFlight.id} from search`);
  };

  const bookFlight = () => {
    const cleanedPhone = phone.trim();

    if (!selectedFlightId || !cleanedPhone) {
      setMessage("Select flight ID + enter phone");
      return;
    }

    const bookingPayload = {
      bookingId: Math.floor(Math.random() * 10000),
      flightId: Number(selectedFlightId),
      phoneNumber: cleanedPhone,
      bookingTime: getLocalDateTime()
    };

    fetch(`${API_BASE_URL}/book`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingPayload),
    })
      .then(async (res) => {
        const text = await res.text();
        if (res.ok) {
          setMessage("Success: " + text);
          getBookings();
        } else {
          setMessage("Error: " + text);
        }
      })
      .catch(() => setMessage("Booking failed: server unreachable"));
  };

  const getBookings = () => {
    fetch(`${API_BASE_URL}/book`)
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch(() => setMessage("Failed to load bookings"));
  };

  const showBook = () => {
    if (!phone.trim()) {
      setMessage("Enter phone number first");
      return;
    }
    navigate(`mybooking/${phone.trim()}`);
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Book My Flight</h1>
        <div className="header-actions">
          <button onClick={() => navigate("/search")}>Open Search Page</button>
          <button onClick={() => navigate("/admin")}>Admin</button>
          <button onClick={() => navigate("/marketing")}>Marketing</button>
        </div>
      </header>

      <section className="panel">
        <h2>Current Special Deals</h2>
        <ul className="list">
          {specialDeals.length === 0 ? (
            <li>No active special deals right now</li>
          ) : (
            specialDeals.map((deal) => (
              <li key={deal.flightId} className="list-item">
                <div>{deal.departurecity} to {deal.arrivalcity}</div>
                <div>Cost: Rs {deal.cost}</div>
                <div>Flight ID: {deal.flightId}</div>
                <button
                  onClick={() => {
                    setSelectedFlightId(String(deal.flightId));
                    setMessage(`Selected deal flight ${deal.flightId}. Enter phone and confirm booking.`);
                  }}
                >
                  Select Deal
                </button>
              </li>
            ))
          )}
        </ul>
      </section>

      <div className="tab-columns">
        <section className="panel">
          <h2>All Flights</h2>
          <ul className="list">
            {flights.length === 0 ? (
              <li>No flights available</li>
            ) : (
              flights.map((f) => (
                <li key={f.id} className="list-item">
                  <span>
                    {f.id} | {f.departurecity} to {f.arrivalcity} | Rs {f.price}
                  </span>
                  <div className="row-actions">
                    <button onClick={() => setSelectedFlightId(String(f.id))}>
                      {String(selectedFlightId) === String(f.id) ? "Selected" : "Select"}
                    </button>
                    <button onClick={() => navigate(`/flight/${f.id}`)}>Details</button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="panel">
          <h2>Search Features</h2>
          <div className="search-form">
            <select value={from} onChange={(e) => setFrom(e.target.value)}>
              <option value="">From</option>
              {INDIAN_CITIES.map(city => (
                <option key={city.code} value={city.code}>{city.code} - {city.name}</option>
              ))}
            </select>
            <select value={to} onChange={(e) => setTo(e.target.value)}>
              <option value="">To</option>
              {INDIAN_CITIES.map(city => (
                <option key={city.code} value={city.code}>{city.code} - {city.name}</option>
              ))}
            </select>
            <button onClick={searchRoutes}>Search</button>
          </div>

          <p className="message">{searchMessage}</p>

          <ul className="list">
            {searchResults.map((path, idx) => (
              <li key={idx} className="list-item">
                <div>Route {idx + 1}: {path.routeDescription}</div>
                <div>Total Cost: Rs {path.totalCost}</div>
                <div>Flights: {path.flights.map((f) => f.id).join(", ")}</div>
                <button onClick={() => selectRouteFlight(idx)}>Use This Route</button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="booking-panel">
        <h2>Flight Booking Entry</h2>
        <div className="booking-row">
          <select
            id="flight-id-select"
            value={selectedFlightId}
            onChange={(e) => setSelectedFlightId(e.target.value)}
          >
            {flights.length === 0 ? (
              <option value="">No flights available</option>
            ) : (
              flights.map((f) => (
                <option key={f.id} value={String(f.id)}>
                  {f.id} ({f.departurecity} to {f.arrivalcity})
                </option>
              ))
            )}
          </select>

          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <button onClick={bookFlight}>Confirm Booking</button>
          <button onClick={showBook}>My Booking</button>
          <button onClick={getBookings}>Load All Bookings</button>
        </div>

        <p className="message">Selected Flight: {selectedFlight?.id || "None"}</p>
        <p className="message">{message}</p>

        <ul className="list compact">
          {bookings.length === 0 ? (
            <li>No bookings yet</li>
          ) : (
            bookings.map((b) => (
              <li key={b.bookingId}>
                Ticket #{b.bookingId} | Flight: {b.flightId} | Phone: {b.phoneNumber}
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}

export default Home;
