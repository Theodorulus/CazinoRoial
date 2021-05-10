CREATE TABLE IF NOT EXISTS users(
	id INT NOT NULL UNIQUE AUTO_INCREMENT,
    Username VARCHAR(50) NOT NULL,
    Email VARCHAR(200) NOT NULL UNIQUE,
    Password VARCHAR(200) NOT NULL,
    CONSTRAINT users_id_pk PRIMARY KEY(id)
);

drop table users;
drop table profile;
drop table sessions;

CREATE TABLE IF NOT EXISTS profile(
	id INT NOT NULL UNIQUE AUTO_INCREMENT,
	RoialPointz INT NOT NULL DEFAULT 100,
	UserId INT NOT NULL UNIQUE,
    CONSTRAINT profile_id_pk PRIMARY KEY(id),
	CONSTRAINT profile_userid_fk FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
);

insert into users(Username, Email, Password) values('gfhdgh', 'dfgfdghdg', 'gggggg');
insert into profile(RoialPointz, UserId) values(33, 1);

select * from profile;

delete from users;
delete from sessions;

select * from sessions;
select * from users;
select * from profile;