const firebaseConfig = {
  apiKey: "AIzaSyC3Cye3RBjmbJV0IBpmB3Mm5vIMywyXOuk",
  authDomain: "connect-89767.firebaseapp.com",
  projectId: "connect-89767",
  storageBucket: "connect-89767.appspot.com",
  messagingSenderId: "776590156653",
  appId: "1:776590156653:web:b92af865af1f7fb6f0f064"
};
firebase.initializeApp(firebaseConfig);

var fileText = document.querySelector(".fileText");
var uploadPercentage = document.querySelector(".uploadPercentage");
var progress = document.querySelector(".progress");
var fileItem;
var fileName;
var img = document.querySelector(".img")

function getFile(e){
  fileItem = e.target.files[0]; 
  fileName = fileItem.name;
  fileText.innerHTML = fileName;
}

function uploadImage(){
  if(!fileItem) {
    console.error("No file selected.");
    return;
  }
  
  let storageRef = firebase.storage().ref("images/" + fileName);
  let uploadTask = storageRef.put(fileItem);

  uploadTask.on("state_changed",(snapshot)=>{
    let progressPercent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    uploadPercentage.innerHTML = Math.round(progressPercent) + "%";
    progress.style.width = progressPercent + "%";
  },(error)=>{
    console.error("Error is", error);
  },()=>{
    uploadTask.snapshot.ref.getDownloadURL().then((url)=>{
      console.log("URL", url);
      img.src = url;
      img.style.display = "block";
    });
  });
}
