import { useEffect, useState, useCallback } from "react";
import { useFireBase } from "../context/FireBase";
import RACRequestCard from "../components/RACRequestCard";
import LoadingSpinner from "../components/LoadingSpinner";

function Request() {
  const firebase = useFireBase();
  const [racPair, setRacPair] = useState([]);
  const [isConfirmedUser, setIsConfirmedUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  // Function to trigger refresh from child
  const triggerRefresh = useCallback(() => {
    setLoading(true);
    setRefresh((prev) => !prev);
  }, []);

  useEffect(() => {
    const fetchRACPair = async () => {
      if (!firebase.user) return;

      const trainSnap = await firebase.getTrainStatus();
      if (!trainSnap) return;

      const confirmedUserEmail = trainSnap.confirmedUser;
      const currentUserEmail = firebase.user.email;

      if (currentUserEmail === confirmedUserEmail) {
        setIsConfirmedUser(true);
        setRacPair(trainSnap.racPair || []);
      } else {
        setIsConfirmedUser(false);
      }

      setLoading(false);
    };

    fetchRACPair();
  }, [firebase.user, refresh]);

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-4">RAC Requests</h2>

      {loading ? (
        <LoadingSpinner />
      ) : !isConfirmedUser ? (
        <div className="alert alert-warning">
          Since your ticket is not confirmed, you cannot view RAC requests.
        </div>
      ) : racPair.length === 0 ? (
        <div className="alert alert-info">No active RAC requests at the moment.</div>
      ) : (
        racPair.map((uid) => (
          <RACRequestCard key={uid} uid={uid} onActionComplete={triggerRefresh} />
        ))
      )}
    </div>
  );
}

export default Request;
