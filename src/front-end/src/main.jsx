import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAI0Qn1XyhnJTcTFmSH9ntwSobpMLeoUb0",
  authDomain: "mern-blog-6c91b.firebaseapp.com",
  projectId: "mern-blog-6c91b",
  storageBucket: "mern-blog-6c91b.firebasestorage.app",
  messagingSenderId: "1077589328588",
  appId: "1:1077589328588:web:8187f3651acd179c697869"
};

// Initialize Firebase
initializeApp(firebaseConfig);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
