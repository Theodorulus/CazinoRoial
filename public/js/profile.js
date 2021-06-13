function closeModal(){
    
  var modal = document.getElementById("boxModal");
  modal.style.display = "none";
}

function openBox(btn){
    var modal = document.getElementById("boxModal");
    modal.style.display = "block";
    choice = 1
    if(Math.random() > 0.5)
        choice+=1
        
    console.log(choice)
    // alegem hat
    if (choice == 1){
        nr = parseInt((Math.random()+0.1)*10)
        itemName = "hat"+String(nr)+".png"
        document.getElementById("modalText").innerHTML = "Congratulations, you won a hat!"
        document.getElementById("modalImg").setAttribute("src", "../../img/items/hats/"+itemName)
        document.getElementById("modalForm").setAttribute("action", "buyItem/"+itemName+"/0")
        
    }
    else{
        nr = parseInt((Math.random()+0.1)*10)
        itemName = "avatar"+String(nr)+".png"
        document.getElementById("modalText").innerHTML= "Congratulations, you won an avatar!"
        document.getElementById("modalImg").setAttribute("src", "../../img/items/avatars/"+itemName)
        document.getElementById("modalForm").setAttribute("action", "buyItem/"+itemName+"/0")
    }
}