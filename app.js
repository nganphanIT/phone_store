const firebaseConfig = {
    apiKey: "AIzaSyCtQGPhdxH-DTj9LatTQDoK-YX6QO3AF9E",
    authDomain: "fir-9982c.firebaseapp.com",
    databaseURL: "https://fir-9982c-default-rtdb.firebaseio.com",
    projectId: "fir-9982c",
    storageBucket: "fir-9982c.appspot.com",
    messagingSenderId: "445270766411",
    appId: "1:445270766411:web:0a9f89bdac6767601c2ece",
    measurementId: "G-ZBN8GEMMV9"
  }; 
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get elements
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const signupForm = document.getElementById('signup-form');

// Signup form submit event
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;

    // Create user with email and password
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log('User signed up:', user);
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Signup error:', errorMessage);
    });
});
