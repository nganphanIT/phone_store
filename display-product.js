const firebaseConfig = {
    apiKey: "AIzaSyC3Cye3RBjmbJV0IBpmB3Mm5vIMywyXOuk",
    authDomain: "connect-89767.firebaseapp.com",
    projectId: "connect-89767",
    storageBucket: "connect-89767.appspot.com",
    messagingSenderId: "776590156653",
    appId: "1:776590156653:web:b92af865af1f7fb6f0f064"
};

firebase.initializeApp(firebaseConfig);

// Display product
function displayProductList() {
    var productList = document.getElementById("productList");
    firebase.database().ref('products').once('value').then(function(snapshot) {
        productList.innerHTML = ''; 
        snapshot.forEach(function(childSnapshot) {
            var product = childSnapshot.val();
            var row = document.createElement("div");
            row.classList.add("product-row");

            // Product UID
            var uidElement = document.createElement("div");
            uidElement.textContent = "UID: " + product.uid;
            row.appendChild(uidElement);

            // Product Name
            var nameElement = document.createElement("div");
            nameElement.textContent = "Name: " + product.name;
            row.appendChild(nameElement);

            // Product Description
            var descriptionElement = document.createElement("div");
            descriptionElement.textContent = "Description: " + product.description;
            row.appendChild(descriptionElement);

            // Product Image
            var imageElement = document.createElement("img");
            imageElement.src = product.imageURL;
            imageElement.alt = product.name;
            imageElement.width = 100; 
            row.appendChild(imageElement);

            // Product Price
            var priceElement = document.createElement("div");
            priceElement.textContent = "Price: $" + product.price;
            row.appendChild(priceElement);

            // Add to Cart Button
            var addToCartButton = document.createElement("button");
            addToCartButton.innerHTML = 'Add to cart';
            addToCartButton.classList.add("cart-button");
            addToCartButton.addEventListener("click", function() {
                addToCart(product); 
            });

            row.appendChild(addToCartButton);           
            productList.appendChild(row);

            // Like and Dislike button
            var likeButton = document.createElement("button");
            likeButton.innerHTML = '<i class="far fa-thumbs-up"></i> Like';
            likeButton.classList.add("btn", "btn-sm", "btn-outline-primary", "like-button");
            likeButton.addEventListener("click", function() {
                likeProduct(product.uid);
            });
            row.appendChild(likeButton);

            var dislikeButton = document.createElement("button");
            dislikeButton.innerHTML = '<i class="far fa-thumbs-down"></i> Dislike';
            dislikeButton.classList.add("btn", "btn-sm", "btn-outline-danger", "dislike-button");
            dislikeButton.addEventListener("click", function() {
                dislikeProduct(product.uid); 
            });
            row.appendChild(dislikeButton);

            var likeCountElement = document.createElement("div");
            likeCountElement.classList.add("like-count");
            likeCountElement.textContent = "Likes: ";
            row.appendChild(likeCountElement);

            var dislikeCountElement = document.createElement("div");
            dislikeCountElement.classList.add("dislike-count");
            dislikeCountElement.textContent = "Dislikes: ";
            row.appendChild(dislikeCountElement);

            firebase.database().ref('likes/' + product.uid).once('value').then(function(snapshot) {
                var likesCount = snapshot.numChildren();
                likeCountElement.textContent = "Likes: " + likesCount;
            }).catch(function(error) {
                console.error("Error fetching like count:", error);
            });

            firebase.database().ref('dislikes/' + product.uid).once('value').then(function(snapshot) {
                var dislikesCount = snapshot.numChildren();
                dislikeCountElement.textContent = "Dislikes: " + dislikesCount;
            }).catch(function(error) {
                console.error("Error fetching dislike count:", error);
            });
            productList.appendChild(row);
        });
    });
}

// Button like
function likeProduct(productID, likeButton) {
    var user = firebase.auth().currentUser;
    if (user) {
        var userID = user.uid;
        var productRef = firebase.database().ref('likes/' + productID);
        productRef.child(userID).set(true)
        .then(() => {
            console.log('Product liked successfully!');
            updateLikeButton(likeButton, true);
        })
        .catch((error) => {
            console.error('Error liking product:', error);
        });
    } else {
        alert("Please sign in to like this product.");
    }
}
function updateLikeButton(likeButton, isLiked) {
    if (isLiked) {
        likeButton.innerHTML = '<i class="fas fa-thumbs-up"></i> Liked';
        likeButton.disabled = true;
    } else {
        likeButton.innerHTML = '<i class="far fa-thumbs-up"></i> Like';
        likeButton.disabled = false;
    }
}
// Button dislike
function dislikeProduct(productID) {
    var user = firebase.auth().currentUser;
    if (user) {
        var userID = user.uid;
        var productRef = firebase.database().ref('dislikes/' + productID);
        productRef.child(userID).set(true)
        .then(() => {
            console.log('Product disliked successfully!');
        })
        .catch((error) => {
            console.error('Error disliking product:', error);
        });
    } else {
        alert("Please sign in to dislike this product.");
    }
}
// Handle add to cart
function addToCart(product) {
    var user = firebase.auth().currentUser;
    if (user) {
        var userID = user.uid;
        var productID = product.uid; 
        var quantity = 1; 
        var price = product.price; 

        if (productID) { 
            firebase.database().ref('carts/' + userID).orderByChild('productId').equalTo(productID).once('value')
            .then(function(snapshot) {
                var existingCartItem = snapshot.val();
                if (existingCartItem) {
                    // If the product already exists in the cart, update the quantity
                    var existingCartItemKey = Object.keys(existingCartItem)[0];
                    var existingQuantity = existingCartItem[existingCartItemKey].quantity;
                    firebase.database().ref('carts/' + userID + '/' + existingCartItemKey).update({
                        quantity: existingQuantity + 1
                    })
                    .then(() => {
                        alert("Added " + product.name + " to cart.");
                        updateCartCount();
                    })
                    .catch((error) => {
                        console.error("Error updating cart:", error);
                    });
                } else {
                    // If the product does not exist in the cart, add it
                    firebase.database().ref('carts/' + userID).push({
                        productId: productID,
                        productName: product.name, 
                        quantity: quantity,
                        price: price
                    })
                    .then(() => {
                        alert("Added " + product.name + " to cart.");
                        updateCartCount();
                    })
                    .catch((error) => {
                        console.error("Error adding to cart:", error);
                    });
                }
            })
            .catch(function(error) {
                console.error("Error checking cart for existing product:", error);
            });
        } else {
            console.error("Error: Product ID is undefined");
        }
    } else {
        alert("Please sign in to add items to cart.");
    }
}


// Update cart count
function updateCartCount(userID) {
    var cartCountElement = document.querySelector(".cart-count");
     firebase.database().ref('carts/' + userID).once('value').then(function(snapshot) {
        var itemCount = snapshot.numChildren(); 
        cartCountElement.textContent = itemCount;
    }).catch(function(error) {
        console.error("Error fetching cart items count:", error);
    });
}

// Call updateCartCount() function when user is logged in or when adding items to cart
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        var userID = user.uid;
        firebase.database().ref('carts/' + userID).once('value').then(function(snapshot) {
            if (snapshot.exists()) {
                updateCartCount(userID); 
            }
        }).catch(function(error) {
            console.error("Error fetching cart items count:", error);
        });
    } else {
        document.querySelector(".cart-count").textContent = 0;
    }
});


// Function to display cart items when the cart icon is clicked
function displayCartItems(userID) {
    var cartList = document.getElementById("cartList");

    firebase.database().ref('carts/' + userID).once('value').then(function(snapshot) {
        cartList.innerHTML = ''; 
        snapshot.forEach(function(childSnapshot) {
            var cartItem = childSnapshot.val();
            var cartItemElement = document.createElement("li");

            // Query product name based on product Name
            firebase.database().ref('products').orderByChild('name').equalTo(cartItem.productName).once('value').then(function(productSnapshot) {
                productSnapshot.forEach(function(productChildSnapshot) {
                    var productName = productChildSnapshot.val().name;
                    // Format cart item and append it to cartList
                    cartItemElement.textContent = productName + " - Quantity: " + cartItem.quantity + " - Price: $" + cartItem.price;
                    cartList.appendChild(cartItemElement);
                });
            }).catch(function(error) {
                console.error("Error fetching product name:", error);
            });
        });
    });
}

// Add event listener to the cart icon
document.querySelector('.cart-icon a').addEventListener('click', function(event) {
    event.preventDefault();
    var user = firebase.auth().currentUser;
    if (user) {
        var userID = user.uid;
        // Display cart items when the cart icon is clicked
        displayCartItems(userID);
        // Show the cart details modal
        document.getElementById('cartDetails').style.display = 'block';
    } else {
        // Handle case when user is not logged in
        alert("Please sign in to view your cart.");
    }
});

// Close the cart details modal when the user clicks on <span> (x)
document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('cartDetails').style.display = 'none';
});

// Close the cart details modal when the user clicks anywhere outside of the modal
window.addEventListener('click', function(event) {
    var modal = document.getElementById('cartDetails');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});



// Show registration form as a modal
document.getElementById('registerButton').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('registerModal').style.display = 'block';
});

// Close the modal when the user clicks on <span> (x)
document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('registerModal').style.display = 'none';
});

// Close the modal when the user clicks anywhere outside of the modal
window.addEventListener('click', function(event) {
    var modal = document.getElementById('registerModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});

// Register a new user
document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var username = document.getElementById('username').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
        var user = userCredential.user;
        firebase.database().ref('users/' + user.uid).set({
            username: username,
            email: email
        }).then(() => {
            alert('User registered successfully!');
            document.getElementById('registrationForm').reset();
            document.getElementById('registerModal').style.display = 'none';
        }).catch((error) => {
            console.error('Error writing user data:', error);
        });
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert('Error: ' + errorMessage);
    });
});



// Display product 
displayProductList();
