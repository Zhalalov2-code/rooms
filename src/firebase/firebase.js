import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCV9fB9CwLrUZqYgoKIvEjwYdk_xzBZNlQ",
  authDomain: "rooms-e29d4.firebaseapp.com",
  projectId: "rooms-e29d4",
  storageBucket: "rooms-e29d4.appspot.com",
  messagingSenderId: "991856965772",
  appId: "1:991856965772:web:5feeb999819bd39074a3a9",
  measurementId: "G-H1SMKCCTEZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();


export {auth, googleProvider, githubProvider, app, signInWithPopup}