// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";
import { getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjgzhBgKsMb23i3y2ezFxUo7fiofnzd4M",
  authDomain: "quadweb-f36ee.firebaseapp.com",
  databaseURL: "https://quadweb-f36ee-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "quadweb-f36ee",
  storageBucket: "quadweb-f36ee.appspot.com",
  messagingSenderId: "176575205057",
  appId: "1:176575205057:web:f5599867fd2c1a84560e40",
  measurementId: "G-ZE56S36YPF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);

// Google provider instance
const provider = new GoogleAuthProvider();

// HTML elements
const loginMessage = document.getElementById('loginMessage');
const login_submit = document.getElementById('loginButton');
const loginForm = document.getElementById('loginForm');
const userInfo = document.getElementById('userInfo');
let user;  // Define the user variable in a higher scope

// Handle Google Sign-In
login_submit.addEventListener('click', function(event) {
  event.preventDefault();

  signInWithPopup(auth, provider)
    .then((result) => {
      // Signed in
      user = result.user;

      loginMessage.innerHTML = "Login successful!";
      setTimeout(function(){
        loginForm.style.display = "none";
        userInfo.style.display = "flex";
        loginMessage.style.display = "none";
      }, 1500);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      loginMessage.style.display = "block";
      loginMessage.innerHTML= `
          <p>আপনি ভুল পাসওয়ার্ড দিয়েছেন !! </p>
          <p id="advertise">মোবাইলে আমাদের ডিজিটাল ভূমি জরিপের প্রিমিয়াম 2 টি অ্যাপ স্বল্প মূল্যে দেওয়া হচ্ছে | ডিজিটাল জরিপের অ্যাপ নিতে চাইলে এই নম্বরে যোগাযোগ করেন <a href="tel:+8801401718917">01401718917</a> <br> 
                              অথবা ফেসবুক <a href="https://m.me/bhumi.porimap">m.me/bhumi.porimap</a></p>
      `;
    });
});

// Login status
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginMessage.style.display = "block";
    loginMessage.innerHTML = `
        <p>আপনি already লগইন আছেন!! <br> যদি কোনো সমস্যা হয় তাহলে যোগাযোগ : 01401718917</p>
    `;
    
    setTimeout(function(){
        window.location.href = "/index.html";
      }, 1500);
      
      
  } else {
    // User is signed out
  }
});


// Function to get email from UID
function getEmailFromUid(uid) {
  return auth.getUser(uid)
    .then((userRecord) => {
      return userRecord.email;
    })
    .catch((error) => {
      console.error('Error fetching user data:', error);
      return null;
    });
}

// Handle form submission
const submitName = document.getElementById('submitName');
submitName.addEventListener('click', async function(){
  var name = document.getElementById('name').value;
  var phone = document.getElementById('phone').value;
  var uid = user.uid; // Assuming user is already authenticated

  if (name && phone && uid) {
    // Get email associated with UID
    const email = await getEmailFromUid(uid);

    if (email) {
      // Get current date and time
      const currentDate = new Date();
      const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')} ${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(2, '0')}:${String(currentDate.getSeconds()).padStart(2, '0')}`;

      // Save data to the database
      set(ref(database, "user/" + uid), {
        name: name,
        phone: phone,
        email: email,
        date: formattedDate
      })
      .then(() => {
        console.log('Data submitted');
        window.location.href = "/index.html";
      })
      .catch((error) => {
        console.error('Error writing to database', error);
        loginMessage.style.display = "block";
        loginMessage.innerHTML = `<p>সব গুলো ঘর পূরণ করুন!!</p>`;
      });
    } else {
      console.error('Email not found for UID:', uid);
    }
  } else {
    loginMessage.style.display = "block";
    loginMessage.innerHTML = `<p>সব গুলো ঘর পূরণ করুন!!</p>`;
  }
});
