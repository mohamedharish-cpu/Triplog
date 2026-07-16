import { useEffect, useState } from "react";
import { supabase } from "./supabase";

function TripHistory() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    setLoading(true);
    // Fetching directly from the 'trips' table
    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setTrips(data || []);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <span className="spinner"></span>
        <p className="loading-text">Fetching trips...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-box">⚠️ Error: {error}</div>;
  }

  return (
    <div className="history-container">
      <h2 className="history-title">Recent Trips ({trips.length})</h2>
      {trips.length === 0 ? (
        <p className="no-trips">No trips logged yet. Start traveling! 🚀</p>
      ) : (
        <div className="trip-list">
          {trips.map((trip) => (
            <div key={trip.id} className="trip-card">
              <div className="trip-header">
                <span className="trip-badge mode-badge">{trip.mode || "Unknown"}</span>
                <span className="trip-badge purpose-badge">{trip.purpose || "Other"}</span>
              </div>
              <div className="trip-route">
                <div className="route-point">
                  <span className="dot origin-dot"></span>
                  <p>{trip.origin}</p>
                </div>
                <div className="route-line"></div>
                <div className="route-point">
                  <span className="dot dest-dot"></span>
                  <p>{trip.destination}</p>
                </div>
              </div>
              <div className="trip-footer">
                <span>
                  {trip.created_at
                    ? new Date(trip.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TripHistory;