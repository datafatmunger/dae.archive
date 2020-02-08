create table Users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  name TEXT,
  hash TEXT,
  salt TEXT,
  CONSTRAINT email_unique UNIQUE (email)
);

create table Tokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  name TEXT,
  token TEXT,
  series TEXT,
  FOREIGN KEY(user_id) REFERENCES Users(id),
  CONSTRAINT is_unique UNIQUE (user_id, name));
