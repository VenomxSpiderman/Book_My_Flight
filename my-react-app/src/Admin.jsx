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
  { code: "CHD", name: "Chandigarh" },
];

export default function Admin() {
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  const getFutureDateTime = () => {
    const future = new Date();
    future.setDate(future.getDate() + 30);
    return future.toISOString().slice(0, 19);
  };

  const [flightData, setFlightData] = useState({
    id: "",
    departurecity: "",
    arrivalcity: "",
    price: "",
    expiryTime: getFutureDateTime(),
  });

  const [message, setMessage] = useState("");

  const checkAdmin = () => {
    if (code === "a") {
      setIsAuthorized(true);
      setMessage("Access Granted");
    } else {
      setMessage("Invalid Admin Code");
    }
  };

  const handleChange = (e) => {
    setFlightData({ ...flightData, [e.target.name]: e.target.value });
  };

  const postFlight = () => {
    if (
      !flightData.id ||
      !flightData.departurecity ||
      !flightData.arrivalcity ||
      !flightData.price
    ) {
      setMessage("All fields are required");
      return;
    }

    if (flightData.departurecity === flightData.arrivalcity) {
      setMessage("Departure and arrival cities must be different");
      return;
    }

    const payload = {
      id: parseInt(flightData.id),
      departurecity: flightData.departurecity,
      arrivalcity: flightData.arrivalcity,
      price: parseInt(flightData.price),
      expiryTime:
        flightData.expiryTime.length === 16
          ? `${flightData.expiryTime}:00`
          : flightData.expiryTime.includes("T")
            ? flightData.expiryTime
            : `${flightData.expiryTime}T23:59:59`,
    };

    fetch(`${API_BASE_URL}/flight`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.text())
      .then((data) => {
        setMessage(data);
        if (data === "Flight saved") {
          setFlightData({
            id: "",
            departurecity: "",
            arrivalcity: "",
            price: "",
            expiryTime: getFutureDateTime(),
          });
        }
      })
      .catch((err) => setMessage("Error: " + err.message));
  };

  const clearAllFlights = () => {
    if (
      window.confirm(
        " Are you sure you want to delete ALL flights? This cannot be undone.",
      )
    ) {
      fetch(`${API_BASE_URL}/flights/clear`, {
        method: "DELETE",
      })
        .then((res) => res.text())
        .then((data) => setMessage(data))
        .catch((err) => setMessage("Error: " + err.message));
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Admin Panel</h1>

      {!isAuthorized ? (
        <div>
          <p>Enter Admin Secret Key:</p>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            type="password"
            placeholder="Secret Key"
          />
          <button onClick={checkAdmin}>Unlock</button>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "300px",
          }}
        >
          <h3>Add New Flight</h3>
          <input
            name="id"
            placeholder="Flight ID"
            value={flightData.id}
            onChange={handleChange}
            type="number"
          />

          <label>
            <b>Departure City:</b>
          </label>
          <select
            name="departurecity"
            value={flightData.departurecity}
            onChange={handleChange}
          >
            <option value="">Select Departure City</option>
            {INDIAN_CITIES.map((city) => (
              <option key={city.code} value={city.code}>
                {city.code} - {city.name}
              </option>
            ))}
          </select>

          <label>
            <b>Arrival City:</b>
          </label>
          <select
            name="arrivalcity"
            value={flightData.arrivalcity}
            onChange={handleChange}
          >
            <option value="">Select Arrival City</option>
            {INDIAN_CITIES.map((city) => (
              <option key={city.code} value={city.code}>
                {city.code} - {city.name}
              </option>
            ))}
          </select>

          <input
            name="price"
            placeholder="Price"
            value={flightData.price}
            onChange={handleChange}
            type="number"
          />
          <label>
            Expiry Time: <i>Default is 30 days from now</i>
          </label>
          <input
            name="expiryTime"
            placeholder="Expiry (YYYY-MM-DDTHH:mm:ss)"
            value={flightData.expiryTime}
            onChange={handleChange}
            type="datetime-local"
          />

          <button
            onClick={postFlight}
            style={{
              backgroundColor: "green",
              color: "white",
              padding: "10px",
            }}
          >
            Add Flight to System
          </button>
        </div>
      )}

      <p>
        <b>{message}</b>
      </p>
      {isAuthorized && (
        <button
          onClick={clearAllFlights}
          style={{
            marginTop: "20px",
            marginRight: "10px",
            backgroundColor: "red",
            color: "white",
            padding: "10px",
          }}
        >
          Clear All Flights
        </button>
      )}
      <button onClick={() => navigate("/")} style={{ marginTop: "20px" }}>
        Back to Home
      </button>
    </div>
  );
}
