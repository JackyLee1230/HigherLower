// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyA1E-v2h5fX3u3VYzRZfOIQgVP12oDW_4Y",
	authDomain: "higherorlower-56ce4.firebaseapp.com",
	databaseURL:
		"https://higherorlower-56ce4-default-rtdb.asia-southeast1.firebasedatabase.app",
	projectId: "higherorlower-56ce4",
	storageBucket: "higherorlower-56ce4.appspot.com",
	messagingSenderId: "627919694877",
	appId: "1:627919694877:web:f6b188443e666b3974eaf4",
	measurementId: "G-W5BTVP35BF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getDatabase(app);

export const firestore = getFirestore(app);

export const auth = getAuth();
