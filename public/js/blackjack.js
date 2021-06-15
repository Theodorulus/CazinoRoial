window.onload=function(){

    document.getElementById("bet_amount").innerHTML=document.getElementById("slider_input").value.concat(" RP");
    document.getElementById("slider_input").max=document.getElementById("balance3").innerHTML.replace(" RP", "").trim();
    //console.log(document.getElementById("balance3").innerHTML.replace(" RP", "").trim())
        
    document.getElementById("slider_input").oninput = function() {
        document.getElementById("bet_amount").innerHTML = this.value.concat(" RP");
    }

    document.getElementById("bet_amount").onclick = function() {
        
        bet_amount=parseInt(document.getElementById("slider_input").value);
        if(bet_amount <= roialpointz) {
            document.getElementById("pot-player3").innerHTML = String(bet_amount) + " RP";
            document.getElementById("slider").classList.add("hidden");
            document.getElementById("bet_amount").classList.add("hidden");
            document.getElementById("hit").classList.remove("hidden");
            document.getElementById("stand").classList.remove("hidden");
            document.getElementById("doubleDown").classList.remove("hidden");
            roialpointz -= bet_amount;
            setRP(roialpointz);
            playRound(bet_amount);
        }
	}

    document.getElementById("play-again").onclick = function() {
        /*
        document.getElementById("cards_dealer").innerHTML="";
        document.getElementById("cards_player").innerHTML="";
        document.getElementById("dealer_value").classList.add("hidden");
        document.getElementById("player_value").classList.add("hidden");
        document.getElementById("who_wins").classList.add("hidden");
        document.getElementById("bet_amount").innerHTML=document.getElementById("slider_input").value.concat(" RP");
        document.getElementById("slider_input").max=document.getElementById("balance3").innerHTML.replace(" RP", "").trim();
        document.getElementById("pot-player3").innerHTML = "0 RP";
        document.getElementById("play-again").classList.add("hidden");
        document.getElementById("slider").classList.remove("hidden");
		document.getElementById("bet_amount").classList.remove("hidden");*/
        window.location.reload();
    }

    //document.getElementById("doubleDown").style.display="none";
    document.getElementById("split").style.display="none";
    document.getElementById("newRound").onclick=function(){
        playRound();
        document.getElementById("doubleDown").style.display="initial";
    }
};

cardRanks = ["a", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
cardSuits = ["spades", "diamonds", "clubs", "hearts"];

function shuffleArray(array) { // gets called in getRandomDeck
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
        }
    return array;
}

function getRandomDeck(){ // gets called in playRound
    let deck=[]
    for (let i=0; i<cardSuits.length;i++){
        for (let j=0; j<cardRanks.length;j++){
            let card = {};
            card.suit = cardSuits[i];
            card.rank = cardRanks[j];
            deck.push(card);
        }
    }
    return shuffleArray(deck);
}

function compareRanks( a, b ) { //aux function for sorting, used in getHandValue
    if ( a.rank < b.rank ){
        return -1;
    }
    if ( a.rank > b.rank ){
        return 1;
    }
    return 0;
}

function getHandValue(cards){
    cards=cards.sort(compareRanks); // the 'A' face card is stored as 'a' to keep them in the back of the card list
    total=0;
    for (let i=0; i< cards.length; i++){
        value = parseInt(cards[i].rank);
        if (isNaN(value)){    
            if (cards[i].rank=="a"){
                if (total+11 > 21){
                    value = 1;
                }
                else{
                    value = 11;
                }
            } 
            else{
                value=10;
            }
        }
        total+=value;
    }
    
    return total;
}

function winCondition(playerCards, dealerCards){
    player = getHandValue(playerCards);
    dealer = getHandValue(dealerCards);  

    if (player > 21 || (dealer > player && dealer <22))
        return -1;
    else if (player == dealer)
        return 0;
    else if (player == 21)
        return 1.5;
    else
        return 1;
}

function showCardsOnTable(playerCards, dealerCards) {
    cards_dealer = document.getElementById("cards_dealer");
    cards_dealer.innerHTML = "";
    cards_player = document.getElementById("cards_player");
    cards_player.innerHTML = "";
    dealerCards.forEach(card => {
        var img = document.createElement('img');
        img.src = "/img/poker/cards/" + card.rank.toUpperCase() + card.suit.charAt(0).toUpperCase() + ".png";
        img.classList.add("card");
        cards_dealer.appendChild(img);
    });

    playerCards.forEach(card => {
        var img = document.createElement('img');
        img.src = "/img/poker/cards/" + card.rank.toUpperCase() + card.suit.charAt(0).toUpperCase() + ".png";
        img.classList.add("card");
        cards_player.appendChild(img);
    });
}

function playRound(bet=10){
    initialBet = bet;
    document.getElementById("newRound").style.display="none";

    function dealCard(to, from = deck){
        to.push(from.pop());
    }
    function endRound(){
        win_cond = winCondition(playerCards, dealerCards)
        payout = bet * win_cond;
        console.log('payout=', payout);
        roialpointz += initialBet;
        roialpointz += payout;
        setRP(roialpointz);
        /*
        getRP();
        socket.on('recieveRP', RP =>{
            
        })*/
        who_wins = document.getElementById("who_wins")
        who_wins.classList.remove("hidden");
        if (win_cond == -1) {
            who_wins.innerHTML = "Dealerul a castigat!";
        } else if (win_cond == 0) {
            who_wins.innerHTML = "Remiza!";
        } else if (win_cond == 1.5) {
            who_wins.innerHTML = "Blackjack! Ai castigat " + String(payout) + " RP!";
        } else {
            who_wins.innerHTML = "Ai castigat " + String(payout) + " RP!";
        }
        for (let button of document.getElementById("play_buttons").children){
            button.classList.add("hidden");
        }
        document.getElementById("play-again").classList.remove("hidden");
        if (playerSplitCards.length >0){
            payout = bet * winCondition(playerSplitCards, dealerCards);
            console.log('payoutSplit=', payout);
            roialpointz+=payout;
        }
        roundEndFlag=1;
        
        document.getElementById("newRound").style.display="initial";
        document.getElementById("doubleDown").style.display="none";
    }

    function showValues(){
        dealer_value = document.getElementById("dealer_value");
        dealer_value.classList.remove("hidden");
        player_value = document.getElementById("player_value");
        player_value.classList.remove("hidden");
        dealer_value.innerHTML=getHandValue(dealerCards)
        player_value.innerHTML=getHandValue(playerCards)
        console.log("player= ", getHandValue(playerCards));
        console.log("dealer= ", getHandValue(dealerCards));
    }

    function hit(cards) {
        if (getHandValue(cards) < 21 && roundEndFlag==0){
            dealCard(cards);
            showValues();
            showCardsOnTable(playerCards, dealerCards);
            if (getHandValue(cards) > 21){
                if (splitToggle) splitToggle=false;
                else endRound();
            }
        }
    }

    roundEndFlag=0;

    const deck = getRandomDeck(); // new deck every round so they can't be counted 
    const dealerCards=[];
    const playerCards=[];
    const playerSplitCards = [];

    dealCard(playerCards);
    dealCard(dealerCards);
    dealCard(playerCards);

    showValues();
    showCardsOnTable(playerCards, dealerCards);
    //console.log(playerCards);
    //console.log(dealerCards);
        

    
    splitToggle=false // false - control on main hand, true- control on split hand
    /*
    if (playerCards[0].rank == playerCards[1].rank){
        document.getElementById("split").style.display="initial";
    }
    document.getElementById("split").onclick= function () {
        splitToggle=true
        document.getElementById("split").style.display="none";

        dealCard(playerSplitCards, playerCards);
        dealCard(playerCards);
        dealCard(playerSplitCards);

        showValues();
    }*/

    document.getElementById("doubleDown").onclick= function () {
        bet*=2;
        dealCard(playerCards);
        if (getHandValue(playerCards) < 22){
            while (getHandValue(dealerCards) < 17){ //dealer turn
                dealCard(dealerCards);
                
            }
        } 
        showValues();
        showCardsOnTable(playerCards, dealerCards);
        endRound();
        document.getElementById("doubleDown").style.display="none";
        document.getElementById("split").style.display="none";
    };

    document.getElementById("hit").onclick = function() {
        document.getElementById("doubleDown").classList.add("hidden");
        if (splitToggle ==false){
        document.getElementById("split").style.display="none";
        hit(playerCards)
        }
        else
        hit(playerSplitCards)
    };


    document.getElementById("stand").onclick = function(){
        if (splitToggle == true){
            splitToggle = false
        }
        else{
                if (roundEndFlag==0){
                    document.getElementById("split").style.display="none";
                    while (getHandValue(dealerCards) < 17){ //dealer turn
                        dealCard(dealerCards);
                        showValues();
                        showCardsOnTable(playerCards, dealerCards);
                    }
                    endRound();    
                }
            }
    };
};
// deck = getRandomDeck()
// console.log(deck);
// deck.forEach(card => {
//     console.log(card, getCardValue(card));
// });

getRP();
socket.on('recieveRP', RP =>{
    roialpointz= RP;
});
// playRound()
/*
document.getElementById("roundStart").onclick=function(){
    playRound();
};*/

