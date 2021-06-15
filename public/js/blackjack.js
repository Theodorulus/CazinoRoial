
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

    

    function playRound(bet=1){
        
        function dealCard(to, from = deck){
            to.push(from.pop());
        }
        roundEndFlag=0;
        function endRound(){
            payout = bet * winCondition(playerCards, dealerCards);
            console.log('payout=', payout);
            roialpointz+=payout;
            roundEndFlag=1;
        }

        function showValues(){
            console.log("player= ", getHandValue(playerCards));
            console.log("dealer= ", getHandValue(dealerCards));
        }
        const deck = getRandomDeck(); // new deck every round so they can't be counted 
        const dealerCards=[];
        const playerCards=[];

        dealCard(playerCards);
        dealCard(dealerCards);
        dealCard(playerCards);
        showValues();
        // console.log(playerCards);
        // console.log(dealerCards);

        
        document.getElementById("hit").onclick = function() {
            if (getHandValue(playerCards) < 21 && roundEndFlag==0){
                dealCard(playerCards);
                showValues();
                if (getHandValue(playerCards) > 21)
                    endRound();
            }
        };


        document.getElementById("stand").onclick = function(){
            if (roundEndFlag==0){
                while (getHandValue(dealerCards) < 17){ //dealer turn
                    dealCard(dealerCards);
                    showValues()
                }
                endRound();    
            }
        };
        
        
    }

/*
// deck = getRandomDeck()
// console.log(deck);
// deck.forEach(card => {
//     console.log(card, getCardValue(card));
// });
roialpointz= 100;
// playRound()
document.getElementById("roundStart").onclick=function(){
    playRound();
};
*/

module.exports= {getHandValue, winCondition}
