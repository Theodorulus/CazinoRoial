const socket = io('http://localhost:3000');

socket.on('connection', () => {

})

// socket.on('message', data => {
//     console.log(data)
// })

/*
document.querySelector("#btn1").onclick = () => {
    var input = 5;
    gainRP(input);
}

document.querySelector("#btn2").onclick = () => {
    var input = 10;
    loseRP(input);
}
*/
function gainRP(RP) {
    socket.emit('gainRP', RP);
    // console.log('ti au adaugat 5 RP')
}

function loseRP(RP) {
    socket.emit('loseRP', RP);
    // console.log('ti au scazut 10 RP')
}

function getRP(){
    socket.emit('getRP');
}

socket.on('recieveRP', RP => {
    
}) 


