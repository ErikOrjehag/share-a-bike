
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
  owner INT REFERENCES users(id)
);

CREATE TABLE bike_positions (
  id SERIAL PRIMARY KEY,
  ts TIMESTAMP DEFAULT NOW(),
  pos GEOGRAPHY,
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