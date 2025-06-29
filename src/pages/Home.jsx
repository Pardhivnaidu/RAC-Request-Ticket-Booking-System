import { useEffect, useState } from "react";
import { useFireBase } from "../context/FireBase";
import { IoMdTrain } from "react-icons/io";
import { GiConfirmed } from "react-icons/gi";
import { GoPeople } from "react-icons/go";
import { IoTimeOutline } from "react-icons/io5";
import LoadingSpinner from "../components/LoadingSpinner";

function Home() {
  const firebase = useFireBase();
  const [ticketData, setTicketData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);

  const triggerRefresh = () => setRefresh(prev => !prev);

  useEffect(() => {
    const fetchTrainData = async () => {
      const data = await firebase.getTrainStatus();
      if (data) {
        setTicketData(data);
      } else {
        console.warn("\uD83D\uDEA8 No train status found.");
      }
    };
    fetchTrainData();
  }, [firebase, refresh]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!firebase.user) return;

      let retries = 0;
      let fetched = false;

      while (retries < 3 && !fetched) {
        const data = await firebase.getCurrentUserData();
        if (data) {
          setUserData(data);
          setLoading(false);
          fetched = true;
          break;
        }
        retries++;
        await new Promise(res => setTimeout(res, 500));
      }

      if (!fetched) {
        console.warn("\uD83D\uDEA8 No user data found after retries.");
        setUserData({
          email: firebase.user?.email || "",
          ticketStatus: "",
          waitingListNumber: 0,
          requestedTo: "",
          racRequestStatus: "",
          paymentStatus: "pending"
        });
        setLoading(false);
      }
    };

    fetchUserData();
  }, [firebase.user, refresh]);

  const handleBooking = async () => {
    await firebase.bookTicket();
    triggerRefresh();
  };

  const handleSendRACRequest = async () => {
    await firebase.sendRACRequest();
    triggerRefresh();
  };

  if (loading || !ticketData || !userData) return <LoadingSpinner />;

  return (
    <div className="container mt-4">
      <div className="card shadow p-4 rounded-4">
        <div className="d-flex justify-content-between">
          <div>
            <h3 className="fw-bold">Express Train 12345</h3>
            <p className="mb-1 text-secondary">Mumbai Central → New Delhi</p>
            <p className="text-secondary">Departure: 08:00 AM | Arrival: 08:00 PM</p>
          </div>
          <div className="text-end">
            <h4 className="text-primary fw-bold">₹200</h4>
            <p className="text-secondary">per ticket</p>
          </div>
        </div>

        <hr />

        <div>
          <h5 className="fw-semibold mb-2">Your Status</h5>

          {userData.ticketStatus === "confirmed" && (
            <div className="d-flex justify-content-between align-items-center text-success">
              <div className="d-flex align-items-center gap-2">
                <h6 className="mb-0">Confirmed Passenger:</h6>
                <span className="fw-medium">{userData.email} (you)</span>
              </div>
              <GiConfirmed size={24} />
            </div>
          )}

          {userData.ticketStatus === "rac" && (
            <div className="d-flex justify-content-between align-items-center text-success">
              <div className="d-flex align-items-center gap-2">
                <h6 className="mb-0">RAC Confirmed:</h6>
                <span className="fw-medium">{userData.email} (you)</span>
              </div>
              <GiConfirmed size={24} />
            </div>
          )}

          {userData.ticketStatus === "waiting" && (
            <div className="d-flex justify-content-between align-items-center text-danger">
              <div className="d-flex align-items-center gap-2">
                <h6 className="mb-0">Waiting List #{userData.waitingListNumber-1}:</h6>
                <span className="fw-medium">{userData.email} (you)</span>
              </div>
            </div>
          )}

          {userData.ticketStatus === "" && (
            <div>
              <span className="badge rounded-pill bg-light text-dark px-3 py-2">
                No Booking
              </span>
            </div>
          )}
        </div>

        <hr />

        <div>
          <h5 className="fw-semibold mb-2">Ticket Availability</h5>
          <p>
            Available Tickets: <span className="fw-bold text-success">{ticketData.ticketAvailabe ? 1 : 0}</span>
          </p>
          <p>
            Waiting List: <span className="fw-bold text-danger">{ticketData.waitingCount}</span>
          </p>
        </div>

        <hr />

        {userData.ticketStatus === "" && (
          <div className="text-center">
            <button
              className="btn btn-primary w-100 fw-bold py-2"
              onClick={handleBooking}
            >
              {ticketData.ticketAvailabe ? "Book Confirmed Ticket" : "Join Waiting List"}
            </button>
          </div>
        )}
      </div>

      {userData.ticketStatus === "waiting" && (
        <div className="card shadow p-4 rounded-4 mt-4 mb-4">
          <h4 className="fw-bold mb-3">RAC Seat Sharing Request</h4>
          <div className="container-fluid d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex flex-column">
              <p className="mb-1">Request to share seat with confirmed passenger</p>
              <p className="text-muted">
                Fee: ₹200 (₹120 to IRCTC, ₹80 to confirmed passenger)
              </p>
            </div>
          </div>

          {userData.requestedTo === "" ? (
            <button
              className="btn btn-primary"
              style={{ marginTop: "15px", marginLeft: "10px" }}
              onClick={handleSendRACRequest}
            >
              <GoPeople /> Send RAC Request
            </button>
          ) : (
            <>
              <h5 className="fw-semibold mt-3">My Requests</h5>
              <div className="container-fluid d-flex justify-content-between align-items-center border rounded p-3 mt-2">
                <div>
                  <p className="mb-1">Request sent to UID: {userData.requestedTo}</p>
                  <p className="mb-0 text-muted">Fee: ₹200</p>
                </div>
                <div className="d-flex flex-row align-items-center text-danger">
                  <IoTimeOutline size={24} />
                  <h6 className="mb-0 ms-2" style={{ fontSize: "18px" }}>Pending</h6>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;