window.onload = function() {

    document.getElementById("create").onclick = function () {
        var roomName = document.getElementById("roomName").value;
        socket.emit('newPokerRoom', roomName);
        console.log("Done!");

        /* Show Lobby / Hide List */
        let listItems = document.getElementsByClassName('lobbyList');
        let lobbyItems = document.getElementById('lbby');
        console.log(listItems.length)
        for(let j=0; j < listItems.length; j++) {
            listItems[j].style.display = "none";
        }

        lobbyItems.classList.remove("dis");

        /* update banner */
        //document.getElementById("banner1").innerHTML = user.username;
    }

    document.getElementById("show").onclick = function () {
        socket.emit('showPokerRooms');
        
        socket.on('getPokerRooms', rooms => {
            document.getElementById("rooms").innerHTML = "";
            for(let i = 0; i < rooms.length; i++) {
                let textnode = document.createTextNode(rooms[i].name);
                let br = document.createElement("br");
                const button = document.createElement("button");
                button.innerText = "Join";

                button.addEventListener("click", function() {
                    let joined = true;
                    console.log(rooms[i].roomId);
                    socket.emit('joinPokerRoom', rooms[i].roomId);
                    socket.on('sorryGameStarted', () => {
                        joined = false;
                        alert("Sorry game started");
                        });
                    socket.on('sorryRoomIsFull', () => {
                        joined = false;
                        alert("Sorry room full");
                    })

                    if (joined == true) {
                        console.log('ok')
                        let listItems = document.getElementsByClassName('lobbyList');
                        let lobbyItems = document.getElementById('lbby');
                        console.log(listItems.length)
                        for(let j=0; j < listItems.length; j++) {
                            listItems[j].style.display = "none";
                        }

                        lobbyItems.classList.remove("dis");

                    }

                });

                document.getElementById("rooms").appendChild(textnode);
                document.getElementById("rooms").appendChild(button);
                document.getElementById("rooms").appendChild(br);
            }


            
        })
    }


    socket.on('someoneJoined', data => {
        for(i = 1; i <= data.players.length; i++) {
            let bannerId = "banner" + i;
            let banner = document.getElementById(bannerId);
            banner.innerHTML = data.players[i-1] + "<br />300 RP"

        }
    });

    document.getElementById("startGame").onclick = function () {
        socket.emit('startPokerGame')
    };

    socket.on('wait', data => {
        console.log(data)
        console.log("Nu este randul tau...")
    });

    socket.on('play', data => {
        console.log(data)
        console.log("Este randul tau!")
    });

    document.getElementById("fold").onclick = function () {
        console.log('Fold1')
        socket.emit('pokerAction', {name: "fold", value: -1})
        console.log('Fold2')
    };
    document.getElementById("check").onclick = function () {
        console.log('Check1')
        socket.emit('pokerAction', {name: 'check', value: -1})
        console.log('Check2')
    };
    document.getElementById("call").onclick = function () {
        socket.emit('pokerAction', {name: "call", value: -1})
    };

    var bet = 0;
    document.getElementById("bet").onclick = function () {
        bet =+ 10;
        socket.emit('pokerAction', {name: "bet", value: bet})
    };
    document.getElementById("raise").onclick = function () {
        socket.emit('pokerAction', {name: "raise", value: 20})
    };


}