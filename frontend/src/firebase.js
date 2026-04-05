import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA0Vc1Yi6c1Us6s1U4LJdYYLS8Mq2C9cvc",
  authDomain: "traktorbnb.firebaseapp.com",
  projectId: "traktorbnb",
  storageBucket: "traktorbnb.firebasestorage.app",
  messagingSenderId: "583660353826",
  appId: "1:583660353826:web:025de374da8874a0108d7b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);