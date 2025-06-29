import { useFireBase } from "../context/FireBase";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

function RACRequestCard({ uid, onActionComplete }) {
  const firebase = useFireBase();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userRef = doc(firebase.db, "users", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, [uid, firebase.db]);

  const handleAccept = async () => {
    await firebase.acceptRACRequest(uid);
    if (onActionComplete) onActionComplete(); 
  };

  const handleDeny = async () => {
    await firebase.denyRACRequest(uid);
    if (onActionComplete) onActionComplete();
  };

  if (!userData) return null;

  return (
    <div className="card shadow-sm p-3 mb-3 rounded-4">
      <h6><strong>Email:</strong> {userData.email}</h6>
      <div className="d-flex gap-2 mt-2">
        <button className="btn btn-success" onClick={handleAccept}>
          Accept
        </button>
        <button className="btn btn-danger" onClick={handleDeny}>
          Deny
        </button>
      </div>
    </div>
  );
}

export default RACRequestCard;
