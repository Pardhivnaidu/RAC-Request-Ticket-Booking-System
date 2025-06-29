// src/context/FireBase.jsx

import { createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  arrayUnion, doc, getDoc, getDocs, setDoc,
  collection, query, where,
  getFirestore,
  addDoc,
} from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

// ✅ Correct Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDqVXjCNJ0tF1xkddIvHtAADP6VVOLF_hU",
  authDomain: "rac-system-f3f6c.firebaseapp.com",
  projectId: "rac-system-f3f6c",
  storageBucket: "rac-system-f3f6c.appspot.com", // ✅ Fixed this
  messagingSenderId: "322321915596",
  appId: "1:322321915596:web:468e756acd00cd7d63ac69"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


const FireBaseContext = createContext(null);

export const FireBaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  // 🔑 Auth functions
  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const register = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);



  const createUserIfNotExists = async (user) => {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        ticketStatus: "",
        waitingListNumber: 0,
        requestedTo: "",
        racRequestStatus: "",
        paymentStatus: "pending"
      });
      alert("✅ Firestore user document created!");
    } else {
      alert("⚠️ User already exists in Firestore.");
    }
  };

  const getTrainStatus = async () => {
    try {
      const trainRef = doc(db, "trainStatus", "train123");
      const trainSnap = await getDoc(trainRef);

      if (trainSnap.exists()) {
        return trainSnap.data();
      } else {
        alert.warn("No such train document!");
        return null;
      }
    } catch (error) {
      alert.error("Error fetching train status:", error);
      return null;
    }
  };


  const getCurrentUserData = async () => {
    if (!user) return null;

    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        return userSnap.data();
      } else {
        console.warn("User document not found.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

const bookTicket = async () => {
  if (!auth.currentUser) {
    alert("User not logged in.");
    return;
  }

  const userId = auth.currentUser.uid;
  const userEmail = auth.currentUser.email;

  const trainRef = doc(db, "trainStatus", "train123");
  const userRef = doc(db, "users", userId);

  try {
    const trainSnap = await getDoc(trainRef);
    const trainData = trainSnap.data();

    const updatedData = {
      waitingCount: trainData.waitingCount + 1,
    };

    if (trainData.ticketAvailabe) {
      updatedData.confirmedUser = userEmail;
      updatedData.ticketAvailabe = false;

      await setDoc(userRef, {
        uid: userId,
        email: userEmail,
        ticketStatus: "confirmed",
        waitingListNumber: 0,
        requestedTo: "",
        racRequestStatus: "",
        paymentStatus: "pending"
      }, { merge: true });

    } else {
      await setDoc(userRef, {
        uid: userId,
        email: userEmail,
        ticketStatus: "waiting",
        waitingListNumber: trainData.waitingCount + 1,
        requestedTo: "",
        racRequestStatus: "",
        paymentStatus: "pending"
      }, { merge: true });
    }

    await setDoc(trainRef, updatedData, { merge: true });

    alert("🎫 Booking successful!");
  } catch (error) {
    console.error("Booking error:", error);
    alert("Booking failed: " + error.message);
  }
};

// Add this function inside FireBaseProvider
const sendRACRequest = async () => {
  if (!user) {
    alert("User not logged in");
    return;
  }

  try {
    // 1. Get train data
    const trainRef = doc(db, "trainStatus", "train123");
    const trainSnap = await getDoc(trainRef);
    const trainData = trainSnap.data();

    const confirmedEmail = trainData.confirmedUser;
    if (!confirmedEmail) {
      alert("No confirmed user found");
      return;
    }

    // 2. Get confirmed user ID
    const userQuery = query(collection(db, "users"), where("email", "==", confirmedEmail));
    const result = await getDocs(userQuery);
    if (result.empty) {
      alert("Confirmed user not found");
      return;
    }

    const confirmedUserId = result.docs[0].id;

    // 3. Update current waiting user
    const currentUserRef = doc(db, "users", user.uid);
    await setDoc(currentUserRef, {
      requestedTo: confirmedUserId,
      racRequestStatus: "pending"
    }, { merge: true });

    // 4. Update train document's racPair
    await setDoc(trainRef, {
      racPair: arrayUnion(user.uid)
    }, { merge: true });

    alert("✅ RAC Request sent!");
  } catch (error) {
    console.error("sendRACRequest error:", error);
    alert("❌ Failed to send RAC request: " + error.message);
  }
};

const acceptRACRequest = async (waitingUid) => {
  const trainRef = doc(db, "trainStatus", "train123");
  const trainSnap = await getDoc(trainRef);
  const trainData = trainSnap.data();

  const confirmedUserRef = doc(db, "users", user.uid);
  const waitingUserRef = doc(db, "users", waitingUid);

  // 1. Update both users to RAC
  await setDoc(confirmedUserRef, { ticketStatus: "rac" }, { merge: true });
  await setDoc(waitingUserRef, { ticketStatus: "rac", racRequestStatus: "accepted" }, { merge: true });

  // 2. Clear racPair array
  await setDoc(trainRef, { racPair: [] }, { merge: true });
};

const denyRACRequest = async (waitingUid) => {
  const trainRef = doc(db, "trainStatus", "train123");
  const trainSnap = await getDoc(trainRef);
  const trainData = trainSnap.data();

  // Remove denied UID from racPair
  const updatedRacPair = (trainData.racPair || []).filter((uid) => uid !== waitingUid);
  await setDoc(trainRef, { racPair: updatedRacPair }, { merge: true });

  // Reset user's request info
  const waitingUserRef = doc(db, "users", waitingUid);
  await setDoc(waitingUserRef, {
    requestedTo: "",
    racRequestStatus: "",
  }, { merge: true });
};








  const logout = () => signOut(auth);

  return (
    <FireBaseContext.Provider value={{     user,
    db,
    login,
    register,
    logout,
    createUserIfNotExists,
    getTrainStatus,
    getCurrentUserData,
    bookTicket,
    sendRACRequest,
    acceptRACRequest,
    denyRACRequest
 }}>
      {children}
    </FireBaseContext.Provider>
  );
};

// 👇 Hook to use Firebase
export const useFireBase = () => useContext(FireBaseContext);
