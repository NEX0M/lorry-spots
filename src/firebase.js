import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDP5DogsoMSm02_u9eBoqaUyESJGHYHYNw",
  authDomain: "lorry-spots.firebaseapp.com",
  projectId: "lorry-spots",
  storageBucket: "lorry-spots.firebasestorage.app",
  messagingSenderId: "674374271428",
  appId: "1:674374271428:web:bc50064e0fa135f7a0a491",
  measurementId: "G-2CSE0Z13WY"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);