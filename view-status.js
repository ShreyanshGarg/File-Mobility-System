/* Set the width of the sidebar to 250px (show it) */
function openNav() {
    document.getElementById("mySidepanel").style.width = "250px";
    const collection = document.getElementsByClassName("subcards");
    for (let i = 0; i < collection.length; i++) {
    collection[i].style.width = "71%";
    collection[i].style.marginLeft = "20%";
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
  }
