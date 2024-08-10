// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE,
  authDomain: "blogsite-juswa.firebaseapp.com",
  projectId: "blogsite-juswa",
  storageBucket: "blogsite-juswa.appspot.com",
  messagingSenderId: "499383271944",
  appId: "1:499383271944:web:fb1830fe5e3c67ac86c7bd",
  measurementId: "G-J7D4K8K8R5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default app