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