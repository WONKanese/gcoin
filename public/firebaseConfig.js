import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js';
import { getDatabase, ref, onValue, get, update, set, push, remove } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js';

        
const firebaseConfig = {
    apiKey: "AIzaSyDtaJjUpoMFNjuGmkO_e0gaRx3-IwheiwU",
  authDomain: "g-coin-x.firebaseapp.com",
  projectId: "g-coin-x",
  storageBucket: "g-coin-x.firebasestorage.app",
  messagingSenderId: "576885215843",
  appId: "1:576885215843:web:f16be7a563c3f0d57f1e56",
  measurementId: "G-QYJHGE7ZF2"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;