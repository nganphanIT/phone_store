// Initialize the user session
function initUserSession() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user) {
        firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then((userCredential) => {
            updateUserUI(userCredential.user);
        })
        .catch((error) => {
            console.error("Error auto-signing in:", error);
        });
    }
}


//Update user UI
// function updateUserUI(user) {
//     firebase.database().ref('users/' + user.uid).once('value')
//     .then(function(snapshot) {
//         var userData = snapshot.val();
//         document.querySelector('.user-name').textContent = "Welcome, " + userData.username; 
//         document.querySelector('.login-icon').style.display = 'none';
//         document.querySelector('.register-icon').style.display = 'none';
//         document.querySelector('.logout-icon').style.display = 'inline-block'; 
//     })
//     .catch(function(error) {
//         console.error('Error getting user data:', error);
//     });
//     document.querySelector('.login-icon').style.display = 'none';
//     document.querySelector('.register-icon').style.display = 'none';
// }
// Show login form as a modal
document.querySelector('.login-icon a').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('loginModal').style.display = 'block';
});


// Close the login modal when the user clicks anywhere outside of the modal
window.addEventListener('click', function(event) {
    var modal = document.getElementById('loginModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});

// Login user
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var email = document.getElementById('loginEmail').value;
    var password = document.getElementById('loginPassword').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        var user = userCredential.user;

        updateUserUI(user);

        // Save user session
        sessionStorage.setItem('user', JSON.stringify({ email, password }));

        // Additional actions after successful login
        alert('Wellcome to you!');
        document.getElementById('loginModal').style.display = 'none';
    })
    .catch((error) => {
        var errorMessage = error.message;
        alert('Error: ' + errorMessage);
    });
});
//Update user UI
function updateUserUI(user) {
    firebase.database().ref('users/' + user.uid).once('value')
    .then(function(snapshot) {
        var userData = snapshot.val();
        document.querySelector('.user-name').textContent = "Welcome, " + userData.username; 
        document.querySelector('.login-icon').style.display = 'none';
        document.querySelector('.register-icon').style.display = 'none';
        document.querySelector('.logout-icon').style.display = 'inline-block'; 
    })
    .catch(function(error) {
        console.error('Error getting user data:', error);
    });
    document.querySelector('.login-icon').style.display = 'none';
    document.querySelector('.register-icon').style.display = 'none';
}

document.getElementById('logoutButton').addEventListener('click', function(event) {
    event.preventDefault();
    firebase.auth().signOut().then(function() {
     
        sessionStorage.removeItem('user');
        document.querySelector('.user-name').textContent = "";
        document.querySelector('.login-icon').style.display = 'inline-block';
        document.querySelector('.register-icon').style.display = 'inline-block';
        location.reload();
    }).catch(function(error) {
        console.error("Error signing out:", error);
    });
});