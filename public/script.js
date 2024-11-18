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

const database = getDatabase(app);

// Reference to the counter in Realtime Database
const counterRef = ref(database, 'counter');

let myCount = getCookie("clicks");
if (myCount == "") {
  setCookie("clicks", 0);
}

document.getElementById('yourclickCount').textContent = getCookie("clicks");
// Listen for the counter value in the database and update UI
onValue(counterRef, (snapshot) => {
    const count = snapshot.val();
    // If count is a number or null, display it, otherwise default to 0
    document.getElementById('clickCount').textContent = count.counter;
});

// Handle button click to increment the counter
document.getElementById('clickButton').addEventListener('click', () => {
    const countRef = ref(database, 'counter');
    get(countRef).then((snapshot) => {
        const currentCount = snapshot.val().counter; // Get the current counter value
        setCookie("clicks", (+getCookie("clicks"))+1);
        if (getCookie("username") != "") {
          updateUsername(getCookie("username"));
        }
        update(counterRef, {counter: currentCount + 1}); // Update the counter in the database
        document.getElementById('yourclickCount').textContent = getCookie("clicks");
    });
});

function setCookie(name, value) {
    document.cookie = `${name}=${value}; expires=Thu, 31 Dec 9999 23:59:59 UTC; path=/`;
}
document.getElementById('name').addEventListener('input', function(event) {
    const value = event.target.value;
    // Allow letters, numbers, and symbols like underscores and hyphens
    const filteredValue = value.replace(/[^a-zA-Z0-9_-]/g, '');
    event.target.value = filteredValue;
});
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

function isThereUser(user) {
    const usersRef = ref(database, 'users');
    return get(usersRef).then((snapshot) => {
        if (snapshot.exists()) {
            const users = snapshot.val();

            for (let id in users) {
                if (users[id].username === user) {
                  console.log(user + " is a unique name");
                    return id; // Username found
                }
            }
        }
        return null;
    })
}
function getUserIdFromUsername(username) {
    const usersRef = ref(database, 'users'); // Reference to 'users' node
    return get(usersRef).then((snapshot) => {
        if (snapshot.exists()) {
            const users = snapshot.val(); // Get all user data
            for (let id in users) {

                if (users[id].username == username) {
                  console.log("successfully converted username to id: " + id);
                  return id; // Return the ID if the username matches
                }
            }
        }
        return null; // Username not found
    });
}

function addUsername(user) {
    const usersRef = ref(database, 'users');
    const newUserRef = push(usersRef);  // Create a new unique ID for the user
    set(newUserRef, { username: user, clicks: getCookie("clicks") });  // Set the username at that reference
}
function removeUserById(userId) {
    const userRef = ref(database, `users/${userId}`); // Reference to the user by ID
    return remove(userRef).then(() => {
        console.log(`User with ID "${userId}" has been removed.`);
    }).catch((error) => {
        console.error(`Failed to remove user: ${error.message}`);
    });
}
function updateUsername(username) {
  getUserIdFromUsername(username).then((key) => {
    if (key) {
      const userRef = ref(database, `users/${key}`);
      set(userRef, { username: username, clicks: getCookie("clicks") });
    } else {
      console.log(`Username "${username}" not found.`);
    }
  });
}
// Function to remove a user by username
function removeUserByUsername(username) {
    getUserIdFromUsername(username).then((userId) => {
        if (userId) {
            return removeUserById(userId);
        } else {
            console.log(`Username "${username}" not found.`);
        }
    }).catch((error) => {
        console.error(`Error finding username: ${error.message}`);
    });
}
const form = document.getElementById('usernameForm');
const nameInput = document.getElementById('name');

let pastUser = getCookie("username");
nameInput.value = pastUser;

form.addEventListener('submit', function(event) {
  event.preventDefault();
  const nameValue = nameInput.value;
  let pastUser = getCookie("username");
  if (nameValue == "" || pastUser == nameValue) {
    return;
  }
  isThereUser(nameValue).then((exists) => {
    if (getCookie("username") == "" && !exists) {
      addUsername(nameValue);
      setCookie("username", nameValue);
      return;
    }
    console.log(pastUser);
    if (isThereUser(pastUser)) {
      if (exists) {
        alert('Username already exists. Please choose another one.');
        return;
      }
       else {
        removeUserByUsername(pastUser);
        addUsername(nameValue);
        setCookie("username", nameValue);
      }
      setCookie("username", nameValue); // Set the cookie if the username is valid
      console.log("Username is set and cookie saved.");
    }
  });
});

