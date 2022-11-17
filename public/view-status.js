/* Set the width of the sidebar to 250px (show it) */
function openNav() {
    document.getElementById("mySidepanel").style.width = "250px";
    const collection = document.getElementsByClassName("subcards");
    for (let i = 0; i < collection.length; i++) {
    collection[i].style.width = "76%";
    collection[i].style.marginLeft = "20%";
    }

    const arr = document.getElementsByClassName("application-form");
    for (let i = 0; i < collection.length; i++) {
    arr[i].style.width = "76%";
    arr[i].style.marginLeft = "20%";
    }

  }
  
  /* Set the width of the sidebar to 0 (hide it) */
  function closeNav() {
    document.getElementById("mySidepanel").style.width = "0";

    const collection = document.getElementsByClassName("subcards");
    for (let i = 0; i < collection.length; i++) {
    collection[i].style.width = "92%";
    collection[i].style.marginLeft = "5%";
    }
  
    const arr = document.getElementsByClassName("application-form");
    for (let i = 0; i < collection.length; i++) {
    arr[i].style.width = "83%";
    arr[i].style.marginLeft = "8%";
    }

    
  }

  function openForm(){
    const collection = document.getElementsByClassName("application-form");

    for (let i = 0; i < collection.length; i++) {
      collection[i].style.display = "block";
      }
      // const arr = document.getElementsByClassName("card-wrapper");
      // for (let i = 0; i < collection.length; i++) {
      // arr[i].style.display = "block";
      // }
      document.getElementsByClassName("card-wrapper")[0].style.display="none"

  }
  function openStatus(){

    // document.getElementsByClassName("card-wrapper").style.display= "block";
    // document.getElementsByClassName("application-form").style.display= "none";
    const collection = document.getElementsByClassName("application-form");
    for (let i = 0; i < collection.length; i++) {
    collection[i].style.display = "none";
    }
    // const arr = document.getElementsByClassName("card-wrapper");
    // for (let i = 0; i < collection.length; i++) {
    // arr[i].style.display = "block";
    // }
    document.getElementsByClassName("card-wrapper")[0].style.display="block"
  }

function accepted() {
  document.querySelectorAll(".label").classList.add('green-active-text');
  document.querySelectorAll(".label").classList.remove('label '); 
}

const stat = document.getElementById("multi-step-form-container").getAttribute("value");
const statArray = stat.split(",");
console.log(statArray);

if(statArray[statArray.length-1] === 'accepted'){
  const boxes = document.querySelectorAll(".label");
  const circle = document.querySelectorAll(".form-stepper-circle");
  document.querySelector(".dis3").style.display = "block";
  document.querySelector(".dis4").style.display = "block";
  for(const box of boxes){
    box.classList.add('green-active-text');
    box.classList.remove('label');
  }
  for(const element of circle){
    element.style.backgroundColor = "green";
  }
} else if(statArray[statArray.length-1] === 'rejected') {
  if(statArray[statArray.length-2] === 'officer1'){
    //rejected by officer 1
    const twos = document.querySelectorAll(".two");
    document.querySelector(".two-text").innerHTML="Rejected by ofiicer 1";
    document.querySelector(".circle-two").style.backgroundColor="red";
    for(const two of twos){
      two.classList.add('red-active-text');
      two.classList.remove('label');
    }
  } else {
    //rejected by officer 2
    const twos = document.querySelectorAll(".two");
    const threes = document.querySelectorAll(".three");
    document.querySelector(".three-text").innerHTML="Rejected by ofiicer 2"
    document.querySelector(".circle-two").style.backgroundColor="green";
    document.querySelector(".circle-three").style.backgroundColor="red";
    document.querySelector(".dis3").style.display = "block";
    for(const two of twos){
      two.classList.add('green-active-text');
      two.classList.remove('label');
    }
    for(const three of threes){
      three.classList.add('red-active-text');
      three.classList.remove('label');
    }
  }
} else if(statArray[statArray.length-1] === 'officer1') {
  //second color to blue
  document.querySelector(".circle-two").style.backgroundColor="#4361ee";
  const twos = document.querySelectorAll(".two");
  document.querySelector(".two-text").innerHTML="Request pending at Officer 1";
  for(const two of twos) {
    two.style.color="#4361ee";
  }
} else {
  // accepted by officer 1
  const twos = document.querySelectorAll(".two");
  document.querySelector(".circle-two").style.backgroundColor="green";
  for(const two of twos){
    two.classList.add('green-active-text');
    two.classList.remove('label');
  }

  //pending at officer 2
  document.querySelector(".circle-three").style.backgroundColor="#4361ee";
  const threes = document.querySelectorAll(".three");
  document.querySelector(".dis3").style.display = "block";
  document.querySelector(".three-text").innerHTML="Request pending at Officer 2";
  console.log(threes);
  for(const three of threes) {
    three.style.color="#4361ee";
  }
}
