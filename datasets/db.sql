DROP DATABASE homey;

CREATE DATABASE homey;

\c homey;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL, 
    email VARCHAR(50) NOT NULL, 
    password VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    occupation VARCHAR(20) NOT NULL,
    budget INT NOT NULL,
    profile_img TEXT NOT NULL,
    description VARCHAR(255) NOT NULL,
    rating INT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    district VARCHAR(20) NOT NULL,
    address VARCHAR(100) NOT NULL,
    size INT NOT NULL,
    monthly_rent INT NOT NULL,
    rental_period INT NOT NULL,
    rules VARCHAR(255) NOT NULL,
    tenant_number INT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    host_id INT NOT NULL UNIQUE,
    wishlist_id INT,
    FOREIGN KEY (host_id) REFERENCES users(id)
);

-- CREATE TABLE wishlist (
--     id SERIAL PRIMARY KEY,
--     created_at TIMESTAMP NOT NULL,
--     updated_at TIMESTAMP NOT NULL,
--     room_id INT NOT NULL,
--     user_id INT NOT NULL,
--     FOREIGN KEY (room_id) REFERENCES rooms(id),
--     FOREIGN KEY (user_id) REFERENCES users(id)
-- );

CREATE TABLE room_images (
    id SERIAL PRIMARY KEY,
    room_img_id INT NOT NULL,
    img VARCHAR(100) NOT NULL,
    room_id INT NOT NULL,
    FOREIGN KEY (room_id) REFERENCES rooms(id)
);

CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    status INT NOT NULL,
    interview_venue VARCHAR(50),
    interview_date DATE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    room_id INT NOT NULL,
    applicant_id INT NOT NULL,
    interview_id INT UNIQUE,
    host_id INT NOT NULL,
    FOREIGN KEY (room_id) REFERENCES rooms(id),
    FOREIGN KEY (applicant_id) REFERENCES users(id),
    FOREIGN KEY (host_id) REFERENCES users(id)
);

CREATE TABLE equipments (
    id SERIAL PRIMARY KEY,
    aircon BOOLEAN NOT NULL,
    bed BOOLEAN NOT NULL,
    chair BOOLEAN NOT NULL,
    cooker BOOLEAN NOT NULL,
    couch BOOLEAN NOT NULL,
    desk BOOLEAN NOT NULL,
    fans BOOLEAN NOT NULL,
    television BOOLEAN NOT NULL,
    washer BOOLEAN NOT NULL,
    wifi BOOLEAN NOT NULL,
    room_id INT NOT NULL,
    FOREIGN KEY (room_id) REFERENCES rooms(id)
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    title VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL, 
    room_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (room_id) REFERENCES rooms(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

SELECT * FROM users;
SELECT * FROM rooms;
SELECT * FROM equipments;
SELECT * FROM applications;
SELECT * FROM room_images;
SELECT * FROM comments;

SELECT * FROM applications INNER JOIN users ON users.id = applications.applicant_id;

UPDATE applications SET status = 1;

DELETE FROM room_images WHERE id = 34;
DELETE FROM room_images WHERE id = 35;
DELETE FROM room_images WHERE id = 36;
DELETE FROM rooms WHERE id = 12;
DELETE FROM equipments WHERE id = 12;
DELETE FROM equipments;
DELETE FROM users WHERE id=32;

DROP TABLE applications;
-- Users (10)

insert into users(name, email, password, birth_date, gender, occupation, budget, profile_img, description, created_at, updated_at) 
values ('daniel','daniel@gamil.com','123','1986-10-01','male','teacher',123,'image-1634699064531.jpeg','no sex',NOW(),NOW());

insert into users(name, email, password, birth_date, gender, occupation, budget, profile_img, description, created_at, updated_at) 
values ('peter','peter@gamil.com','123','1975-10-01','male','student',123,'image-1634699064531.jpeg','no smoke',NOW(),NOW());

insert into users(name, email, password, birth_date, gender, occupation, budget, profile_img, description, created_at, updated_at) 
values ('john','john@gamil.com','123','2000-10-01','male','finance',123,'image-1634699064531.jpeg','no joke',NOW(),NOW());

insert into users(name, email, password, birth_date, gender, occupation, budget, profile_img, description, created_at, updated_at) 
values ('mary','mary@gamil.com','123','1980-10-01','female','worker',123,'image-1634699064531.jpeg','no sex',NOW(),NOW());

insert into users(name, email, password, birth_date, gender, occupation, budget, profile_img, description, created_at, updated_at) 
values ('may','may@gamil.com','123','1998-10-01','female','retiree',123,'image-1634699064531.jpeg','no sex',NOW(),NOW());

insert into users(name, email, password, birth_date, gender, occupation, budget, profile_img, description, created_at, updated_at) 
values ('joseph','joseph@gamil.com','123','1978-10-01','male','student',123,'image-1634699064531.jpeg','no sex',NOW(),NOW());

insert into users(name, email, password, birth_date, gender, occupation, budget, profile_img, description, created_at, updated_at) 
values ('louis','louis@gamil.com','123','1988-10-01','male','teacher',123,'image-1634699064531.jpeg','no sex',NOW(),NOW());

insert into users(name, email, password, birth_date, gender, occupation, budget, profile_img, description, created_at, updated_at) 
values ('jsaon','jsaon@gamil.com','123','1999-10-01','male','admin',123,'image-1634699064531.jpeg','no sex',NOW(),NOW());

insert into users(name, email, password, birth_date, gender, occupation, budget, profile_img, description, created_at, updated_at) 
values ('leo','leo@gamil.com','123','2001-10-01','male','civil servant',123,'image-1634699064531.jpeg','no sex',NOW(),NOW());

-- password : 123 -> hash : $2a$10$0DCBYRaxj1qWMjLRpZgbOehQ0P37dUgQAikjrJBMlX4t2ib1cwj9C


insert into users(name, email, password, birth_date, gender, occupation, budget, profile_img, description, created_at, updated_at) 
values ('weemo','weemo@gamil.com','123','1982-10-01','male','education',123,'image-1634699064531.jpeg','no sex',NOW(),NOW());
-- Rooms & equipments (5)

INSERT INTO rooms (district, address, size, monthly_rent, rental_period, rules, tenant_number, created_at, updated_at, host_id) 
VALUES ('kowloon', 'room101', 200, 10000, 10, 'no dog', 3, NOW(), NOW(), 1);

INSERT INTO rooms (district, address, size, monthly_rent, rental_period, rules, tenant_number, created_at, updated_at, host_id) 
VALUES ('hong kong', '15-43 braemar hill road', 1000, 35000, 5, 'no rules', 4, NOW(), NOW(), 3);

INSERT INTO rooms (district, address, size, monthly_rent, rental_period, rules, tenant_number, created_at, updated_at, host_id) 
VALUES ('new territories', 'flat a', 400, 6000, 2, 'no noise', 2, NOW(), NOW(), 5);

INSERT INTO rooms (district, address, size, monthly_rent, rental_period, rules, tenant_number, created_at, updated_at, host_id) 
VALUES ('new territories', 'flat b', 300, 5500, 5, 'no dogs and cats', 7, NOW(), NOW(), 7);

INSERT INTO rooms (district, address, size, monthly_rent, rental_period, rules, tenant_number, created_at, updated_at, host_id) 
VALUES ('kowloon', '217 cheung sha wan road', 600, 8200, 6, 'no smoke', 3, NOW(), NOW(), 9);

INSERT INTO room_images (room_img_id, img, room_id) VALUES (1, 'image-1634699161766.jpeg', 1);
INSERT INTO room_images (room_img_id, img, room_id) VALUES (2, 'image-1634699161766.jpeg', 1);
INSERT INTO room_images (room_img_id, img, room_id) VALUES (3, 'image-1634699161766.jpeg', 1);
INSERT INTO room_images (room_img_id, img, room_id) VALUES (1, 'image-1634699161766.jpeg', 2);
INSERT INTO room_images (room_img_id, img, room_id) VALUES (2, 'image-1634699161766.jpeg', 2);
INSERT INTO room_images (room_img_id, img, room_id) VALUES (3, 'image-1634699161766.jpeg', 2);
INSERT INTO room_images (room_img_id, img, room_id) VALUES (1, 'image-1634699161766.jpeg', 3);
INSERT INTO room_images (room_img_id, img, room_id) VALUES (2, 'image-1634699161766.jpeg', 3);
INSERT INTO room_images (room_img_id, img, room_id) VALUES (3, 'image-1634699161766.jpeg', 3);
INSERT INTO room_images (room_img_id, img, room_id) VALUES (1, 'image-1634699161766.jpeg', 4);
INSERT INTO room_images (room_img_id, img, room_id) VALUES (2, 'image-1634699161766.jpeg', 4);
INSERT INTO room_images (room_img_id, img, room_id) VALUES (3, 'image-1634699161766.jpeg', 4);
INSERT INTO room_images (room_img_id, img, room_id) VALUES (1, 'image-1634699161766.jpeg', 5);
INSERT INTO room_images (room_img_id, img, room_id) VALUES (2, 'image-1634699161766.jpeg', 5);
INSERT INTO room_images (room_img_id, img, room_id) VALUES (3, 'image-1634699161766.jpeg', 5);

-- equipments (5)
INSERT INTO equipments (aircon, bed, chair, cooker, couch, fans, desk, television, washer, wifi, room_id)
VALUES (true, true, false, false, true, false, true, false, false, true, 1);

INSERT INTO equipments (aircon, bed, chair, cooker, couch, fans, desk, television, washer, wifi, room_id)
VALUES (true, true, false, false, false, false, true, false, false, true, 2);

INSERT INTO equipments (aircon, bed, chair, cooker, couch, fans, desk, television, washer, wifi, room_id)
VALUES (true, true, false, true, true, false, true, true, false, true, 3);

INSERT INTO equipments (aircon, bed, chair, cooker, couch, fans, desk, television, washer, wifi, room_id)
VALUES (true, true, false, true, true, false, true, false, true, true, 4);

INSERT INTO equipments (aircon, bed, chair, cooker, couch, fans, desk, television, washer, wifi, room_id)
VALUES (false, true, false, false, true, true, true, false, false, true, 5);

-- Applications (5)
INSERT INTO applications (status, created_at, updated_at, room_id, applicant_id, host_id) VALUES (1, NOW(), NOW(), 1, 2, 1);
INSERT INTO applications (status, created_at, updated_at, room_id, applicant_id, host_id) VALUES (1, NOW(), NOW(), 1, 4, 1);
INSERT INTO applications (status, created_at, updated_at, room_id, applicant_id, host_id) VALUES (1, NOW(), NOW(), 2, 2, 3);
INSERT INTO applications (status, created_at, updated_at, room_id, applicant_id, host_id) VALUES (1, NOW(), NOW(), 3, 6, 5);
INSERT INTO applications (status, created_at, updated_at, room_id, applicant_id, host_id) VALUES (1, NOW(), NOW(), 5, 8, 9);

-- COMMENTS

INSERT INTO comments (title, message, created_at, updated_at, room_id, user_id) VALUES ('BAD ROOM', 'always bring girl home', NOW(), NOW(), 8, 10);
INSERT INTO comments (title, message, created_at, updated_at, room_id, user_id) VALUES ('GOOD ROOM', 'always bring food home', NOW(), NOW(), 8, 11);
INSERT INTO comments (title, message, created_at, updated_at, room_id, user_id) VALUES ('dont apply', 'smelly', NOW(), NOW(), 8, 12);
INSERT INTO comments (title, message, created_at, updated_at, room_id, user_id) VALUES ('wonderful', 'big and warm', NOW(), NOW(), 8, 13);
INSERT INTO comments (title, message, created_at, updated_at, room_id, user_id) VALUES ('nice host', 'friendly and cool', NOW(), NOW(), 8, 14);
INSERT INTO comments (title, message, created_at, updated_at, room_id, user_id) VALUES ('room for programmer', 'exchange info of it', NOW(), NOW(), 8, 15);