
-- psql -U postgres
-- \connect bike
-- \d+
-- \d+ bikes

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100),
  full_name VARCHAR(100),
  profile_text TEXT,
  rating INT,
  image_url VARCHAR(100)
);

CREATE TABLE bikes (
  id SERIAL PRIMARY KEY,
  bike_name VARCHAR(100),
  image_url VARCHAR(100),
  electron_id VARCHAR(100),
  owner INT REFERENCES users(id),
  rented_by INT REFERENCES users(id) DEFAULT NULL
);

ALTER TABLE bikes ADD COLUMN rented_by INT REFERENCES users(id) DEFAULT NULL;

ALTER TABLE bikes ADD COLUMN moved BOOLEAN DEFAULT FALSE;
ALTER TABLE bikes ADD COLUMN locked BOOLEAN DEFAULT FALSE;
ALTER TABLE bikes ADD COLUMN online BOOLEAN DEFAULT FALSE;

CREATE TABLE bike_positions (
  id SERIAL PRIMARY KEY,
  ts TIMESTAMP DEFAULT NOW(),
  pos GEOMETRY,
  bike_id INT REFERENCES bikes(id)
);

CREATE TABLE user_comments (
  id SERIAL PRIMARY KEY,
  to_user INT REFERENCES users(id),
  from_user INT REFERENCES users(id),
  text TEXT
);

CREATE TABLE rentals (
  id SERIAL PRIMARY KEY,
  from_ts TIMESTAMP DEFAULT NOW(),
  to_ts TIMESTAMP DEFAULT NULL,
  bike_id INT REFERENCES bikes(id),
  by_user_id INT REFERENCES users(id)
);


INSERT INTO users (email, full_name, profile_text, rating, image_url) VALUES ('erik@orjehag.se', 'Erik Örjehag', 'This is a cool service!', 5, '/images/erik.png');
INSERT INTO users (email, full_name, profile_text, rating, image_url) VALUES ('wille@sjoblom.se', 'William Sjöblom', 'Welcome to my profile!', 5, '/images/wille.png');
INSERT INTO bikes (bike_name, image_url, owner) VALUES ('Skruttis', '', 1), ('Blå racketen', '', 1);
INSERT INTO bike_positions (pos, bike_id) VALUES (ST_GeomFromText('POINT(58.394156 15.561379)'), 1), (ST_GeomFromText('POINT(58.395967 15.563529)'), 2);
INSERT INTO bike_positions (pos, bike_id) VALUES (ST_GeomFromText('POINT(58.394353 15.561931)'), 1), (ST_GeomFromText('POINT(58.397439 15.562656)'), 2);
INSERT INTO rentals (bike_id, by_user_id) VALUES (1, 1);
UPDATE rentals SET to_ts = NOW() WHERE bike_id = 1;

INSERT INTO rentals (bike_id, by_user_id) VALUES (2, 1);
UPDATE rentals SET to_ts = NOW() WHERE bike_id = 2;

DELETE FROM bike_positions WHERE ST_Y(pos) < 15.297807;
DELETE FROM bike_positions WHERE ST_Y(pos) > 15.782511;
DELETE FROM bike_positions WHERE ST_X(pos) > 58.420472;
DELETE FROM bike_positions WHERE ST_X(pos) < 58.352313;


SELECT bikes.id, bikes.bike_name, bikes.image_url, bikes.owner, bikes.electron_id, bikes.locked, bikes.moved, bikes.online, bikes.rented_by, users.full_name FROM bikes LEFT JOIN users ON bikes.owner = users.id ORDER BY bikes.id DESC;