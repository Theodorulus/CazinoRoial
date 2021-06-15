const {getHandValue, winCondition} = require ('../public/js/blackjack.js');
const request = require("supertest");
const app = require('../app.js');
const db = require('../src/config/dbConnection').db;

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

      test("POST buyItem", async () => { 
        const response =  await (request(app).post("/accounts/buyItem/avatar2.png/0"))
        // un user care nu e logat nu ar trebui sa fie capabil sa cumpere iteme
        expect(response.statusCode).toBe(500);
      });
  });








