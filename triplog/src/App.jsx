import { useState } from "react";
import { supabase } from "./supabase";
import TripHistory from "./Triphistory"; // Matching file case
import "./App.css"; // Connecting cleanly with external CSS!

function App() {
  const [form, setForm] = useState({
    origin: "",
    destination: "",
    mode: "",
    purpose: "",
  });
  const [message, setMessage] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [loadingLoc, setLoadingLoc] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setMessage("⚠️ Geolocation is not supported by your browser.");
      return;
    }
    setLoadingLoc(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const city = data.address.city || data.address.town || data.address.village || "Unknown Location";
          setForm((prev) => ({ ...prev, origin: city }));
        } catch (err) {
          setMessage("⚠️ Failed to detect location.");
        } finally {
          setLoadingLoc(false);
        }
      },
      () => {
        setMessage("⚠️ Location permission denied.");
        setLoadingLoc(false);
      }
    );
  };

  const handleSubmit = async () => {
    if (!form.origin || !form.destination || !form.mode || !form.purpose) {
      setMessage("⚠️ Please fill in all fields!");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("trips").insert([form]);
    setSubmitting(false);

    if (error) {
      setMessage("❌ Error: " + error.message);
    } else {
      setMessage("🎉 Trip logged successfully!");
      setForm({ origin: "", destination: "", mode: "", purpose: "" });
      setTimeout(() => setMessage(""), 4000);
    }
  };

  return (
    <div className="app-container">
      <div className="glass-card">
        <div className="header-section">
          <h1 className="title-gradient">TripLog</h1>
          <button onClick={() => setShowHistory(!showHistory)} className="btn-toggle">
            {showHistory ? "📝 Log Trip" : "📊 View History"}
          </button>
        </div>

        {showHistory ? (
          <TripHistory />
        ) : (
          <>
            <button onClick={getLocation} disabled={loadingLoc} className="btn-gps">
              {loadingLoc ? (
                <>
                  <span className="spinner"></span> Detecting...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                  </svg>
                  Auto Detect Location
                </>
              )}
            </button>

            <span className="section-label">Route</span>
            <div className="input-group">
              <input
                name="origin"
                placeholder="Origin"
                value={form.origin}
                onChange={handleChange}
                className="input-field"
                style={{ marginBottom: "12px" }}
              />
              <input
                name="destination"
                placeholder="Destination"
                value={form.destination}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <span className="section-label">Travel Mode</span>
            <div className="grid-selector">
              {["Bus", "Bike", "Auto", "Walk", "Car"].map((item) => (
                <div
                  key={item}
                  onClick={() => handleSelectChange("mode", item)}
                  className={`grid-item ${form.mode === item ? "active" : ""}`}
                >
                  {item}
                </div>
              ))}
            </div>

            <span className="section-label">Purpose</span>
            <div className="grid-selector grid-selector-4">
              {["Work", "Education", "Shopping", "Other"].map((item) => (
                <div
                  key={item}
                  onClick={() => handleSelectChange("purpose", item)}
                  className={`grid-item ${form.purpose === item ? "active" : ""}`}
                >
                  {item}
                </div>
              ))}
            </div>

            <button onClick={handleSubmit} disabled={submitting} className="btn-submit">
              {submitting ? <span className="spinner"></span> : "Save Trip Log"}
            </button>

            {message && (
              <div className={`toast ${message.includes("🎉") ? "toast-success" : "toast-info"}`}>
                {message}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;