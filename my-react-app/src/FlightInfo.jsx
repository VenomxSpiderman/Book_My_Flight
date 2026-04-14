import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function FlightInfo() {
  const { id } = useParams();
  const [flight, setFlight] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/flight/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Not Found");
        return res.json();
      })
      .then(data => setFlight(data))
      .catch(err => {
        console.error(err);
        setFlight("NOT_FOUND");
      });
  }, [id]);

  if (!flight) return <p>Loading...</p>;
  if (flight === "NOT_FOUND") {
    return <p>FLIGHT DOES NOT EXIST</p>;
  }

  return (
    <div>
      <h2>Flight Details</h2>
      <p>ID: {flight.id}</p>
      <p>{flight.departurecity}  {flight.arrivalcity}</p>
      <p>Price: Rs {flight.price}</p>

    </div>
  );
}

export default FlightInfo;
