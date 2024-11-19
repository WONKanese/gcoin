import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js';
import { getDatabase, ref, onValue, get, update, set, push, remove } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js';
import { censorText } from './badword-handler.js';
        
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
const database = getDatabase(app);
const leaderboard = document.getElementById("leaderboard");

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function updateLeaderboard() {
    console.log("Updating Leaderboard...");
    const usersRef = ref(database, 'users');
    let users;
    get(usersRef).then((snapshot) => {
        console.log(snapshot.exists());
        if (snapshot.exists()) {
            users = snapshot.val();
        }
        else {
            users = null;
        }

        if (users == null) {
            leaderboard.innerHTML = "Error occurred";
            return;
        }
        users = Object.values(users);
        let i = 0;
        leaderboard.innerHTML = "";
        users.sort((a, b) => b.clicks - a.clicks);
        console.log(users);
        for (let user of users) {
            i++;
            if (i > 10) {
                break;
            }
            const newItem = document.createElement("li");
            
            const censoredText = censorText(user.username);
            newItem.textContent = `#${i} ${censoredText} - ${user.clicks}`;
            leaderboard.appendChild(newItem);
        }
        let place = users.findIndex(user => user.username == getCookie("username"));
        document.getElementById("your-place").textContent = `Your #${place+1}`;
    })

}
updateLeaderboard();

setInterval(() => {
    updateLeaderboard();
}, 5000);
