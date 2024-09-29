import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { auth } from './firebase.js';
import { showMessage } from './showMessage.js';

const signupForm = document.querySelector('#signup-form');

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = signupForm['email'].value;
    const password = signupForm['password'].value;

    
    if (password.length < 6) {
        alert("Password should be at least 6 characters long.");
        return;
    }

    try {
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
        console.log(userCredentials);
        const signupModal = document.querySelector('#signupModal');
        const modal = bootstrap.Modal.getInstance(signupModal);
        modal.hide()

    } catch (error) {
        console.log(error.message);
        console.log(error.code);
        if (error.code === 'auth/email-already-in-use') {
            showMessage('Email already in use', 'error'); 
        } else if (error.code === 'auth/invalid-email') {
            showMessage('Invalid email', 'error'); 
        } else if (error.code === 'auth/weak-password') {
            showMessage('Password is too weak', 'error'); 
        } else if (error.code) {
            showMessage('Something went wrong', 'error'); 
        }
    }
});
