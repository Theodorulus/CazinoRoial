const {getHandValue, winCondition, getRandomDeck, shuffleArray} = require ('../public/js/blackjackFunctions.js');

describe("Unit tests", () => {


  test("Verify blackjack hand value", async () => { 
      const response =  getHandValue([{rank:4, suit:"spades"}, {rank:10, suit:"spades"}])
      // un user care nu e logat nu ar trebui sa fie capabil sa cumpere iteme
      expect(response).toBe(14);
    });

  test("Verify blackjack win condition", async () => { 
        const response =  winCondition([{rank:4, suit:"spades"}, {rank:10, suit:"spades"}], [{rank:8, suit:"spades"}, {rank:10, suit:"spades"}] )
        // un user care nu e logat nu ar trebui sa fie capabil sa cumpere iteme
        expect(response).toBe(-1);
      });

  test("Verify blackjack shuffleDeck", async () => { 

    cardRanks = ["a", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    cardSuits = ["spades", "diamonds", "clubs", "hearts"];

    let deck=[]
    for (let i=0; i<cardSuits.length;i++){
        for (let j=0; j<cardRanks.length;j++){
            let card = {};
            card.suit = cardSuits[i];
            card.rank = cardRanks[j];
            deck.push(card);
        }
    }

    const shuffleDeck = shuffleArray(deck)
    var response = 0
    for (var i=0; i<deck.length; i++){
        if (deck[i] != shuffleDeck)
          {response = 1;
            break;
          }
     }
    // un user care nu e logat nu ar trebui sa fie capabil sa cumpere iteme
    expect(response).toBe(1);
  });


  test("Verify blackjack getRandomDeck", async () => { 

        const cards =  getRandomDeck()
        allCards = []
        var response = 0;
        for (var x of cards){
          if (allCards.includes(x))
            {
              response = 1;
              break
            }
          allCards.push(x)
        }

        // un user care nu e logat nu ar trebui sa fie capabil sa cumpere iteme
        expect(response).toBe(0);
    });


    

  });








