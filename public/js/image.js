// img = document.getElementById("img1");
// Function to set image dimensions
// function enlargeImg() {
//     img.style.width = "60%";
//     img.style.height = "100%";
//     img.style.transition = "width 0.5s ease";
// }
// Function to reset image dimensions
// function resetImg() {
//     img.style.width = "40%";
//     img.style.height = "auto";
//     img.style.transition = "width 0.5s ease";
// }
// *--*-*-*-

let imageBox1 = document.getElementById("imageBox1");

// Get the modal image tag
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
var modalImage = document.getElementById("modal-image");
// Get the <span> element that closes the modal
// When the user clicks the big picture, set the image and open the modal
// imageBox1.onclick = function (e) {
//   var src = e.srcElement.src;
//   modal.style.display = "block";
//   modalImage.src = src;
// };
function resetImg(event) {
  modal.style.display = "block";
  var src = event.target.src;
  modalImage.src = src;
}
// When the user clicks on <span> (x), close the modal
span.onclick = function (e) {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
// window.onclick = function (event) {
//   if (event.target == modal) {
//   }
// };
// window.onclick =(event)=>{
//   var src =event.target.src;
//   modal.style.display = "block";
//   modalImage.src = src;
// }
