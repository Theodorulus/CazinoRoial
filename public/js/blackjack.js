
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

    function playRound(bet=10){
        document.getElementById("newRound").style.display="none";

        function dealCard(to, from = deck){
            to.push(from.pop());
        }
        function endRound(){
            payout = bet * winCondition(playerCards, dealerCards);
            console.log('payout=', payout);
            roialpointz+=payout;

            if (playerSplitCards.length >0){
                payout = bet * winCondition(playerSplitCards, dealerCards);
                console.log('payoutSplit=', payout);
                roialpointz+=payout;
            }

            roundEndFlag=1;
            document.getElementById("newRound").style.display="initial";
            document.getElementById("doubleDown").style.display="none";
        }

        function hit(cards) {
            if (getHandValue(cards) < 21 && roundEndFlag==0){
                dealCard(cards);
                showValues();
                if (getHandValue(cards) > 21){
                    if (splitToggle) splitToggle=false;
                    else endRound();
                }
            }
        }

        function showValues(){
            console.log("player= ", getHandValue(playerCards), playerCards);

            if (playerSplitCards.length > 0)
            console.log("playerSplit= ", getHandValue(playerSplitCards), playerSplitCards);

            console.log("dealer= ", getHandValue(dealerCards), dealerCards);
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
        // console.log(playerCards);
        // console.log(dealerCards);

        if (playerCards[0].rank == playerCards[1].rank){
            document.getElementById("split").style.display="initial";
        }
        splitToggle=false // false - control on main hand, true- control on split hand
        document.getElementById("split").onclick= function () {
            splitToggle=true
            document.getElementById("split").style.display="none";

            dealCard(playerSplitCards, playerCards);
            dealCard(playerCards);
            dealCard(playerSplitCards);

            showValues();
        }

        document.getElementById("doubleDown").onclick= function () {
            bet*=2;
            dealCard(playerCards);
            if (getHandValue(playerCards) < 22){
                while (getHandValue(dealerCards) < 17){ //dealer turn
                    dealCard(dealerCards);
                    showValues()
                }
            }
            endRound();
            document.getElementById("doubleDown").style.display="none";
            document.getElementById("split").style.display="none";
        };

        document.getElementById("hit").onclick = function() {
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
                        showValues()
                    }
                    endRound();    
                }
            }
        };
        
        
    }


// deck = getRandomDeck()
// console.log(deck);
// deck.forEach(card => {
//     console.log(card, getCardValue(card));
// });
roialpointz= 100;
// playRound()
document.getElementById("doubleDown").style.display="none";
document.getElementById("split").style.display="none";
document.getElementById("newRound").onclick=function(){
    playRound();
    document.getElementById("doubleDown").style.display="initial";
};


