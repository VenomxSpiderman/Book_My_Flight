import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import FlightInfo from "./FlightInfo";
import MyBooking from "./MyBooking";
import Admin from "./Admin";
import Search from "./Search";
import Marketing from "./Marketing";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/flight/:id" element={<FlightInfo />} />
        <Route path="/mybooking/:phone" element={<MyBooking />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/marketing" element={<Marketing />} />
      </Routes>
    </Router>
  );
}

export default App;
