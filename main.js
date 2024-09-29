import './signupForm.js'
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js"
import { auth } from './firebase.js'
import './signupForm.js'
import './logout.js'
import './loginForm.js'
import './googleLogin.js'
import { loginCheck} from   './loginCheck.js'

onAuthStateChanged(auth,async(user)=>{
    loginCheck(user)
})