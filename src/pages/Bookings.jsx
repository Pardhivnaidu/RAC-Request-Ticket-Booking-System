import { useEffect, useState } from "react";
import { useFireBase } from "../context/FireBase";

function Bookings() {
  const firebase = useFireBase();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    let retries = 0;
    const fetchUserData = async () => {
      if (!firebase.user) return;

      while (retries < 3) {
        const data = await firebase.getCurrentUserData();
        if (data) {
          setUserData(data);
          break;
        }
        retries++;
        await new Promise((res) => setTimeout(res, 500));
      }

      if (retries === 3) {
        console.warn("🚨 No user data found after 3 attempts.");
      }
    };

    fetchUserData();
  }, [firebase.user]);

  if (!userData) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container card shadow-sm p-4 rounded-4 mt-4 w-100">
      <h3 className="fw-bold mb-4">My Bookings</h3>

      {/* No Booking */}
      {userData.ticketStatus === "" && (
        <h6 className="text-muted">No Bookings Yet</h6>
      )}

      {/* Confirmed Booking */}
      {userData.ticketStatus === "confirmed" && (
        <BookingCard status="Booked" statusColor="success" />
      )}

      {/* Waiting List */}
      {userData.ticketStatus === "waiting" && (
        <BookingCard
          status={`Waiting List #${userData.waitingListNumber}`}
          statusColor="danger"
        />
      )}

      {/* RAC */}
      {userData.ticketStatus === "rac" && (
        <BookingCard status="Confirmed to RAC" statusColor="success" />
      )}
    </div>
  );
}

function BookingCard({ status, statusColor }) {
  return (
    <div className="card shadow-sm p-4 rounded-4 mb-3 w-100">
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <h5 className="fw-semibold mb-1">Express Train 12345</h5>
          <p className="mb-1 text-secondary">Mumbai Central → New Delhi</p>
          <p className="text-muted">08:00 AM - 08:00 PM</p>
        </div>
        <div className="text-end">
          <h5 className="text-primary fw-bold">₹200</h5>
        </div>
      </div>

      <hr />

      <div>
        <p className="text-muted mb-1">Status</p>
        <h6 className={`fw-bold text-${statusColor}`}>{status}</h6>
      </div>
    </div>
  );
}

export default Bookings;
