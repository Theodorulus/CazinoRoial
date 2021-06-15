const request = require("supertest");
const app = require('../app.js');

const poker = require('../src/modules/socketIO.js');
const account = require('../src/controllers/accountsController.js');
const db = require('../src/config/dbConnection').db;


describe("Unit tests", () => {

  beforeAll(() => {
    try{db.query('DELETE FROM users WHERE Email = ? ',"test@test.com", () => {});
    }
    catch(e){next(e)}
  });

  test("GET register page", async () => {
    const response = await request(app).get("/accounts/register");
    expect(response.statusCode).toBe(200);
  });

  test("Create user", async () => {
    
      req = {
        username: "test",
        email: "test@test.com",
        password: "parola123",
        confirm_pass: "parola123",
        phone: 123123123,
        data: "0001-01-01"
      }
      const response =  await (request(app).post("/accounts/register")).send(req)
      expect(response.status).toBe(302);
  });

  test("Login user", async () => {
    
    req = {
      email: "test@test.com",
      password: "parola123",
    }
    const response =  await (request(app).post("/accounts/login")).send(req)
    expect(response.status).toBe(302);
});

  test("POST buyItem", async () => { 
      const response =  await (request(app).post("/accounts/buyItem/avatar2.png/0"))
      // un user care nu e logat nu ar trebui sa fie capabil sa cumpere iteme
      expect(response.statusCode).toBe(500);
    });

  });








