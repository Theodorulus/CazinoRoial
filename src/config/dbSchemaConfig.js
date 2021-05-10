const db = require('./dbConnection').db;

const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users(
        id INT NOT NULL UNIQUE AUTO_INCREMENT,
        Username VARCHAR(50) NOT NULL,
        Email VARCHAR(200) NOT NULL UNIQUE,
        Password VARCHAR(200) NOT NULL,
        CONSTRAINT users_id_pk PRIMARY KEY(id)
    );
`
const createProfileTable = `
    CREATE TABLE IF NOT EXISTS profile(
        id INT NOT NULL UNIQUE AUTO_INCREMENT,
        RoialPointz INT NOT NULL DEFAULT 100,
        UserId INT NOT NULL UNIQUE,
        CONSTRAINT profile_id_pk PRIMARY KEY(id),
        CONSTRAINT profile_userid_fk FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
    )
`

function createSchema() {
    db.query(createUsersTable, error => {
        if (error){
            console.log(error)
        }

        db.query(createProfileTable, error => {
            if (error){
                console.log(error)
            }
        })
    })
    //...
}

module.exports = createSchema;