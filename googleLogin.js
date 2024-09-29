import { GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js"
import { auth } from './firebase.js'
import { showMessage } from './showMessage.js'

const googleButton = document.querySelector('#googleLogin')

googleButton.addEventListener('click', async () => {
    const provider = new GoogleAuthProvider()
    try {
        if (auth.currentUser) {
            console.log(auth.currentUser.email); 
        }
        
        const credentials = await signInWithPopup(auth, provider)
        console.log(credentials.user.email)
        const modal = bootstrap.Modal.getInstance(document.querySelector('#signinModal'));
        modal.hide()
    
        showMessage('Welcome  ' + credentials.user.displayName, 'success')
    } catch (error) {
        console.log(error)
    }
})
