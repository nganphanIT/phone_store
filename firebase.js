import { initializeApp  } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js"
import { getAuth } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3Cye3RBjmbJV0IBpmB3Mm5vIMywyXOuk",
  authDomain: "connect-89767.firebaseapp.com",
  projectId: "connect-89767",
  storageBucket: "connect-89767.appspot.com",
  messagingSenderId: "776590156653",
  appId: "1:776590156653:web:b92af865af1f7fb6f0f064"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
