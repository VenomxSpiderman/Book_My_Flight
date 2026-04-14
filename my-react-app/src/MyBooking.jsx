import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function MyBooking() {
  const { phone } = useParams();
  const [flight, setFlight] = useState(null);
  const [fa, setfa] = useState([]);
  useEffect(() => {
    fetch(`${API_BASE_URL}/booking/${phone}`)
      .then(res => {
        if (!res.ok) throw new Error("Not Found");
        return res.json();
      })
      .then(data => { setfa(data); setFlight("OK") })
      .catch(err => {
        console.error(err);
        setFlight("NOT_FOUND");
      });
  }, [phone]);

  if (!flight) return <p>Loading...</p>;
  if (flight === "NOT_FOUND") {
    return <p>FLIGHT DO NOT EXIST</p>;
  }

  return (
    <div>
      <ul>
        {fa.length === 0
          ? <li>No Bookings</li>
          : fa.map((i) => (
            <li key={i.bookingId}>Ticket #{i.bookingId} | Flight: {i.flightId} | Phone: {i.phoneNumber}</li>
          ))}
      </ul>
    </div>
  );

};
