
window.onload=function()
{
	document.getElementById("show_rooms").onclick = function() {
		document.getElementById("rooms").classList.remove("hidden")
	};
	
	document.getElementById("go").onclick = function() {
		document.getElementById("lobbyList").classList.add("hidden")
		document.getElementById("poker_table").classList.remove("hidden")
	};
	
	document.getElementById("bet_amount").innerHTML=document.getElementById("slider_input").value.concat(" RP");
	
	document.getElementById("slider_input").oninput = function() {
		document.getElementById("bet_amount").innerHTML = this.value.concat(" RP");
	}
	
	document.getElementById("bet").onclick = function() {
		//console.log("Salut robi");
		document.getElementById("slider").classList.remove("hidden");
		document.getElementById("bet_amount").classList.remove("hidden");
	}
	
	document.getElementById("send_message").onclick = function (e) {
		e.preventDefault();
	}
	
window.onload = function() {
    var currentMaxBet = 0;
    var myBet = 0;
    var round = "betting";
    var yourTurn = false;
    var yourActions = [];
    var myId = 1;
    var raiseOrBet = "bet";
    var smallBlinds = [1, 2, 5, 10, 20, 50, 100, 200, 500]
	var bets = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000]
    var isSmallBlind = false;
    var isBigBlind = false;
    var currentSmallBlind = 0;

    document.getElementById("create").onclick = function () {
        let roomName = document.getElementById("roomName").value;
        socket.emit('newPokerRoom', roomName);
        console.log("Done!");
        //To do: verifica daca numele are len>0
        /* Show Lobby / Hide List */
        let listItems = document.getElementById('lobbyList');
        let lobbyItems = document.getElementById('poker_table');
        
        listItems.classList.add("hidden");
        lobbyItems.classList.remove("hidden");
        document.getElementById("startGame").classList.remove("hidden");
    }

    socket.on('getAdminData', data => {
        //data = userName, rp, inGame
        document.getElementById("username1").innerHTML = data.userName;
        document.getElementById("balance1").innnerHTML = data.rp;
    })

    document.getElementById("show_rooms").onclick = function () {
        socket.emit('showPokerRooms');
        
        socket.on('getPokerRooms', rooms => {
            let roomList = document.getElementById('rooms');
            roomList.classList.remove("hidden");
            roomList.innerHTML = "";

            for(let i = 0; i < rooms.length; i++) {
                let li = document.createElement("li");
                let div = document.createElement("div");
                div.classList.add("room_name");
                let nameNode = document.createTextNode("♣ " +  rooms[i].name);
                div.appendChild(nameNode);
                li.appendChild(div);

                const button = document.createElement("button");
                button.innerText = "Intra";
                button.classList.add("joinbtn")

                button.addEventListener("click", function() {
                    let joined = true;
                    console.log(rooms[i].roomId);
                    socket.emit('joinPokerRoom', rooms[i].roomId);
                    socket.on('sorryGameStarted', () => {
                        joined = false;
                        alert("Jocul a inceput deja!");
                        });
                    socket.on('sorryRoomIsFull', () => {
                        joined = false;
                        alert("Nu mai sunt locuri libere!");
                    })

                    if (joined == true) {
                        myId = rooms[i].numOfPlayers + 1;
                        console.log('ok');
                        let listItems = document.getElementById('lobbyList');
                        let lobbyItems = document.getElementById('poker_table');
                        
                        listItems.classList.add("hidden");
                        lobbyItems.classList.remove("hidden");
                    }

                });

                div = document.createElement("div");
                div.classList.add("number_of_players");
                let playersNode = document.createTextNode(rooms[i].numOfPlayers + "/5");
                div.appendChild(playersNode);

                li.appendChild(button);
                li.appendChild(div);
                roomList.appendChild(li);
            }


            
        })
    }


    socket.on('someoneJoined', data => {
        for(i = 1; i <= data.players.length; i++) {
            let usernameId = "username" + i;
            let balanceId = "balance" + i;

            let username = document.getElementById(usernameId);
            username.innerHTML = data.players[i-1].userName;
            
            let balance = document.getElementById(balanceId);
            balance.innerHTML = data.players[i-1].rp + " RP";

        }
    });

    document.getElementById("startGame").onclick = function () {
        socket.emit('startPokerGame')
    };

    socket.on('wait', data => {
        yourTurn = false;
        yoarActions = [];
        document.getElementById('pot').innerHTML = data.pot + " RP";

        hideButtons();
        
        turnOwnedCards(data);

        turnCommonCards(data);

        //  reseteaza culoarea username urilor si bet-urile acestora
        for (let i = 0; i < data.players.length; i++) {
            if (data.players[i].inGame == 0) {
                document.getElementById("pot-player" + (i + 1)).innerHTML = "FOLD";
            }
            let usernameId = "username" + (i + 1);
            let username = document.getElementById(usernameId);
            username.style.color =  "white";

        // marcheaza jucatorul al carui ii este randul
        usernameId = "username" + (data.turn + 1);
        username = document.getElementById(usernameId);
        username.style.color =  "#309259";
        }

        console.log("Nu este randul tau...")
    });

    socket.on('play', data => {
        yourTurn = true;
        yourActions = data.actions;
        currentMaxBet = data.roundTotalBet;
        myBet = data.myBetInRound;
        document.getElementById('pot').innerHTML = data.pot + " RP";

        displayButtons();
        
        turnOwnedCards(data);

        turnCommonCards(data);

        if (typeof data.info !== undefined) {
            if (data.info == "smallblind") {
                isSmallBlind = true;
                isBigBlind = false;
            }
            else {
                isSmallBlind = false;
                isBigBlind = true;
                currentSmallBlind = data.smallblind;
            }
        }
        else {
            isSmallBlind = false;
            isBigBlind = false; 
        }

        for (let i = 0; i < data.players.length; i++) {
            if (data.players[i].inGame == 0) {
                document.getElementById("pot-player" + (i + 1)).innerHTML = "FOLD";
            }
            let usernameId = "username" + (i + 1);
            let username = document.getElementById(usernameId);
            username.style.color =  "white";
        }

        // marcheaza jucatorul al carui ii este randul
        usernameId = "username" + myId;
        username = document.getElementById(usernameId);
        username.style.color =  "#309259";

        console.log("Este randul tau!")
    });


    function turnOwnedCards(data) {
        // Afisarea celor doua carti
        if (typeof data.myCards !== "undefined") {
            let firstCard = data.myCards[0].Value + data.myCards[0].Suit.charAt(0).toUpperCase();
            let secondCard = data.myCards[1].Value + data.myCards[1].Suit.charAt(0).toUpperCase();

            document.getElementById("card" + (2*myId - 1)).src = "/img/poker/cards/" + firstCard + ".png";
            document.getElementById("card" + (2*myId)).src = "/img/poker/cards/" + secondCard + ".png";
            
        }

        else {
            let firstCardId = 2*myId - 1;
            let secondCardId = 2 * myId;
            document.getElementById("card" + firstCardId).src = "/img/avatars/deck_5_large.png"
            document.getElementById("card" + secondCardId).src = "/img/avatars/deck_5_large.png"
        }
    }

    function turnCommonCards(data) {
        // afisarea cartilor comune
        if (data.round == "preflop") {
            document.getElementById("ccard1").innerHTML = "";
            document.getElementById("ccard2").innerHTML = "";
            document.getElementById("ccard3").innerHTML = "";
            document.getElementById("ccard4").innerHTML = "";
            document.getElementById("ccard5").innerHTML = "";
        }
        else if (data.round == "flop") {
            document.getElementById("ccard1").innerHTML = "";
            document.getElementById("ccard2").innerHTML = "";
            document.getElementById("ccard3").innerHTML = "";
            let firstCard = data.commonCards[0].Value + data.commonCards[0].Suit.charAt(0).toUpperCase();
            let secondCard = data.commonCards[1].Value + data.commonCards[1].Suit.charAt(0).toUpperCase();
            let thirdCard = data.commonCards[2].Value + data.commonCards[2].Suit.charAt(0).toUpperCase();

            let img = document.createElement("img");
            img.src =  "/img/poker/cards/" + firstCard + ".png";
            document.getElementById("ccard1").appendChild(img);
            img = document.createElement("img");
            img.src = "/img/poker/cards/" + secondCard + ".png";
            document.getElementById("ccard2").appendChild(img);
            img = document.createElement("img");
            img.src = "/img/poker/cards/" + thirdCard + ".png";
            document.getElementById("ccard3").appendChild(img);

        }
        else if (data.round == "turn") {
            document.getElementById("ccard4").innerHTML = "";
            let forthCard = data.commonCards[3].Value + data.commonCards[3].Suit.charAt(0).toUpperCase();
            let img = document.createElement("img");
            img.src =  "/img/poker/cards/" + forthCard + ".png";
            document.getElementById("ccard4").appendChild(img);
        }
        else if (data.round == "river") {
            document.getElementById("ccard5").innerHTML = "";
            let fifthCard = data.commonCards[4].Value + data.commonCards[4].Suit.charAt(0).toUpperCase();
            let img = document.createElement("img");
            img.src =  "/img/poker/cards/" + fifthCard + ".png";
            document.getElementById("ccard5").appendChild(img);
        }
    }

    // pentru jucatorii care asteapta
    function hideButtons() {
        document.getElementById("check").classList.add('hidden');
        document.getElementById("call").classList.add('hidden');
        document.getElementById("fold").classList.add('hidden');
        document.getElementById("bet").classList.add('hidden');
        document.getElementById("raise").classList.add('hidden');
        
    }


    // display doar la butoanele care apar in lista yourActions
    function displayButtons() {
        if (yourActions.includes("check")) {
            document.getElementById("check").classList.remove('hidden');
        }
        else {
            document.getElementById("check").classList.add('hidden');
        }

        if (yourActions.includes("call")) {
            document.getElementById("call").classList.remove('hidden');
        } 
        else {
            document.getElementById("call").classList.add('hidden');
        }

        if (yourActions.includes("fold")) {
            document.getElementById("fold").classList.remove('hidden');
        }
        else {
            document.getElementById("fold").classList.add('hidden');
        }

        if (yourActions.includes("bet")) {
            document.getElementById("bet").classList.remove('hidden');
            raiseOrBet = "bet"
        }
        else {
            document.getElementById("bet").classList.add('hidden');
        }

        if (yourActions.includes("raise")) {
            document.getElementById("raise").classList.remove('hidden');
            raiseOrBet = "raise";
        }
        else {
            document.getElementById("raise").classList.add('hidden');
        }
    }


    document.getElementById("fold").onclick = function () {
        socket.emit('pokerAction', {name: "fold", value: -1})
    };


    document.getElementById("check").onclick = function () {
        socket.emit('pokerAction', {name: 'check', value: -1})
    };

    document.getElementById("call").onclick = function () {
        socket.emit('pokerAction', {name: "call", value: -1})
    };


    document.getElementById("bet_amount").innerHTML=document.getElementById("slider_input").value.concat(" RP");
    
    document.getElementById("slider_input").oninput = function() {
        if (isSmallBlind == true) {
            let rp = smallBlinds[this.value];
            document.getElementById("bet_amount").innerHTML = rp + " RP";
        }
        else {
            let rp = bets[this.value];
            document.getElementById("bet_amount").innerHTML = rp + " RP";
        }
    }

    document.getElementById("bet").onclick = function () {
        if (isSmallBlind == true) {
            document.getElementById("slider_input").min = 0;
            document.getElementById("slider_input").max = smallBlinds.length - 1;
            document.getElementById("slider_input").value= 0;
            
            document.getElementById("slider").classList.remove("hidden");
            document.getElementById("bet_amount").classList.remove("hidden");
        }
        else if (isBigBlind == true) {
            let bet = currentSmallBlind * 2;
            socket.emit('pokerAction', {name: "bet", value: bet})
            isBigBlind = false;
        }
        else {
            document.getElementById("slider_input").min = 0;
            document.getElementById("slider_input").max = bets.length - 1;
            document.getElementById("slider_input").value= 0;

            document.getElementById("slider").classList.remove("hidden");
            document.getElementById("bet_amount").classList.remove("hidden");
        }
    };

    document.getElementById("bet_amount").onclick = function() {
        let bet = bets[document.getElementById("slider_input").value];
        if (isSmallBlind == true) {
            bet = smallBlinds[document.getElementById("slider_input").value]
        }
        console.log(bet);
        socket.emit('pokerAction', {name: "bet", value: bet})
        document.getElementById("slider").classList.add("hidden");
        document.getElementById("bet_amount").classList.add("hidden");
    }



    document.getElementById("raise_amount").innerHTML=document.getElementById("slider_input_raise").value.concat(" RP");

    document.getElementById("slider_input_raise").value= currentMaxBet - myBet + 1;


    document.getElementById("slider_input_raise").oninput = function() {
        document.getElementById("raise_amount").innerHTML = this.value.concat(" RP");
    }

    document.getElementById("raise").onclick = function () {
        document.getElementById("slider_input_raise").min = currentMaxBet - myBet + 1;
        document.getElementById("slider_input_raise").max = currentMaxBet - myBet + 501;
        document.getElementById("slider_input_raise").value= currentMaxBet - myBet + 1;
        
        document.getElementById("sliderRaise").classList.remove("hidden");
        document.getElementById("raise_amount").classList.remove("hidden");
    }

    document.getElementById("raise_amount").onclick = function() {
        let raise = parseInt(document.getElementById("slider_input_raise").value) + parseInt(myBet);
        socket.emit('pokerAction', {name: "raise", value: raise})
        document.getElementById("sliderRaise").classList.add("hidden");
        document.getElementById("raise_amount").classList.add("hidden");
    }

    document.getElementById("leaveGame").onclick = function() {
        window.location.reload();
    }


    socket.on('winner', data => { 
        hideButtons();
    });

    socket.on('loser', data => { 
        hideButtons();
        
    });

}