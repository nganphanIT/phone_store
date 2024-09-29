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
  firebase.initializeApp(firebaseConfig);

document.addEventListener('DOMContentLoaded', function() {
  const registerForm = document.getElementById('register-form');

  registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = registerForm['email'].value;
      const password = registerForm['password'].value;

      firebase.auth().createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
              // Registration successful
              console.log('User registered:', userCredential.user);
              alert('Đăng ký thành công!');
          })
          .catch((error) => {
              // Handle errors
              const errorMessage = error.message;
              console.error('Registration failed:', errorMessage);
              alert('Đăng ký thất bại: ' + errorMessage);
          });
  });
});
