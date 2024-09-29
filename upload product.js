    const firebaseConfig = {
        apiKey: "AIzaSyC3Cye3RBjmbJV0IBpmB3Mm5vIMywyXOuk",
        authDomain: "connect-89767.firebaseapp.com",
        projectId: "connect-89767",
        storageBucket: "connect-89767.appspot.com",
        messagingSenderId: "776590156653",
        appId: "1:776590156653:web:b92af865af1f7fb6f0f064"
        };

    firebase.initializeApp(firebaseConfig);

    document.getElementById("productForm").addEventListener("submit", function(event) {
        event.preventDefault(); 
        var productName = document.getElementById("productName").value;
        var productDescription = document.getElementById("productDescription").value;
        var productPrice = document.getElementById("productPrice").value;
        var productImageFile = document.getElementById("productImage").files[0];
        var productDocumentFile = document.getElementById("productDocument").files[0];
        
        // Upload image 
        var imageStorageRef = firebase.storage().ref('product_images/' + productImageFile.name);
        imageStorageRef.put(productImageFile).then(function(imageSnapshot) {
           
            // Get URL image
            imageSnapshot.ref.getDownloadURL().then(function(imageDownloadURL) {
                // Upload document
                var documentStorageRef = firebase.storage().ref('product_documents/' + productDocumentFile.name);
                documentStorageRef.put(productDocumentFile).then(function(documentSnapshot) {
                 
                    // Get document
                    documentSnapshot.ref.getDownloadURL().then(function(documentDownloadURL) {
                        // Save product information to the database
                        saveProduct(productName, productDescription, productPrice, imageDownloadURL, documentDownloadURL);
                        alert('Product information saved to the database.');
                    });
                }).catch(function(error) {
                    alert('Error uploading document: ' + error.message);
                });
            });
        }).catch(function(error) {
            alert('Error uploading image: ' + error.message);
        });
    });
    
    // Save product 
    function saveProduct(name, description, price, imageURL, documentURL) {
        var newProductRef = firebase.database().ref('products').push();
        var uid = newProductRef.key;
        var uid = newProductRef.key;
        firebase.database().ref('products').push({
            uid: uid,
            name: name,
            description: description,
            price: price,
            imageURL: imageURL,
            documentURL: documentURL
        });
    }
    

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
                  


                    alert("Added " + product.name + " to cart.");
                });
                row.appendChild(addToCartButton);

            // Delete Button
                var deleteButton = document.createElement("button");
                deleteButton.innerHTML = 'Xóa';
                deleteButton.classList.add("delete-button");
                deleteButton.addEventListener("click", function() {
                  
                    var productKey = childSnapshot.key;
      
                    firebase.database().ref('products/' + productKey).remove()
                    .then(function() {
                        // If successful
                        productList.removeChild(row);
                        alert("Deleted " + product.name + " from the database.");
                    })
                    .catch(function(error) {
                        // If an error 
                        console.error("Error removing product: ", error);
                        alert("An error occurred while deleting " + product.name);
                    });
                });
                row.appendChild(deleteButton);

            // Edit Button
            var editButton = document.createElement("button");
            editButton.innerHTML = 'Sửa';
            editButton.classList.add("edit-button");
            editButton.addEventListener("click", function() {
                var productKey = childSnapshot.key;

                var newName = prompt("Enter the new name for the product", product.name);
                var newDescription = prompt("Enter the new description for the product", product.description);
                var newPrice = prompt("Enter the new price for the product", product.price);

                // Check if the user provided new values and they are not empty
                if (newName !== null && newDescription !== null && newPrice !== null &&
                    newName.trim() !== "" && newDescription.trim() !== "" && newPrice.trim() !== "") {

                    // Create a file input field for selecting a new image
                    var imageFileInput = document.createElement("input");
                    imageFileInput.type = "file";
                    imageFileInput.accept = "image/*";
                    imageFileInput.style.display = "none";

                    // Trigger click event on the file input field
                    imageFileInput.click();

                    imageFileInput.addEventListener("change", function(event) {
                        var file = event.target.files[0];
                        if (file) {
                            var imageStorageRef = firebase.storage().ref('product_images/' + productKey + '_' + Date.now());
                            imageStorageRef.put(file).then(function(imageSnapshot) {
                                imageSnapshot.ref.getDownloadURL().then(function(newImageDownloadURL) {
                                    firebase.database().ref('products/' + productKey).update({
                                        name: newName,
                                        description: newDescription,
                                        price: newPrice,
                                        imageURL: newImageDownloadURL
                                    })
                                    .then(function() {
                                        nameElement.textContent = "Name: " + newName;
                                        descriptionElement.textContent = "Description: " + newDescription;
                                        priceElement.textContent = "Price: $" + newPrice;
                                        imageElement.src = newImageDownloadURL;
                                        alert("Product updated successfully.");
                                    })
                                    .catch(function(error) {
                                        console.error("Error updating product: ", error);
                                        alert("An error occurred while updating product.");
                                    });
                                });
                            }).catch(function(error) {
                                console.error("Error uploading new image: ", error);
                                alert("An error occurred while uploading new image.");
                            });
                        }
                    });

                    document.body.appendChild(imageFileInput);
                }
            });
            row.appendChild(editButton);
                    productList.appendChild(row);
                });
            });
        }

    // Get the filename from a URL
    function getFileName(url) {
        var index = url.lastIndexOf("/") + 1;
        return url.substr(index);
    }

    // Display product 
    displayProductList();
