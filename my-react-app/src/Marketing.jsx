import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const MARKETING_KEY = "mk-2026-special";

function Marketing() {
    const navigate = useNavigate();
    const [secretKey, setSecretKey] = useState("");
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [message, setMessage] = useState("");
    const [dealData, setDealData] = useState({
        flightId: "",
        discountAmount: "",
        dealExpiryTime: "",
    });

    const unlock = () => {
        if (!secretKey.trim()) {
            setMessage("Enter marketing secret key");
            return;
        }

        if (secretKey.trim() === MARKETING_KEY) {
            setIsAuthorized(true);
            setMessage("Access granted");
            return;
        }

        setMessage("Invalid marketing secret key");
    };

    const applyDeal = () => {
        if (!dealData.flightId || !dealData.discountAmount || !dealData.dealExpiryTime) {
            setMessage("Flight ID, discount amount and deal expiry time are required");
            return;
        }

        const payload = {
            secretKey: secretKey.trim(),
            flightId: Number(dealData.flightId),
            discountAmount: Number(dealData.discountAmount),
            dealExpiryTime:
                dealData.dealExpiryTime.length === 16
                    ? `${dealData.dealExpiryTime}:00`
                    : dealData.dealExpiryTime,
        };

        fetch(`${API_BASE_URL}/marketing/deal`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
            .then(async (res) => {
                const text = await res.text();
                if (res.ok) {
                    setMessage(text || "Special deal applied");
                    setDealData({
                        flightId: "",
                        discountAmount: "",
                        dealExpiryTime: "",
                    });
                } else {
                    setMessage(text || "Failed to apply special deal");
                }
            })
            .catch(() => setMessage("Server unreachable"));
    };

    return (
        <div className="app-shell">
            <header className="app-header">
                <h1>Marketing Department</h1>
                <div className="header-actions">
                    <button onClick={() => navigate("/")}>Back to Home</button>
                </div>
            </header>

            {!isAuthorized ? (
                <section className="panel" style={{ maxWidth: "420px" }}>
                    <h2>Enter Secret Key</h2>
                    <div className="search-form">
                        <input
                            type="password"
                            placeholder="Marketing secret key"
                            value={secretKey}
                            onChange={(e) => setSecretKey(e.target.value)}
                        />
                        <button onClick={unlock}>Unlock</button>
                    </div>
                    <p className="message">{message}</p>
                </section>
            ) : (
                <section className="panel" style={{ maxWidth: "520px" }}>
                    <h2>Apply Time-Limited Discount</h2>
                    <div className="search-form">
                        <input
                            type="number"
                            placeholder="Flight ID"
                            value={dealData.flightId}
                            onChange={(e) => setDealData({ ...dealData, flightId: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Discount Amount"
                            value={dealData.discountAmount}
                            onChange={(e) => setDealData({ ...dealData, discountAmount: e.target.value })}
                        />
                        <input
                            type="datetime-local"
                            value={dealData.dealExpiryTime}
                            onChange={(e) => setDealData({ ...dealData, dealExpiryTime: e.target.value })}
                        />
                        <button onClick={applyDeal}>Apply Deal</button>
                    </div>
                    <p className="message">{message}</p>
                </section>
            )}
        </div>
    );
}

export default Marketing;
